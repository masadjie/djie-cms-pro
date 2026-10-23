# 🌐 Djie CMS Pro — Enterprise Open Source Government & Portal CMS

<div align="center">
  <img src="frontend/public/logo-djie-cms-pro-horizontal.png" alt="Djie CMS Pro Banner" width="460" />
  
  <p align="center">
    <strong>Content Management System (CMS) Modern Level Enterprise Khusus Portal Pemerintah, OPD, Lembaga & Organisasi Publik</strong>
  </p>

  <p align="center">
    <a href="https://github.com/masadjie/djie-cms-pro/releases/latest"><img src="https://img.shields.io/badge/Release-v1.0.0-10b981?style=for-the-badge&logo=github" alt="Latest Release" /></a>
    <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-amber?style=for-the-badge" alt="License" /></a>
    <a href="#arsitektur--tech-stack"><img src="https://img.shields.io/badge/Stack-Node.js%20%7C%20React%20%7C%20MySQL%20%7C%20Redis-blue?style=for-the-badge" alt="Tech Stack" /></a>
    <a href="#installation-setup-wizard"><img src="https://img.shields.io/badge/Setup-Interactive%20Wizard-emerald?style=for-the-badge" alt="Setup Wizard" /></a>
  </p>
</div>

---

## 📖 Ringkasan Proyek

**Djie CMS Pro** adalah platform portal informasi dan manajemen konten (CMS) berstandar industri modern yang dirancang untuk instansi pemerintahan (Dinas/Badan/OPD, Pemkab/Pemkot, Lembaga Publik) serta organisasi profesional. 

Berbeda dari CMS konvensional, **Djie CMS Pro** hadir dengan **Fresh-Install Engine**: saat pertama kali di-clone, sistem berstatus **`Uninstalled`**. Siapa pun yang membuka web langsung disambut oleh **Setup Wizard Interaktif 4-Langkah** dengan opsi migrasi dummy data bawaan.

---

## ✨ Fitur Kunci & Keunggulan

### 1. 🛠️ Interactive Setup Wizard (`/install`)
* **Sistem Deteksi Otomatis**: Jika database baru belum dikonfigurasi, pengunjung otomatis diarahkan ke Wizard `/install`.
* **Pengecekan Kesiapan Lingkungan**: Verifikasi versi Node.js, koneksi MySQL/MariaDB, Redis Cache, dan S3 MinIO.
* **Konfigurasi Identitas Instansi**: Pengisian nama situs, tagline, kontak, logo, dan profil wilayah tanpa coding.
* **Akun Master Super Admin**: Pembuatan akun admin pertama dengan enkripsi bcrypt yang aman.
* **Opsi Migrasi Dummy Data**: Disediakan tombol centang apakah ingin memasang sampel artikel berita, SOP regulasi, banner slider, dan testimoni bawaan atau mulai dari database kosong.

### 2. 🕒 Jadwal Publikasi Otomatis (Scheduled Publishing)
* Penulis berita dapat menjadwalkan tanggal dan jam publikasi artikel di masa mendatang (`published_at`).
* **Sistem Embargo**: Artikel tidak akan bocor ke publik atau tautan langsung (*direct slug*) sebelum waktu terbit tiba.
* Begitu waktu tayang tercapai, artikel otomatis tampil di portal publik tanpa perlu intervensi staf.

### 3. 💾 Auto-Save Draft & Crash Recovery Naskah
* Naskah di editor tersimpan otomatis ke browser (`localStorage`) setiap 15 detik.
* Jika laptop mati mendadak, kuota habis, atau tab tertutup, sistem langsung menampilkan banner pemulihan: *"Ditemukan draf lokal belum tersimpan. Pulihkan tulisan Anda?"*.

### 4. 🚧 Mode Pemeliharaan Publik (1-Click Maintenance Mode)
* Sakelar cepat di panel admin untuk mengunci akses warga saat server sedang diperbarui.
* Tampilan publik pemeliharaan bergaya *dark-ambient glassmorphism* dilengkapi hitungan estimasi waktu online kembali dan kontak WhatsApp darurat.
* **Jalur Admin Tetap Terbuka**: Administrator tetap bebas login dan mengelola sistem seperti biasa.

### 5. 👥 Granular Role-Based Access Control (RBAC)
* Hak akses berjenjang:
  * `SUPER_ADMIN`: Akses penuh konfigurasi sistem, database, audit log, dan tema.
  * `ADMIN_OPD`: Manajemen layanan, dokumen publik, dan data sektoral.
  * `EDITOR`: Penulisan, kurasi, dan publikasi artikel berita/galeri.
  * `VERIFIKATOR`: Peninjauan dan validasi permohonan layanan publik.
  * `WARGA`: Akses akun pemohon layanan dan pelacakan tiket permohonan.

### 6. 🛡️ Audit Trail & Keamanan Menyeluruh
* Log audit real-time mencatat setiap aksi login, pembuatan naskah, penghapusan data, dan manipulasi sistem lengkap dengan alamat IP dan User-Agent.

### 7. ⚡ Performa Tinggi & SEO Suite
* Otomasi kompresi gambar upload ke format modern **WebP**.
* Dukungan penuh Schema.org (JSON-LD), Open Graph, Twitter Cards, dan generator Canonical URL otomatis.
* Akselerasi cache memori **Redis** dengan fallback cerdas.

---

## 🏗️ Arsitektur & Tech Stack

```
djie-cms-pro/
├── backend/                  # Node.js + Express REST API Server
│   ├── src/
│   │   ├── config/           # Database Sequelize, Redis, MinIO, Winston Logger
│   │   ├── controllers/      # Logika Bisnis (CMS, Berita, RBAC, Layanan, Storage)
│   │   ├── middlewares/      # JWT Auth, Rate Limiter, Security, Audit Log
│   │   ├── models/           # Sequelize ORM Schema
│   │   ├── routes/           # RESTful API Endpoints
│   │   └── utils/            # Migrator, Seeder, dan Dummy Generator
│   ├── .env.example
│   └── package.json
└── frontend/                 # React 18 + Vite SPA Single Page Application
    ├── src/
    │   ├── components/       # UI Komponen Reusable, Navbar, Sidebar, Editor
    │   ├── context/          # Auth Context, Theme Context
    │   ├── pages/            # Home, Katalog, Berita, Admin, Setup Wizard, Maintenance
    │   └── services/         # Axios API Client Interceptor
    ├── vite.config.js
    └── tailwind.config.js
```

---

## 🚀 Panduan Instalasi Cepat

### Prasyarat Sistem
* **Node.js**: Versi 18.x atau 20.x ke atas
* **Database**: MySQL 8.0+ atau MariaDB 10.5+
* **Redis** (Opsional, untuk akselerasi cache)
* **MinIO / S3 Storage** (Opsional, untuk penyimpanan berkas dokumen awan)

---

### Langkah 1: Clone Repositori
```bash
git clone https://github.com/masadjie/djie-cms-pro.git
cd djie-cms-pro
```

### Langkah 2: Konfigurasi & Jalankan Backend
```bash
cd backend
cp .env.example .env
```
> Buka file `.env` dan sesuaikan kredensial database Anda (`DB_NAME`, `DB_USER`, `DB_PASS`). Buat database kosong terlebih dahulu di MySQL (misal: `CREATE DATABASE djie_cms_pro;`).

Lalu jalankan backend:
```bash
npm install
npm run dev
```

### Langkah 3: Konfigurasi & Jalankan Frontend
Buka terminal baru di folder proyek:
```bash
cd frontend
npm install
npm run dev
```

### Langkah 4: Buka Setup Wizard di Browser
Kunjungi alamat web lokal Anda:
👉 **`http://localhost:5173`**

Sistem otomatis mendeteksi status instalasi dan mengarahkan Anda ke:
👉 **`http://localhost:5173/install`**

Ikuti 4 langkah pada antarmuka:
1. **Pemeriksaan Sistem**: Memastikan server siap digunakan.
2. **Identitas Portal**: Masukkan nama instansi/organisasi dan informasi kontak.
3. **Akun Super Admin**: Tentukan email dan password admin utama Anda, serta pilih opsi data contoh (*dummy migration*).
4. **Selesai**: Klik tombol luncurkan dan masuk ke Dashboard Administrator!

---

## 🤝 Berkontribusi

Kontribusi dari seluruh pengembang sangat terbuka!
1. Fork repositori ini
2. Buat branch fitur baru (`git checkout -b feature/FiturKeren`)
3. Commit perubahan Anda (`git commit -m 'Menambahkan fitur keren'`)
4. Push ke branch (`git push origin feature/FiturKeren`)
5. Buat **Pull Request** baru

---

## 📄 Lisensi

Proyek ini dirilis di bawah lisensi resmi **[MIT License](LICENSE)**. Anda bebas menggunakan, memodifikasi, dan menyebarluaskannya untuk kepentingan instansi pemerintah, swasta, akademis, maupun komersial.

<div align="center">
  <p>Dibuat dengan dedikasi untuk akselerasi transformasi digital pelayanan publik Indonesia.</p>
</div>
