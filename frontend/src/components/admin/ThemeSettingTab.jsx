import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../services/api';
import { useTheme } from '../../context/ThemeContext';
import { 
  Palette, 
  Check, 
  Sparkles, 
  Share2, 
  Facebook, 
  Instagram, 
  Twitter, 
  Youtube, 
  MessageSquare, 
  Accessibility, 
  Save, 
  Volume2, 
  Eye, 
  EyeOff,
  CheckCircle2,
  LayoutTemplate,
  Clock,
  ExternalLink,
  Laptop
} from 'lucide-react';

export default function ThemeSettingTab() {
  const { currentTheme, changeTheme, themes } = useTheme();
  const queryClient = useQueryClient();
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Form state for Social Media & Accessibility
  const [form, setForm] = useState({
    show_social_floating: 'true',
    show_accessibility_floating: 'true',
    show_facebook: 'true',
    social_facebook: 'https://facebook.com/bkpsdmatam',
    show_instagram: 'true',
    social_instagram: 'https://instagram.com/bkpsdm_acehtamiang',
    show_twitter: 'true',
    social_twitter: 'https://x.com/bkpsdmatam',
    show_youtube: 'true',
    social_youtube: 'https://www.youtube.com/@asnatam?si=YDmlZ8BoP9MefuHs',
    show_whatsapp: 'true',
    social_whatsapp: '081168814767',
    contact_phone: '081168814767',
    contact_email: 'bkpsdm@acehtamiangkab.go.id'
  });

  // Fetch live web settings from CMS
  const { data: settingsData, isLoading } = useQuery({
    queryKey: ['cmsWebSettings'],
    queryFn: async () => {
      try {
        const res = await api.get('/cms/pengaturan');
        return res?.data || res || {};
      } catch (err) {
        return {};
      }
    }
  });

  // Populate form when data loads
  useEffect(() => {
    if (settingsData && Object.keys(settingsData).length > 0) {
      setForm((prev) => ({
        ...prev,
        ...settingsData
      }));
    }
  }, [settingsData]);

  // Save Settings Mutation
  const saveMutation = useMutation({
    mutationFn: async (payload) => {
      return await api.post('/cms/pengaturan', payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cmsWebSettings'] });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3500);
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    saveMutation.mutate(form);
  };

  return (
    <div className="space-y-8">
      
      {/* 1. SECTION: TEMA & WARNA PORTAL */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <Palette className="w-5 h-5 text-emerald-600" />
              <h2 className="text-lg font-black text-slate-900">Pengaturan Tema & Warna Portal</h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Pilih dan ubah skema warna portal publik secara dinamis (Hijau & Kuning Zamrud Aceh Tamiang, SiKEPO Indigo, Sapphire Blue, Midnight Dark).
            </p>
          </div>
          <div className="px-3 py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-black flex items-center gap-1.5 shrink-0">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Tema Aktif: {themes.find(t => t.id === currentTheme)?.name}</span>
          </div>
        </div>

        {/* Layout Mode Selector (Portal vs Editorial Revision) */}
        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-black text-slate-800 block">Layout Beranda (Homepage Layout Mode)</span>
              <span className="text-[11px] text-slate-500">Tentukan apakah halaman utama tampil sebagai Portal Multi-Layanan atau Portal Berita Editorial (Revision Magazine).</span>
            </div>
            <span className="text-xs font-bold text-violet-700 bg-violet-100 px-3 py-1 rounded-xl">
              {currentTheme === 'editorial' || form.home_layout_mode === 'EDITORIAL' ? 'Mode Editorial Berita Aktif' : 'Mode Portal Layanan Aktif'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <button
              type="button"
              onClick={() => {
                changeTheme('emerald');
                setForm(prev => ({ ...prev, home_layout_mode: 'PORTAL' }));
              }}
              className={`p-3.5 rounded-xl border-2 text-left transition-all flex items-center justify-between cursor-pointer ${
                currentTheme !== 'editorial' && form.home_layout_mode !== 'EDITORIAL'
                  ? 'border-emerald-600 bg-white shadow-xs'
                  : 'border-slate-200 bg-slate-100/60 hover:bg-white'
              }`}
            >
              <div>
                <span className="text-xs font-black text-slate-800 block">🏛️ Portal Layanan & Berita Terpadu</span>
                <span className="text-[10px] text-slate-500 block">Hero pencarian besar, katalog layanan, banner sorotan, dan agenda kegiatan.</span>
              </div>
              {currentTheme !== 'editorial' && form.home_layout_mode !== 'EDITORIAL' && (
                <Check className="w-4 h-4 text-emerald-600 stroke-[3] shrink-0" />
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                changeTheme('editorial');
                setForm(prev => ({ ...prev, home_layout_mode: 'EDITORIAL' }));
              }}
              className={`p-3.5 rounded-xl border-2 text-left transition-all flex items-center justify-between cursor-pointer ${
                currentTheme === 'editorial' || form.home_layout_mode === 'EDITORIAL'
                  ? 'border-violet-600 bg-white shadow-xs'
                  : 'border-slate-200 bg-slate-100/60 hover:bg-white'
              }`}
            >
              <div>
                <span className="text-xs font-black text-violet-900 block">📰 Revision Editorial & Digital Magazine</span>
                <span className="text-[10px] text-slate-500 block">Desain majalah modern, pills kategori warna-warni, grid 2-kolom, sidebar profil, & newsletter.</span>
              </div>
              {(currentTheme === 'editorial' || form.home_layout_mode === 'EDITORIAL') && (
                <Check className="w-4 h-4 text-violet-600 stroke-[3] shrink-0" />
              )}
            </button>
          </div>
        </div>

        {/* Theme Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {themes.map((theme) => {
            const isSelected = currentTheme === theme.id;
            return (
              <button
                key={theme.id}
                onClick={() => changeTheme(theme.id)}
                className={`p-4 rounded-2xl border-2 text-left transition-all relative group flex flex-col justify-between h-40 cursor-pointer overflow-hidden ${
                  isSelected
                    ? 'border-emerald-600 bg-gradient-to-br from-emerald-50/50 via-white to-amber-50/30 shadow-md scale-[1.01]'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm'
                }`}
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span
                        className="w-4 h-4 rounded-full border border-white shadow-sm"
                        style={{ backgroundColor: theme.primaryColor }}
                      />
                      <span
                        className="w-4 h-4 rounded-full border border-white shadow-sm -ml-2"
                        style={{ backgroundColor: theme.accentColor }}
                      />
                      <span className="text-xs font-bold text-slate-900 ml-1">{theme.name}</span>
                    </div>

                    {isSelected && (
                      <span className="w-5 h-5 rounded-full bg-emerald-700 text-amber-300 flex items-center justify-center shadow">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </span>
                    )}
                  </div>

                  <div className={`h-10 rounded-xl bg-gradient-to-r ${theme.heroGradient} p-2 flex items-center justify-between shadow-inner`}>
                    <div className="h-1.5 w-12 bg-white/40 rounded-full" />
                    <div
                      className="px-1.5 py-0.5 rounded text-[8px] font-black text-slate-950"
                      style={{ backgroundColor: theme.accentColor }}
                    >
                      Aksen
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[10px]">
                  <span className="text-slate-500 font-medium">Primary: <strong className="font-mono text-slate-700">{theme.primaryColor}</strong></span>
                  <span className="text-slate-500 font-medium">Accent: <strong className="font-mono text-slate-700">{theme.accentColor}</strong></span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. SECTION: TEMPLATE VIEW & LAYOUT PRESET (COMING SOON) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <LayoutTemplate className="w-5 h-5 text-indigo-600" />
              <h2 className="text-lg font-black text-slate-900">Katalog Template & Tata Letak Beranda (Layout Preset)</h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Pilihan arsitektur tata letak antarmuka beranda publik (Portal Klasik Pemda, Modern SaaS Metro, Card Bento Grid, & Minimalist News Portal).
            </p>
          </div>
          <div className="px-3 py-1.5 bg-indigo-50 text-indigo-800 border border-indigo-200 rounded-xl text-xs font-black flex items-center gap-1.5 shrink-0">
            <Clock className="w-3.5 h-3.5 text-indigo-600 animate-spin" />
            <span>Tahap Digitalisasi v2.0</span>
          </div>
        </div>

        {/* Template Showcase Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          
          {/* Template 1: Active Default */}
          <div className="rounded-2xl border-2 border-emerald-600 bg-white p-5 space-y-4 relative shadow-sm">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase tracking-wider">
                Aktif Saat Ini
              </span>
              <span className="w-5 h-5 rounded-full bg-emerald-700 text-white flex items-center justify-center text-xs">
                <Check className="w-3.5 h-3.5" />
              </span>
            </div>
            {/* Mock Layout Diagram */}
            <div className="h-28 rounded-xl bg-slate-50 border border-slate-200 p-2.5 space-y-1.5">
              <div className="h-3 w-full bg-emerald-800/80 rounded" />
              <div className="h-10 w-full bg-slate-200 rounded flex items-center px-2">
                <div className="h-2 w-16 bg-slate-400 rounded" />
              </div>
              <div className="grid grid-cols-3 gap-1.5 pt-0.5">
                <div className="h-7 bg-slate-200 rounded" />
                <div className="h-7 bg-slate-200 rounded" />
                <div className="h-7 bg-slate-200 rounded" />
              </div>
            </div>
            <div>
              <h4 className="text-sm font-black text-slate-900">Template 01: Government Portal Pro</h4>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Struktur resmi Kementerian & Pemerintah Daerah dengan Hero Banner raksasa, Quick Service Grid, Ekosistem SiKEPO, Berita, & Footer Mega Link.
              </p>
            </div>
          </div>

          {/* Template 2: Bento Grid (Coming Soon) */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-5 space-y-4 relative group hover:border-indigo-300 transition-all overflow-hidden">
            <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[9px] font-black tracking-widest uppercase border border-amber-300">
              Segera Hadir
            </div>
            <span className="px-2.5 py-1 rounded-full bg-slate-200 text-slate-700 text-[10px] font-bold uppercase tracking-wider inline-block">
              Preset Desain 02
            </span>
            {/* Mock Layout Diagram */}
            <div className="h-28 rounded-xl bg-white border border-slate-200 p-2 space-y-1 opacity-75">
              <div className="grid grid-cols-3 gap-1 h-14">
                <div className="col-span-2 bg-indigo-100 rounded" />
                <div className="bg-amber-100 rounded" />
              </div>
              <div className="grid grid-cols-3 gap-1 h-9">
                <div className="bg-slate-200 rounded" />
                <div className="col-span-2 bg-slate-200 rounded" />
              </div>
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                <span>Template 02: Modern Bento Box</span>
              </h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Tata letak modular asimetris ala Apple & Next.js dengan kartu interaktif fleksibel, grafik real-time, dan highlight agenda bergerak.
              </p>
            </div>
          </div>

          {/* Template 3: News Editorial (Coming Soon) */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-5 space-y-4 relative group hover:border-indigo-300 transition-all overflow-hidden">
            <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[9px] font-black tracking-widest uppercase border border-amber-300">
              Segera Hadir
            </div>
            <span className="px-2.5 py-1 rounded-full bg-slate-200 text-slate-700 text-[10px] font-bold uppercase tracking-wider inline-block">
              Preset Desain 03
            </span>
            {/* Mock Layout Diagram */}
            <div className="h-28 rounded-xl bg-white border border-slate-200 p-2 space-y-1 opacity-75">
              <div className="h-2 w-full bg-slate-800 rounded" />
              <div className="grid grid-cols-4 gap-1 h-20 pt-1">
                <div className="col-span-3 bg-slate-200 rounded space-y-1 p-1">
                  <div className="h-8 bg-slate-300 rounded" />
                  <div className="h-1.5 w-20 bg-slate-400 rounded" />
                </div>
                <div className="bg-slate-100 rounded border border-slate-200" />
              </div>
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                <span>Template 03: Editorial Press & Media</span>
              </h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Dirancang khusus untuk fokus publikasi siaran pers kedinasan, breaking news, galeri foto dokumentasi jurnalistik, dan video podcast.
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* 2. SECTION: PENGELOLAAN MEDIA SOSIAL & FLOATING ACTION BAR */}
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-sm">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <Share2 className="w-5 h-5 text-emerald-700" />
              <h2 className="text-lg font-black text-slate-900">Manajemen Media Sosial & Floating Icon</h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Atur tautan akun resmi media sosial dan kontrol tombol tampil / sembunyikan (*Show / Hide*) pada bilah melayang portal publik.
            </p>
          </div>

          <button
            type="submit"
            disabled={saveMutation.isPending}
            className="px-5 py-2.5 bg-emerald-800 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-md transition-all self-start sm:self-auto cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{saveMutation.isPending ? 'Menyimpan...' : 'Simpan Pengaturan'}</span>
          </button>
        </div>

        {saveSuccess && (
          <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Pengaturan media sosial dan aksesibilitas berhasil disimpan ke database!</span>
          </div>
        )}

        {/* Master Toggles Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-200">
          
          {/* Master Toggle: Social Floating Bar */}
          <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200 shadow-xs">
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-slate-900 block">Floating Bar Media Sosial (Kiri)</span>
              <span className="text-[11px] text-slate-500">Tampilkan ikon sosmed melayang di sisi kiri layar</span>
            </div>
            <button
              type="button"
              onClick={() => setForm({ ...form, show_social_floating: form.show_social_floating === 'true' ? 'false' : 'true' })}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
                form.show_social_floating === 'true'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'bg-slate-200 text-slate-600'
              }`}
            >
              {form.show_social_floating === 'true' ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
              <span>{form.show_social_floating === 'true' ? 'Tampil' : 'Sembunyi'}</span>
            </button>
          </div>

          {/* Master Toggle: Accessibility Floating Bar */}
          <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200 shadow-xs">
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-slate-900 block">Bilah Aksesibilitas & Bantuan (Kanan)</span>
              <span className="text-[11px] text-slate-500">Tampilkan fitur Screen Reader Tuna Netra & Bantuan</span>
            </div>
            <button
              type="button"
              onClick={() => setForm({ ...form, show_accessibility_floating: form.show_accessibility_floating === 'true' ? 'false' : 'true' })}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
                form.show_accessibility_floating === 'true'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'bg-slate-200 text-slate-600'
              }`}
            >
              {form.show_accessibility_floating === 'true' ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
              <span>{form.show_accessibility_floating === 'true' ? 'Tampil' : 'Sembunyi'}</span>
            </button>
          </div>

        </div>

        {/* Individual Social Media URLs & Show/Hide Toggles */}
        <div className="space-y-4">
          <h3 className="text-xs font-black uppercase text-slate-600 tracking-wider">
            Daftar Akun Media Sosial Resmi
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* 1. Facebook */}
            <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-3 shadow-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                    <Facebook className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold text-slate-900">Facebook</span>
                </div>
                <button
                  type="button"
                  onClick={() => setForm({ ...form, show_facebook: form.show_facebook === 'true' ? 'false' : 'true' })}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-bold cursor-pointer transition-colors ${
                    form.show_facebook === 'true' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-slate-100 text-slate-400'
                  }`}
                >
                  {form.show_facebook === 'true' ? 'Aktif' : 'Disembunyikan'}
                </button>
              </div>
              <input
                type="text"
                value={form.social_facebook || ''}
                onChange={(e) => setForm({ ...form, social_facebook: e.target.value })}
                placeholder="https://facebook.com/..."
                className="w-full p-2.5 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:outline-none font-mono"
              />
            </div>

            {/* 2. Instagram */}
            <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-3 shadow-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-pink-50 text-pink-600 rounded-lg">
                    <Instagram className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold text-slate-900">Instagram</span>
                </div>
                <button
                  type="button"
                  onClick={() => setForm({ ...form, show_instagram: form.show_instagram === 'true' ? 'false' : 'true' })}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-bold cursor-pointer transition-colors ${
                    form.show_instagram === 'true' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-slate-100 text-slate-400'
                  }`}
                >
                  {form.show_instagram === 'true' ? 'Aktif' : 'Disembunyikan'}
                </button>
              </div>
              <input
                type="text"
                value={form.social_instagram || ''}
                onChange={(e) => setForm({ ...form, social_instagram: e.target.value })}
                placeholder="https://instagram.com/..."
                className="w-full p-2.5 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:outline-none font-mono"
              />
            </div>

            {/* 3. X / Twitter */}
            <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-3 shadow-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-slate-100 text-slate-800 rounded-lg">
                    <Twitter className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold text-slate-900">X (Twitter)</span>
                </div>
                <button
                  type="button"
                  onClick={() => setForm({ ...form, show_twitter: form.show_twitter === 'true' ? 'false' : 'true' })}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-bold cursor-pointer transition-colors ${
                    form.show_twitter === 'true' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-slate-100 text-slate-400'
                  }`}
                >
                  {form.show_twitter === 'true' ? 'Aktif' : 'Disembunyikan'}
                </button>
              </div>
              <input
                type="text"
                value={form.social_twitter || ''}
                onChange={(e) => setForm({ ...form, social_twitter: e.target.value })}
                placeholder="https://x.com/..."
                className="w-full p-2.5 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:outline-none font-mono"
              />
            </div>

            {/* 4. YouTube */}
            <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-3 shadow-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-red-50 text-red-600 rounded-lg">
                    <Youtube className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold text-slate-900">YouTube</span>
                </div>
                <button
                  type="button"
                  onClick={() => setForm({ ...form, show_youtube: form.show_youtube === 'true' ? 'false' : 'true' })}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-bold cursor-pointer transition-colors ${
                    form.show_youtube === 'true' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-slate-100 text-slate-400'
                  }`}
                >
                  {form.show_youtube === 'true' ? 'Aktif' : 'Disembunyikan'}
                </button>
              </div>
              <input
                type="text"
                value={form.social_youtube || ''}
                onChange={(e) => setForm({ ...form, social_youtube: e.target.value })}
                placeholder="https://youtube.com/@..."
                className="w-full p-2.5 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:outline-none font-mono"
              />
            </div>

            {/* 5. WhatsApp Hotline Helpdesk */}
            <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-3 shadow-xs sm:col-span-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">Nomor WhatsApp Helpdesk Pelayanan</span>
                    <span className="text-[11px] text-slate-400">Tautan cepat konsultasi ASN pada bilah bantuan melayang</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setForm({ ...form, show_whatsapp: form.show_whatsapp === 'true' ? 'false' : 'true' })}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-bold cursor-pointer transition-colors ${
                    form.show_whatsapp === 'true' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-slate-100 text-slate-400'
                  }`}
                >
                  {form.show_whatsapp === 'true' ? 'Aktif' : 'Disembunyikan'}
                </button>
              </div>
              <input
                type="text"
                value={form.social_whatsapp || ''}
                onChange={(e) => setForm({ ...form, social_whatsapp: e.target.value })}
                placeholder="08116800000"
                className="w-full p-2.5 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:outline-none font-mono"
              />
            </div>

          </div>
        </div>

        {/* Action Button Bottom */}
        <div className="flex justify-end pt-4 border-t border-slate-100">
          <button
            type="submit"
            disabled={saveMutation.isPending}
            className="px-6 py-2.5 bg-emerald-800 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-md transition-all cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{saveMutation.isPending ? 'Menyimpan...' : 'Simpan Perubahan Web'}</span>
          </button>
        </div>

      </form>

    </div>
  );
}
