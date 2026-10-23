# 🌐 Djie CMS Pro — Open Source Portal & Content Management System

<div align="center">
  <img src="frontend/public/logo-djie-cms-pro-horizontal.png" alt="Djie CMS Pro Banner" width="460" />
  
  <p align="center">
    <strong>Content Management System (CMS) Modern, Cepat & Fleksibel untuk Portal Berita, Media Online, Blog Profesional, Company Profile, Komunitas, dan Portal Publik</strong>
  </p>

  <p align="center">
    <a href="README.md"><img src="https://img.shields.io/badge/Language-Bahasa%20Indonesia-10b981?style=for-the-badge&logo=google-translate&logoColor=white" alt="Bahasa Indonesia" /></a>
    <a href="README_EN.md"><img src="https://img.shields.io/badge/Language-English-3b82f6?style=for-the-badge&logo=google-translate&logoColor=white" alt="English Documentation" /></a>
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

**Djie CMS Pro** adalah Content Management System (CMS) modern level Enterprise yang dirancang fleksibel untuk berbagai kebutuhan web: mulai dari **Portal Berita & Media Online**, **Blog Publikasi Berbobot**, **Website Profil Perusahaan (Company Profile)**, **Portal Komunitas/Organisasi**, hingga **Layanan Informasi Publik**.

Dibangun dengan arsitektur modern (*Node.js + React*), Djie CMS Pro memberikan kecepatan muat super kencang, editor naskah yang nyaman, sistem manajemen media, serta **Fresh-Install Engine**: saat pertama kali di-clone, sistem berada dalam status **`Uninstalled`**. Siapa pun yang membuka web langsung disambut oleh **Interactive Setup Wizard 4-Langkah** dengan opsi migrasi data contoh (*dummy migration*) sekali klik!

---

## 🎯 Cocok Digunakan Untuk Apa Saja?

* 📰 **Portal Berita & Media Informasi**: Media online, pers kampus, portal berita independen, majalah digital, dan bulletin berkala.
* 🏢 **Company Profile & Corporate Website**: Website resmi perusahaan, agensi, startup, bisnis jasa, atau portofolio tim.
* 👥 **Organisasi, Komunitas & Yayasan**: Portal yayasan sosial, asosiasi profesi, komunitas hobi, lembaga riset, maupun serikat pekerja.
* 🏛️ **Instansi & Layanan Publik**: Portal informasi warga, pusat dokumen resmi, regulasi, dan transparansi publik.
* ✍️ **Personal Brand & Blog Profesional**: Penulis, analis, konten kreator, dan profesional yang membutuhkan CMS mandiri tanpa ketergantungan platform sewa.

---

## ✨ Fitur Kunci & Keunggulan

### 1. 🛠️ Interactive Setup Wizard (`/install`)
* **Sistem Deteksi Otomatis**: Jika database baru belum dikonfigurasi, sistem otomatis mengarahkan pengunjung ke Setup Wizard `/install`.
* **Pengecekan Kesiapan Sistem**: Verifikasi versi Node.js, status koneksi MySQL/MariaDB, Redis Cache, dan S3 MinIO secara visual.
* **Konfigurasi Identitas Portal**: Input nama situs/portal, slogan, kontak, alamat, dan deskripsi SEO tanpa perlu menyentuh kode.
* **Akun Master Super Admin**: Pembuatan akun admin utama pertama kali dengan enkripsi aman (`bcrypt`).
* **Opsi Migrasi Dummy Data (Pilihan)**: Tersedia pilihan untuk langsung memasang sampel artikel berita, slider hero, arsip dokumen, galeri foto, dan ulasan agar website langsung terlihat hidup dan siap demo, atau mulai dari database kosong (*clean slate*).

### 2. 🕒 Jadwal Publikasi Berita (Scheduled Publishing)
* Penulis dan redaksi dapat menjadwalkan tanggal dan jam publikasi artikel di masa mendatang (`published_at`).
* **Sistem Embargo**: Artikel tidak akan bocor ke publik atau tautan langsung (*direct slug*) sebelum waktu terbit tiba.
* Begitu waktu tayang tercapai, artikel otomatis tampil di portal publik secara real-time tanpa perlu login admin manual.

### 3. 💾 Auto-Save Draft & Crash Recovery Naskah
* Ketikan naskah di editor tersimpan otomatis ke browser (`localStorage`) setiap 15 detik.
* Jika laptop mati mendadak, kuota habis, atau tab tertutup tidak sengaja, sistem langsung menampilkan banner pemulihan: *"Ditemukan draf lokal belum tersimpan. Pulihkan tulisan Anda?"*.

### 4. 🚧 Mode Pemeliharaan Publik (1-Click Maintenance Mode)
* Sakelar cepat di panel admin untuk mengunci sementara akses publik saat portal sedang diperbarui.
* Tampilan publik pemeliharaan bergaya *dark-ambient glassmorphism* dilengkapi hitungan estimasi waktu online kembali dan kontak darurat.
* **Jalur Admin Tetap Terbuka**: Staf admin tetap leluasa login dan bekerja normal di dalam dashboard.

### 5. 👥 Granular Role-Based Access Control (RBAC)
* Pembagian peran pengguna berjenjang:
  * `SUPER_ADMIN`: Pengaturan sistem penuh, konfigurasi tema, audit log, dan database.
  * `ADMIN_OPD`: Manajemen kategori, dokumen, dan data layanan portal.
  * `EDITOR`: Penulisan, kurasi konten, jadwal terbit, dan moderasi artikel/galeri.
  * `VERIFIKATOR`: Peninjauan dan validasi data/permohonan masuk.
  * `WARGA`: Akun pengguna/member umum untuk berinteraksi dan komentar.

### 6. 🛡️ Audit Trail & Keamanan Menyeluruh
* Log audit real-time mencatat setiap aksi login, pembuatan naskah, pengeditan, penghapusan data, dan manipulasi sistem lengkap dengan alamat IP dan User-Agent.

### 7. ⚡ Performa Super Cepat & SEO Suite Studio
* Otomasi kompresi gambar upload ke format modern **WebP** guna menghemat kuota dan mempercepat loading.
* Dukungan penuh Schema.org (JSON-LD `NewsArticle`), Open Graph Facebook, Twitter Cards, dan Canonical URL otomatis.
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
│   │   ├── models/           # Sequelize ORM Schema (Berita, User, Halaman, dll)
│   │   ├── routes/           # RESTful API Endpoints
│   │   └── utils/            # Migrator, Seeder, dan Dummy Data Generator
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

## 💻 Rincian Teknologi yang Digunakan

* **Backend**:
  * **Runtime**: Node.js (v18.x / v20.x LTS)
  * **Framework**: Express.js
  * **Database ORM**: Sequelize ORM (MySQL 8.x / MariaDB)
  * **Keamanan**: JSON Web Token (JWT), bcryptjs, Helmet, Express Rate Limit
  * **Cache**: Redis Cache Engine
  * **File Storage**: MinIO / S3 Object Storage & Local Storage fallback
* **Frontend**:
  * **Framework**: React 18
  * **Build Tool**: Vite 5
  * **CSS Framework**: Tailwind CSS v3
  * **State & Data Cache**: TanStack React Query v5
  * **Routing**: React Router DOM v6
  * **Editor Visual**: TipTap WYSIWYG Editor
  * **Ikon**: Lucide React Vector Icons

---

## 📦 Panduan Instalasi

> 💡 **Sangat Disarankan Menggunakan Docker!**  
> Menggunakan Docker adalah cara paling cepat, bersih, dan bebas pusing karena database MySQL, Redis, S3 MinIO, Backend, dan Frontend akan langsung terkonfigurasi otomatis dalam satu perintah tanpa perlu install database manual di laptop/server Anda.

---

### 🐳 Opsi 1: Instalasi dengan Docker (Sangat Disarankan ⭐)

Cukup pastikan Anda sudah menginstall [Docker](https://www.docker.com/) dan Docker Compose.

1. **Clone Repositori**:
   ```bash
   git clone https://github.com/masadjie/djie-cms-pro.git
   cd djie-cms-pro
   ```

2. **Jalankan Seluruh Stack dengan 1 Perintah**:
   ```bash
   docker compose up -d --build
   ```
   *Docker akan otomatis menyiapkan container MySQL 8, Redis 7, MinIO Storage, Backend API, dan Frontend Nginx.*

3. **Buka Browser & Jalankan Setup Wizard**:
   Buka browser di:  
   👉 **`http://localhost:3000`** (atau `http://localhost:3000/install`)

---

### 💻 Opsi 2: Instalasi Manual (Node.js & Local MySQL)

Jika Anda ingin menjalankan server development langsung di environment lokal:

#### Prasyarat Sistem
* **Node.js**: Versi 18.x atau 20.x ke atas
* **Database**: MySQL 8.0+ atau MariaDB 10.5+

#### Langkah-langkah:
1. **Clone Repositori**:
   ```bash
   git clone https://github.com/masadjie/djie-cms-pro.git
   cd djie-cms-pro
   ```

2. **Setup & Jalankan Backend**:
   ```bash
   cd backend
   cp .env.example .env
   ```
   > Sesuaikan kredensial database di file `.env` (misal: `DB_NAME=djie_cms_pro`). Buat database kosong terlebih dahulu di MySQL (`CREATE DATABASE djie_cms_pro;`).

   Lalu jalankan backend:
   ```bash
   npm install
   npm run dev
   ```

3. **Setup & Jalankan Frontend**:
   Buka terminal baru di folder proyek:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

4. **Buka Setup Wizard di Browser**:
   Buka browser di:  
   👉 **`http://localhost:5173`** (otomatis dialihkan ke `/install`)

---

### 🧙‍♂️ Apa yang Dilakukan di Setup Wizard (`/install`)?
Ikuti 4 langkah mudah pada layar:
1. **Pemeriksaan Kesiapan Sistem**: Memastikan server dan database terhubung.
2. **Identitas Portal**: Masukkan nama portal berita/organisasi Anda, tagline, dan kontak.
3. **Akun Super Admin & Dummy Data**: Buat email dan password admin utama Anda, serta pilih apakah ingin mencentang **Pasang Data Contoh / Dummy Migration**.
4. **Selesai**: Klik tombol luncurkan dan langsung masuk ke Dashboard Administrator!

---

## 🤝 Berkontribusi

Kontribusi dari seluruh pengembang dan komunitas open source sangat terbuka!
1. Fork repositori ini
2. Buat branch fitur baru (`git checkout -b feature/FiturKeren`)
3. Commit perubahan Anda (`git commit -m 'Menambahkan fitur keren'`)
4. Push ke branch (`git push origin feature/FiturKeren`)
5. Buat **Pull Request** baru

---

## 📄 Lisensi

Proyek ini dirilis secara terbuka di bawah lisensi resmi **[MIT License](LICENSE)**. Anda bebas menggunakan, memodifikasi, dan menyebarluaskannya untuk kepentingan personal, portal berita independen, komersial, maupun organisasi.

<div align="center">
  <p>Dibuat dan dikembangkan oleh <strong>Mas Adjie & Kontributor Open Source</strong>.</p>
</div>
