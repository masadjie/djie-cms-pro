import React, { useState, useMemo } from 'react';
import * as LucideIcons from 'lucide-react';
import { 
  Search, 
  X, 
  Layers, 
  Users, 
  FileText, 
  Building2, 
  BarChart3, 
  Megaphone, 
  Settings, 
  Check, 
  Trash2,
  Sparkles
} from 'lucide-react';

// Curated library of 100+ icons suitable for government CMS, services, and navigation
export const ICON_LIBRARY = [
  // Kepegawaian & Layanan ASN
  { name: 'User', label: 'Pengguna', category: 'kepegawaian', tags: ['user', 'profil', 'orang', 'asn', 'pegawai'] },
  { name: 'Users', label: 'Kelompok Pegawai', category: 'kepegawaian', tags: ['users', 'tim', 'pegawai', 'asn', 'staf'] },
  { name: 'UserCheck', label: 'Verifikasi ASN', category: 'kepegawaian', tags: ['verifikasi', 'asn', 'valid', 'setuju'] },
  { name: 'UserCog', label: 'Admin Pegawai', category: 'kepegawaian', tags: ['admin', 'kelola', 'pegawai', 'setting'] },
  { name: 'UserPlus', label: 'Tambah Pegawai', category: 'kepegawaian', tags: ['tambah', 'rekrutmen', 'cpns', 'p3k'] },
  { name: 'Briefcase', label: 'Jabatan / Karir', category: 'kepegawaian', tags: ['jabatan', 'karir', 'pekerjaan', 'mutasi'] },
  { name: 'Award', label: 'Penghargaan / Prestasi', category: 'kepegawaian', tags: ['award', 'prestasi', 'tanda jasa', 'satyalancana'] },
  { name: 'GraduationCap', label: 'Pendidikan / Diklat', category: 'kepegawaian', tags: ['sekolah', 'kuliah', 'ijazah', 'diklat', 'pelatihan'] },
  { name: 'HeartHandshake', label: 'Kesejahteraan / Cuti', category: 'kepegawaian', tags: ['cuti', 'bantuan', 'taspen', 'pensiun', 'sosial'] },
  { name: 'ShieldCheck', label: 'Disiplin & Integritas', category: 'kepegawaian', tags: ['disiplin', 'integritas', 'kode etik', 'hukuman'] },
  { name: 'Contact', label: 'Buku Kontak Pegawai', category: 'kepegawaian', tags: ['kontak', 'direktori', 'telepon', 'buku'] },
  { name: 'BadgeCheck', label: 'Sertifikasi', category: 'kepegawaian', tags: ['sertifikat', 'akreditasi', 'lulus', 'kompetensi'] },
  { name: 'Smile', label: 'Indeks Kepuasan', category: 'kepegawaian', tags: ['kepuasan', 'ikm', 'survei', 'layanan'] },
  { name: 'Scale', label: 'Hukum & Regulasi ASN', category: 'kepegawaian', tags: ['hukum', 'aturan', 'perbup', 'undang-undang'] },

  // Dokumen & Publikasi
  { name: 'FileText', label: 'Dokumen / Berkas', category: 'dokumen', tags: ['dokumen', 'surat', 'file', 'teks', 'sk'] },
  { name: 'Files', label: 'Koleksi Dokumen', category: 'dokumen', tags: ['arsip', 'berkas', 'banyak', 'koleksi'] },
  { name: 'FolderTree', label: 'Struktur / Folder', category: 'dokumen', tags: ['struktur', 'direktori', 'folder', 'organisasi'] },
  { name: 'BookOpen', label: 'Buku Panduan / SOP', category: 'dokumen', tags: ['buku', 'panduan', 'sop', 'juknis', 'pedoman'] },
  { name: 'ClipboardList', label: 'Daftar Layanan / Formulir', category: 'dokumen', tags: ['katalog', 'formulir', 'daftar', 'checklist'] },
  { name: 'CheckSquare', label: 'Persetujuan / Validasi', category: 'dokumen', tags: ['centang', 'selesai', 'setuju', 'status'] },
  { name: 'FileCheck', label: 'SK / Dokumen Terverifikasi', category: 'dokumen', tags: ['sk', 'sah', 'legal', 'ttd'] },
  { name: 'Scroll', label: 'Maklumat Pelayanan', category: 'dokumen', tags: ['maklumat', 'piagam', 'naskah', 'sejarah'] },
  { name: 'FileSpreadsheet', label: 'Data Tabel / Excel', category: 'dokumen', tags: ['excel', 'tabel', 'angka', 'bezetting'] },
  { name: 'Archive', label: 'Arsip Kepegawaian', category: 'dokumen', tags: ['arsip', 'simpan', 'lama', 'riwayat'] },
  { name: 'Download', label: 'Unduhan Formulir', category: 'dokumen', tags: ['unduh', 'download', 'format', 'template'] },
  { name: 'Printer', label: 'Cetak Dokumen', category: 'dokumen', tags: ['cetak', 'print', 'laporan'] },

  // Navigasi, Gedung & Wilayah
  { name: 'Home', label: 'Beranda Utama', category: 'navigasi', tags: ['beranda', 'home', 'depan', 'utama'] },
  { name: 'Compass', label: 'Peta Navigasi', category: 'navigasi', tags: ['navigasi', 'arah', 'kompas', 'panduan'] },
  { name: 'Building2', label: 'Instansi / Kantor BKPSDM', category: 'navigasi', tags: ['kantor', 'gedung', 'instansi', 'dinas', 'badan'] },
  { name: 'Landmark', label: 'Pemerintah Daerah', category: 'navigasi', tags: ['pemkab', 'tamiang', 'pemerintah', 'bupati'] },
  { name: 'MapPin', label: 'Lokasi / Alamat', category: 'navigasi', tags: ['lokasi', 'alamat', 'peta', 'kantor'] },
  { name: 'Globe', label: 'Portal / Publik', category: 'navigasi', tags: ['web', 'internet', 'portal', 'nasional', 'bkn'] },
  { name: 'Layers', label: 'Kategori / Menu', category: 'navigasi', tags: ['menu', 'kategori', 'tingkatan', 'modul'] },
  { name: 'Navigation', label: 'Penunjuk Arah', category: 'navigasi', tags: ['arah', 'petunjuk', 'rute'] },
  { name: 'Network', label: 'Hierarki / Bagan Organisasi', category: 'navigasi', tags: ['bagan', 'struktur', 'hierarki', 'unit kerja'] },
  { name: 'Share2', label: 'Tautan / Integrasi', category: 'navigasi', tags: ['integrasi', 'bagi', 'tautan', 'link'] },
  { name: 'ExternalLink', label: 'Tautan Luar (BKN/KemenPAN)', category: 'navigasi', tags: ['eksternal', 'luar', 'link', 'bkn', 'siasn'] },

  // Statistik & Analitik
  { name: 'BarChart3', label: 'Grafik Batang ASN', category: 'statistik', tags: ['statistik', 'grafik', 'data', 'batang', 'jumlah'] },
  { name: 'LineChart', label: 'Tren Perkembangan', category: 'statistik', tags: ['tren', 'kenaikan', 'garis', 'proyeksi'] },
  { name: 'PieChart', label: 'Komposisi Pegawai', category: 'statistik', tags: ['komposisi', 'persentase', 'golongan', 'gender'] },
  { name: 'Activity', label: 'Aktivitas Layanan Real-time', category: 'statistik', tags: ['aktivitas', 'realtime', 'pantau', 'kecepatan'] },
  { name: 'TrendingUp', label: 'Peningkatan Kinerja', category: 'statistik', tags: ['kinerja', 'prestasi', 'evaluasi', 'target'] },
  { name: 'Presentation', label: 'Ekspose & Laporan', category: 'statistik', tags: ['presentasi', 'laporan', 'paparan', 'rakor'] },
  { name: 'Database', label: 'Basis Data Kepegawaian', category: 'statistik', tags: ['database', 'server', 'simpeg', 'siasn'] },
  { name: 'Search', label: 'Pencarian Pegawai/Data', category: 'statistik', tags: ['cari', 'search', 'lacak', 'nip'] },
  { name: 'Filter', label: 'Penyaringan Data', category: 'statistik', tags: ['filter', 'saring', 'kriteria'] },

  // Informasi, Berita & Media
  { name: 'Megaphone', label: 'Pengumuman Resmi', category: 'informasi', tags: ['pengumuman', 'siaran', 'penting', 'seleksi'] },
  { name: 'Newspaper', label: 'Berita & Artikel', category: 'informasi', tags: ['berita', 'kabar', 'artikel', 'pers'] },
  { name: 'Bell', label: 'Notifikasi & Pemberitahuan', category: 'informasi', tags: ['lonceng', 'notifikasi', 'peringatan', 'info'] },
  { name: 'Info', label: 'Informasi Publik / PPID', category: 'informasi', tags: ['informasi', 'ppid', 'keterbukaan', 'bantuan'] },
  { name: 'HelpCircle', label: 'Bantuan / FAQ', category: 'informasi', tags: ['tanya', 'faq', 'helpdesk', 'panduan'] },
  { name: 'Mail', label: 'Kotak Surat / Pengaduan', category: 'informasi', tags: ['surat', 'email', 'pesan', 'lapor', 'wbs'] },
  { name: 'Phone', label: 'Call Center / WhatsApp', category: 'informasi', tags: ['telepon', 'kontak', 'call center', 'wa'] },
  { name: 'MessageSquare', label: 'Konsultasi Online', category: 'informasi', tags: ['chat', 'tanya jawab', 'pesan', 'forum'] },
  { name: 'Calendar', label: 'Agenda & Jadwal Kegiatan', category: 'informasi', tags: ['jadwal', 'kalender', 'agenda', 'waktu'] },
  { name: 'Clock', label: 'Jam Layanan', category: 'informasi', tags: ['jam', 'waktu', 'durasi', 'sla'] },
  { name: 'Image', label: 'Galeri Foto Kegiatan', category: 'informasi', tags: ['foto', 'gambar', 'galeri', 'dokumentasi'] },
  { name: 'Video', label: 'Video Dokumentasi / Tutorial', category: 'informasi', tags: ['video', 'youtube', 'tutorial', 'liputan'] },

  // Pengaturan & Keamanan
  { name: 'Settings', label: 'Pengaturan Sistem', category: 'sistem', tags: ['pengaturan', 'konfigurasi', 'sistem'] },
  { name: 'Sliders', label: 'Preferensi & Filter', category: 'sistem', tags: ['opsi', 'penyesuaian', 'kontrol'] },
  { name: 'Shield', label: 'Keamanan Data ASN', category: 'sistem', tags: ['keamanan', 'privasi', 'proteksi'] },
  { name: 'Key', label: 'Hak Akses / Login', category: 'sistem', tags: ['kunci', 'akses', 'autentikasi', 'token'] },
  { name: 'Lock', label: 'Zona Terbatas', category: 'sistem', tags: ['gembok', 'rahasia', 'internal'] },
  { name: 'Bookmark', label: 'Menu Favorit', category: 'sistem', tags: ['simpan', 'favorit', 'penting'] },
  { name: 'Star', label: 'Layanan Unggulan', category: 'sistem', tags: ['bintang', 'utama', 'prioritas', 'unggulan'] },
  { name: 'Sparkles', label: 'Fitur Khusus / AI', category: 'sistem', tags: ['ai', 'pintar', 'modern', 'baru'] }
];

const CATEGORIES = [
  { id: 'all', label: 'Semua Ikon', icon: Sparkles },
  { id: 'kepegawaian', label: 'Kepegawaian & ASN', icon: Users },
  { id: 'dokumen', label: 'Dokumen & Layanan', icon: FileText },
  { id: 'navigasi', label: 'Navigasi & Wilayah', icon: Building2 },
  { id: 'statistik', label: 'Data & Statistik', icon: BarChart3 },
  { id: 'informasi', label: 'Informasi & Media', icon: Megaphone },
  { id: 'sistem', label: 'Sistem & Keamanan', icon: Settings }
];

// Helper to render dynamic icon component safely
export function DynamicIcon({ name, className = 'w-4 h-4', fallback = null }) {
  if (!name) return fallback;
  const Component = LucideIcons[name];
  if (!Component) return fallback;
  return <Component className={className} />;
}

export default function IconPickerModal({
  isOpen,
  onClose,
  selectedIcon,
  onSelectIcon
}) {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  const filteredIcons = useMemo(() => {
    return ICON_LIBRARY.filter((item) => {
      // Category filter
      if (activeCategory !== 'all' && item.category !== activeCategory) {
        return false;
      }
      // Search filter (by name, label, and tags)
      if (search.trim()) {
        const q = search.toLowerCase().trim();
        const matchesName = item.name.toLowerCase().includes(q);
        const matchesLabel = item.label.toLowerCase().includes(q);
        const matchesTags = item.tags.some(tag => tag.toLowerCase().includes(q));
        return matchesName || matchesLabel || matchesTags;
      }
      return true;
    });
  }, [search, activeCategory]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div 
        className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-3xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-wide">Pustaka Ikon Menu</h3>
              <p className="text-xs text-slate-400">Pilih simbol visual untuk menu navigasi portal BKPSDM</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Categories */}
        <div className="p-4 border-b border-slate-800/80 bg-slate-950/40 space-y-3">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari ikon (contoh: surat, mutasi, pengguna, grafik, kontak, gedung)..."
              className="w-full pl-10 pr-10 py-2.5 bg-slate-800/90 border border-slate-700 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
              autoFocus
            />
            {search && (
              <button 
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 text-xs">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Icon Grid */}
        <div className="p-6 overflow-y-auto max-h-[50vh] min-h-[300px]">
          {filteredIcons.length === 0 ? (
            <div className="py-12 text-center text-slate-400">
              <Search className="w-8 h-8 mx-auto mb-2 opacity-40 text-slate-500" />
              <p className="text-sm font-medium">Ikon tidak ditemukan</p>
              <p className="text-xs text-slate-500 mt-1">Coba kata kunci lain atau pilih kategori Semua Ikon</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
              {filteredIcons.map((item) => {
                const isSelected = selectedIcon === item.name;
                const IconComponent = LucideIcons[item.name];
                if (!IconComponent) return null;

                return (
                  <button
                    key={item.name}
                    type="button"
                    onClick={() => {
                      onSelectIcon(item.name);
                      onClose();
                    }}
                    className={`flex items-center gap-3 p-2.5 rounded-xl border text-left transition-all group ${
                      isSelected
                        ? 'bg-emerald-500/15 border-emerald-500 text-emerald-300 shadow-md shadow-emerald-950/40 ring-1 ring-emerald-500'
                        : 'bg-slate-800/50 border-slate-700/60 text-slate-300 hover:bg-slate-800 hover:border-slate-600 hover:text-white'
                    }`}
                  >
                    <div className={`p-2 rounded-lg shrink-0 transition-colors ${
                      isSelected 
                        ? 'bg-emerald-500 text-slate-950 font-bold' 
                        : 'bg-slate-900 text-slate-300 group-hover:text-emerald-400 group-hover:bg-slate-950'
                    }`}>
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold truncate leading-tight">{item.label}</p>
                      <p className="text-[10px] text-slate-500 truncate font-mono mt-0.5">{item.name}</p>
                    </div>
                    {isSelected && (
                      <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-900/90 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            {selectedIcon ? (
              <div className="flex items-center gap-2 text-slate-300">
                <span>Ikon Terpilih:</span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-950 border border-emerald-700/60 text-emerald-300 font-mono font-medium">
                  <DynamicIcon name={selectedIcon} className="w-3.5 h-3.5" />
                  {selectedIcon}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    onSelectIcon('');
                    onClose();
                  }}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-red-950/40 border border-red-800/50 text-red-400 hover:bg-red-900/50 hover:text-red-300 transition-colors ml-2"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Hapus Ikon</span>
                </button>
              </div>
            ) : (
              <span className="text-slate-500">Belum ada ikon yang dipilih untuk menu ini</span>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl font-medium transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
