import React, { useState, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../services/api';
import { compressImageToWebP, formatBytes } from '../../utils/imageCompressor';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  Image as ImageIcon, 
  UploadCloud, 
  X, 
  RefreshCw, 
  CheckCircle2, 
  Play, 
  Video, 
  Eye, 
  FolderOpen, 
  Copy, 
  Check, 
  Search, 
  ExternalLink,
  Layers,
  Sparkles,
  Info,
  Download,
  AlertCircle
} from 'lucide-react';
import { useConfirm } from '../common/ConfirmDialog';
import MediaLibraryModal from './MediaLibraryModal';
import { 
  detectVideoPlatform, 
  extractYouTubeId, 
  extractInstagramId, 
  extractTikTokId, 
  getEmbedUrl, 
  getVideoThumbnail 
} from '../../utils/videoEmbedHelper';

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];

export default function GaleriManagerTab() {
  const confirm = useConfirm();
  const queryClient = useQueryClient();
  const fileInputRef = useRef(null);

  // States
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [mediaType, setMediaType] = useState('FOTO'); // 'FOTO' | 'VIDEO'
  const [videoPlatform, setVideoPlatform] = useState('YOUTUBE'); // 'YOUTUBE' | 'INSTAGRAM' | 'TIKTOK'
  const [form, setForm] = useState({ judul: '', album: 'Kegiatan Kedinasan', caption: '' });
  const [videoUrl, setVideoUrl] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [compressionInfo, setCompressionInfo] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [playingVideo, setPlayingVideo] = useState(null);
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);

  // Filter & Search & Pagination
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('ALL'); // 'ALL' | 'FOTO' | 'VIDEO'
  const [selectedAlbum, setSelectedAlbum] = useState('ALL');
  const [page, setPage] = useState(1);
  const [limit] = useState(15);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'

  // Modal Details & Preview
  const [previewMedia, setPreviewMedia] = useState(null);
  const [detailMedia, setDetailMedia] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [statusToast, setStatusToast] = useState('');

  // 1. Fetch Galeri List
  const { data: galeriData, isLoading } = useQuery({
    queryKey: ['adminGaleriList', page, limit, search, activeTab, selectedAlbum],
    queryFn: async () => {
      try {
        const params = new URLSearchParams({
          page: String(page),
          limit: String(limit)
        });
        if (search) params.append('search', search);
        if (activeTab !== 'ALL') params.append('tipe', activeTab);
        if (selectedAlbum !== 'ALL') params.append('album', selectedAlbum);

        const res = await api.get(`/cms/galeri?${params.toString()}`);
        return res?.data || res || { data: [], pagination: { total: 0 } };
      } catch (err) {
        return { data: [], pagination: { total: 0 } };
      }
    }
  });

  const galeriItems = Array.isArray(galeriData) 
    ? galeriData 
    : (Array.isArray(galeriData?.data) ? galeriData.data : []);

  const totalPages = galeriData?.pagination?.totalPages || Math.ceil((galeriData?.pagination?.total || galeriItems.length) / limit) || 1;
  const totalItems = galeriData?.pagination?.total || galeriItems.length;

  // Derived Video detection & preview
  const detectedPlatform = detectVideoPlatform(videoUrl) || videoPlatform;
  const videoEmbedSrc = getEmbedUrl(videoUrl, detectedPlatform);
  const isVideoUrlValid = Boolean(
    (detectedPlatform === 'YOUTUBE' && extractYouTubeId(videoUrl)) ||
    (detectedPlatform === 'INSTAGRAM' && (extractInstagramId(videoUrl) || videoUrl.includes('instagram.com'))) ||
    (detectedPlatform === 'TIKTOK' && (extractTikTokId(videoUrl) || videoUrl.includes('tiktok.com')))
  );

  // Handle file selection (from file picker or drag-drop)
  const handleFileSelect = async (file) => {
    if (!file) return;
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      alert('Hanya berkas gambar (JPG, PNG, WebP, GIF, SVG) yang diizinkan.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target.result);
    reader.readAsDataURL(file);

    const originalSize = file.size;
    const compressed = await compressImageToWebP(file);
    setSelectedFile(compressed);

    if (compressed !== file) {
      setCompressionInfo({
        original: formatBytes(originalSize),
        compressed: formatBytes(compressed.size),
        savings: Math.round((1 - compressed.size / originalSize) * 100)
      });
    } else {
      setCompressionInfo(null);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    if (mediaType !== 'FOTO') return;
    const file = e.dataTransfer?.files?.[0];
    if (file) handleFileSelect(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    if (mediaType === 'FOTO') setDragOver(true);
  };

  // 2. Create / Update Galeri Media
  const handleSubmit = async () => {
    if (!form.judul.trim()) {
      alert('Judul media wajib diisi.');
      return;
    }

    if (!editingItem) {
      if (mediaType === 'FOTO' && !selectedFile && !preview) {
        alert('Pilih foto untuk diunggah.');
        return;
      }
      if (mediaType === 'VIDEO' && (!videoUrl.trim() || !isVideoUrlValid)) {
        alert('URL Video tidak valid. Masukkan tautan YouTube, Instagram Reels, atau TikTok.');
        return;
      }
    }

    setUploading(true);
    try {
      let mediaUrl = editingItem ? editingItem.media_url : '';
      let thumbUrl = editingItem ? editingItem.thumbnail_url : '';

      if (mediaType === 'FOTO') {
        if (selectedFile) {
          // Upload new image to MinIO S3
          const formData = new FormData();
          formData.append('file', selectedFile);
          formData.append('nama_lampiran', `Galeri: ${form.judul}`);
          formData.append('kategori_dokumen', 'GALERI_MEDIA');

          const uploadRes = await api.post('/storage/upload', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });

          const rawUrl = uploadRes?.data?.file_url || uploadRes?.file_url;
          mediaUrl = rawUrl?.startsWith('http') ? rawUrl : `${window.location.origin}${rawUrl?.startsWith('/') ? '' : '/'}${rawUrl}`;
          thumbUrl = mediaUrl;
        } else if (preview && typeof preview === 'string') {
          mediaUrl = preview.startsWith('http') ? preview : `${window.location.origin}${preview.startsWith('/') ? '' : '/'}${preview}`;
          thumbUrl = mediaUrl;
        }
      } else {
        if (videoUrl.trim()) {
          mediaUrl = videoUrl.trim();
          thumbUrl = getVideoThumbnail(videoUrl.trim(), detectedPlatform) || '';
        }
      }

      if (editingItem) {
        // Update existing item
        await api.put(`/cms/galeri/${editingItem.id}`, {
          judul: form.judul,
          tipe: mediaType,
          media_url: mediaUrl,
          thumbnail_url: thumbUrl || mediaUrl,
          album: form.album,
          caption: form.caption
        });
        setStatusToast('Media galeri berhasil diperbarui!');
      } else {
        // Create new item
        await api.post('/cms/galeri', {
          judul: form.judul,
          tipe: mediaType,
          media_url: mediaUrl,
          thumbnail_url: thumbUrl || mediaUrl,
          album: form.album,
          caption: form.caption
        });
        setStatusToast('Media berhasil ditambahkan ke Galeri!');
      }

      queryClient.invalidateQueries({ queryKey: ['adminGaleriList'] });
      resetModal();
      setTimeout(() => setStatusToast(''), 3000);
    } catch (err) {
      alert(err.response?.data?.message || err.message || 'Gagal menyimpan media.');
    } finally {
      setUploading(false);
    }
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setMediaType(item.tipe === 'VIDEO' ? 'VIDEO' : 'FOTO');
    setForm({
      judul: item.judul || '',
      album: item.album || 'Kegiatan Kedinasan',
      caption: item.caption || ''
    });
    if (item.tipe === 'VIDEO') {
      setVideoUrl(item.media_url || '');
      setVideoPlatform(detectVideoPlatform(item.media_url) || 'YOUTUBE');
    } else {
      setPreview(item.media_url || null);
    }
    setShowModal(true);
  };

  const resetModal = () => {
    setShowModal(false);
    setEditingItem(null);
    setMediaType('FOTO');
    setVideoPlatform('YOUTUBE');
    setForm({ judul: '', album: 'Kegiatan Kedinasan', caption: '' });
    setVideoUrl('');
    setSelectedFile(null);
    setPreview(null);
    setCompressionInfo(null);
    setDragOver(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // 3. Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: async (id) => await api.delete(`/cms/galeri/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminGaleriList'] });
      setStatusToast('Media berhasil dihapus dari galeri.');
      setTimeout(() => setStatusToast(''), 3000);
    }
  });

  // Check if a galeri item is a video item
  const isVideoItem = (g) => {
    return g.tipe === 'VIDEO' || detectVideoPlatform(g.media_url) !== null;
  };

  const getItemPlatform = (g) => {
    return detectVideoPlatform(g.media_url) || 'YOUTUBE';
  };

  const copyUrl = (url, id) => {
    const full = url.startsWith('http') ? url : `${window.location.origin}${url}`;
    navigator.clipboard.writeText(full);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      
      {/* Toast Alert */}
      {statusToast && (
        <div className="bg-emerald-900 text-white px-4 py-3 rounded-2xl shadow-lg flex items-center gap-2.5 text-xs font-bold animate-bounce">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span>{statusToast}</span>
        </div>
      )}

      {/* 1. STATS METRICS BAR */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-2xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Dokumentasi</span>
            <div className="p-2 bg-emerald-50 text-emerald-800 rounded-xl">
              <ImageIcon className="w-4 h-4 text-emerald-700" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 font-mono">{totalItems}</p>
          <p className="text-[11px] text-slate-500">Foto & Video Kegiatan ASN</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-2xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Dokumentasi Foto MinIO</span>
            <div className="p-2 bg-blue-50 text-blue-800 rounded-xl">
              <FolderOpen className="w-4 h-4 text-blue-700" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 font-mono">
            {galeriItems.filter(g => g.tipe === 'FOTO').length} Foto
          </p>
          <p className="text-[11px] text-slate-500">Tersimpan di S3 Storage</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-2xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Video & Reels Kegiatan</span>
            <div className="p-2 bg-rose-50 text-rose-800 rounded-xl">
              <Play className="w-4 h-4 text-rose-600" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 font-mono">
            {galeriItems.filter(g => isVideoItem(g)).length} Video
          </p>
          <p className="text-[11px] text-slate-500">YouTube, Instagram & TikTok</p>
        </div>
      </div>

      {/* 2. MAIN CARD TABLE & GRID */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
        
        {/* Table & Header Toolbar */}
        <div className="p-5 sm:p-6 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/50">
          <div>
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-emerald-800" />
              <span>Manajemen Galeri Media & Dokumentasi ASN</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Pusat penyimpanan foto MinIO serta video dokumentasi (YouTube, Instagram Reels, TikTok) resmi BKPSDM Kabupaten Aceh Tamiang.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => { resetModal(); setShowModal(true); }}
              className="px-4 py-2.5 bg-emerald-800 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition-all hover:scale-[1.02] cursor-pointer"
            >
              <Plus className="w-4 h-4 text-amber-300" />
              <span>Tambah Media Baru</span>
            </button>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="p-4 bg-white border-b border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Cari judul media, kegiatan, album..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none"
            />
          </div>

          {/* Type Filter Pills & View Switcher */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-xs font-bold bg-slate-100 p-1 rounded-xl">
              {[
                { id: 'ALL', label: 'Semua' },
                { id: 'FOTO', label: 'Foto' },
                { id: 'VIDEO', label: 'Video' }
              ].map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => { setActiveTab(t.id); setPage(1); }}
                  className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                    activeTab === t.id
                      ? 'bg-white text-emerald-800 shadow-2xs font-black'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs">
              <button
                type="button"
                onClick={() => setViewMode('table')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                  viewMode === 'table' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500'
                }`}
                title="Tampilan Tabel Berkas"
              >
                Tabel
              </button>
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                  viewMode === 'grid' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500'
                }`}
                title="Tampilan Kartu Grid"
              >
                Grid
              </button>
            </div>
          </div>

        </div>

        {/* 3. TABLE VIEW */}
        {viewMode === 'table' ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="px-5 py-3">Pratinjau & Judul Media</th>
                  <th className="px-4 py-3">Tipe</th>
                  <th className="px-4 py-3">Album / Kegiatan</th>
                  <th className="px-4 py-3">Tanggal Unggah</th>
                  <th className="px-5 py-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="px-5 py-12 text-center text-slate-400">
                      <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-emerald-600" />
                      <span>Memuat media galeri...</span>
                    </td>
                  </tr>
                ) : galeriItems.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-5 py-12 text-center text-slate-400">
                      <AlertCircle className="w-6 h-6 mx-auto mb-2 text-slate-300" />
                      <span>Belum ada foto atau video yang diunggah pada kriteria ini.</span>
                    </td>
                  </tr>
                ) : (
                  galeriItems.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                      
                      {/* Media Thumb & Title */}
                      <td className="px-5 py-3.5 max-w-sm">
                        <div className="flex items-center gap-3">
                          <div 
                            onClick={() => setPreviewMedia(item)}
                            className="w-12 h-12 rounded-xl bg-slate-900 overflow-hidden shrink-0 cursor-pointer relative group border border-slate-200"
                            title="Klik untuk Preview"
                          >
                            <img
                              src={isYouTubeItem(item) ? getYouTubeThumbnail(getItemYouTubeId(item)) : item.media_url}
                              alt={item.judul}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                              onError={(e) => { e.currentTarget.src = '/hero-tamiang.jpg'; }}
                            />
                            {isYouTubeItem(item) && (
                              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                <Play className="w-3.5 h-3.5 text-white fill-white" />
                              </div>
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <button
                              type="button"
                              onClick={() => setPreviewMedia(item)}
                              className="font-bold text-slate-900 hover:text-emerald-800 text-left truncate max-w-[260px] block transition-colors cursor-pointer"
                              title={item.judul}
                            >
                              {item.judul}
                            </button>
                            <p className="text-[11px] text-slate-400 font-mono truncate max-w-[260px]" title={item.media_url}>
                              {item.media_url}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Type Badge */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                          isVideoItem(item)
                            ? getItemPlatform(item) === 'INSTAGRAM'
                              ? 'bg-pink-50 text-pink-700 border-pink-200'
                              : getItemPlatform(item) === 'TIKTOK'
                                ? 'bg-slate-900 text-white border-slate-700'
                                : 'bg-red-50 text-red-700 border-red-200'
                            : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        }`}>
                          {isVideoItem(item) ? getItemPlatform(item) : item.tipe}
                        </span>
                      </td>

                      {/* Album */}
                      <td className="px-4 py-3.5 font-medium text-slate-600 whitespace-nowrap">
                        {item.album || 'Kegiatan Kedinasan'}
                      </td>

                      {/* Created At */}
                      <td className="px-4 py-3.5 text-slate-500 font-mono text-[11px] whitespace-nowrap">
                        {item.created_at ? new Date(item.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'}
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-3.5 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          
                          {/* Preview button */}
                          <button
                            type="button"
                            onClick={() => setPreviewMedia(item)}
                            className="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-lg text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer"
                            title="Pratinjau Media"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Preview</span>
                          </button>

                          {/* Detail button */}
                          <button
                            type="button"
                            onClick={() => setDetailMedia(item)}
                            className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 rounded-lg text-[11px] font-semibold flex items-center gap-1 transition-all cursor-pointer"
                            title="Detail Rincian"
                          >
                            <Info className="w-3.5 h-3.5 text-slate-500" />
                            <span>Detail</span>
                          </button>

                          {/* Copy URL */}
                          <button
                            type="button"
                            onClick={() => copyUrl(item.media_url, item.id)}
                            className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-800 transition-colors"
                            title="Salin Tautan Media"
                          >
                            {copiedId === item.id ? (
                              <Check className="w-4 h-4 text-emerald-600" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </button>

                          {/* Edit button */}
                          <button
                            type="button"
                            onClick={() => openEditModal(item)}
                            className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-600 hover:text-emerald-800 transition-colors cursor-pointer"
                            title="Edit Media"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>

                          {/* Delete button */}
                          <button
                            type="button"
                            onClick={async () => {
                              const ok = await confirm({
                                title: 'Hapus Media Galeri',
                                message: `Apakah Anda yakin ingin menghapus media "${item.judul}" dari galeri?`,
                                confirmText: 'Ya, Hapus Media',
                                variant: 'danger'
                              });
                              if (ok) {
                                deleteMutation.mutate(item.id);
                              }
                            }}
                            className="p-1.5 hover:bg-red-50 rounded-lg text-red-500 hover:text-red-700 transition-colors cursor-pointer"
                            title="Hapus Media"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>

                        </div>
                      </td>

                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        ) : (
          /* 4. GRID VIEW */
          <div className="p-6">
            {isLoading ? (
              <div className="p-12 text-center text-xs text-slate-400">
                <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-emerald-600" />
                <span>Memuat galeri media...</span>
              </div>
            ) : galeriItems.length === 0 ? (
              <div className="p-12 text-center text-xs text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                <AlertCircle className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                <span>Belum ada foto atau video kegiatan. Klik <strong>Tambah Media Baru</strong> di atas untuk mengunggah.</span>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {galeriItems.map((g) => (
                  <div key={g.id} className="rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-2xs relative group flex flex-col justify-between hover:border-emerald-300 transition-all">
                    
                    {/* Media Thumbnail Container */}
                    <div className="relative h-44 w-full bg-slate-900 overflow-hidden">
                      {isVideoItem(g) ? (
                        playingVideo === g.id ? (
                          <iframe
                            src={getEmbedUrl(g.media_url, getItemPlatform(g))}
                            title={g.judul}
                            className="w-full h-full border-0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        ) : (
                          <div 
                            className="relative w-full h-full cursor-pointer bg-slate-950 flex items-center justify-center"
                            onClick={() => setPlayingVideo(g.id)}
                          >
                            {getItemPlatform(g) === 'YOUTUBE' && extractYouTubeId(g.media_url) ? (
                              <img
                                src={getVideoThumbnail(g.media_url, 'YOUTUBE')}
                                alt={g.judul}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                              />
                            ) : (
                              <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-gradient-to-br from-slate-900 to-slate-800 text-center">
                                <Video className="w-8 h-8 text-rose-400 mb-1" />
                                <span className="text-[11px] font-bold text-white line-clamp-1">{g.judul}</span>
                                <span className="text-[9px] text-slate-400 font-mono mt-0.5">{getItemPlatform(g)}</span>
                              </div>
                            )}
                            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                              <div className={`w-11 h-11 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform ${
                                getItemPlatform(g) === 'INSTAGRAM' ? 'bg-gradient-to-tr from-yellow-500 via-pink-500 to-purple-600' :
                                getItemPlatform(g) === 'TIKTOK' ? 'bg-black border border-slate-700' : 'bg-red-600'
                              }`}>
                                <Play className="w-5 h-5 text-white fill-white ml-0.5" />
                              </div>
                            </div>
                            <span className={`absolute top-2 left-2 text-white text-[9px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 shadow ${
                              getItemPlatform(g) === 'INSTAGRAM' ? 'bg-pink-600' :
                              getItemPlatform(g) === 'TIKTOK' ? 'bg-slate-900 border border-slate-700' : 'bg-red-600'
                            }`}>
                              <Video className="w-3 h-3" /> {getItemPlatform(g)}
                            </span>
                          </div>
                        )
                      ) : (
                        <div 
                          className="relative w-full h-full cursor-pointer"
                          onClick={() => setPreviewMedia(g)}
                        >
                          <img
                            src={g.media_url}
                            alt={g.judul}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            onError={(e) => { e.currentTarget.src = '/hero-tamiang.jpg'; }}
                          />
                          <span className="absolute top-2 left-2 bg-emerald-950/80 backdrop-blur-xs text-emerald-300 border border-emerald-500/30 text-[9px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 shadow">
                            <ImageIcon className="w-3 h-3" /> MinIO Foto
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Content Info */}
                    <div className="p-3.5 space-y-1">
                      <h4 
                        onClick={() => setPreviewMedia(g)}
                        className="text-xs font-bold text-slate-900 truncate hover:text-emerald-800 cursor-pointer" 
                        title={g.judul}
                      >
                        {g.judul}
                      </h4>
                      <p className="text-[10px] text-slate-500 truncate">{g.album || 'Kegiatan Kedinasan'}</p>
                    </div>

                    {/* Card Actions Footer */}
                    <div className="px-3.5 py-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-1 text-xs">
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => setPreviewMedia(g)}
                          className="p-1 hover:bg-slate-200 rounded text-slate-600"
                          title="Pratinjau"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDetailMedia(g)}
                          className="p-1 hover:bg-slate-200 rounded text-slate-600"
                          title="Detail Rincian"
                        >
                          <Info className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => copyUrl(g.media_url, g.id)}
                          className="p-1 hover:bg-slate-200 rounded text-slate-600"
                          title="Salin Tautan"
                        >
                          {copiedId === g.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => openEditModal(g)}
                          className="p-1 hover:bg-slate-200 rounded text-slate-600"
                          title="Ubah Media"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={async () => {
                            const ok = await confirm({
                              title: 'Hapus Media',
                              message: `Hapus media "${g.judul}"?`,
                              confirmText: 'Ya, Hapus',
                              variant: 'danger'
                            });
                            if (ok) deleteMutation.mutate(g.id);
                          }}
                          className="p-1 hover:bg-red-100 rounded text-red-600"
                          title="Hapus"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-600">
            <span>Halaman {page} dari {totalPages} ({totalItems} berkas media)</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
                className="px-3 py-1 bg-white border border-slate-200 rounded-lg disabled:opacity-40"
              >
                Sebelumnya
              </button>
              <button
                type="button"
                disabled={page >= totalPages}
                onClick={() => setPage(page + 1)}
                className="px-3 py-1 bg-white border border-slate-200 rounded-lg disabled:opacity-40"
              >
                Berikutnya
              </button>
            </div>
          </div>
        )}

      </div>

      {/* === 5. ADD / EDIT MEDIA MODAL === */}
      {showModal && (
        <div 
          className="fixed inset-0 bg-slate-950/75 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-6 animate-fadeIn"
          onClick={resetModal}
        >
          <div 
            className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full max-h-[92vh] overflow-y-auto shadow-2xl space-y-4 border border-slate-200 animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-black text-slate-900">
                  {editingItem ? 'Edit Media Galeri' : 'Tambah Media Baru ke Galeri'}
                </h3>
                <p className="text-[11px] text-slate-500">Unggah ke MinIO S3 atau embed link YouTube</p>
              </div>
              <button onClick={resetModal} className="p-1.5 hover:bg-slate-100 rounded-xl cursor-pointer">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            {/* Media Type Switcher */}
            <div className="flex bg-slate-100 rounded-xl p-1 gap-1">
              <button
                type="button"
                onClick={() => { setMediaType('FOTO'); setYoutubeUrl(''); }}
                className={`flex-1 py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  mediaType === 'FOTO'
                    ? 'bg-white text-emerald-800 shadow-xs'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <ImageIcon className="w-3.5 h-3.5" />
                Upload Foto (MinIO)
              </button>
              <button
                type="button"
                onClick={() => { setMediaType('VIDEO'); setSelectedFile(null); setPreview(null); setCompressionInfo(null); }}
                className={`flex-1 py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  mediaType === 'VIDEO'
                    ? 'bg-white text-rose-700 shadow-xs'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <Play className="w-3.5 h-3.5" />
                Video (YouTube / IG / TikTok)
              </button>
            </div>

            {/* === FOTO: Drag & Drop + Media Library Button === */}
            {mediaType === 'FOTO' && (
              <div className="space-y-2">
                <div
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={() => setDragOver(false)}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
                    dragOver 
                      ? 'border-emerald-500 bg-emerald-50' 
                      : preview 
                        ? 'border-emerald-300 bg-emerald-50/30' 
                        : 'border-slate-200 bg-slate-50 hover:border-emerald-400 hover:bg-emerald-50/50'
                  }`}
                >
                  {preview ? (
                    <div className="space-y-3">
                      <img src={preview} alt="Preview" className="max-h-44 mx-auto rounded-xl shadow-xs object-contain" />
                      {compressionInfo && (
                        <div className="flex items-center justify-center gap-2 text-xs">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span className="text-slate-500">
                            {compressionInfo.original} → <strong className="text-emerald-700">{compressionInfo.compressed}</strong>
                            <span className="ml-1 text-emerald-600 font-bold">(-{compressionInfo.savings}%)</span>
                          </span>
                        </div>
                      )}
                      <p className="text-[11px] text-slate-400">Klik untuk ganti foto</p>
                    </div>
                  ) : (
                    <div className="space-y-2 py-4">
                      <UploadCloud className="w-10 h-10 text-slate-300 mx-auto" />
                      <p className="text-sm font-bold text-slate-600">Drag & drop foto di sini</p>
                      <p className="text-xs text-slate-400">atau klik untuk pilih berkas (JPG, PNG, WebP)</p>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-1">
                  <button
                    type="button"
                    onClick={() => setIsMediaModalOpen(true)}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors"
                  >
                    <FolderOpen className="w-3.5 h-3.5 text-amber-500" />
                    <span>Pilih dari Galeri MinIO yang Ada</span>
                  </button>
                  {preview && (
                    <button
                      type="button"
                      onClick={() => { setSelectedFile(null); setPreview(null); }}
                      className="text-xs text-red-500 hover:underline font-bold"
                    >
                      Hapus Pilihan
                    </button>
                  )}
                </div>

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={(e) => handleFileSelect(e.target.files?.[0])}
                  className="hidden"
                  accept=".jpg,.jpeg,.png,.webp,.gif,.svg"
                />
              </div>
            )}

            {/* === VIDEO: Multi-Platform (YouTube, Instagram Reels, TikTok) === */}
            {mediaType === 'VIDEO' && (
              <div className="space-y-3">
                {/* Platform Selection Tabs */}
                <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-bold text-slate-600">
                  <button
                    type="button"
                    onClick={() => setVideoPlatform('YOUTUBE')}
                    className={`flex-1 py-1.5 rounded-lg transition-all ${
                      detectedPlatform === 'YOUTUBE' ? 'bg-red-600 text-white shadow-xs' : 'hover:text-slate-900'
                    }`}
                  >
                    YouTube
                  </button>
                  <button
                    type="button"
                    onClick={() => setVideoPlatform('INSTAGRAM')}
                    className={`flex-1 py-1.5 rounded-lg transition-all ${
                      detectedPlatform === 'INSTAGRAM' ? 'bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-xs' : 'hover:text-slate-900'
                    }`}
                  >
                    Instagram
                  </button>
                  <button
                    type="button"
                    onClick={() => setVideoPlatform('TIKTOK')}
                    className={`flex-1 py-1.5 rounded-lg transition-all ${
                      detectedPlatform === 'TIKTOK' ? 'bg-slate-900 text-white shadow-xs' : 'hover:text-slate-900'
                    }`}
                  >
                    TikTok
                  </button>
                </div>

                {/* Video URL Input */}
                <div className="relative">
                  <input
                    type="text"
                    placeholder={
                      detectedPlatform === 'INSTAGRAM'
                        ? 'Paste URL Reels / Post Instagram (contoh: https://www.instagram.com/reel/xxxx/)'
                        : detectedPlatform === 'TIKTOK'
                          ? 'Paste URL TikTok (contoh: https://www.tiktok.com/@bkpsdm/video/xxxx)'
                          : 'Paste URL YouTube (contoh: https://youtube.com/watch?v=xxxx atau shorts)'
                    }
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    className="w-full p-3 pl-10 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-none"
                  />
                  <Play className="w-4 h-4 text-rose-500 absolute left-3 top-3" />
                </div>

                {/* Video Preview Box */}
                {videoUrl && isVideoUrlValid ? (
                  <div className="rounded-xl overflow-hidden border border-slate-200 bg-black">
                    <iframe
                      src={videoEmbedSrc}
                      title="Video Preview"
                      className={`w-full ${detectedPlatform === 'INSTAGRAM' ? 'h-96' : detectedPlatform === 'TIKTOK' ? 'h-96' : 'h-48'}`}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                    <div className="bg-emerald-50 px-3 py-2 flex items-center justify-between text-xs text-emerald-700">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span className="font-semibold">Platform: <strong>{detectedPlatform}</strong> terverifikasi!</span>
                      </div>
                      <span className="text-[10px] uppercase font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">Embed Siap</span>
                    </div>
                  </div>
                ) : videoUrl ? (
                  <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-800 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>Format tautan belum dikenali. Pastikan memasukkan tautan lengkap dari YouTube, Instagram, atau TikTok.</span>
                  </div>
                ) : null}
              </div>
            )}

            {/* Fields: Judul & Album */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">Judul Dokumentasi *</label>
              <input
                type="text"
                placeholder="Judul foto / video kegiatan"
                value={form.judul}
                onChange={(e) => setForm({ ...form, judul: e.target.value })}
                className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">Nama Album / Kategori Acara</label>
              <input
                type="text"
                placeholder="Contoh: Pelantikan Pejabat 2026, Seleksi PPPK, dll."
                value={form.album}
                onChange={(e) => setForm({ ...form, album: e.target.value })}
                className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">Keterangan / Caption Singkat (Opsional)</label>
              <textarea
                rows={2}
                placeholder="Keterangan tambahan seputar kegiatan ini..."
                value={form.caption}
                onChange={(e) => setForm({ ...form, caption: e.target.value })}
                className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              />
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={resetModal}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={handleSubmit}
                disabled={uploading || !form.judul.trim()}
                className={`px-5 py-2 text-xs font-bold text-white rounded-xl shadow-xs disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center gap-2 ${
                  mediaType === 'VIDEO' ? 'bg-red-700 hover:bg-red-600' : 'bg-emerald-800 hover:bg-emerald-700'
                }`}
              >
                {uploading ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Menyimpan ke MinIO...</span>
                  </>
                ) : (
                  <span>{editingItem ? 'Simpan Perubahan' : 'Terbitkan ke Galeri'}</span>
                )}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* === 6. MODAL PREVIEW DETAIL DOKUMEN / FOTO / VIDEO === */}
      {previewMedia && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-xs animate-fadeIn"
          onClick={() => setPreviewMedia(null)}
        >
          <div 
            className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between gap-4 shrink-0">
              <div className="min-w-0">
                <h3 className="text-sm font-black text-slate-900 truncate">{previewMedia.judul}</h3>
                <p className="text-[11px] text-slate-500 font-mono truncate">
                  Album: {previewMedia.album} &bull; Tipe: {previewMedia.tipe}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setPreviewMedia(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body: Viewer */}
            <div className="flex-1 overflow-auto p-4 sm:p-6 bg-slate-950 flex items-center justify-center min-h-[350px]">
              {isVideoItem(previewMedia) ? (
                <div className={`w-full ${getItemPlatform(previewMedia) === 'YOUTUBE' ? 'h-[60vh] max-h-[500px]' : 'h-[75vh] max-h-[620px] max-w-md mx-auto'}`}>
                  <iframe
                    src={getEmbedUrl(previewMedia.media_url, getItemPlatform(previewMedia))}
                    title={previewMedia.judul}
                    className="w-full h-full border-0 rounded-2xl bg-black"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              ) : (
                <img
                  src={previewMedia.media_url}
                  alt={previewMedia.judul}
                  className="max-h-[70vh] max-w-full rounded-2xl shadow-xl object-contain"
                  onError={(e) => { e.currentTarget.src = '/hero-tamiang.jpg'; }}
                />
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3 bg-white border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span className="truncate max-w-md">
                Tautan: <code className="bg-slate-100 px-2 py-0.5 rounded text-[11px] font-mono select-all">{previewMedia.media_url}</code>
              </span>
              <button
                type="button"
                onClick={() => copyUrl(previewMedia.media_url, 'modal')}
                className="text-emerald-800 hover:text-emerald-900 font-bold flex items-center gap-1 cursor-pointer shrink-0"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Salin Tautan</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* === 7. MODAL DETAIL RINCIAN MEDIA === */}
      {detailMedia && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-xs animate-fadeIn"
          onClick={() => setDetailMedia(null)}
        >
          <div 
            className="bg-white rounded-3xl max-w-xl w-full flex flex-col shadow-2xl overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-100">
                  <Info className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Detail & Metadata Media Galeri</h3>
                  <p className="text-[11px] text-slate-500">Rincian berkas MinIO dan dokumentasi kegiatan</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setDetailMedia(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-xl cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs text-slate-700">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Judul Media</span>
                <p className="font-bold text-slate-900 text-sm mt-0.5 break-words">{detailMedia.judul}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Tipe Format</span>
                  <p className="font-bold text-emerald-800 mt-0.5">{detailMedia.tipe}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Nama Album</span>
                  <p className="font-bold text-slate-800 mt-0.5">{detailMedia.album || 'Kegiatan Kedinasan'}</p>
                </div>
              </div>

              {detailMedia.caption && (
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Caption / Deskripsi</span>
                  <p className="text-slate-700 mt-0.5">{detailMedia.caption}</p>
                </div>
              )}

              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">URL Sumber Media</span>
                <div className="flex items-center gap-2 mt-1">
                  <input
                    type="text"
                    readOnly
                    value={detailMedia.media_url}
                    className="w-full bg-slate-50 text-[11px] font-mono px-3 py-2 rounded-xl border border-slate-200 text-slate-700 select-all"
                  />
                  <button
                    type="button"
                    onClick={() => copyUrl(detailMedia.media_url, detailMedia.id)}
                    className="px-3 py-2 bg-emerald-800 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shrink-0 flex items-center gap-1.5"
                  >
                    {copiedId === detailMedia.id ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedId === detailMedia.id ? 'Tersalin' : 'Salin'}</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  const m = detailMedia;
                  setDetailMedia(null);
                  setPreviewMedia(m);
                }}
                className="px-3.5 py-1.5 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5"
              >
                <Eye className="w-3.5 h-3.5 text-emerald-700" />
                <span>Buka Pratinjau Penuh</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  const m = detailMedia;
                  setDetailMedia(null);
                  openEditModal(m);
                }}
                className="px-4 py-1.5 bg-emerald-800 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold"
              >
                Edit Media Ini
              </button>
            </div>
          </div>
        </div>
      )}

      {/* === 8. MEDIA LIBRARY PICKER === */}
      <MediaLibraryModal
        isOpen={isMediaModalOpen}
        onClose={() => setIsMediaModalOpen(false)}
        singleSelect={true}
        onlyImages={true}
        title="Pilih Foto Kegiatan dari Galeri MinIO"
        confirmText="Gunakan Foto Ini"
        onSelectFiles={(files) => {
          const fileArr = Array.isArray(files) ? files : (files?.files || [files]);
          const selected = fileArr[0];
          if (selected?.file_url) {
            const rawUrl = selected.file_url;
            const fullUrl = rawUrl?.startsWith('http') ? rawUrl : `${window.location.origin}${rawUrl?.startsWith('/') ? '' : '/'}${rawUrl}`;
            setPreview(fullUrl);
          }
          setIsMediaModalOpen(false);
        }}
      />

    </div>
  );
}
