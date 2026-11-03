import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../services/api';
import { 
  Instagram, 
  Youtube, 
  Facebook, 
  Twitter, 
  Video, 
  ExternalLink, 
  Plus, 
  Edit, 
  Trash2, 
  Sparkles, 
  Search, 
  Eye, 
  Check, 
  X, 
  AlertCircle,
  Share2,
  Image as ImageIcon
} from 'lucide-react';
import { useConfirm } from '../common/ConfirmDialog';

export default function MedsosAsnManagerTab() {
  const confirm = useConfirm();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);

  // Form State
  const [form, setForm] = useState({
    judul: '',
    platform: 'INSTAGRAM',
    url: '',
    cover_image: '',
    badge_text: '',
    urutan: 0,
    is_active: true
  });
  const [errorMsg, setErrorMsg] = useState('');

  // Fetch list Medsos ASN
  const { data: medsosData, isLoading } = useQuery({
    queryKey: ['adminMedsosAsnList'],
    queryFn: async () => {
      const res = await api.get('/cms/medsos-asn');
      return res?.data || res || [];
    }
  });

  const items = Array.isArray(medsosData) ? medsosData : [];
  const filtered = items.filter(it => 
    it.judul?.toLowerCase().includes(search.toLowerCase()) ||
    it.platform?.toLowerCase().includes(search.toLowerCase())
  );

  // Create or Update Mutation
  const saveMutation = useMutation({
    mutationFn: async (payload) => {
      if (editItem) {
        return await api.put(`/cms/medsos-asn/${editItem.id}`, payload);
      }
      return await api.post('/cms/medsos-asn', payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminMedsosAsnList'] });
      queryClient.invalidateQueries({ queryKey: ['homeMedsosAsn'] });
      setModalOpen(false);
      setEditItem(null);
      resetForm();
    },
    onError: (err) => {
      setErrorMsg(err?.response?.data?.message || 'Gagal menyimpan konten Medsos ASN.');
    }
  });

  // Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      return await api.delete(`/cms/medsos-asn/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminMedsosAsnList'] });
      queryClient.invalidateQueries({ queryKey: ['homeMedsosAsn'] });
    }
  });

  const handleDelete = async (item) => {
    const isConfirmed = await confirm({
      title: 'Hapus Konten Medsos ASN?',
      message: `Apakah Anda yakin ingin menghapus "${item.judul}"? Konten ini tidak akan lagi tampil di highlight beranda.`,
      confirmText: 'Ya, Hapus Konten',
      variant: 'danger'
    });

    if (isConfirmed) {
      deleteMutation.mutate(item.id);
    }
  };

  const resetForm = () => {
    setForm({
      judul: '',
      platform: 'INSTAGRAM',
      url: '',
      cover_image: '',
      badge_text: '',
      urutan: 0,
      is_active: true
    });
    setErrorMsg('');
  };

  const handleOpenCreate = () => {
    setEditItem(null);
    resetForm();
    setModalOpen(true);
  };

  const handleOpenEdit = (it) => {
    setEditItem(it);
    setForm({
      judul: it.judul || '',
      platform: it.platform || 'INSTAGRAM',
      url: it.url || '',
      cover_image: it.cover_image || '',
      badge_text: it.badge_text || '',
      urutan: it.urutan !== undefined ? it.urutan : 0,
      is_active: it.is_active !== undefined ? it.is_active : true
    });
    setErrorMsg('');
    setModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.judul.trim() || !form.url.trim()) {
      setErrorMsg('Judul dan URL Medsos wajib diisi.');
      return;
    }
    saveMutation.mutate(form);
  };

  const renderPlatformBadge = (platform) => {
    switch (platform) {
      case 'INSTAGRAM':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-pink-50 text-pink-700 border border-pink-200">
            <Instagram className="w-3 h-3 text-pink-600" />
            <span>Instagram</span>
          </span>
        );
      case 'TIKTOK':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-900 text-white">
            <Video className="w-3 h-3 text-cyan-400" />
            <span>TikTok</span>
          </span>
        );
      case 'YOUTUBE':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
            <Youtube className="w-3 h-3 text-rose-600" />
            <span>YouTube</span>
          </span>
        );
      case 'FACEBOOK':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
            <Facebook className="w-3 h-3 text-blue-600" />
            <span>Facebook</span>
          </span>
        );
      case 'TWITTER':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-sky-50 text-sky-700 border border-sky-200">
            <Twitter className="w-3 h-3 text-sky-600" />
            <span>Twitter/X</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
            <ExternalLink className="w-3 h-3 text-slate-500" />
            <span>Medsos</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center font-bold">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900">Medsos ASN (Sorotan Media Sosial)</h2>
              <p className="text-xs text-slate-500">
                Publikasikan tautan konten Instagram Reels, TikTok, YouTube Shorts, atau Facebook ASN dengan cover highlight modern.
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={handleOpenCreate}
          className="px-4 py-2.5 bg-emerald-800 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm transition-all cursor-pointer self-start sm:self-auto active:scale-95"
        >
          <Plus className="w-4 h-4 text-amber-300" />
          <span>Tambah Medsos ASN</span>
        </button>
      </div>

      {/* Filter / Search Bar */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari judul konten atau platform..."
            className="w-full pl-10 pr-4 py-2 text-xs border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600"
          />
        </div>
        <span className="text-xs text-slate-500 font-medium">
          Total: <strong className="text-slate-800">{filtered.length}</strong> konten
        </span>
      </div>

      {/* Grid of Highlight Cards Preview */}
      {isLoading ? (
        <div className="p-12 text-center text-xs text-slate-400 bg-white rounded-2xl border border-slate-200">
          Memuat data Medsos ASN...
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-12 text-center text-xs text-slate-400 bg-white rounded-2xl border border-slate-200 space-y-2">
          <p>Belum ada konten Medsos ASN yang ditambahkan.</p>
          <button
            type="button"
            onClick={handleOpenCreate}
            className="text-emerald-700 hover:underline font-bold text-xs"
          >
            + Tambah konten Medsos pertama
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="group relative bg-slate-900 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl border border-slate-200/80 transition-all duration-300 hover:-translate-y-1 flex flex-col h-[340px]"
            >
              {/* Background Cover */}
              <img
                src={item.cover_image || '/hero-tamiang.jpg'}
                alt={item.judul}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                onError={(e) => { e.currentTarget.src = '/hero-tamiang.jpg'; }}
              />

              {/* Dark Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-slate-900/10" />

              {/* Top Badges */}
              <div className="absolute top-4 inset-x-4 flex items-center justify-between gap-2 z-10">
                {renderPlatformBadge(item.platform)}
                {item.badge_text && (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-white/95 text-slate-900 backdrop-blur-md">
                    {item.badge_text}
                  </span>
                )}
              </div>

              {/* Center Action overlay on hover */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20 pointer-events-none">
                <span className="px-3.5 py-1.5 rounded-full bg-white/90 text-slate-950 text-xs font-bold shadow-lg flex items-center gap-1.5 backdrop-blur-md">
                  <ExternalLink className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Buka Link</span>
                </span>
              </div>

              {/* Bottom Details & Admin Buttons */}
              <div className="mt-auto p-4 z-10 space-y-3 relative">
                <h4 className="text-xs sm:text-sm font-bold text-white leading-snug line-clamp-2 drop-shadow-xs">
                  {item.judul}
                </h4>

                <div className="flex items-center justify-between pt-2 border-t border-white/20 text-[11px] text-slate-300">
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noreferrer"
                    className="truncate max-w-[140px] text-emerald-300 hover:underline flex items-center gap-1 font-mono text-[10px]"
                  >
                    <span>{item.url.replace(/^https?:\/\/(www\.)?/, '')}</span>
                  </a>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(item)}
                      title="Edit Medsos"
                      className="p-1.5 rounded-lg bg-white/20 hover:bg-white text-white hover:text-slate-900 transition-colors cursor-pointer"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(item)}
                      title="Hapus Medsos"
                      className="p-1.5 rounded-lg bg-rose-500/80 hover:bg-rose-600 text-white transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Create / Edit */}
      {modalOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setModalOpen(false)}
        >
          <div 
            className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-200 space-y-5 animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center font-bold">
                  <Share2 className="w-4 h-4" />
                </div>
                <h3 className="text-base font-black text-slate-900">
                  {editItem ? 'Edit Konten Medsos ASN' : 'Tambah Konten Medsos ASN'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {errorMsg && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Judul Sorotan Medsos <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={form.judul}
                  onChange={(e) => setForm({ ...form, judul: e.target.value })}
                  placeholder="e.g. Tips Pengisian e-Kinerja BKN 2026 Tanpa Kendala"
                  className="w-full p-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Platform Medsos <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={form.platform}
                    onChange={(e) => setForm({ ...form, platform: e.target.value })}
                    className="w-full p-2.5 text-xs border border-slate-200 rounded-xl bg-white focus:ring-2 focus:ring-emerald-600 focus:outline-none font-semibold"
                  >
                    <option value="INSTAGRAM">Instagram (Reels / Post)</option>
                    <option value="TIKTOK">TikTok Video</option>
                    <option value="YOUTUBE">YouTube / Shorts</option>
                    <option value="FACEBOOK">Facebook</option>
                    <option value="TWITTER">Twitter / X</option>
                    <option value="OTHER">Lainnya (Tautan Eksternal)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Tag / Badge Teks (Opsional)
                  </label>
                  <input
                    type="text"
                    value={form.badge_text}
                    onChange={(e) => setForm({ ...form, badge_text: e.target.value })}
                    placeholder="e.g. Tips ASN / Reels / Edukasi"
                    className="w-full p-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  URL / Tautan Media Sosial <span className="text-rose-500">*</span>
                </label>
                <input
                  type="url"
                  required
                  value={form.url}
                  onChange={(e) => setForm({ ...form, url: e.target.value })}
                  placeholder="https://www.instagram.com/reel/... atau https://vt.tiktok.com/..."
                  className="w-full p-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  URL Gambar Cover / Thumbnail
                </label>
                <input
                  type="text"
                  value={form.cover_image}
                  onChange={(e) => setForm({ ...form, cover_image: e.target.value })}
                  placeholder="https://... atau /hero-tamiang.jpg"
                  className="w-full p-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none font-mono"
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  Cover akan ditampilkan sebagai poster visual bergaya highlight.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Urutan Prioritas</label>
                  <input
                    type="number"
                    value={form.urutan}
                    onChange={(e) => setForm({ ...form, urutan: e.target.value })}
                    className="w-full p-2 text-xs border border-slate-200 rounded-xl"
                  />
                </div>
                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700">
                    <input
                      type="checkbox"
                      checked={form.is_active}
                      onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                      className="w-4 h-4 rounded text-emerald-600"
                    />
                    <span>Aktifkan / Tampilkan</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={saveMutation.isPending}
                  className="px-5 py-2 bg-emerald-800 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>{saveMutation.isPending ? 'Menyimpan...' : 'Simpan Konten'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
