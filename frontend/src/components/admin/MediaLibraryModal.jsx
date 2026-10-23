import React, { useState, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../services/api';
import {
  X,
  UploadCloud,
  FileText,
  FileCheck,
  FileSpreadsheet,
  Image as ImageIcon,
  Check,
  Search,
  Plus,
  RefreshCw,
  FolderOpen
} from 'lucide-react';

export default function MediaLibraryModal({
  isOpen,
  onClose,
  selectedIds = [],
  onSelectFiles,
  singleSelect = false,
  onlyImages = false,
  title = 'Pustaka Dokumen & MinIO Object Storage',
  confirmText
}) {
  const queryClient = useQueryClient();
  const fileInputRef = useRef(null);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [uploading, setUploading] = useState(false);
  const [localSelectedIds, setLocalSelectedIds] = useState(selectedIds);

  // Sync selection state whenever modal is opened or selectedIds prop changes
  React.useEffect(() => {
    if (isOpen) {
      setLocalSelectedIds(Array.isArray(selectedIds) ? selectedIds : []);
    }
  }, [isOpen, selectedIds]);

  // Fetch Files
  const { data: filesData, isLoading } = useQuery({
    queryKey: ['storageFilesModal', search, selectedCategory],
    queryFn: async () => {
      const params = new URLSearchParams({ limit: '60' });
      if (search) params.append('search', search);
      if (selectedCategory !== 'ALL') params.append('kategori', selectedCategory);
      const res = await api.get(`/storage/files?${params.toString()}`);
      return res?.data || [];
    },
    enabled: isOpen
  });

  if (!isOpen) return null;

  // Filter files if onlyImages is true
  const displayedFiles = (filesData || []).filter(f => {
    if (!onlyImages) return true;
    const ext = (f.file_extension || '').toLowerCase();
    return ['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg'].includes(ext);
  });

  // Toggle file selection
  const toggleSelection = (file) => {
    if (singleSelect) {
      if (localSelectedIds.includes(file.id)) {
        setLocalSelectedIds([]);
      } else {
        setLocalSelectedIds([file.id]);
      }
    } else {
      if (localSelectedIds.includes(file.id)) {
        setLocalSelectedIds(localSelectedIds.filter((id) => id !== file.id));
      } else {
        setLocalSelectedIds([...localSelectedIds, file.id]);
      }
    }
  };

  // Immediate selection handler (single-click direct pick or double-click)
  const handleDirectPick = (file) => {
    const list = [file];
    list.ids = [file.id];
    list.files = list;
    if (typeof onSelectFiles === 'function') {
      onSelectFiles(list, list);
    }
    onClose();
  };

  // Upload New File to MinIO
  const handleQuickUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const ALLOWED_EXTS = /\.(pdf|docx?|xlsx?|pptx?|csv|txt|zip|rar|jpe?g|png|webp|gif|svg)$/i;
    if (!ALLOWED_EXTS.test(file.name)) {
      alert('Tipe berkas tidak didukung. Format yang diizinkan: PDF, Word (DOC/DOCX), Excel (XLS/XLSX), PPT/PPTX, CSV, ZIP/RAR, dan Gambar.');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('nama_lampiran', file.name);
    formData.append('kategori_dokumen', onlyImages ? 'GALERI_MEDIA' : 'LAMPIRAN_RESMI');

    setUploading(true);
    try {
      const res = await api.post('/storage/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      queryClient.invalidateQueries({ queryKey: ['storageFilesModal'] });
      queryClient.invalidateQueries({ queryKey: ['storageFilesList'] });
      if (res?.data?.id) {
        if (singleSelect) {
          setLocalSelectedIds([res.data.id]);
        } else {
          setLocalSelectedIds((prev) => [...prev, res.data.id]);
        }
      }
    } catch (err) {
      const errMsg = err?.message || (typeof err === 'string' ? err : err?.response?.data?.message) || 'Gagal mengunggah berkas.';
      alert(errMsg);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleConfirm = () => {
    const selectedFiles = (displayedFiles || []).filter((f) => localSelectedIds.includes(f.id));
    if (typeof onSelectFiles === 'function') {
      selectedFiles.ids = localSelectedIds;
      selectedFiles.files = selectedFiles;
      onSelectFiles(selectedFiles, selectedFiles);
    }
    onClose();
  };

  const getFileIcon = (ext) => {
    const lower = (ext || '').toLowerCase();
    if (lower === 'pdf') return <FileText className="w-5 h-5 text-red-600" />;
    if (['doc', 'docx'].includes(lower)) return <FileCheck className="w-5 h-5 text-blue-600" />;
    if (['xls', 'xlsx', 'csv'].includes(lower)) return <FileSpreadsheet className="w-5 h-5 text-emerald-600" />;
    if (['jpg', 'jpeg', 'png', 'webp', 'svg'].includes(lower)) return <ImageIcon className="w-5 h-5 text-amber-600" />;
    return <FolderOpen className="w-5 h-5 text-slate-500" />;
  };

  const isImageFile = (ext) => ['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg'].includes((ext || '').toLowerCase());

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[85vh] shadow-2xl flex flex-col overflow-hidden">
        
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-emerald-100 text-emerald-800 rounded-xl">
              <FolderOpen className="w-4 h-4 text-emerald-800" />
            </div>
            <div>
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
                {title}
              </h3>
              <p className="text-[11px] text-slate-400">
                {singleSelect ? 'Pilih salah satu berkas atau klik langsung untuk menggunakan.' : 'Pilih lampiran resmi atau unggah berkas baru ke MinIO storage.'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 bg-slate-200 hover:bg-slate-300 rounded-full text-slate-600 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Toolbar & Search */}
        <div className="p-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 bg-white">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Cari berkas dokumen atau media..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-1 focus:ring-emerald-600 focus:outline-none"
            />
          </div>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleQuickUpload}
            className="hidden"
            accept={onlyImages ? 'image/*' : '.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.csv,.txt,.zip,.rar,.jpg,.jpeg,.png,.webp,.gif,.svg'}
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="px-3 py-1.5 bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
          >
            {uploading ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-300" />
                <span>Mengunggah...</span>
              </>
            ) : (
              <>
                <UploadCloud className="w-3.5 h-3.5 text-amber-300" />
                <span>{onlyImages ? 'Unggah Gambar Baru' : 'Unggah Berkas Baru'}</span>
              </>
            )}
          </button>
        </div>

        {/* File Grid */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-2">
          {isLoading ? (
            <div className="py-12 text-center text-slate-400">
              <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-emerald-600" />
              <span className="text-xs">Memuat berkas dari MinIO...</span>
            </div>
          ) : displayedFiles?.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs">
              {onlyImages ? 'Belum ada gambar yang ditemukan di MinIO.' : 'Belum ada berkas yang ditemukan.'}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {displayedFiles?.map((file) => {
                const isSelected = localSelectedIds.includes(file.id);
                const isImg = isImageFile(file.file_extension);
                return (
                  <div
                    key={file.id}
                    onClick={() => toggleSelection(file)}
                    onDoubleClick={() => handleDirectPick(file)}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 group ${
                      isSelected
                        ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-500/20 shadow-2xs'
                        : 'bg-slate-50 border-slate-200 hover:bg-slate-100/90'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center shrink-0 overflow-hidden shadow-2xs">
                        {isImg && file.file_url ? (
                          <img
                            src={file.file_url}
                            alt=""
                            className="w-full h-full object-cover"
                            onError={(e) => { e.currentTarget.style.display = 'none'; }}
                          />
                        ) : (
                          getFileIcon(file.file_extension)
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-bold text-slate-900 text-xs truncate" title={file.nama_lampiran}>
                          {file.nama_lampiran}
                        </p>
                        <p className="text-[10px] text-slate-400 truncate">
                          {file.kategori_dokumen} &bull; {(file.file_size_bytes / 1024).toFixed(0)} KB
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {/* Quick Select Button on Hover */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDirectPick(file);
                        }}
                        className="px-2 py-1 bg-white border border-slate-200 hover:bg-emerald-700 hover:text-white hover:border-emerald-700 rounded-lg text-[10px] font-bold text-slate-600 transition-colors shadow-2xs"
                        title="Langsung pilih berkas ini"
                      >
                        Pilih
                      </button>

                      <div className={`w-5 h-5 rounded-full flex items-center justify-center border transition-all ${
                        isSelected ? 'bg-emerald-800 text-white border-emerald-800' : 'border-slate-300 bg-white'
                      }`}>
                        {isSelected && <Check className="w-3.5 h-3.5" />}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs">
          <span className="text-slate-500 font-semibold">
            {localSelectedIds.length} berkas dipilih
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 hover:bg-slate-200 rounded-xl font-bold cursor-pointer"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              disabled={localSelectedIds.length === 0}
              className="px-4 py-2 bg-emerald-800 hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl font-bold cursor-pointer shadow-xs transition-all"
            >
              {confirmText || (singleSelect ? 'Gunakan Berkas Ini' : `Gunakan Lampiran (${localSelectedIds.length})`)}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
