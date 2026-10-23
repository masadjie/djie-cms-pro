/**
 * DJIE CMS PRO Version & Release Changelog Config
 * Single source of truth for Version, Updates, and Features Log
 */

export const CMS_APP_VERSION = {
  name: 'DJIE CMS PRO',
  version: '1.0',
  patch: 'Patch 2',
  fullVersion: 'DJIE CMS PRO v1.0 Patch 2',
  buildDate: '23 Oktober 2026',
  badge: 'v1.0 Patch 2 • Official Stable',
  status: 'Up to Date',
  checkUpdateUrl: 'https://github.com/masadjie/layanan-bkpsdm',
  changelog: [
    {
      version: 'v1.0 Patch 2',
      date: '23 Oktober 2026',
      badge: 'Terbaru',
      highlights: [
        'Fitur Pencarian Universal Global (Quick Search): Pencarian cepat instan di header panel admin untuk menu navigasi, artikel berita, dan katalog layanan.',
        'Sistem Pembaruan & Riwayat Rilis Versi: Modal changelog interaktif dan badge versi resmi sistem.',
        'Filter Kustom Tanggal (Start Date & End Date): Pemilihan rentang tanggal analitik lalu lintas riil dengan batas 90 hari dan render grafik adaptif.',
        'Fitur Ingat Akun & Kata Sandi (Remember Me): Penyimpanan kredensial lokal terenkripsi di browser agar login berikutnya instan.',
        'Pemberitahuan Sistem & Keamanan Real-Time: Popover notifikasi lonceng untuk komentar baru masyarakat dan upaya serangan hacker WAF yang dicegah.'
      ]
    },
    {
      version: 'v1.0 Patch 1',
      date: '22 Oktober 2026',
      badge: 'Stabil',
      highlights: [
        'Pembaruan Engine Node.js 24 LTS & Nginx Mainline Alpine Slim dengan hardening keamanan maksimal.',
        'Manajemen Sidebar & Widget: Pengaturan dinamis widget sambutan pimpinan, jam kerja, hotline darurat, dan widget custom HTML.',
        'Perbaikan Tata Letak Menu Navigasi: Grid multi-baris responsive dan konsisten di perangkat mobile dan desktop.',
        '1-Click SEO Booster: Generator meta tags otomatis, slugifier, dan pratinjau cuplikan Google Search.',
        'Color Picker & Custom Modal Dialog: Penggantian window alert bawaan dengan dialog kustom bertema Glassmorphism.'
      ]
    },
    {
      version: 'v1.0 Patch 0',
      date: '20 Oktober 2026',
      badge: 'Rilis Perdana',
      highlights: [
        'Peluncuran Fondasi Arsitektur Skote Admin & DJIE CMS PRO.',
        'Sistem Otentikasi Multi-Role RBAC (Super Admin, Editor, OPD, Warga).',
        'Pencatatan Audit Trail Aktivitas dan Web Application Firewall (WAF) Shield.',
        'Penyimpanan Media S3/MinIO & Kompresi Gambar Otomatis WebP.'
      ]
    }
  ]
};

export default CMS_APP_VERSION;
