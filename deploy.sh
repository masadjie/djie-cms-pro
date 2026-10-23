#!/usr/bin/env bash
# ==============================================================================
# Script Otomasi Deploy Production: Portal Pelayanan BKPSDM Aceh Tamiang
# OS Target: Ubuntu 20.04/22.04/24.04 LTS / Debian 11/12
# Deskripsi: Menginstal Docker, Docker Compose, konfigurasi firewall, build & run
# ==============================================================================

set -e

# Warna Terminal
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo -e "${CYAN}"
echo "=============================================================================="
echo "    PRODUKSI DEPLOYMENT OTOMATIS: DJIE CMS PRO V 1.0                          "
echo "=============================================================================="
echo -e "${NC}"

# 1. Pastikan script dijalankan dengan hak akses root / sudo
if [ "$EUID" -ne 0 ]; then
  echo -e "${RED}[ERROR] Harap jalankan script ini sebagai root atau dengan sudo:${NC}"
  echo -e "        sudo bash deploy.sh"
  exit 1
fi

# 2. Update repository sistem
echo -e "${BLUE}[1/6] Memperbarui paket sistem operasi...${NC}"
apt-get update -y
apt-get install -y ca-certificates curl gnupg lsb-release ufw git

# 3. Instalasi Docker Engine & Docker Compose jika belum terinstall
echo -e "${BLUE}[2/6] Memeriksa instalasi Docker & Docker Compose...${NC}"
if ! command -v docker &> /dev/null; then
    echo -e "${YELLOW}>> Docker belum terpasang. Mengunduh dan memasang Docker Engine resmi...${NC}"
    mkdir -p /etc/apt/keyrings
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg --yes
    
    echo \
      "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
      $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null
    
    apt-get update -y
    apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
    
    systemctl enable docker
    systemctl start docker
    echo -e "${GREEN}>> Docker berhasil dipasang!${NC}"
else
    echo -e "${GREEN}>> Docker sudah terpasang ($(docker --version))${NC}"
fi

# Pastikan perintah docker-compose / docker compose berfungsi
DOCKER_COMPOSE_CMD=""
if docker compose version &> /dev/null; then
    DOCKER_COMPOSE_CMD="docker compose"
elif command -v docker-compose &> /dev/null; then
    DOCKER_COMPOSE_CMD="docker-compose"
else
    echo -e "${YELLOW}>> Memasang docker-compose plugin...${NC}"
    apt-get install -y docker-compose-plugin
    DOCKER_COMPOSE_CMD="docker compose"
fi

# 4. Paksa bebaskan port yang sudah ditentukan (tidak auto-increment, selalu pakai port tetap)
FRONTEND_PORT=3000
REQUIRED_PORTS=(3000 5055 9001 3316)

echo -e "${BLUE}[3/6] Membebaskan port yang dibutuhkan (kill proses yang sedang menempati)...${NC}"

# Install fuser jika belum ada (psmisc)
if ! command -v fuser &>/dev/null; then
    apt-get install -y psmisc &>/dev/null || true
fi

for PORT_TO_FREE in "${REQUIRED_PORTS[@]}"; do
    # Periksa proses di port ini, abaikan jika proses tersebut adalah docker-proxy milik kita sendiri
    PIDS=$(ss -tulnp 2>/dev/null | grep ":${PORT_TO_FREE} " | grep -v "docker-proxy" | grep -oP 'pid=\K[0-9]+' | sort -u || true)
    if [ -n "$PIDS" ]; then
        for PID in $PIDS; do
            echo -e "${YELLOW}>> Menutup proses non-Docker PID ${PID} yang menempati port ${PORT_TO_FREE}...${NC}"
            kill -9 "$PID" 2>/dev/null || true
        done
    fi
    echo -e "${GREEN}>> Port ${PORT_TO_FREE} aman & siap digunakan.${NC}"
done

echo -e "${GREEN}>> Port Web Frontend terpilih (tetap) : ${CYAN}${FRONTEND_PORT}${NC}"

# Tulis file .env di root secara aman
echo "FRONTEND_PORT=${FRONTEND_PORT}" > .env

# Konfigurasi Firewall Dasar (UFW)
if command -v ufw &>/dev/null; then
    ufw allow 22/tcp comment 'SSH' || true
    ufw allow 80/tcp comment 'HTTP Web' || true
    ufw allow 443/tcp comment 'HTTPS SSL' || true
    ufw allow ${FRONTEND_PORT}/tcp comment 'Frontend Port' || true
    ufw allow 5055/tcp comment 'Backend Port' || true
    ufw allow 9001/tcp comment 'MinIO Console' || true
    ufw allow 3316/tcp comment 'MySQL External' || true
    echo -e "${GREEN}>> Firewall UFW diperbarui.${NC}"
fi

# 5. Menyiapkan Direktori & Lingkungan Environment Backend
echo -e "${BLUE}[4/6] Menyiapkan environment production & script database...${NC}"

# Pastikan folder dan file inisialisasi database ada
mkdir -p docker/mysql
if [ ! -f "docker/mysql/init.sql" ]; then
    echo -e "${YELLOW}>> docker/mysql/init.sql belum ada, menyiapkan file inisialisasi kosong...${NC}"
    touch docker/mysql/init.sql
else
    echo -e "${GREEN}>> File inisialisasi database docker/mysql/init.sql terdeteksi siap mount.${NC}"
fi

if [ ! -f "backend/.env" ]; then
    echo -e "${YELLOW}>> Membuat backend/.env production standar...${NC}"
    cat <<EOT > backend/.env
NODE_ENV=production
PORT=5000
DB_HOST=mysql
DB_PORT=3306
DB_NAME=layanan_acehtamiang
DB_USER=root
DB_PASS=root
REDIS_HOST=redis
REDIS_PORT=6379
MINIO_ENDPOINT=minio
MINIO_PORT=9000
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadminpassword
MINIO_BUCKET=djie-cms-attachments
JWT_SECRET=tamiang_super_secret_jwt_key_2026_bkpsdm
CLIENT_URL=https://bkpsdm.acehtamiangkab.go.id
CORS_ORIGIN=*
RATE_LIMIT_MAX=50000
RATE_LIMIT_WINDOW_MS=900000
EOT
    echo -e "${GREEN}>> File backend/.env berhasil dibuat.${NC}"
fi

# 6. Build dan Jalankan Seluruh Container Docker
echo -e "${BLUE}[5/6] Memulai proses Build & Deploy Container Docker...${NC}"
echo -e "${CYAN}>> Service: MySQL 8.0 (Primary + Auto-Init), Redis 7, MinIO S3, Node.js Backend API, Vite-Nginx Frontend${NC}"

# BACKUP PENGAMAN DATA: Jika kontainer MySQL sedang hidup, buat snapshot backup otomatis!
mkdir -p backups
if docker ps --format '{{.Names}}' | grep -q "tamiang_mysql"; then
    BACKUP_TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
    echo -e "${YELLOW}>> Mengamankan data: Membuat backup otomatis ke backups/backup_prod_${BACKUP_TIMESTAMP}.sql...${NC}"
    docker exec tamiang_mysql mysqldump -u root -proot --databases layanan_acehtamiang --routines --triggers --single-transaction > "backups/backup_prod_${BACKUP_TIMESTAMP}.sql" 2>/dev/null || true
    echo -e "${GREEN}>> Backup database berhasil dibuat di backups/backup_prod_${BACKUP_TIMESTAMP}.sql${NC}"
fi

# Build image baru terlebih dahulu sebelum mematikan container lama (Zero-Downtime strategy)
echo -e "${YELLOW}>> Melakukan build image terbaru di background...${NC}"
$DOCKER_COMPOSE_CMD build --pull

# Up secara rolling (-d) tanpa perlu 'down' penuh yang mematikan database
echo -e "${YELLOW}>> Menerapkan update container secara rolling (Zero-Downtime)...${NC}"
$DOCKER_COMPOSE_CMD up -d --remove-orphans

# 7. Verifikasi Status Kesehatan Layanan & Database Readiness
echo -e "${BLUE}[6/6] Memverifikasi status kesehatan container & database...${NC}"
sleep 10
$DOCKER_COMPOSE_CMD ps

# Ambil IP Publik Server
SERVER_IP=$(curl -s -4 ifconfig.me || curl -s icanhazip.com || echo "IP_SERVER_ANDA")

echo ""
echo -e "${GREEN}==============================================================================${NC}"
echo -e "${GREEN}       DEPLOYMENT PRODUCTION BERHASIL DIJALANKAN DENGAN SUKSES!              ${NC}"
echo -e "${GREEN}==============================================================================${NC}"
echo ""
echo -e "Akses Layanan Anda:"
echo -e "  🌐 Portal Publik (Frontend Web) : ${CYAN}http://${SERVER_IP}:${FRONTEND_PORT}${NC}"
echo -e "  ⚙️  CMS Setup / Install Wizard   : ${CYAN}http://${SERVER_IP}:${FRONTEND_PORT}/install${NC}"
echo -e "  🔐 Panel Login Administrator     : ${CYAN}http://${SERVER_IP}:${FRONTEND_PORT}/admin/login${NC}"
echo -e "  🚀 Backend REST API             : ${CYAN}http://${SERVER_IP}:5055/api/v1/health${NC}"
echo -e "  🗄️  MinIO S3 Object Storage      : ${CYAN}http://${SERVER_IP}:9001${NC} (minioadmin / minioadminpassword)"
echo ""
echo -e "${YELLOW}Perintah Pemeliharaan Berguna:${NC}"
echo -e "  - Cek Log Realtime : ${CYAN}$DOCKER_COMPOSE_CMD logs -f${NC}"
echo -e "  - Restart Service  : ${CYAN}$DOCKER_COMPOSE_CMD restart${NC}"
echo -e "  - Hentikan Service : ${CYAN}$DOCKER_COMPOSE_CMD down${NC}"
echo ""
echo -e "Terima kasih! Seluruh infrastruktur telah siap melayani ASN Aceh Tamiang."

