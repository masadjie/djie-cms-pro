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

## 💎 14 Modul Fitur Unggulan

Djie CMS Pro menghadirkan **14 modul manajemen komprehensif** yang siap pakai untuk mengelola operasional portal berita, media online, maupun website organisasi secara profesional:

| No | Modul Fitur | Deskripsi Fungsional |
| :---: | :--- | :--- |
| **1** | **Manajemen Berita & Artikel** | Editor WYSIWYG canggih, **Jadwal Publikasi Berita (*Scheduled Publishing*)**, **Auto-Save Draf ke Browser**, fitur crash recovery naskah, sematkan berita utama (*sticky/pinned*), dan hitung estimasi waktu baca (*read time*). |
| **2** | **Manajemen Komentar & Moderasi** | Sistem peninjauan komentar pembaca berjenjang (*Pending / Approved / Spam / Rejected*), filter kata sensitif, dan pelindung anti-spam. |
| **3** | **Manajemen Kategori Berita** | Pengelompokan topik/rubrik artikel yang fleksibel dengan pembuatan otomatis URL SEO-friendly (*slug generator*). |
| **4** | **Manajemen Halaman Statis (Pages)** | Pembuatan halaman profil, tentang kami, visi-misi, kebijakan privasi (*privacy policy*), dan syarat ketentuan dengan layout visual bersih. |
| **5** | **Manajemen Agenda & Acara** | Kalender kegiatan, jadwal pertemuan, liputan acara, dan webinar lengkap dengan penanda lokasi dan status *Online / Offline / Hybrid*. |
| **6** | **Manajemen Dokumen & Berkas** | Repositori arsip digital terpusat (PDF, spreadsheet, formulir) dengan pelacak statistik jumlah unduhan (*download counter*). |
| **7** | **Manajemen Banner & Slider** | Pengaturan visual banner utama di beranda dengan kontrol link tujuan, status aktif/nonaktif, dan urutan sorotan visual. |
| **8** | **Manajemen Testimoni & Ulasan** | Pengelolaan survei kepuasan, ulasan pembaca/klien, kutipan tokoh, dan rating bintang untuk membangun kredibilitas portal. |
| **9** | **Manajemen User & Role (RBAC)** | Kontrol hak akses multi-level (`SUPER_ADMIN`, `ADMIN_OPD`, `EDITOR`, `VERIFIKATOR`, `WARGA`), manajemen akun staf, dan reset password aman. |
| **10** | **Manajemen Sidebar & Widget** | Pengaturan komponen dinamis di bilah samping (widget berita terpopuler, live visitor counter, jam operasional, dan info kontak). |
| **11** | **Manajemen SEO Studio** | Optimasi kata kunci Google, Meta Title, Meta Description, OpenGraph preview medsos, dan Schema.org JSON-LD otomatis. |
| **12** | **Manajemen Tema & Tampilan** | Kustomisasi palet warna aksen primer, logo header/footer, favicon, tipografi, dan mode pemeliharaan publik (*1-Click Maintenance Mode*). |
| **13** | **Manajemen Menu & Navigasi** | Penata struktur menu header, navigasi bertingkat (*dropdown multi-level*), dan mega-menu interaktif yang responsif di smartphone. |
| **14** | **Audit Trail & Keamanan Sistem** | Rekam jejak seluruh aktivitas login, perubahan naskah, dan penghapusan data secara transparan dengan alamat IP dan User-Agent. |

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
