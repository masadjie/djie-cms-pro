# Panduan Lengkap Deploy Production Portal BKPSDM Kab. Aceh Tamiang

Dokumentasi ini menjelaskan langkah demi langkah untuk melakukan deploy aplikasi ke server VPS / Dedicated (Ubuntu/Debian) secara otomatis dengan 1 perintah saja.

---

## ⚡ Cara Cepat (One-Click Automatic Deploy)

Jika Anda memiliki server baru (Ubuntu 20.04/22.04/24.04 atau Debian 11/12):

1. **Clone repositori di server:**
   ```bash
   git clone https://github.com/masadjie/layanan-bkpsdm.git
   cd layanan-bkpsdm
   ```

2. **Jalankan script deploy otomatis:**
   ```bash
   sudo bash deploy.sh
   ```

### 🛠️ Apa saja yang otomatis dilakukan oleh script `deploy.sh`?
1. Mengupdate paket sistem server.
2. Memeriksa & menginstal **Docker Engine**, **Docker CLI**, dan **Docker Compose plugin** secara resmi jika belum ada di server.
3. Membuka port firewall (UFW) untuk HTTP (80), HTTPS (443), dan port aplikasi (8080).
4. Menyiapkan environment variable production (`backend/.env`).
5. Membangun dan menjalankan 5 container terisolasi:
   - **MySQL 8.0** (Database utama terindeks & auto-seed)
   - **Redis 7 Alpine** (Lapisan cache berkecepatan tinggi)
   - **MinIO S3** (Object storage berkas lampiran & dokumen)
   - **Node.js Express API** (Backend REST API)
   - **Nginx Alpine + Vite** (Frontend web server dengan Gzip kompresi & reverse proxy)
6. Melakukan health check otomatis untuk memastikan seluruh kontainer sehat (*healthy*).

---

## 🌐 Port dan Akses Layanan

Setelah script selesai berjalan, Anda dapat langsung mengakses:

| Layanan | URL Akses | Keterangan |
| :--- | :--- | :--- |
| **Portal Web Publik** | `http://IP_SERVER:8080` atau `http://IP_SERVER` | Halaman landing page resmi |
| **Wizard Instalasi CMS** | `http://IP_SERVER:8080/install` | Konfigurasi awal identitas portal |
| **Panel Admin BKPSDM** | `http://IP_SERVER:8080/admin/login` | Login admin panel kepegawaian |
| **Backend REST API** | `http://IP_SERVER:5055/api/v1/health` | Health status API |
| **MinIO Storage Console** | `http://IP_SERVER:9001` | User: `minioadmin` / Pass: `minioadminpassword` |

---

## 🔒 Konfigurasi Domain & SSL (HTTPS Gratis Let's Encrypt)

Jika Anda ingin menghubungkan domain resmi (contoh: `bkpsdm.acehtamiangkab.go.id`):

1. Arahkan DNS **A Record** domain ke IP Publik server Anda.
2. Pasang Nginx Host & Certbot di server utama:
   ```bash
   sudo apt install -y certbot python3-certbot-nginx
   sudo certbot --nginx -d bkpsdm.acehtamiangkab.go.id
   ```
3. Konfigurasi Nginx server host untuk mem-proxy port `8080`:
   ```nginx
   server {
       server_name bkpsdm.acehtamiangkab.go.id;

       location / {
           proxy_pass http://127.0.0.1:8080;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
       }
   }
   ```

---

## 📋 Perintah Pemeliharaan Server

- **Melihat status container:**
  ```bash
  docker compose ps
  ```
- **Melihat live logs server:**
  ```bash
  docker compose logs -f
  ```
- **Restart seluruh service:**
  ```bash
  docker compose restart
  ```
- **Memperbarui aplikasi ke versi terbaru dari Git:**
  ```bash
  git pull origin master
  docker compose build
  docker compose up -d
  ```
