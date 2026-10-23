<div align="center">
  <img src="frontend/public/logo-djie-cms-pro-horizontal.png" alt="Djie CMS Pro" width="380" />
  <br /><br />

  <p align="center">
    <strong>CMS modern, cepat, dan independen untuk portal berita, media digital, dan website profesional.</strong>
  </p>

  <p align="center">
    <a href="README.md"><img src="https://img.shields.io/badge/Bahasa-Indonesia-10b981?style=flat-square" alt="Bahasa Indonesia" /></a>
    <a href="README_EN.md"><img src="https://img.shields.io/badge/Language-English-3b82f6?style=flat-square" alt="English Documentation" /></a>
    <a href="https://github.com/masadjie/djie-cms-pro/releases/latest"><img src="https://img.shields.io/badge/Release-v1.0.0-10b981?style=flat-square" alt="Latest Release" /></a>
    <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-gray?style=flat-square" alt="License" /></a>
    <a href="#arsitektur--tech-stack"><img src="https://img.shields.io/badge/Stack-Node.js%20%7C%20React%20%7C%20MySQL%20%7C%20Redis-blue?style=flat-square" alt="Tech Stack" /></a>
  </p>
</div>

---

## Ringkasan

**Djie CMS Pro** adalah Content Management System mandiri (*self-hosted*) yang dirancang untuk kecepatan, kemudahan kurasi konten, dan kesiapan produksi tinggi. Cocok untuk portal berita online, ruang redaksi pers, website profil perusahaan, maupun portal komunitas.

Dibangun dengan arsitektur decoupled (**Node.js REST API + React 18 SPA**), Djie CMS Pro sudah dilengkapi **Setup Wizard 4-langkah** bawaan untuk instalasi instan (lengkap dengan opsi seeding data dummy untuk preview langsung).

---

## Skenario Penggunaan

* **Portal Berita & Media Digital**: Redaksi independen, majalah online, jurnalisme kampus, portal warta regional.
* **Company Profile & Korporat**: Showcase agensi, profil startup, portofolio tim, portal layanan bisnis.
* **Komunitas & Asosiasi**: Yayasan publik, komunitas hobi, perserikatan, portal alumni atau lembaga riset.
* **Pusat Informasi & Pengumuman**: Transparansi publik, repositori arsip & dokumen resmi, pengumuman agenda berkala.
* **Publikasi & Blog Pribadi**: Wadah naskah dan opini mandiri tanpa ketergantungan pada platform sewa pihak ketiga.

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

## Arsitektur & Cara Kerja Sistem

Djie CMS Pro dirancang dengan konsep **Decoupled (Headless-Ready) Architecture**. Artinya, backend (logika bisnis & database) dan frontend (tampilan web) terpisah secara independen. Pendekatan ini membuat website jauh lebih cepat, hemat resource, dan mudah dimodifikasi di kemudian hari.

```
+-------------------------------------------------------------+
|                     PENGUNJUNG & REDAKSI                    |
|             (Desktop, Tablet, & Smartphone Browser)         |
+-------------------------------------------------------------+
                              |
                              v
+-------------------------------------------------------------+
|                 FRONTEND (React 18 + Vite)                  |
|  - Single Page Application (SPA) secepat kilat tanpa reload |
|  - Tailwind CSS: Tampilan responsif & modern                |
|  - TanStack Query: Caching data pintar di sisi browser      |
|  - TipTap Editor: Ruang redaksi & penulisan naskah interaktif|
+-------------------------------------------------------------+
                              |
                     RESTful API (JSON / HTTPs)
                              |
                              v
+-------------------------------------------------------------+
|                 BACKEND (Node.js + Express)                 |
|  - API Controller: Menangani logika berita, user, & menu    |
|  - Security Layer: JWT Token, Helmet, CORS, & Rate Limiter  |
|  - Activity Logger: Pencatat riwayat & audit trail admin    |
+-------------------------------------------------------------+
         |                        |                   |
         v                        v                   v
+------------------+    +-------------------+   +-------------+
|  DATABASE UTAMA  |    |     IN-MEMORY     |   |   STORAGE   |
|  MySQL 8 / Maria |    |       CACHE       |   |   OBJECT    |
|                  |    |       Redis       |   | MinIO / S3  |
|  (Data berita,   |    | (Akselerasi data  |   | (Penyimpanan|
|  user, kategori, |    | & penahan lonjakan|   | foto berita,|
|  dan pengaturan) |    | traffic pembaca)  |   | pdf dokumen)|
+------------------+    +-------------------+   +-------------+
```

---

## Tech Stack & Peran Teknologinya

Untuk memastikan performa tinggi dan kemudahan pemeliharaan, berikut teknologi yang digunakan beserta perannya:

### 1. Sisi Pengguna & Antarmuka (Frontend)
| Teknologi | Peran & Mengapa Digunakan |
| :--- | :--- |
| **React 18** | Fondasi antarmuka modern berbasis komponen yang reaktif dan interaktif. |
| **Vite 5** | Build tool generasi terbaru yang membuat loading dev server dan kompilasi produksi sangat kencang. |
| **Tailwind CSS v3** | Styling utility-first untuk desain website yang rapi, modern, dan otomatis pas di layar smartphone. |
| **TanStack React Query v5** | Mengelola request data dan caching di browser agar halaman tidak perlu loading ulang terus-menerus. |
| **TipTap Editor** | Editor teks kaya (WYSIWYG) standar industri yang nyaman untuk wartawan dan penulis berita. |
| **Lucide React** | Koleksi ikon vektor modern yang ringan dan tajam di semua resolusi layar. |

### 2. Sisi Server & Logika Bisnis (Backend)
| Teknologi | Peran & Mengapa Digunakan |
| :--- | :--- |
| **Node.js (LTS)** | Runtime JavaScript sisi server yang hemat memori dan memiliki performa I/O non-blocking tinggi. |
| **Express.js** | Framework web minimalis dan handal untuk menyediakan rute RESTful API yang bersih. |
| **Sequelize ORM** | Jembatan pengelola relasi tabel database secara terstruktur, aman dari SQL Injection. |
| **JWT (JSON Web Token)** | Standar autentikasi modern tanpa session cookie yang memberatkan server. |
| **Helmet & Express Rate Limit** | Lapisan proteksi keamanan otomatis terhadap serangan brute-force, header tampering, dan DDoS ringan. |

### 3. Sisi Database, Caching & Media Storage
| Teknologi | Peran & Mengapa Digunakan |
| :--- | :--- |
| **MySQL 8.x / MariaDB** | Penyimpanan data relasional utama (artikel, user, audit trail, halaman, banner). |
| **Redis Cache** | Database memori super kilat untuk menyimpan sementara data populer sehingga database tidak terbebani saat traffic melonjak. |
| **MinIO / AWS S3 Compatible** | Tempat penyimpanan file foto berita, banner, dan lampiran dokumen secara terpusat (*tersedia fallback penyimpanan lokal otomatis*). |

---

## Struktur Folder Proyek

```
djie-cms-pro/
├── docker-compose.yml        # Konfigurasi 1-klik untuk MySQL, Redis, MinIO, Backend & Frontend
├── backend/                  # Server Node.js + Express REST API
│   ├── src/
│   │   ├── config/           # Koneksi database Sequelize, Redis, MinIO, & Winston logger
│   │   ├── controllers/      # Logika pemrosesan berita, kategori, user, menu, dsb.
│   │   ├── middlewares/      # Pelindung token JWT, pembatas rate limit, audit log
│   │   ├── models/           # Definisi skema tabel database (Berita, User, Page, dsb.)
│   │   ├── routes/           # Alamat endpoint RESTful API
│   │   └── utils/            # Script Setup Wizard, migrator tabel, & pembuat data dummy
│   ├── .env.example          # Template konfigurasi environment backend
│   └── package.json
└── frontend/                 # Aplikasi Web React 18 + Vite
    ├── src/
    │   ├── components/       # Komponen UI (Navbar, Footer, Sidebar, Dialog, TipTap Editor)
    │   ├── context/          # Pengelola state global (Status login & tema)
    │   ├── pages/            # Halaman Portal, Detail Berita, Dashboard Admin, Setup Wizard
    │   └── services/         # Penghubung HTTP client (Axios) ke API backend
    ├── vite.config.js        # Konfigurasi bundler Vite
    └── tailwind.config.js    # Konfigurasi palet warna & tema Tailwind CSS
```

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
