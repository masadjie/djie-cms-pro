import React, { useState, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../services/api';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  Sliders, 
  Image as ImageIcon, 
  UploadCloud, 
  Eye, 
  ExternalLink, 
  Check, 
  X, 
  ToggleLeft, 
  ToggleRight, 
  AlertCircle,
  HelpCircle,
  Megaphone,
  FolderOpen
} from 'lucide-react';
import { useConfirm } from '../common/ConfirmDialog';
import MediaLibraryModal from './MediaLibraryModal';
import { compressImageToWebP } from '../../utils/imageCompressor';

const BANNER_TYPES = [
  { id: 'HERO_SLIDER', label: 'Hero Slider Utama', desc: 'Tampil sebagai background slide dan headline di beranda depan' },
  { id: 'POPUP_ALERT', label: 'Alert / Pengumuman Prioritas', desc: 'Tampil sebagai banner notifikasi highlight di atas headline portal' },
  { id: 'PROMO_BANNER', label: 'Banner Promo / Layanan Unggulan', desc: 'Kartu interaktif di section sorotan beranda depan (bisa disesuaikan teks, logo & link)' },
  { id: 'SIDEBAR_BANNER', label: 'Sidebar / Widget Banner', desc: 'Banner pendukung di sidebar berita atau halaman informasi' }
];

export default function BannerManagerTab() {
  const confirm = useConfirm();
  const queryClient = useQueryClient();
  const fileInputRef = useRef(null);

  // States
  const [showModal, setShowModal] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [previewModalBanner, setPreviewModalBanner] = useState(null);
  const [activeTabFilter, setActiveTabFilter] = useState('ALL');

  // Form State
  const initialForm = {
    judul: '',
    subjudul: '',
    gambar_url: '',
    target_url: '',
    tipe: 'HERO_SLIDER',
    urutan: 1,
    is_active: true
  };
  const [form, setBannerForm] = useState(initialForm);

  // 1. Fetch Banner List
  const { data: bannerData, isLoading, refetch } = useQuery({
    queryKey: ['adminBannerList'],
    queryFn: async () => {
      try {
        const res = await api.get('/cms/banner');
        return Array.isArray(res?.data) ? res.data : (Array.isArray(res) ? res : []);
      } catch (err) {
        return [];
      }
    }
  });

  const bannerItems = Array.isArray(bannerData) 
    ? bannerData 
    : (Array.isArray(bannerData?.data) ? bannerData.data : []);

  // Filtered by tab
  const filteredBanners = bannerItems.filter(b => {
    if (activeTabFilter === 'ALL') return true;
    return b.tipe === activeTabFilter;
  });

  // 2. Create Mutation
  const createMutation = useMutation({
    mutationFn: async (payload) => await api.post('/cms/banner', payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminBannerList'] });
      queryClient.invalidateQueries({ queryKey: ['portalLiveBanners'] });
      closeModal();
    },
    onError: (err) => {
      alert('Gagal membuat banner: ' + (err?.response?.data?.message || err?.message || err));
    }
  });

  // 3. Update Mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, payload }) => await api.put(`/cms/banner/${id}`, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminBannerList'] });
      queryClient.invalidateQueries({ queryKey: ['portalLiveBanners'] });
      closeModal();
    },
    onError: (err) => {
      alert('Gagal memperbarui banner: ' + (err?.response?.data?.message || err?.message || err));
    }
  });

  // 4. Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: async (id) => await api.delete(`/cms/banner/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminBannerList'] });
      queryClient.invalidateQueries({ queryKey: ['portalLiveBanners'] });
    }
  });

  // 5. Toggle Status Mutation
  const toggleStatusMutation = useMutation({
    mutationFn: async ({ id, is_active }) => await api.put(`/cms/banner/${id}`, { is_active }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminBannerList'] });
      queryClient.invalidateQueries({ queryKey: ['portalLiveBanners'] });
    }
  });

  const toFullUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    const base = window.location.origin;
    return `${base}${url.startsWith('/') ? '' : '/'}${url}`;
  };

  const openCreateModal = () => {
    setEditingBanner(null);
    setBannerForm(initialForm);
    setShowModal(true);
  };

  const openEditModal = (banner) => {
    setEditingBanner(banner);
    setBannerForm({
      judul: banner.judul || '',
      subjudul: banner.subjudul || '',
      gambar_url: toFullUrl(banner.gambar_url || ''),
      target_url: banner.target_url || '',
      tipe: banner.tipe || 'HERO_SLIDER',
      urutan: banner.urutan !== undefined ? banner.urutan : 1,
      is_active: banner.is_active !== undefined ? banner.is_active : true
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingBanner(null);
    setBannerForm(initialForm);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!form.judul.trim()) {
      alert('Judul banner wajib diisi.');
      return;
    }
    if (!form.gambar_url.trim()) {
      alert('Gambar banner wajib diisi. Silakan unggah foto atau masukkan URL gambar.');
      return;
    }

    if (editingBanner) {
      updateMutation.mutate({ id: editingBanner.id, payload: form });
    } else {
      createMutation.mutate(form);
    }
  };

  // Direct Image Upload to MinIO S3
  const handleDirectImageUpload = async (e) => {
    let file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Hanya berkas gambar (JPG, PNG, WebP) yang dapat diunggah sebagai banner.');
      return;
    }

    setUploadingImage(true);
    try {
      file = await compressImageToWebP(file);
      const formData = new FormData();
      formData.append('file', file);
      formData.append('nama_lampiran', `Banner: ${form.judul || file.name}`);
      formData.append('kategori_dokumen', 'GALERI_MEDIA');

      const res = await api.post('/storage/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (res?.data?.file_url) {
        setBannerForm(prev => ({ ...prev, gambar_url: toFullUrl(res.data.file_url) }));
      }
    } catch (err) {
      alert('Gagal mengunggah gambar ke MinIO S3: ' + (err?.response?.data?.message || err.message));
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xs">
      
      {/* 1. Header Area */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-100">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900">Manajemen Banner Slider & Notifikasi Alert</h2>
              <p className="text-xs text-slate-500">Kelola gambar latar slider hero utama, notifikasi pengumuman, dan banner portal BKPSDM.</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={openCreateModal}
            className="px-4 py-2.5 bg-emerald-800 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition-all hover:scale-[1.02] cursor-pointer"
          >
            <Plus className="w-4 h-4 text-amber-300" />
            <span>Tambah Banner Baru</span>
          </button>
        </div>
      </div>

      {/* 2. Filter Category Pills */}
      <div className="flex flex-wrap items-center gap-2 text-xs">
        {[
          { id: 'ALL', label: `Semua Banner (${bannerItems.length})` },
          { id: 'HERO_SLIDER', label: `Hero Slider (${bannerItems.filter(b => b.tipe === 'HERO_SLIDER').length})` },
          { id: 'POPUP_ALERT', label: `Alert Prioritas (${bannerItems.filter(b => b.tipe === 'POPUP_ALERT').length})` },
          { id: 'PROMO_BANNER', label: `Promo / Layanan (${bannerItems.filter(b => b.tipe === 'PROMO_BANNER' || b.tipe === 'SIKEPO_BANNER').length})` },
          { id: 'SIDEBAR_BANNER', label: `Sidebar (${bannerItems.filter(b => b.tipe === 'SIDEBAR_BANNER').length})` }
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTabFilter(tab.id)}
            className={`px-3.5 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
              activeTabFilter === tab.id
                ? 'bg-emerald-800 text-white shadow-2xs'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 3. Banner Cards Grid */}
      {isLoading ? (
        <div className="py-16 text-center text-xs text-slate-400">
          <div className="w-6 h-6 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <span>Memuat data banner dari server...</span>
        </div>
      ) : filteredBanners.length === 0 ? (
        <div className="py-16 text-center text-xs text-slate-400 bg-slate-50/80 rounded-2xl border border-dashed border-slate-200 p-8 space-y-3">
          <AlertCircle className="w-8 h-8 mx-auto text-slate-300" />
          <p className="font-semibold text-slate-600">Belum ada banner pada kategori ini.</p>
          <button
            type="button"
            onClick={openCreateModal}
            className="px-4 py-2 bg-emerald-800 text-white font-bold rounded-xl text-xs hover:bg-emerald-700 inline-flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Tambah Sekarang</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {filteredBanners.map((banner) => (
            <div 
              key={banner.id} 
              className={`rounded-2xl border transition-all overflow-hidden flex flex-col justify-between ${
                banner.is_active 
                  ? 'bg-white border-slate-200 hover:border-emerald-300 shadow-xs' 
                  : 'bg-slate-50/80 border-slate-200 opacity-75'
              }`}
            >
              {/* Card Top: Banner Preview & Badges */}
              <div className="relative h-44 sm:h-48 w-full bg-slate-900 overflow-hidden group">
                <img
                  src={banner.gambar_url}
                  alt={banner.judul}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                  onError={(e) => {
                    e.currentTarget.src = '/hero-tamiang.jpg';
                  }}
                />
                
                {/* Gradient Overlay for Readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* Badges on Top */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
                  <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg backdrop-blur-md shadow-sm ${
                    banner.tipe === 'HERO_SLIDER'
                      ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/30'
                      : banner.tipe === 'POPUP_ALERT'
                      ? 'bg-amber-950/80 text-amber-300 border border-amber-500/30'
                      : 'bg-sky-950/80 text-sky-300 border border-sky-500/30'
                  }`}>
                    {banner.tipe}
                  </span>

                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 ${
                    banner.is_active ? 'bg-emerald-500 text-white' : 'bg-slate-600 text-slate-200'
                  }`}>
                    {banner.is_active ? 'Aktif' : 'Nonaktif'}
                  </span>
                </div>

                {/* Info Text in Image bottom */}
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <h4 className="text-sm font-bold truncate drop-shadow-sm">{banner.judul}</h4>
                  {banner.subjudul && (
                    <p className="text-[11px] text-slate-200 line-clamp-1 drop-shadow-xs">{banner.subjudul}</p>
                  )}
                </div>

                {/* Zoom / Preview Button on Image Hover */}
                <button
                  type="button"
                  onClick={() => setPreviewModalBanner(banner)}
                  className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity text-white font-bold text-xs gap-1.5 cursor-pointer"
                >
                  <Eye className="w-4 h-4 text-amber-300" />
                  <span>Lihat Tampilan Penuh</span>
                </button>
              </div>

              {/* Card Bottom: Metadata & Actions */}
              <div className="p-4 bg-white flex items-center justify-between gap-3 text-xs border-t border-slate-100">
                <div className="min-w-0">
                  <p className="text-[11px] text-slate-500 font-mono truncate">
                    Urutan: <strong className="text-slate-800">#{banner.urutan || 1}</strong>
                    {banner.target_url && (
                      <span className="ml-2">
                        &bull; Target: <a href={banner.target_url} target="_blank" rel="noreferrer" className="text-emerald-700 underline">{banner.target_url}</a>
                      </span>
                    )}
                  </p>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  {/* Toggle Active Switch */}
                  <button
                    type="button"
                    onClick={() => toggleStatusMutation.mutate({ id: banner.id, is_active: !banner.is_active })}
                    className={`p-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                      banner.is_active 
                        ? 'text-emerald-700 hover:bg-emerald-50' 
                        : 'text-slate-400 hover:bg-slate-100'
                    }`}
                    title={banner.is_active ? 'Klik untuk Nonaktifkan' : 'Klik untuk Aktifkan'}
                  >
                    {banner.is_active ? <ToggleRight className="w-5 h-5 text-emerald-700" /> : <ToggleLeft className="w-5 h-5 text-slate-400" />}
                  </button>

                  {/* Edit Button */}
                  <button
                    type="button"
                    onClick={() => openEditModal(banner)}
                    className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-600 hover:text-emerald-800 transition-colors cursor-pointer"
                    title="Ubah / Edit Banner"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>

                  {/* Delete Button */}
                  <button
                    type="button"
                    onClick={async () => {
                      const ok = await confirm({
                        title: 'Hapus Banner',
                        message: `Apakah Anda yakin ingin menghapus banner "${banner.judul}"?`,
                        confirmText: 'Ya, Hapus Banner',
                        variant: 'danger'
                      });
                      if (ok) {
                        deleteMutation.mutate(banner.id);
                      }
                    }}
                    className="p-1.5 hover:bg-red-50 rounded-lg text-red-500 hover:text-red-700 transition-colors cursor-pointer"
                    title="Hapus Banner"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* 4. MODAL FORM: CREATE / EDIT BANNER */}
      {showModal && (
        <div 
          className="fixed inset-0 bg-slate-950/75 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-6 animate-fadeIn"
          onClick={closeModal}
        >
          <div 
            className="bg-white rounded-3xl max-w-xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-800">
                  <Sliders className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900">
                    {editingBanner ? 'Edit Banner / Pengumuman' : 'Tambah Banner Baru'}
                  </h3>
                  <p className="text-[11px] text-slate-500">Sesuaikan konten, gambar MinIO, dan jenis banner</p>
                </div>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body / Form */}
            <form onSubmit={handleFormSubmit} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs text-slate-700">
              
              {/* Tipe Banner */}
              <div>
                <label className="block font-bold text-slate-800 mb-1.5">
                  Tipe / Posisi Penempatan Banner <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {BANNER_TYPES.map((type) => (
                    <label
                      key={type.id}
                      className={`p-3 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                        form.tipe === type.id
                          ? 'bg-emerald-50 border-emerald-500 text-emerald-950 font-bold shadow-2xs'
                          : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-600'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs">{type.label}</span>
                        <input
                          type="radio"
                          name="banner_type"
                          value={type.id}
                          checked={form.tipe === type.id}
                          onChange={(e) => setBannerForm({ ...form, tipe: e.target.value })}
                          className="text-emerald-700 focus:ring-emerald-600"
                        />
                      </div>
                      <p className="text-[10px] text-slate-500 mt-1 font-normal leading-tight">{type.desc}</p>
                    </label>
                  ))}
                </div>
              </div>

              {/* Judul */}
              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  Judul Banner / Headline <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Portal Layanan Kepegawaian BKPSDM Aceh Tamiang"
                  value={form.judul}
                  onChange={(e) => setBannerForm({ ...form, judul: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                />
              </div>

              {/* Subjudul */}
              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  Subjudul / Ringkasan Keterangan
                </label>
                <textarea
                  rows={2}
                  placeholder="Keterangan singkat yang tampil di bawah judul..."
                  value={form.subjudul}
                  onChange={(e) => setBannerForm({ ...form, subjudul: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                />
              </div>

              {/* Gambar Banner: MinIO Picker & Direct Upload */}
              <div>
                <label className="block font-bold text-slate-800 mb-1.5">
                  Gambar Banner <span className="text-red-500">*</span>
                </label>
                
                {/* Image Preview Box */}
                {form.gambar_url ? (
                  <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-900 h-36 mb-2 group">
                    <img
                      src={form.gambar_url}
                      alt="Banner Preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-3 py-1.5 bg-white text-slate-800 font-bold rounded-xl text-xs hover:bg-slate-100"
                      >
                        Ganti Foto
                      </button>
                      <button
                        type="button"
                        onClick={() => setBannerForm({ ...form, gambar_url: '' })}
                        className="px-3 py-1.5 bg-red-600 text-white font-bold rounded-xl text-xs hover:bg-red-700"
                      >
                        Hapus
                      </button>
                    </div>
                  </div>
                ) : null}

                {/* Upload & Choose Options */}
                <div className="flex flex-wrap items-center gap-2">
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleDirectImageUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    disabled={uploadingImage}
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl font-bold flex items-center gap-1.5 cursor-pointer transition-all disabled:opacity-50"
                  >
                    <UploadCloud className="w-4 h-4" />
                    <span>{uploadingImage ? 'Mengompres & Mengunggah...' : 'Unggah Foto Baru (MinIO)'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsMediaModalOpen(true)}
                    className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 rounded-xl font-bold flex items-center gap-1.5 cursor-pointer transition-all"
                  >
                    <FolderOpen className="w-4 h-4 text-amber-500" />
                    <span>Pilih dari Galeri MinIO</span>
                  </button>
                </div>

                <div className="mt-2">
                  <input
                    type="text"
                    placeholder="Atau masukkan URL gambar langsung (https://...)"
                    value={form.gambar_url}
                    onChange={(e) => setBannerForm({ ...form, gambar_url: e.target.value })}
                    className="w-full px-3 py-2 text-[11px] font-mono bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>
              </div>

              {/* Target Link & Urutan */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-800 mb-1">
                    Tautan Target (Opsional)
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: /berita atau https://sikepo..."
                    value={form.target_url}
                    onChange={(e) => setBannerForm({ ...form, target_url: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-800 mb-1">
                    Nomor Urut
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={form.urutan}
                    onChange={(e) => setBannerForm({ ...form, urutan: parseInt(e.target.value) || 1 })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none font-mono"
                  />
                </div>
              </div>

              {/* Status Aktif */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-800 block text-xs">Status Publikasi Banner</span>
                  <span className="text-[11px] text-slate-500">Tampilkan banner ini di portal publik</span>
                </div>
                <button
                  type="button"
                  onClick={() => setBannerForm({ ...form, is_active: !form.is_active })}
                  className="cursor-pointer"
                >
                  {form.is_active ? (
                    <ToggleRight className="w-7 h-7 text-emerald-700" />
                  ) : (
                    <ToggleLeft className="w-7 h-7 text-slate-400" />
                  )}
                </button>
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                  className="px-5 py-2 text-xs font-bold bg-emerald-800 text-white rounded-xl shadow-xs hover:bg-emerald-700 transition-all cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
                >
                  <Check className="w-4 h-4 text-amber-300" />
                  <span>{editingBanner ? 'Simpan Perubahan' : 'Terbitkan Banner'}</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* 5. PREVIEW MODAL */}
      {previewModalBanner && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-fadeIn"
          onClick={() => setPreviewModalBanner(null)}
        >
          <div 
            className="bg-white rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl border border-slate-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative h-72 sm:h-96 bg-slate-900">
              <img
                src={previewModalBanner.gambar_url}
                alt={previewModalBanner.judul}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white space-y-1">
                <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md bg-amber-400 text-slate-950">
                  {previewModalBanner.tipe}
                </span>
                <h3 className="text-xl sm:text-2xl font-black drop-shadow-md">{previewModalBanner.judul}</h3>
                <p className="text-xs text-slate-200 drop-shadow-sm">{previewModalBanner.subjudul}</p>
              </div>
              <button
                type="button"
                onClick={() => setPreviewModalBanner(null)}
                className="absolute top-4 right-4 p-2 bg-black/50 text-white rounded-xl hover:bg-black/70 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 bg-slate-50 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-mono">Tautan URL: {previewModalBanner.gambar_url}</span>
              <button
                type="button"
                onClick={() => {
                  const b = previewModalBanner;
                  setPreviewModalBanner(null);
                  openEditModal(b);
                }}
                className="px-3 py-1.5 bg-emerald-800 text-white rounded-xl font-bold hover:bg-emerald-700"
              >
                Edit Banner Ini
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. MEDIA LIBRARY MODAL (SELECT FROM MINIO FILES) */}
      <MediaLibraryModal
        isOpen={isMediaModalOpen}
        onClose={() => setIsMediaModalOpen(false)}
        singleSelect={true}
        onlyImages={true}
        title="Pilih Gambar Banner dari Galeri MinIO"
        confirmText="Gunakan Gambar Ini"
        onSelectFiles={(files) => {
          const fileArr = Array.isArray(files) ? files : (files?.files || [files]);
          const selected = fileArr[0];
          if (selected?.file_url) {
            setBannerForm(prev => ({ ...prev, gambar_url: toFullUrl(selected.file_url) }));
          }
          setIsMediaModalOpen(false);
        }}
      />

    </div>
  );
}
