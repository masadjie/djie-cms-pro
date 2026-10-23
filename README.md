<div align="center">
  <img src="frontend/public/logo-djie-cms-pro-horizontal.png" alt="Djie CMS Pro Logo" width="380" />
  <p><strong>Sistem Manajemen Konten & Portal Informasi Publik Modern Terpadu untuk Instansi Pemerintah & Organisasi</strong></p>

  <p>
    <a href="#fitur-utama"><img src="https://img.shields.io/badge/Versi-1.0%20Pro-10b981?style=for-the-badge" alt="Version" /></a>
    <a href="#lisensi"><img src="https://img.shields.io/badge/Lisensi-MIT-amber?style=for-the-badge" alt="License" /></a>
    <a href="#tech-stack"><img src="https://img.shields.io/badge/Stack-Node.js%20%7C%20React%20%7C%20MySQL-3b82f6?style=for-the-badge" alt="Stack" /></a>
  </p>
</div>

---

## 📌 Tentang Djie CMS Pro

**Djie CMS Pro** adalah Content Management System (CMS) modern level Enterprise yang dirancang khusus untuk portal pemerintahan (OPD, Dinas, Lembaga, Pemkab/Pemkot) maupun organisasi publik. Dilengkapi dengan **Installation Setup Wizard interaktif**, fitur keamanan RBAC granular, jadwal publikasi berita otomatis, auto-save draft, dan mode pemeliharaan publik 1-klik.

Ketika repositori pertama kali di-*clone* dan dijalankan pada database baru, sistem berada dalam status **`Uninstalled`**. Siapa pun yang membuka browser akan langsung dipandu melalui **Installation Wizard 4-Langkah** tanpa perlu setup database secara manual!

---

## 🚀 Fitur Unggulan

* 🛠️ **Interactive Installation Setup Wizard (`/install`)**:
  * Pengecekan otomatis kesiapan sistem (Node.js, DB, Cache).
  * Formulir identitas instansi & branding portal.
  * Pembuatan akun Master Super Administrator pertama.
  * **Opsi Migrasi Dummy Data**: Anda dapat memilih apakah ingin memasang contoh berita, dokumen, banner, dan testimoni bawaan atau mulai dari database kosong.
* 🕒 **Jadwal Publikasi Berita (Scheduled Publishing)**:
  * Artikel dapat dijadwalkan untuk terbit pada tanggal dan jam tertentu di masa depan (`published_at`).
  * Sistem otomatis menahan embargo berita dan mempublikasikannya ke publik tepat waktu.
* 💾 **Auto-Save Draft & Crash Recovery**:
  * Ketikan editor tersimpan otomatis ke browser setiap 15 detik.
  * Fitur pemulihan naskah jika browser tertutup atau laptop mati secara tiba-tiba.
* 🚧 **Mode Pemeliharaan Publik (Maintenance Mode 1-Klik)**:
  * Sakelar cepat di panel admin untuk mengunci akses publik saat pembaruan server.
  * Halaman publik pemeliharaan berdesain eksklusif dengan kontak darurat, sementara akses admin tetap terbuka.
* 👥 **Role-Based Access Control (RBAC)**:
  * Pembagian peran yang jelas: `SUPER_ADMIN`, `ADMIN_OPD`, `EDITOR`, `VERIFIKATOR`, dan `WARGA`.
* 🛡️ **Audit Trail & Log Keamanan Lengkap**:
  * Mencatat setiap aksi login, pembuatan naskah, penghapusan, dan perubahan sistem.
* ⚡ **High Performance & Cache Ready**:
  * Integrasi Redis Cache otomatis dengan fallback in-memory, kompresi gambar otomatis ke format WebP modern, serta pagination server-side.

---

## 💻 Tech Stack

* **Backend**: Node.js (v18+ / v20+), Express.js, Sequelize ORM, MySQL 8 / MariaDB, Redis, MinIO S3 Object Storage.
* **Frontend**: React 18, Vite, Tailwind CSS, Lucide Icons, React Query (TanStack), TipTap WYSIWYG Editor.

---

## 📦 Panduan Instalasi Cepat

### 1. Clone Repositori
```bash
git clone https://github.com/masadjie/djie-cms-pro.git
cd djie-cms-pro
```

### 2. Konfigurasi Backend
```bash
cd backend
cp .env.example .env
# Sesuaikan pengaturan database (DB_NAME, DB_USER, DB_PASS) pada file .env
npm install
npm run dev
```

### 3. Konfigurasi Frontend
```bash
cd ../frontend
npm install
npm run dev
```

### 4. Buka Browser & Jalankan Setup Wizard
Buka browser Anda di:
👉 **`http://localhost:5173`**

Sistem otomatis mendeteksi bahwa CMS belum terinstall dan akan mengarahkan Anda ke:
👉 **`http://localhost:5173/install`**

Ikuti 4 langkah mudah:
1. Pengecekan spesifikasi server.
2. Isi identitas instansi / organisasi Anda.
3. Buat email dan password Super Admin pertama, serta tentukan apakah ingin memasang **Data Dummy / Sample Data**.
4. Selesai! Anda langsung diarahkan ke Dashboard Admin untuk mulai mengelola portal.

---

## 📄 Lisensi

Djie CMS Pro dirilis di bawah lisensi open source **[MIT License](LICENSE)**. Anda bebas menggunakan, memodifikasi, dan mendistribusikannya untuk kebutuhan instansi pemerintah, swasta, maupun komersial.
