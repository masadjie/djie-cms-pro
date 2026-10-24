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
                setForm(prev => ({ ...prev, home_layout_mode: 'PORTAL', site_theme: 'emerald' }));
                localStorage.setItem('djie_layout_mode', 'PORTAL');
                saveMutation.mutate({ ...form, home_layout_mode: 'PORTAL', site_theme: 'emerald' });
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
                setForm(prev => ({ ...prev, home_layout_mode: 'EDITORIAL', site_theme: 'editorial' }));
                localStorage.setItem('djie_layout_mode', 'EDITORIAL');
                saveMutation.mutate({ ...form, home_layout_mode: 'EDITORIAL', site_theme: 'editorial' });
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

      {/* 2. SECTION: TEMPLATE VIEW & LAYOUT PRESET */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <LayoutTemplate className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-black text-slate-900">Katalog Template & Tata Letak Beranda (Layout Preset)</h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Pilih arsitektur tata letak antarmuka beranda publik secara real-time. Template langsung aktif di halaman depan.
            </p>
          </div>
          <div className="px-3 py-1.5 bg-blue-50 text-blue-800 border border-blue-200 rounded-xl text-xs font-black flex items-center gap-1.5 shrink-0">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Multi-Template Ready v2.0</span>
          </div>
        </div>

        {/* Template Showcase Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          
          {/* Template A: Revision Editorial Magazine */}
          <div 
            onClick={() => {
              changeTheme('editorial');
              setForm(prev => ({ ...prev, home_layout_mode: 'EDITORIAL' }));
              localStorage.setItem('djie_layout_mode', 'EDITORIAL');
              saveMutation.mutate({ ...form, home_layout_mode: 'EDITORIAL', site_theme: 'editorial' });
            }}
            className={`rounded-2xl border-2 p-5 space-y-4 relative shadow-sm cursor-pointer transition-all ${
              currentTheme === 'editorial' || form.home_layout_mode === 'EDITORIAL'
                ? 'border-blue-600 bg-blue-50/20 ring-2 ring-blue-500/10'
                : 'border-slate-200 bg-white hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                currentTheme === 'editorial' || form.home_layout_mode === 'EDITORIAL'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-600'
              }`}>
                {currentTheme === 'editorial' || form.home_layout_mode === 'EDITORIAL' ? 'Aktif Saat Ini' : 'Pilihan A'}
              </span>
              {(currentTheme === 'editorial' || form.home_layout_mode === 'EDITORIAL') && (
                <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs shadow-xs">
                  <Check className="w-4 h-4 stroke-[3]" />
                </span>
              )}
            </div>

            {/* Mock Layout Diagram: Revision Editorial */}
            <div className="h-32 rounded-xl bg-slate-50 border border-slate-200/80 p-2 space-y-1.5">
              <div className="h-3 w-full bg-blue-600 rounded flex items-center px-1.5 justify-between">
                <div className="w-8 h-1 bg-white rounded-full" />
                <div className="flex gap-1">
                  <div className="w-4 h-1 bg-white/70 rounded-full" />
                  <div className="w-4 h-1 bg-white/70 rounded-full" />
                </div>
              </div>
              <div className="flex gap-1 items-center pt-0.5">
                <div className="h-2 w-8 bg-blue-200 rounded-full" />
                <div className="h-2 w-6 bg-slate-200 rounded-full" />
                <div className="h-2 w-10 bg-slate-200 rounded-full" />
              </div>
              <div className="grid grid-cols-12 gap-1.5 h-16 pt-0.5">
                <div className="col-span-8 bg-white border border-slate-200/80 rounded p-1 space-y-1 flex flex-col justify-between">
                  <div className="h-8 bg-slate-200 rounded" />
                  <div className="h-1.5 w-3/4 bg-slate-400 rounded-full" />
                </div>
                <div className="col-span-4 bg-blue-50 border border-blue-200/60 rounded p-1 flex flex-col justify-between">
                  <div className="h-4 bg-blue-200 rounded" />
                  <div className="h-1 w-full bg-blue-400 rounded-full" />
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
                <span>Template A: Revision Editorial Magazine</span>
              </h4>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Desain editorial modern khusus portal berita & media digital. Dilengkapi bar topik trending warna-warni, grid 2-kolom artikel, profil redaksi bergradasi, dan subscription box newsletter.
              </p>
            </div>
          </div>

          {/* Template B: Government & Public Service Portal */}
          <div 
            onClick={() => {
              changeTheme('emerald');
              setForm(prev => ({ ...prev, home_layout_mode: 'PORTAL' }));
              localStorage.setItem('djie_layout_mode', 'PORTAL');
              saveMutation.mutate({ ...form, home_layout_mode: 'PORTAL', site_theme: 'emerald' });
            }}
            className={`rounded-2xl border-2 p-5 space-y-4 relative shadow-sm cursor-pointer transition-all ${
              currentTheme !== 'editorial' && form.home_layout_mode !== 'EDITORIAL'
                ? 'border-emerald-600 bg-emerald-50/20 ring-2 ring-emerald-500/10'
                : 'border-slate-200 bg-white hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                currentTheme !== 'editorial' && form.home_layout_mode !== 'EDITORIAL'
                  ? 'bg-emerald-700 text-white'
                  : 'bg-slate-100 text-slate-600'
              }`}>
                {currentTheme !== 'editorial' && form.home_layout_mode !== 'EDITORIAL' ? 'Aktif Saat Ini' : 'Pilihan B'}
              </span>
              {currentTheme !== 'editorial' && form.home_layout_mode !== 'EDITORIAL' && (
                <span className="w-6 h-6 rounded-full bg-emerald-700 text-white flex items-center justify-center text-xs shadow-xs">
                  <Check className="w-4 h-4 stroke-[3]" />
                </span>
              )}
            </div>

            {/* Mock Layout Diagram: Government Portal */}
            <div className="h-32 rounded-xl bg-slate-50 border border-slate-200/80 p-2 space-y-1.5">
              <div className="h-3 w-full bg-emerald-800 rounded flex items-center px-1.5 justify-between">
                <div className="w-8 h-1 bg-white rounded-full" />
                <div className="flex gap-1">
                  <div className="w-4 h-1 bg-white/70 rounded-full" />
                </div>
              </div>
              <div className="h-10 w-full bg-emerald-900/90 rounded flex flex-col items-center justify-center px-2">
                <div className="h-2 w-20 bg-white/90 rounded-full mb-1" />
                <div className="h-2.5 w-32 bg-white/20 rounded" />
              </div>
              <div className="grid grid-cols-4 gap-1 pt-0.5">
                <div className="h-7 bg-white border border-slate-200 rounded" />
                <div className="h-7 bg-white border border-slate-200 rounded" />
                <div className="h-7 bg-white border border-slate-200 rounded" />
                <div className="h-7 bg-white border border-slate-200 rounded" />
              </div>
            </div>

            <div>
              <h4 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
                <span>Template B: Government & Public Service Portal</span>
              </h4>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Struktur korporat dan pemerintahan dengan Hero Banner pencarian cepat, grid katalog multi-layanan publik, widget status antrean, dan kalender agenda resmi.
              </p>
            </div>
          </div>

        </div>

        {/* ── EDIT KONTEN TEMPLATE A (EDITORIAL MAGAZINE) ── */}
        {(currentTheme === 'editorial' || form.home_layout_mode === 'EDITORIAL') && (
          <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-50/70 via-white to-sky-50/40 border-2 border-blue-200/80 space-y-6 animate-in fade-in duration-300">
            <div className="flex items-center gap-3 border-b border-blue-100 pb-4">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-sm">
                <LayoutTemplate className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900">
                  Pengaturan Konten Template A (Revision Editorial Magazine)
                </h3>
                <p className="text-xs text-slate-500">
                  Sesuaikan teks horizontal banner promo, highlight cards lingkaran, dan statistik followers secara dinamis.
                </p>
              </div>
            </div>

            {/* Horizontal Promo Banner Fields */}
            <div className="bg-white p-5 rounded-2xl border border-blue-100 shadow-xs space-y-4">
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-blue-700">
                <Sparkles className="w-4 h-4" />
                <span>1. Banner Promo / Spotlight Display (Horizontal)</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Tag / Subjudul Banner</label>
                  <input
                    type="text"
                    value={form.editorial_promo_tag || ''}
                    onChange={(e) => setForm({ ...form, editorial_promo_tag: e.target.value })}
                    placeholder="SPECIAL HIGHLIGHT PROMO"
                    className="w-full p-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Judul Utama Banner</label>
                  <input
                    type="text"
                    value={form.editorial_promo_title || ''}
                    onChange={(e) => setForm({ ...form, editorial_promo_title: e.target.value })}
                    placeholder="Djie CMS Pro — High-Speed Digital Publishing Engine"
                    className="w-full p-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Deskripsi Singkat Banner</label>
                  <textarea
                    rows="2"
                    value={form.editorial_promo_desc || ''}
                    onChange={(e) => setForm({ ...form, editorial_promo_desc: e.target.value })}
                    placeholder="Dapatkan akses penuh ke seluruh modul berita redaksi, integrasi dokumen publik, dan performa tinggi React 18 SPA."
                    className="w-full p-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Teks Tombol CTA</label>
                  <input
                    type="text"
                    value={form.editorial_promo_btn || ''}
                    onChange={(e) => setForm({ ...form, editorial_promo_btn: e.target.value })}
                    placeholder="Masuk Dashboard"
                    className="w-full p-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">URL Target Tombol CTA</label>
                  <input
                    type="text"
                    value={form.editorial_promo_url || ''}
                    onChange={(e) => setForm({ ...form, editorial_promo_url: e.target.value })}
                    placeholder="/admin/login atau https://..."
                    className="w-full p-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none font-mono"
                  />
                </div>
              </div>
            </div>

            {/* 4 Circular Highlights Customization */}
            <div className="bg-white p-5 rounded-2xl border border-blue-100 shadow-xs space-y-4">
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-blue-700">
                <Clock className="w-4 h-4" />
                <span>2. 4 Bar Highlight Thumbnail Lingkaran (Top Bar)</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* HL 1 */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <span className="text-[11px] font-black text-blue-600 block">Item #01</span>
                  <input
                    type="text"
                    value={form.editorial_hl1_title || ''}
                    onChange={(e) => setForm({ ...form, editorial_hl1_title: e.target.value })}
                    placeholder="Judul Highlight 1"
                    className="w-full p-2 text-xs border border-slate-200 rounded-lg bg-white"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={form.editorial_hl1_cat || ''}
                      onChange={(e) => setForm({ ...form, editorial_hl1_cat: e.target.value })}
                      placeholder="Kategori (e.g. SPORTS)"
                      className="p-2 text-xs border border-slate-200 rounded-lg bg-white"
                    />
                    <input
                      type="text"
                      value={form.editorial_hl1_url || ''}
                      onChange={(e) => setForm({ ...form, editorial_hl1_url: e.target.value })}
                      placeholder="URL Tautan"
                      className="p-2 text-xs border border-slate-200 rounded-lg bg-white font-mono"
                    />
                  </div>
                </div>

                {/* HL 2 */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <span className="text-[11px] font-black text-blue-600 block">Item #02</span>
                  <input
                    type="text"
                    value={form.editorial_hl2_title || ''}
                    onChange={(e) => setForm({ ...form, editorial_hl2_title: e.target.value })}
                    placeholder="Judul Highlight 2"
                    className="w-full p-2 text-xs border border-slate-200 rounded-lg bg-white"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={form.editorial_hl2_cat || ''}
                      onChange={(e) => setForm({ ...form, editorial_hl2_cat: e.target.value })}
                      placeholder="Kategori (e.g. TRAVEL)"
                      className="p-2 text-xs border border-slate-200 rounded-lg bg-white"
                    />
                    <input
                      type="text"
                      value={form.editorial_hl2_url || ''}
                      onChange={(e) => setForm({ ...form, editorial_hl2_url: e.target.value })}
                      placeholder="URL Tautan"
                      className="p-2 text-xs border border-slate-200 rounded-lg bg-white font-mono"
                    />
                  </div>
                </div>

                {/* HL 3 */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <span className="text-[11px] font-black text-blue-600 block">Item #03</span>
                  <input
                    type="text"
                    value={form.editorial_hl3_title || ''}
                    onChange={(e) => setForm({ ...form, editorial_hl3_title: e.target.value })}
                    placeholder="Judul Highlight 3"
                    className="w-full p-2 text-xs border border-slate-200 rounded-lg bg-white"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={form.editorial_hl3_cat || ''}
                      onChange={(e) => setForm({ ...form, editorial_hl3_cat: e.target.value })}
                      placeholder="Kategori (e.g. FASHION)"
                      className="p-2 text-xs border border-slate-200 rounded-lg bg-white"
                    />
                    <input
                      type="text"
                      value={form.editorial_hl3_url || ''}
                      onChange={(e) => setForm({ ...form, editorial_hl3_url: e.target.value })}
                      placeholder="URL Tautan"
                      className="p-2 text-xs border border-slate-200 rounded-lg bg-white font-mono"
                    />
                  </div>
                </div>

                {/* HL 4 */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <span className="text-[11px] font-black text-blue-600 block">Item #04</span>
                  <input
                    type="text"
                    value={form.editorial_hl4_title || ''}
                    onChange={(e) => setForm({ ...form, editorial_hl4_title: e.target.value })}
                    placeholder="Judul Highlight 4"
                    className="w-full p-2 text-xs border border-slate-200 rounded-lg bg-white"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={form.editorial_hl4_cat || ''}
                      onChange={(e) => setForm({ ...form, editorial_hl4_cat: e.target.value })}
                      placeholder="Kategori (e.g. HEALTH)"
                      className="p-2 text-xs border border-slate-200 rounded-lg bg-white"
                    />
                    <input
                      type="text"
                      value={form.editorial_hl4_url || ''}
                      onChange={(e) => setForm({ ...form, editorial_hl4_url: e.target.value })}
                      placeholder="URL Tautan"
                      className="p-2 text-xs border border-slate-200 rounded-lg bg-white font-mono"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Social Followers Counters Widget */}
            <div className="bg-white p-5 rounded-2xl border border-blue-100 shadow-xs space-y-4">
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-blue-700">
                <Share2 className="w-4 h-4" />
                <span>3. Teks Statistik Pengikut Sosial Media (Stay Connected Box)</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Facebook Fans</label>
                  <input
                    type="text"
                    value={form.social_facebook_fans || ''}
                    onChange={(e) => setForm({ ...form, social_facebook_fans: e.target.value })}
                    placeholder="12.5k Fans"
                    className="w-full p-2 text-xs border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Twitter Followers</label>
                  <input
                    type="text"
                    value={form.social_twitter_fans || ''}
                    onChange={(e) => setForm({ ...form, social_twitter_fans: e.target.value })}
                    placeholder="28.4k Followers"
                    className="w-full p-2 text-xs border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Instagram Followers</label>
                  <input
                    type="text"
                    value={form.social_instagram_fans || ''}
                    onChange={(e) => setForm({ ...form, social_instagram_fans: e.target.value })}
                    placeholder="45.2k Followers"
                    className="w-full p-2 text-xs border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">YouTube Subscribers</label>
                  <input
                    type="text"
                    value={form.social_youtube_fans || ''}
                    onChange={(e) => setForm({ ...form, social_youtube_fans: e.target.value })}
                    placeholder="8.9k Subscribers"
                    className="w-full p-2 text-xs border border-slate-200 rounded-lg"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={saveMutation.isPending}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-md transition-all cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>{saveMutation.isPending ? 'Menyimpan...' : 'Simpan Konten Template A'}</span>
              </button>
            </div>
          </div>
        )}
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
