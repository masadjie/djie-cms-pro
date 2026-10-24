import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../services/api';
import { 
  Sliders, 
  Globe, 
  Search, 
  MapPin, 
  Phone, 
  Mail, 
  Save, 
  CheckCircle2, 
  Sparkles, 
  ShieldCheck, 
  Building2, 
  Layers, 
  Link as LinkIcon,
  HelpCircle,
  AlertCircle,
  Hammer,
  Clock,
  Power,
  Image as ImageIcon,
  UploadCloud,
  Trash2
} from 'lucide-react';
import MediaLibraryModal from './MediaLibraryModal';

export default function PengaturanAplikasiTab() {
  const queryClient = useQueryClient();
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);

  // Main Application & SEO Settings Form State
  const [form, setForm] = useState({
    // 1. Identitas & Nama Portal
    site_title: 'BKPSDM Kab. Aceh Tamiang',
    site_name: 'BKPSDM Kab. Aceh Tamiang',
    site_tagline: 'Badan Kepegawaian & Pengembangan Sumber Daya Manusia',
    site_description: 'Portal resmi pelayanan kepegawaian, pengumuman seleksi CASN, kenaikan pangkat, e-kinerja, dan SIKEPO Kabupaten Aceh Tamiang.',
    site_logo: '',
    instansi_name: 'Badan Kepegawaian & Pengembangan Sumber Daya Manusia Kabupaten Aceh Tamiang',
    
    // 2. SEO & Metadata
    seo_keywords: 'BKPSDM Aceh Tamiang, SiKEPO Aceh Tamiang, CASN Aceh Tamiang, Kenaikan Pangkat BKN, SIASN, MyASN, E-Kinerja, Pemkab Aceh Tamiang',
    seo_author: 'BKPSDM Kabupaten Aceh Tamiang',
    seo_canonical_url: 'https://bkpsdm.acehtamiangkab.go.id',
    seo_og_image: '/hero-tamiang.webp',
    
    // 3. Kontak & Alamat Kantor
    instansi_nama: 'Badan Kepegawaian & Pengembangan Sumber Daya Manusia Kabupaten Aceh Tamiang',
    kantor_alamat: 'Jl. Ir. H. Juanda No. 1, Komplek Perkantoran Pemkab Aceh Tamiang, Karang Baru',
    kantor_kota: 'Karang Baru',
    kantor_provinsi: 'Aceh',
    kantor_kodepos: '24476',
    kantor_gmaps_url: 'https://maps.google.com/?q=BKPSDM+Kabupaten+Aceh+Tamiang',
    
    // 4. Layanan Pengaduan & Helpdesk
    kontak_telepon: '0811-6881-4767',
    kontak_wa: '081168814767',
    kontak_email: 'bkpsdm@acehtamiangkab.go.id',
    helpdesk_jam_pelayanan: 'Senin - Jumat: 08.00 - 16.30 WIB',
    
    // 5. Integrasi Sistem Eksternal
    url_sikepo: 'https://sikepo.acehtamiangkab.go.id',
    url_siasn: 'https://siasn.bkn.go.id',
    url_myasn: 'https://myasn.bkn.go.id',
    url_ekinerja: 'https://kinerja.bkn.go.id',

    // 6. Mode Pemeliharaan (Maintenance Mode)
    maintenance_mode: 'false',
    maintenance_title: 'Sistem Sedang Dalam Pemeliharaan Berkala',
    maintenance_message: 'Portal layanan publik ini sedang dalam proses pembaruan dan optimalisasi sistem oleh Tim IT. Layanan publik akan segera kembali aktif.',
    maintenance_until: ''
  });

  // Fetch live web settings from backend
  const { data: settingsData, isLoading } = useQuery({
    queryKey: ['cmsWebSettingsApp'],
    queryFn: async () => {
      try {
        const res = await api.get('/cms/pengaturan');
        return res?.data || res || {};
      } catch (err) {
        return {};
      }
    }
  });

  useEffect(() => {
    if (settingsData && typeof settingsData === 'object') {
      setForm((prev) => ({
        ...prev,
        ...Object.fromEntries(
          Object.entries(settingsData).filter(([_, v]) => v !== undefined && v !== null && v !== '')
        )
      }));
    }
  }, [settingsData]);

  // Mutation to save settings
  const saveMutation = useMutation({
    mutationFn: async (payload) => {
      return await api.post('/cms/pengaturan', payload);
    },
    onSuccess: () => {
      setSaveSuccess(true);
      setSaveError('');
      queryClient.invalidateQueries({ queryKey: ['cmsWebSettings'] });
      queryClient.invalidateQueries({ queryKey: ['cmsWebSettingsApp'] });
      setTimeout(() => setSaveSuccess(false), 4000);
    },
    onError: (err) => {
      setSaveError(err?.response?.data?.message || err?.message || 'Gagal menyimpan pengaturan.');
    }
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // 1-Click Master SEO Auto-Optimizer
  const handleAutoOptimizeSeo = () => {
    setForm((prev) => ({
      ...prev,
      site_title: 'BKPSDM Kab. Aceh Tamiang',
      site_tagline: 'Badan Kepegawaian & Pengembangan Sumber Daya Manusia',
      site_description: 'Portal Resmi BKPSDM Kabupaten Aceh Tamiang & SiKEPO (Sistem Kepegawaian Online). Layanan Kenaikan Pangkat SIASN, E-Kinerja, Seleksi CASN/PPPK, Presensi GPS, Cuti, dan Pensiun ASN Terpadu.',
      seo_keywords: 'BKPSDM Aceh Tamiang, SiKEPO Aceh Tamiang, CASN Aceh Tamiang 2026, PPPK Aceh Tamiang, Kenaikan Pangkat SIASN, e-Kinerja BKN, MyASN, Presensi GPS ASN Aceh Tamiang, Mutasi Pegawai, Layanan Kepegawaian Aceh Tamiang, Pemkab Aceh Tamiang',
      seo_author: 'Badan Kepegawaian & Pengembangan Sumber Daya Manusia Kabupaten Aceh Tamiang',
      seo_canonical_url: 'https://bkpsdm.acehtamiangkab.go.id',
      seo_og_image: '/hero-tamiang.webp'
    }));
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSaveError('');
    setSaveSuccess(false);
    saveMutation.mutate(form);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
            <Sliders className="w-4 h-4 text-emerald-700" />
            <span>Konfigurasi Portal Utama</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Pengaturan Aplikasi, Identitas & SEO
          </h2>
          <p className="text-xs text-slate-500 max-w-2xl leading-relaxed">
            Kelola nama situs, deskripsi publik, kata kunci mesin pencari (SEO Google), alamat kantor, jam operasional helpdesk, serta tautan ekosistem ASN.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 self-start md:self-auto">
          <button
            type="button"
            onClick={handleAutoOptimizeSeo}
            className="inline-flex items-center gap-2 px-4 py-3 bg-amber-500 hover:bg-amber-600 active:scale-95 text-slate-950 rounded-2xl text-xs font-black shadow-md shadow-amber-500/20 transition-all cursor-pointer"
            title="Klik 1 tombol untuk mengisi konfigurasi SEO & Metadata Google otomatis paling optimal"
          >
            <Sparkles className="w-4 h-4 text-slate-950 animate-bounce" />
            <span>1-Klik Optimalkan SEO</span>
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={saveMutation.isPending}
            className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-800 hover:bg-emerald-700 active:scale-95 disabled:opacity-60 text-white rounded-2xl text-xs font-black shadow-md shadow-emerald-900/10 transition-all cursor-pointer"
          >
            {saveMutation.isPending ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Menyimpan...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4 text-amber-300" />
                <span>Simpan Perubahan</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Notifications */}
      {saveSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center gap-3 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <div className="text-xs font-bold">
            Pengaturan aplikasi dan konfigurasi SEO berhasil diperbarui ke seluruh sistem!
          </div>
        </div>
      )}

      {saveError && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <div className="text-xs font-bold">{saveError}</div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* BLOK 1: IDENTITAS APLIKASI */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center justify-center font-black">
              <Globe className="w-5 h-5 text-emerald-700" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-black text-slate-900">
                1. Identitas & Nama Portal
              </h3>
              <p className="text-xs text-slate-500">
                Pengaturan nama instansi, judul header browser, dan deskripsi beranda.
              </p>
            </div>
          </div>

          {/* Logo Instansi / Aplikasi Setting */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-xs font-black text-slate-800 block">Logo Resmi Portal / Instansi</span>
                <span className="text-[11px] text-slate-500">Logo ini akan otomatis tampil di Navbar, Footer, Kopsurat, dan seluruh halaman publik.</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsMediaModalOpen(true)}
                  className="px-3.5 py-2 bg-emerald-800 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <UploadCloud className="w-3.5 h-3.5" />
                  <span>Pilih / Upload Logo</span>
                </button>
                {form.site_logo && (
                  <button
                    type="button"
                    onClick={() => setForm(prev => ({ ...prev, site_logo: '' }))}
                    className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl transition-all cursor-pointer border border-rose-200"
                    title="Hapus Logo Custom"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            <div className="flex items-center gap-4 pt-2">
              <div className="w-16 h-16 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-center p-2 overflow-hidden shrink-0">
                {form.site_logo ? (
                  <img
                    src={form.site_logo}
                    alt="Logo Preview"
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      e.target.src = '/logo-djie-cms-pro-square.png';
                    }}
                  />
                ) : (
                  <img
                    src="/logo-djie-cms-pro-square.png"
                    alt="Default Logo CMS"
                    className="w-full h-full object-contain opacity-70"
                  />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <input
                  type="text"
                  name="site_logo"
                  value={form.site_logo || ''}
                  onChange={handleChange}
                  placeholder="URL Logo atau path (contoh: https://... atau /uploads/...)"
                  className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 font-mono outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition-all"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  {form.site_logo ? 'Menggunakan Logo Kustom yang diunggah' : 'Menggunakan logo bawaan default CMS'}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Nama Situs / Judul Aplikasi (Site Title)
              </label>
              <input
                type="text"
                name="site_title"
                value={form.site_title}
                onChange={handleChange}
                placeholder="Contoh: BKPSDM Kab. Aceh Tamiang"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-[13px] text-slate-800 font-semibold focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10 outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Nama Singkat / Instansi (Site Name & Instansi)
              </label>
              <input
                type="text"
                name="site_name"
                value={form.site_name || form.site_title}
                onChange={(e) => {
                  handleChange(e);
                  setForm(prev => ({ ...prev, site_name: e.target.value, instansi_name: e.target.value }));
                }}
                placeholder="Contoh: BKPSDM Kabupaten Aceh Tamiang"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-[13px] text-slate-800 font-semibold focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10 outline-none transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Tagline / Slogan Subjudul
              </label>
              <input
                type="text"
                name="site_tagline"
                value={form.site_tagline}
                onChange={handleChange}
                placeholder="Badan Kepegawaian & Pengembangan Sumber Daya Manusia"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-[13px] text-slate-800 focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10 outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Nama Instansi Lengkap (Footer & Dokumen)
              </label>
              <input
                type="text"
                name="instansi_nama"
                value={form.instansi_nama || form.instansi_name || ''}
                onChange={(e) => {
                  handleChange(e);
                  setForm(prev => ({ ...prev, instansi_nama: e.target.value, instansi_name: e.target.value }));
                }}
                placeholder="Badan Kepegawaian & Pengembangan Sumber Daya Manusia"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-[13px] text-slate-800 focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10 outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Deskripsi Singkat Portal (Meta Description)
            </label>
            <textarea
              name="site_description"
              rows={3}
              value={form.site_description}
              onChange={handleChange}
              placeholder="Jelaskan secara ringkas peran dan layanan website ini..."
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-[13px] text-slate-800 focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10 outline-none transition-all resize-none leading-relaxed"
            />
          </div>
        </div>

        {/* BLOK 2: OPTIMASI MESIN PENCARI (SEO & GOOGLE) */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-800 border border-amber-200 flex items-center justify-center font-black">
              <Search className="w-5 h-5 text-amber-700" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-black text-slate-900">
                2. Metadata SEO & Social Share (OpenGraph)
              </h3>
              <p className="text-xs text-slate-500">
                Konfigurasi agar portal mudah ditemukan di Google dan tampil rapi saat tautan dibagikan ke WhatsApp / medsos.
              </p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Kata Kunci Pencarian (SEO Keywords)
            </label>
            <textarea
              name="seo_keywords"
              rows={2}
              value={form.seo_keywords}
              onChange={handleChange}
              placeholder="Pisahkan dengan tanda koma (,)"
              className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-800 font-mono focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10 outline-none transition-all resize-none"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Contoh: BKPSDM Aceh Tamiang, SiKEPO Aceh Tamiang, CASN Aceh Tamiang, Kenaikan Pangkat, SIASN
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                URL Resmi Utama (Canonical URL)
              </label>
              <input
                type="text"
                name="seo_canonical_url"
                value={form.seo_canonical_url}
                onChange={handleChange}
                placeholder="https://bkpsdm.acehtamiangkab.go.id"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-mono focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10 outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Penulis Resmi (Meta Author)
              </label>
              <input
                type="text"
                name="seo_author"
                value={form.seo_author}
                onChange={handleChange}
                placeholder="BKPSDM Kabupaten Aceh Tamiang"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10 outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Gambar Thumbnail Share (OG Image)
              </label>
              <input
                type="text"
                name="seo_og_image"
                value={form.seo_og_image}
                onChange={handleChange}
                placeholder="/hero-tamiang.webp"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-mono focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10 outline-none transition-all"
              />
            </div>
          </div>
        </div>

        {/* BLOK 3: ALAMAT KANTOR & KONTAK HELPDESK */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-800 border border-blue-200 flex items-center justify-center font-black">
              <MapPin className="w-5 h-5 text-blue-700" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-black text-slate-900">
                3. Alamat Instansi & Layanan Helpdesk
              </h3>
              <p className="text-xs text-slate-500">
                Informasi lokasi kantor, call center, dan jam pelayanan ASN yang tampil di footer & kontak.
              </p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Alamat Lengkap Kantor
            </label>
            <input
              type="text"
              name="kantor_alamat"
              value={form.kantor_alamat}
              onChange={handleChange}
              placeholder="Jl. Ir. H. Juanda No. 1, Komplek Perkantoran Pemkab Aceh Tamiang, Karang Baru"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10 outline-none transition-all"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Kota / Kecamatan
              </label>
              <input
                type="text"
                name="kantor_kota"
                value={form.kantor_kota}
                onChange={handleChange}
                placeholder="Karang Baru"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10 outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Provinsi
              </label>
              <input
                type="text"
                name="kantor_provinsi"
                value={form.kantor_provinsi}
                onChange={handleChange}
                placeholder="Aceh"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10 outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Kode Pos
              </label>
              <input
                type="text"
                name="kantor_kodepos"
                value={form.kantor_kodepos}
                onChange={handleChange}
                placeholder="24476"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-mono focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10 outline-none transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Nomor Call Center
              </label>
              <input
                type="text"
                name="kontak_telepon"
                value={form.kontak_telepon}
                onChange={handleChange}
                placeholder="0811-6881-4767"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-bold focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10 outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Nomor WhatsApp Helpdesk
              </label>
              <input
                type="text"
                name="kontak_wa"
                value={form.kontak_wa}
                onChange={handleChange}
                placeholder="081168814767"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-mono focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10 outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Email Resmi Kedinasan
              </label>
              <input
                type="email"
                name="kontak_email"
                value={form.kontak_email}
                onChange={handleChange}
                placeholder="bkpsdm@acehtamiangkab.go.id"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10 outline-none transition-all"
              />
            </div>
          </div>
        </div>

        {/* BLOK 4: TAUTAN EKOSISTEM DIGITAL */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-800 border border-purple-200 flex items-center justify-center font-black">
              <LinkIcon className="w-5 h-5 text-purple-700" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-black text-slate-900">
                4. Integrasi Tautan Ekosistem Digital ASN
              </h3>
              <p className="text-xs text-slate-500">
                URL resmi integrasi ekosistem BKN RI dan aplikasi kepegawaian internal.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Portal SiKEPO Online
              </label>
              <input
                type="text"
                name="url_sikepo"
                value={form.url_sikepo}
                onChange={handleChange}
                placeholder="https://sikepo.acehtamiangkab.go.id"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-mono focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10 outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                SIASN BKN Pusat
              </label>
              <input
                type="text"
                name="url_siasn"
                value={form.url_siasn}
                onChange={handleChange}
                placeholder="https://siasn.bkn.go.id"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-mono focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10 outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                MyASN BKN Terpadu
              </label>
              <input
                type="text"
                name="url_myasn"
                value={form.url_myasn}
                onChange={handleChange}
                placeholder="https://myasn.bkn.go.id"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-mono focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10 outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                E-Kinerja BKN & SKP
              </label>
              <input
                type="text"
                name="url_ekinerja"
                value={form.url_ekinerja}
                onChange={handleChange}
                placeholder="https://kinerja.bkn.go.id"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-mono focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10 outline-none transition-all"
              />
            </div>
          </div>
        </div>

        {/* BLOK 5: MODE PEMELIHARAAN SISTEM (MAINTENANCE MODE TOGGLE) */}
        <div className={`rounded-3xl p-6 sm:p-8 border transition-all ${
          form.maintenance_mode === 'true' 
            ? 'bg-amber-50/60 border-amber-300 shadow-sm' 
            : 'bg-white border-slate-200/90 shadow-sm'
        }`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black border ${
                form.maintenance_mode === 'true'
                  ? 'bg-amber-500 text-slate-950 border-amber-600'
                  : 'bg-slate-100 text-slate-600 border-slate-200'
              }`}>
                <Hammer className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm sm:text-base font-black text-slate-900">
                    5. Mode Pemeliharaan Publik (Maintenance Mode)
                  </h3>
                  {form.maintenance_mode === 'true' && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500 text-slate-950 animate-pulse">
                      Aktif
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500">
                  Kunci akses publik saat melakukan pembaruan data/server. Admin tetap bisa login normal.
                </p>
              </div>
            </div>

            {/* Toggle Switch Button */}
            <button
              type="button"
              onClick={() => {
                setForm((prev) => ({
                  ...prev,
                  maintenance_mode: prev.maintenance_mode === 'true' ? 'false' : 'true'
                }));
              }}
              className={`inline-flex items-center gap-2.5 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer border ${
                form.maintenance_mode === 'true'
                  ? 'bg-amber-600 text-white border-amber-700 shadow-sm hover:bg-amber-700'
                  : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
              }`}
            >
              <Power className={`w-4 h-4 ${form.maintenance_mode === 'true' ? 'text-white' : 'text-slate-500'}`} />
              <span>{form.maintenance_mode === 'true' ? 'Mode Maintenance: AKTIF' : 'Mode Maintenance: NONAKTIF'}</span>
            </button>
          </div>

          <div className="pt-5 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Judul Halaman Pemeliharaan
                </label>
                <input
                  type="text"
                  name="maintenance_title"
                  value={form.maintenance_title || ''}
                  onChange={handleChange}
                  placeholder="Contoh: Sistem Sedang Dalam Pemeliharaan Berkala"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-[13px] text-slate-800 font-semibold focus:bg-white focus:border-amber-600 focus:ring-2 focus:ring-amber-600/10 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>Estimasi Selesai (Opsional)</span>
                </label>
                <input
                  type="datetime-local"
                  name="maintenance_until"
                  value={form.maintenance_until || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:border-amber-600 focus:ring-2 focus:ring-amber-600/10 outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Pesan Resmi Untuk Pengunjung / Publik
              </label>
              <textarea
                name="maintenance_message"
                rows={3}
                value={form.maintenance_message || ''}
                onChange={handleChange}
                placeholder="Tuliskan penjelasan mengenai kegiatan pemeliharaan sistem..."
                className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-800 focus:bg-white focus:border-amber-600 focus:ring-2 focus:ring-amber-600/10 outline-none transition-all resize-none"
              />
            </div>
          </div>
        </div>

        {/* Bottom Save Action */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={saveMutation.isPending}
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-emerald-800 hover:bg-emerald-700 active:scale-95 disabled:opacity-60 text-white rounded-2xl text-xs font-black shadow-lg shadow-emerald-900/15 transition-all cursor-pointer"
          >
            {saveMutation.isPending ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Menyimpan Pengaturan...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4 text-amber-300" />
                <span>Simpan Seluruh Pengaturan</span>
              </>
            )}
          </button>
        </div>

      </form>

      {/* Media Library Modal for Selecting Logo */}
      <MediaLibraryModal
        isOpen={isMediaModalOpen}
        onClose={() => setIsMediaModalOpen(false)}
        singleSelect={true}
        onlyImages={true}
        title="Pilih File Logo dari Media Library"
        confirmText="Gunakan Sebagai Logo Portal"
        onSelectFiles={(files) => {
          if (files && files.length > 0) {
            setForm(prev => ({
              ...prev,
              site_logo: files[0].file_url || files[0].url || files[0].path
            }));
          }
          setIsMediaModalOpen(false);
        }}
      />
    </div>
  );
}
