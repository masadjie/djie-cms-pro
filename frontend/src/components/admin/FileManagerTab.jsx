import React, { useState, useRef } from 'react';
import { compressImageToWebP, formatBytes as formatBytesUtil } from '../../utils/imageCompressor';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../services/api';
import {
  FolderOpen,
  UploadCloud,
  FileText,
  FileSpreadsheet,
  Image as ImageIcon,
  FileCheck,
  Download,
  Trash2,
  Copy,
  Check,
  Search,
  HardDrive,
  Activity,
  Layers,
  Sparkles,
  ExternalLink,
  Plus,
  RefreshCw,
  Eye,
  Info,
  X,
  CheckSquare,
  AlertTriangle,
  AlertCircle
} from 'lucide-react';
import { useConfirm } from '../common/ConfirmDialog';

export default function FileManagerTab() {
  const confirm = useConfirm();
  const queryClient = useQueryClient();
  const fileInputRef = useRef(null);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedExt, setSelectedExt] = useState('ALL');
  const [page, setPage] = useState(1);
  const [copiedId, setCopiedId] = useState(null);
  const [uploadCategory, setUploadCategory] = useState('SURAT_EDARAN');
  const [customName, setCustomName] = useState('');
  const [uploading, setUploading] = useState(false);
  const [statusToast, setStatusToast] = useState('');
  const [previewFile, setPreviewFile] = useState(null);
  const [detailFile, setDetailFile] = useState(null);

  const [selectedFileIds, setSelectedFileIds] = useState([]);

  // 1. Fetch Storage Stats
  const { data: statsData } = useQuery({
    queryKey: ['storageStats'],
    queryFn: async () => {
      const res = await api.get('/storage/stats');
      return res?.data || null;
    }
  });

  // 2. Fetch Files List
  const { data: filesData, isLoading, isRefetching } = useQuery({
    queryKey: ['storageFilesList', page, search, selectedCategory, selectedExt],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: String(page),
        limit: '15'
      });
      if (search) params.append('search', search);
      if (selectedCategory !== 'ALL') params.append('kategori', selectedCategory);
      if (selectedExt !== 'ALL') params.append('ext', selectedExt);

      const res = await api.get(`/storage/files?${params.toString()}`);
      return res || { data: [], total: 0, totalPages: 1 };
    }
  });

  // 3. Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      return await api.delete(`/storage/files/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['storageFilesList'] });
      queryClient.invalidateQueries({ queryKey: ['storageStats'] });
      setStatusToast('File berhasil dihapus dari MinIO dan database.');
      setTimeout(() => setStatusToast(''), 3000);
    }
  });

  // 3b. Bulk Delete Mutation
  const bulkDeleteMutation = useMutation({
    mutationFn: async (ids) => {
      return await api.post('/storage/files/bulk-delete', { ids });
    },
    onSuccess: (res) => {
      setSelectedFileIds([]);
      queryClient.invalidateQueries({ queryKey: ['storageFilesList'] });
      queryClient.invalidateQueries({ queryKey: ['storageStats'] });
      setStatusToast(res?.message || 'Berkas terpilih berhasil dihapus massal dari MinIO.');
      setTimeout(() => setStatusToast(''), 3000);
    },
    onError: (err) => {
      alert('Gagal menghapus massal berkas: ' + (err?.response?.data?.message || err.message));
    }
  });

  const fileList = filesData?.data || [];
  const isAllCurrentSelected = fileList.length > 0 && fileList.every((f) => selectedFileIds.includes(f.id));
  const isSomeCurrentSelected = fileList.some((f) => selectedFileIds.includes(f.id)) && !isAllCurrentSelected;

  const handleSelectAllCurrentPage = () => {
    const currentIds = fileList.map((f) => f.id);
    const allSelected = currentIds.every((id) => selectedFileIds.includes(id));
    if (allSelected) {
      setSelectedFileIds((prev) => prev.filter((id) => !currentIds.includes(id)));
    } else {
      setSelectedFileIds((prev) => Array.from(new Set([...prev, ...currentIds])));
    }
  };

  const handleToggleSelect = (id) => {
    setSelectedFileIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleBulkDelete = async () => {
    if (selectedFileIds.length === 0) return;
    const ok = await confirm({
      title: 'Hapus Massal Berkas MinIO',
      message: `Apakah Anda yakin ingin menghapus ${selectedFileIds.length} berkas yang dipilih sekaligus dari object storage MinIO dan database? Tindakan ini permanen dan tidak dapat dibatalkan.`,
      confirmText: `Ya, Hapus ${selectedFileIds.length} Berkas`,
      variant: 'danger'
    });
    if (ok) {
      bulkDeleteMutation.mutate(selectedFileIds);
    }
  };

  // 4. Handle Direct File Upload with client-side compression
  const ALLOWED_EXTS = /\.(pdf|docx?|xlsx?|pptx?|csv|txt|zip|rar|jpe?g|png|webp|gif|svg)$/i;

  const handleFileUpload = async (e) => {
    let file = e.target.files?.[0];
    if (!file) return;

    // Client-side validation by extension
    if (!ALLOWED_EXTS.test(file.name)) {
      alert('Tipe berkas tidak didukung. Format yang diizinkan: PDF, Word (DOC/DOCX), Excel (XLS/XLSX), PPT/PPTX, CSV, ZIP/RAR, dan Gambar.');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    setUploading(true);
    try {
      // Compress image to WebP (PDF & SVG/GIF will pass through unchanged)
      if (file.type.startsWith('image/')) {
        const original = file;
        file = await compressImageToWebP(file);
        if (file !== original) {
          console.log(`Compressed: ${formatBytesUtil(original.size)} → ${formatBytesUtil(file.size)} (${Math.round((1 - file.size / original.size) * 100)}% smaller)`);
        }
      }

      const formData = new FormData();
      formData.append('file', file);
      formData.append('nama_lampiran', customName || file.name);
      formData.append('kategori_dokumen', uploadCategory);

      await api.post('/storage/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      queryClient.invalidateQueries({ queryKey: ['storageFilesList'] });
      queryClient.invalidateQueries({ queryKey: ['storageStats'] });
      setCustomName('');
      if (fileInputRef.current) fileInputRef.current.value = '';
      setStatusToast('File berhasil diunggah ke MinIO S3 Object Storage!');
      setTimeout(() => setStatusToast(''), 3500);
    } catch (err) {
      const errMsg = err?.message || (typeof err === 'string' ? err : err?.response?.data?.message) || 'Gagal mengunggah file.';
      alert(errMsg);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Helper formatting size
  const formatBytes = (bytes) => {
    if (!bytes || bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Helper icon by extension
  const getFileIcon = (ext) => {
    const lower = (ext || '').toLowerCase();
    if (lower === 'pdf') return <FileText className="w-5 h-5 text-red-600" />;
    if (['doc', 'docx'].includes(lower)) return <FileCheck className="w-5 h-5 text-blue-600" />;
    if (['xls', 'xlsx', 'csv'].includes(lower)) return <FileSpreadsheet className="w-5 h-5 text-emerald-600" />;
    if (['jpg', 'jpeg', 'png', 'webp', 'svg'].includes(lower)) return <ImageIcon className="w-5 h-5 text-amber-600" />;
    return <FolderOpen className="w-5 h-5 text-slate-500" />;
  };

  const copyFileUrl = (url, id) => {
    const full = `${window.location.origin}${url}`;
    navigator.clipboard.writeText(full);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const stats = statsData?.data || {
    totalFiles: 0,
    totalDownloads: 0,
    totalMegabytes: '0.00',
    distribution: { pdf: 0, documents: 0, spreadsheets: 0, images: 0 }
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

      {/* 1. MINIO S3 OBJECT STORAGE METRICS HEADER */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Total Files */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-2xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Berkas MinIO</span>
            <div className="p-2 bg-emerald-50 text-emerald-800 rounded-xl">
              <FolderOpen className="w-4 h-4 text-emerald-700" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 font-mono">{stats.totalFiles}</p>
          <p className="text-[11px] text-slate-500">PDF, Dokumen, Lampiran SK</p>
        </div>

        {/* Card 2: Total Size */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-2xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Kapasitas Terpakai</span>
            <div className="p-2 bg-amber-50 text-amber-800 rounded-xl">
              <HardDrive className="w-4 h-4 text-amber-700" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 font-mono">{stats.totalMegabytes} MB</p>
          <p className="text-[11px] text-slate-500">Bucket: <code className="text-emerald-800 font-bold">{statsData?.data?.bucket || 'djie-cms-attachments'}</code></p>
        </div>

        {/* Card 3: Total Downloads */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-2xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Diunduh ASN</span>
            <div className="p-2 bg-blue-50 text-blue-800 rounded-xl">
              <Download className="w-4 h-4 text-blue-700" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 font-mono">{stats.totalDownloads}x</p>
          <p className="text-[11px] text-slate-500">Statistik unduhan publik</p>
        </div>

        {/* Card 4: MinIO S3 Engine Status */}
        <div className="bg-gradient-to-br from-emerald-900 to-teal-950 p-5 rounded-3xl text-white shadow-sm space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-200">Engine Object Storage</span>
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
          </div>
          <p className="text-base font-black text-amber-300">MinIO S3 Cluster</p>
          <div className="flex items-center justify-between text-[10px] text-emerald-200 pt-1">
            <span>Port: 9000 (API) &bull; 9001</span>
            <span className="bg-emerald-800/80 px-2 py-0.5 rounded font-mono font-bold text-emerald-100">ONLINE</span>
          </div>
        </div>

      </div>

      {/* 2. UPLOAD BOX & DROPZONE */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <UploadCloud className="w-4 h-4 text-emerald-700" />
              <span>Unggah Berkas Baru ke MinIO Object Storage</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Mendukung PDF dan Gambar (JPG, PNG, WebP, GIF, SVG). Gambar otomatis dikompresi ke WebP (Maks. 50MB).
            </p>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={uploadCategory}
              onChange={(e) => setUploadCategory(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-600"
            >
              <option value="SURAT_EDARAN">Surat Edaran</option>
              <option value="JUKNIS">Petunjuk Teknis (Juknis)</option>
              <option value="SK">Keputusan / SK</option>
              <option value="FORMULIR">Formulir / Blangko</option>
              <option value="LAMPIRAN_RESMI">Lampiran Berita Umum</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-3">
          <input
            type="text"
            placeholder="Nama tampilan berkas (opsional, contoh: SE Kenaikan Pangkat Periode 2026.pdf)..."
            value={customName}
            onChange={(e) => setCustomName(e.target.value)}
            className="flex-1 p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none text-slate-800"
          />

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            className="hidden"
            accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.csv,.txt,.zip,.rar,.jpg,.jpeg,.png,.webp,.gif,.svg"
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="w-full md:w-auto px-5 py-2.5 bg-emerald-800 hover:bg-emerald-700 active:scale-95 text-white text-xs font-bold rounded-xl transition-all shadow-sm cursor-pointer flex items-center justify-center gap-2"
          >
            {uploading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-amber-300" />
                <span>Mengunggah ke MinIO...</span>
              </>
            ) : (
              <>
                <Plus className="w-4 h-4 text-amber-300" />
                <span>Pilih & Unggah Berkas</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 3. FILE LIST & TABLE CONTROLS */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden flex flex-col">
        
        {/* Filters Bar */}
        <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50/50 flex flex-wrap items-center justify-between gap-3">
          
          {/* Search Box */}
          <div className="relative flex-1 min-w-[240px] max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Cari berkas berdasarkan nama atau filename..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full pl-10 pr-4 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none"
            />
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs font-bold">
            {[
              { id: 'ALL', label: 'Semua Kategori' },
              { id: 'SURAT_EDARAN', label: 'Surat Edaran' },
              { id: 'JUKNIS', label: 'Juknis' },
              { id: 'SK', label: 'SK Resmi' },
              { id: 'FORMULIR', label: 'Formulir' }
            ].map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  setSelectedCategory(cat.id);
                  setPage(1);
                }}
                className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-emerald-800 text-white shadow-2xs'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

        </div>

        {/* Bulk Selection Notification Bar */}
        {selectedFileIds.length > 0 && (
          <div className="px-5 py-3 bg-red-50 border-b border-red-200 flex flex-wrap items-center justify-between gap-3 text-xs text-red-900 animate-fadeIn">
            <div className="flex items-center gap-2 font-bold">
              <CheckSquare className="w-4 h-4 text-red-600" />
              <span>{selectedFileIds.length} berkas dipilih dari penyimpanan MinIO.</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setSelectedFileIds([])}
                className="px-3 py-1.5 text-slate-600 hover:bg-red-100 rounded-xl font-bold cursor-pointer transition-colors"
              >
                Batal Pilih
              </button>
              <button
                type="button"
                onClick={handleBulkDelete}
                disabled={bulkDeleteMutation.isPending}
                className="px-4 py-1.5 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white rounded-xl font-bold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{bulkDeleteMutation.isPending ? 'Menghapus...' : `Hapus (${selectedFileIds.length}) Berkas Terpilih`}</span>
              </button>
            </div>
          </div>
        )}

        {/* Files Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="px-4 py-3 text-center w-10">
                  <div className="flex items-center justify-center">
                    <input
                      type="checkbox"
                      checked={isAllCurrentSelected}
                      ref={(el) => { if (el) el.indeterminate = isSomeCurrentSelected; }}
                      onChange={handleSelectAllCurrentPage}
                      className="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                      title="Pilih Semua Halaman Ini"
                    />
                  </div>
                </th>
                <th className="px-4 py-3">Nama Berkas & Dokumen</th>
                <th className="px-4 py-3">Kategori</th>
                <th className="px-4 py-3">Ukuran</th>
                <th className="px-4 py-3">Tautan Berita</th>
                <th className="px-4 py-3 text-center">Diunduh</th>
                <th className="px-5 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-5 py-10 text-center text-slate-400">
                    <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-emerald-600" />
                    <span>Memuat daftar berkas MinIO...</span>
                  </td>
                </tr>
              ) : filesData?.data?.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-10 text-center text-slate-400">
                    <AlertCircle className="w-6 h-6 mx-auto mb-2 text-slate-300" />
                    <span>Belum ada berkas yang diunggah pada kategori ini.</span>
                  </td>
                </tr>
              ) : (
                filesData?.data?.map((file) => (
                  <tr 
                    key={file.id} 
                    className={`transition-colors ${
                      selectedFileIds.includes(file.id) ? 'bg-red-50/50 hover:bg-red-50/80' : 'hover:bg-slate-50/80'
                    }`}
                  >
                    
                    {/* Checkbox */}
                    <td className="px-4 py-3.5 text-center">
                      <div className="flex items-center justify-center">
                        <input
                          type="checkbox"
                          checked={selectedFileIds.includes(file.id)}
                          onChange={() => handleToggleSelect(file.id)}
                          className="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                        />
                      </div>
                    </td>

                    {/* Filename & Icon */}
                    <td className="px-4 py-3.5 max-w-xs">
                      <div className="flex items-center gap-3">
                        <div 
                          onClick={() => setPreviewFile(file)}
                          className="p-2 bg-slate-100 hover:bg-emerald-100 rounded-xl shrink-0 cursor-pointer transition-colors"
                          title="Klik untuk Pratinjau"
                        >
                          {getFileIcon(file.file_extension)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <button
                            type="button"
                            onClick={() => setPreviewFile(file)}
                            className="font-bold text-slate-900 hover:text-emerald-800 text-left truncate max-w-[260px] block transition-colors cursor-pointer"
                            title={file.nama_lampiran}
                          >
                            {file.nama_lampiran}
                          </button>
                          <p className="text-[11px] text-slate-400 font-mono truncate max-w-[260px]" title={file.original_filename}>
                            {file.original_filename}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Category Badge */}
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                        {file.kategori_dokumen}
                      </span>
                    </td>

                    {/* Size */}
                    <td className="px-4 py-3.5 font-mono text-slate-600 whitespace-nowrap">
                      {formatBytes(file.file_size_bytes)}
                    </td>

                    {/* Linked Berita */}
                    <td className="px-4 py-3.5">
                      {file.berita ? (
                        <span className="text-[11px] font-semibold text-emerald-800 truncate max-w-[180px] block" title={file.berita.title}>
                          {file.berita.title}
                        </span>
                      ) : (
                        <span className="text-[11px] text-slate-400 italic">Pustaka Umum</span>
                      )}
                    </td>

                    {/* Download count */}
                    <td className="px-4 py-3.5 text-center font-mono font-bold text-slate-700 whitespace-nowrap">
                      {file.downloads_count}x
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-3.5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        
                        {/* Tombol Pratinjau Dokumen */}
                        <button
                          type="button"
                          onClick={() => setPreviewFile(file)}
                          className="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-lg text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer"
                          title="Lihat Pratinjau Dokumen"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Preview</span>
                        </button>

                        {/* Tombol Detail Dokumen */}
                        <button
                          type="button"
                          onClick={() => setDetailFile(file)}
                          className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 rounded-lg text-[11px] font-semibold flex items-center gap-1 transition-all cursor-pointer"
                          title="Lihat Rincian / Detail Berkas"
                        >
                          <Info className="w-3.5 h-3.5 text-slate-500" />
                          <span>Detail</span>
                        </button>

                        {/* Copy URL */}
                        <button
                          type="button"
                          onClick={() => copyFileUrl(file.file_url, file.id)}
                          className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-800 transition-colors"
                          title="Salin Tautan Unduhan"
                        >
                          {copiedId === file.id ? (
                            <Check className="w-4 h-4 text-emerald-600" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>

                        {/* Download direct */}
                        <a
                          href={file.file_url}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-600 hover:text-slate-900 transition-colors"
                          title="Unduh / Buka Dokumen"
                        >
                          <Download className="w-4 h-4" />
                        </a>

                        {/* Delete */}
                        <button
                          type="button"
                          onClick={async () => {
                            const ok = await confirm({
                              title: 'Hapus Berkas dari MinIO',
                              message: `Apakah Anda yakin ingin menghapus berkas "${file.nama_lampiran}" dari penyimpanan MinIO S3?`,
                              confirmText: 'Ya, Hapus Berkas',
                              variant: 'danger'
                            });
                            if (ok) {
                              deleteMutation.mutate(file.id);
                            }
                          }}
                          className="p-1.5 hover:bg-red-50 rounded-lg text-red-500 hover:text-red-700 transition-colors cursor-pointer"
                          title="Hapus Berkas"
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

        {/* Pagination Footer */}
        {filesData?.totalPages > 1 && (
          <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-600">
            <span>Halaman {page} dari {filesData.totalPages} ({filesData.total} berkas)</span>
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
                disabled={page >= filesData.totalPages}
                onClick={() => setPage(page + 1)}
                className="px-3 py-1 bg-white border border-slate-200 rounded-lg disabled:opacity-40"
              >
                Berikutnya
              </button>
            </div>
          </div>
        )}

      </div>

      {/* 5. MODAL DETAIL BERKAS LENGKAP */}
      {detailFile && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-xs animate-fadeIn"
          onClick={() => setDetailFile(null)}
        >
          <div 
            className="bg-white rounded-3xl max-w-xl w-full flex flex-col shadow-2xl overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3 min-w-0">
                <div className="p-2 bg-emerald-50 rounded-xl border border-emerald-200 shrink-0 text-emerald-800">
                  <Info className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Detail & Rincian Berkas</h3>
                  <p className="text-[11px] text-slate-500">Metadata penyimpanan S3 MinIO & database</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setDetailFile(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Body */}
            <div className="p-6 space-y-4 text-xs text-slate-700 overflow-y-auto max-h-[70vh]">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Nama Dokumen / Lampiran</span>
                <p className="font-bold text-slate-900 text-sm mt-0.5 break-words">{detailFile.nama_lampiran}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Kategori Dokumen</span>
                  <p className="font-bold text-emerald-800 mt-0.5">{detailFile.kategori_dokumen}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Ukuran Berkas</span>
                  <p className="font-bold text-slate-800 font-mono mt-0.5">{formatBytes(detailFile.file_size_bytes)}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Format / Ekstensi</span>
                  <p className="font-bold text-slate-800 font-mono uppercase mt-0.5">{detailFile.file_extension || 'N/A'}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Total Unduhan</span>
                  <p className="font-bold text-slate-800 font-mono mt-0.5">{detailFile.downloads_count || 0} kali</p>
                </div>
              </div>

              <div className="pt-2">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Nama File Asli</span>
                <p className="font-mono text-slate-800 bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-[11px] mt-1 break-all select-all">
                  {detailFile.original_filename}
                </p>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Objek MinIO S3 (Path Key)</span>
                <p className="font-mono text-slate-800 bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-[11px] mt-1 break-all select-all">
                  {detailFile.object_name}
                </p>
              </div>

              {detailFile.berita && (
                <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-100">
                  <span className="text-[10px] text-emerald-700 font-bold uppercase">Terhubung dengan Berita:</span>
                  <p className="font-bold text-emerald-900 mt-0.5">{detailFile.berita.title}</p>
                </div>
              )}

              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Tautan Langsung (Direct URL)</span>
                <div className="flex items-center gap-2 mt-1">
                  <input
                    type="text"
                    readOnly
                    value={detailFile.file_url}
                    className="w-full bg-slate-50 text-[11px] font-mono px-3 py-2 rounded-xl border border-slate-200 text-slate-700 select-all"
                  />
                  <button
                    type="button"
                    onClick={() => copyFileUrl(detailFile.file_url, detailFile.id)}
                    className="px-3 py-2 bg-emerald-800 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shrink-0 flex items-center gap-1.5 cursor-pointer transition-all"
                  >
                    {copiedId === detailFile.id ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedId === detailFile.id ? 'Tersalin' : 'Salin'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => {
                  const f = detailFile;
                  setDetailFile(null);
                  setPreviewFile(f);
                }}
                className="px-3.5 py-1.5 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
              >
                <Eye className="w-3.5 h-3.5 text-emerald-700" />
                <span>Buka Preview Dokumen</span>
              </button>
              <div className="flex items-center gap-2">
                <a
                  href={detailFile.file_url}
                  download={detailFile.original_filename}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-1.5 bg-emerald-800 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5 text-amber-300" />
                  <span>Unduh File</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6. DYNAMIC PREVIEW MODAL (GAMBAR / PDF / DOKUMEN) */}
      {previewFile && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-xs animate-fadeIn"
          onClick={() => setPreviewFile(null)}
        >
          <div 
            className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between gap-4 shrink-0">
              <div className="flex items-center gap-3 min-w-0">
                <div className="p-2 bg-white rounded-xl shadow-2xs border border-slate-200 shrink-0">
                  {getFileIcon(previewFile.file_extension)}
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm font-black text-slate-900 truncate">
                    {previewFile.nama_lampiran}
                  </h3>
                  <p className="text-[11px] text-slate-500 font-mono truncate">
                    {previewFile.original_filename} &bull; {formatBytes(previewFile.file_size_bytes)} &bull; {previewFile.kategori_dokumen}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {/* Download Button */}
                <a
                  href={previewFile.file_url}
                  download={previewFile.original_filename}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3.5 py-1.5 bg-emerald-800 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5 text-amber-300" />
                  <span>Unduh</span>
                </a>

                {/* Close Button */}
                <button
                  type="button"
                  onClick={() => setPreviewFile(null)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
                  title="Tutup (Esc)"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body / Viewer */}
            <div className="flex-1 overflow-auto p-4 sm:p-6 bg-slate-100 flex items-center justify-center min-h-[350px]">
              {/* KONDISI 1: GAMBAR (JPG, PNG, WEBP, GIF, SVG) */}
              {['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg'].includes((previewFile.file_extension || '').toLowerCase()) || 
               (previewFile.file_type && previewFile.file_type.startsWith('image/')) ? (
                <div className="flex flex-col items-center justify-center max-w-full">
                  <img
                    src={previewFile.file_url}
                    alt={previewFile.nama_lampiran}
                    className="max-h-[68vh] max-w-full rounded-2xl shadow-md object-contain bg-white border border-slate-200"
                  />
                  <p className="mt-2 text-xs text-slate-500 font-mono">
                    Resolusi penuh dimuat dari MinIO S3
                  </p>
                </div>
              ) : /* KONDISI 2: PDF */
              (previewFile.file_extension || '').toLowerCase() === 'pdf' || 
              previewFile.file_type === 'application/pdf' ? (
                <div className="w-full h-[70vh] rounded-2xl overflow-hidden shadow-inner bg-white border border-slate-300">
                  <iframe
                    src={`${previewFile.file_url}#toolbar=1`}
                    title={previewFile.nama_lampiran}
                    className="w-full h-full border-0"
                  />
                </div>
              ) : /* KONDISI 3: OFFICE DOKUMEN / LAINNYA */ (
                <div className="bg-white p-8 rounded-3xl border border-slate-200 max-w-md w-full text-center space-y-4 shadow-sm">
                  <div className="w-16 h-16 bg-slate-100 text-slate-700 rounded-2xl flex items-center justify-center mx-auto shadow-2xs">
                    {getFileIcon(previewFile.file_extension)}
                  </div>
                  <div>
                    <h4 className="text-base font-black text-slate-900">{previewFile.nama_lampiran}</h4>
                    <p className="text-xs text-slate-500 mt-1">
                      Dokumen format <span className="font-mono font-bold uppercase">{previewFile.file_extension}</span> tidak mendukung pratinjau browser langsung.
                    </p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-600 font-mono text-left space-y-1">
                    <p><span className="text-slate-400">Ukuran:</span> {formatBytes(previewFile.file_size_bytes)}</p>
                    <p><span className="text-slate-400">Kategori:</span> {previewFile.kategori_dokumen}</p>
                    <p><span className="text-slate-400">Total Unduh:</span> {previewFile.downloads_count}x</p>
                  </div>
                  <div className="flex gap-2 justify-center pt-2">
                    <a
                      href={previewFile.file_url}
                      download={previewFile.original_filename}
                      className="px-5 py-2.5 bg-emerald-800 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-2"
                    >
                      <Download className="w-4 h-4 text-amber-300" />
                      <span>Unduh File Sekarang</span>
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3 bg-white border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span className="truncate max-w-md">
                Tautan: <code className="bg-slate-100 px-2 py-0.5 rounded text-[11px] font-mono select-all">{previewFile.file_url}</code>
              </span>
              <button
                type="button"
                onClick={() => copyFileUrl(previewFile.file_url, 'modal')}
                className="text-emerald-800 hover:text-emerald-900 font-bold flex items-center gap-1 cursor-pointer shrink-0"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Salin Tautan</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

