import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../services/api';
import { 
  Sliders, 
  Activity, 
  Clock, 
  Calendar, 
  MessageCircle, 
  Phone, 
  Save, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  Sparkles, 
  Layout, 
  Check, 
  HelpCircle,
  ExternalLink,
  ShieldCheck,
  Plus,
  Trash2,
  AlertCircle
} from 'lucide-react';

export default function WidgetManagerTab() {
  const queryClient = useQueryClient();
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Default widget state
  const [form, setForm] = useState({
    // Widget 1: Live Visitor Counter
    widget_visitor_active: 'true',
    widget_visitor_title: 'Statistik Pengunjung Portal',
    widget_visitor_desc: 'Perhitungan real-time kunjungan publik',
    widget_visitor_show_online: 'true',

    // Widget 2: Jam Pelayanan & Helpdesk
    widget_hours_active: 'true',
    widget_hours_title: 'Jam Pelayanan Terpadu',
    widget_hours_desc: 'Senin - Jumat: 08.00 - 16.30 WIB',

    // Widget 3: Live Agenda Mendatang
    widget_agenda_active: 'true',
    widget_agenda_title: 'Agenda & Kegiatan Kedinasan',

    // Section Header Sorotan (Banner & Layanan Digital)
    section_promo_title: 'Satu Pintu Layanan Digital Karir ASN',
    section_promo_desc: 'Integrasi terpadu SiKEPO Kabupaten Aceh Tamiang dengan ekosistem BKN RI untuk pelayanan kenaikan pangkat, e-Kinerja, dan mutasi tanpa hambatan.',
    section_promo_active: 'true',

    // Widget 4: Quick Contact & Call Center
    widget_contact_active: 'true',
    widget_contact_title: 'Helpdesk & Konsultasi ASN',

    // Custom Widget
    widget_custom_active: 'false',
    widget_custom_title: 'Pengumuman Penting BKPSDM',
    widget_custom_content: 'Seluruh layanan kepegawaian BKPSDM Aceh Tamiang bebas pungli dan berorientasi pelayanan prima.'
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

  // Populate form
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
      queryClient.invalidateQueries({ queryKey: ['portalPublicStats'] });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3500);
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    saveMutation.mutate(form);
  };

  const toggleField = (fieldName) => {
    setForm(prev => ({
      ...prev,
      [fieldName]: prev[fieldName] === 'true' ? 'false' : 'true'
    }));
  };

  return (
    <div className="space-y-6">
      
      {/* Header Info */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                <Layout className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-black text-slate-900">Manajemen Widget Portal</h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Atur widget sisi kanan (*Right Widget*) yang tampil di portal publik: aktifkan/nonaktifkan, ubah judul, dan kustomisasi konten.
            </p>
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={saveMutation.isPending}
            className="px-5 py-2.5 bg-emerald-800 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm transition-all self-start sm:self-auto cursor-pointer"
          >
            <Save className="w-4 h-4 text-amber-300" />
            <span>{saveMutation.isPending ? 'Menyimpan...' : 'Simpan Pengaturan Widget'}</span>
          </button>
        </div>

        {saveSuccess && (
          <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Pengaturan widget berhasil disimpan dan langsung diterapkan pada portal publik!</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
          
          {/* 1. WIDGET STATISTIK PENGUNJUNG (VISITOR COUNTER) */}
          <div className="p-5 rounded-2xl border border-slate-200 bg-white space-y-4 shadow-xs hover:border-emerald-500/50 transition-all">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <Activity className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900">Widget Statistik Pengunjung</h3>
                  <p className="text-[11px] text-slate-500">Counter live real-time kunjungan portal</p>
                </div>
              </div>
              
              <button
                type="button"
                onClick={() => toggleField('widget_visitor_active')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  form.widget_visitor_active === 'true'
                    ? 'bg-emerald-800 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                }`}
              >
                {form.widget_visitor_active === 'true' ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                <span>{form.widget_visitor_active === 'true' ? 'Aktif' : 'Nonaktif'}</span>
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Judul Widget</label>
                <input
                  type="text"
                  value={form.widget_visitor_title || ''}
                  onChange={(e) => setForm({ ...form, widget_visitor_title: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  placeholder="Statistik Pengunjung Portal"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Keterangan Subjudul</label>
                <input
                  type="text"
                  value={form.widget_visitor_desc || ''}
                  onChange={(e) => setForm({ ...form, widget_visitor_desc: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  placeholder="Perhitungan real-time kunjungan publik"
                />
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-slate-600 text-[11px] font-semibold">Tampilkan Indikator Pengunjung Online</span>
                <input
                  type="checkbox"
                  checked={form.widget_visitor_show_online === 'true'}
                  onChange={() => toggleField('widget_visitor_show_online')}
                  className="w-4 h-4 rounded text-emerald-700 focus:ring-emerald-600 cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* 2. WIDGET JAM PELAYANAN & HELPDESK */}
          <div className="p-5 rounded-2xl border border-slate-200 bg-white space-y-4 shadow-xs hover:border-emerald-500/50 transition-all">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900">Widget Jam Pelayanan</h3>
                  <p className="text-[11px] text-slate-500">Jam operasional kantor BKPSDM</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => toggleField('widget_hours_active')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  form.widget_hours_active === 'true'
                    ? 'bg-emerald-800 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                }`}
              >
                {form.widget_hours_active === 'true' ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                <span>{form.widget_hours_active === 'true' ? 'Aktif' : 'Nonaktif'}</span>
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Judul Widget</label>
                <input
                  type="text"
                  value={form.widget_hours_title || ''}
                  onChange={(e) => setForm({ ...form, widget_hours_title: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Jadwal Operasional Ringkas</label>
                <input
                  type="text"
                  value={form.widget_hours_desc || ''}
                  onChange={(e) => setForm({ ...form, widget_hours_desc: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>
            </div>
          </div>

          {/* 3. WIDGET AGENDA MENDATANG */}
          <div className="p-5 rounded-2xl border border-slate-200 bg-white space-y-4 shadow-xs hover:border-emerald-500/50 transition-all">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900">Widget Agenda Mendatang</h3>
                  <p className="text-[11px] text-slate-500">Ringkasan jadwal kegiatan terdekat</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => toggleField('widget_agenda_active')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  form.widget_agenda_active === 'true'
                    ? 'bg-emerald-800 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                }`}
              >
                {form.widget_agenda_active === 'true' ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                <span>{form.widget_agenda_active === 'true' ? 'Aktif' : 'Nonaktif'}</span>
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Judul Tab Agenda</label>
                <input
                  type="text"
                  value={form.widget_agenda_title || ''}
                  onChange={(e) => setForm({ ...form, widget_agenda_title: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>
            </div>
          </div>

          {/* 4. WIDGET CUSTOM ANNOUNCEMENT / EMBED */}
          <div className="p-5 rounded-2xl border border-slate-200 bg-white space-y-4 shadow-xs hover:border-emerald-500/50 transition-all">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900">Custom Widget Pengumuman</h3>
                  <p className="text-[11px] text-slate-500">Tampilkan teks atau banner khusus di sidebar</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => toggleField('widget_custom_active')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  form.widget_custom_active === 'true'
                    ? 'bg-emerald-800 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                }`}
              >
                {form.widget_custom_active === 'true' ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                <span>{form.widget_custom_active === 'true' ? 'Aktif' : 'Nonaktif'}</span>
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Judul Custom Widget</label>
                <input
                  type="text"
                  value={form.widget_custom_title || ''}
                  onChange={(e) => setForm({ ...form, widget_custom_title: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  placeholder="Pengumuman Penting"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Konten Teks Widget</label>
                <textarea
                  rows={2}
                  value={form.widget_custom_content || ''}
                  onChange={(e) => setForm({ ...form, widget_custom_content: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  placeholder="Tulis pesan pengumuman..."
                />
              </div>
            </div>
          </div>

          {/* 5. PENGATURAN HEADER SECTION SOROTAN / PROMO BERANDA */}
          <div className="p-5 rounded-2xl border border-slate-200 bg-white space-y-4 shadow-xs hover:border-emerald-500/50 transition-all md:col-span-2">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <Layout className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900">Header Section Promo & Layanan Unggulan (Beranda)</h3>
                  <p className="text-[11px] text-slate-500">Sesuaikan judul dan deskripsi yang tampil di atas kartu banner promo/layanan beranda</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => toggleField('section_promo_active')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  form.section_promo_active !== 'false'
                    ? 'bg-emerald-800 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                }`}
              >
                {form.section_promo_active !== 'false' ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                <span>{form.section_promo_active !== 'false' ? 'Section Tampil' : 'Section Disembunyikan'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Judul Utama Section</label>
                <input
                  type="text"
                  value={form.section_promo_title || ''}
                  onChange={(e) => setForm({ ...form, section_promo_title: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  placeholder="Misal: Satu Pintu Layanan Digital Karir ASN / Layanan & Publikasi Unggulan"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Deskripsi / Sub-judul Section</label>
                <input
                  type="text"
                  value={form.section_promo_desc || ''}
                  onChange={(e) => setForm({ ...form, section_promo_desc: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  placeholder="Penjelasan ringkas seputar layanan terintegrasi..."
                />
              </div>
            </div>
            <p className="text-[11px] text-slate-400 italic">
              *Catatan: Kartu banner di dalam section ini dapat ditambah, diedit gambarnya, diubah judulnya, dan diganti tautan link-nya di tab <strong>Manajemen Banner</strong> (Pilih filter tipe <strong>Promo / Layanan</strong>).
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}
