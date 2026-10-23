import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../services/api';
import { 
  Plus, 
  Trash2, 
  FolderOpen, 
  Download, 
  FileText, 
  Eye, 
  X, 
  Copy, 
  Check, 
  CheckSquare, 
  Square,
  AlertCircle,
  ExternalLink,
  Sparkles
} from 'lucide-react';
import DataTable from '../common/DataTable';
import Badge from '../common/Badge';
import { useConfirm } from '../common/ConfirmDialog';

export default function DokumenManagerTab() {
  const confirm = useConfirm();
  const queryClient = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ judul: '', nomor_surat: '', tahun: 2026, kategori: 'SURAT_EDARAN', file_url: '' });

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('');
  const [kategori, setKategori] = useState('');

  // Bulk selection state
  const [selectedIds, setSelectedIds] = useState([]);
  
  // Preview modal state
  const [previewDoc, setPreviewDoc] = useState(null);
  const [copied, setCopied] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const { data: dokumenData, isLoading } = useQuery({
    queryKey: ['adminDokumenList', page, limit, search, kategori],
    queryFn: async () => {
      try {
        const params = new URLSearchParams({
          page: String(page),
          limit: String(limit)
        });
        if (search) params.append('search', search);
        if (kategori) params.append('kategori', kategori);
        const res = await api.get(`/cms/dokumen?${params.toString()}`);
        return res?.data || res || { data: [], pagination: { total: 0 } };
      } catch (err) {
        return { data: [], pagination: { total: 0 } };
      }
    }
  });

  const docItems = Array.isArray(dokumenData) 
    ? dokumenData 
    : (Array.isArray(dokumenData?.data) ? dokumenData.data : []);

  const totalDocsCount = dokumenData?.pagination?.total 
    || (Array.isArray(dokumenData?.data) ? dokumenData.pagination?.total : 0) 
    || (Array.isArray(dokumenData) ? dokumenData.length : 0) 
    || 0;

  // Create Mutation
  const createMutation = useMutation({
    mutationFn: async (payload) => await api.post('/cms/dokumen', payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminDokumenList'] });
      queryClient.invalidateQueries({ queryKey: ['cmsAnalytics'] });
      setShowModal(false);
      setForm({ judul: '', nomor_surat: '', tahun: 2026, kategori: 'SURAT_EDARAN', file_url: '' });
      setToastMessage('Dokumen berhasil ditambahkan!');
      setTimeout(() => setToastMessage(''), 3000);
    }
  });

  // Single Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: async (id) => await api.delete(`/cms/dokumen/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminDokumenList'] });
      setSelectedIds((prev) => prev.filter((item) => item !== deleteMutation.variables));
      setToastMessage('Dokumen berhasil dihapus.');
      setTimeout(() => setToastMessage(''), 3000);
    }
  });

  // Bulk Delete Mutation
  const bulkDeleteMutation = useMutation({
    mutationFn: async (ids) => await api.post('/cms/dokumen/bulk-delete', { ids }),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['adminDokumenList'] });
      queryClient.invalidateQueries({ queryKey: ['cmsAnalytics'] });
      setSelectedIds([]);
      setToastMessage(res?.message || 'Dokumen terpilih berhasil dihapus massal!');
      setTimeout(() => setToastMessage(''), 3500);
    },
    onError: (err) => {
      alert(err.response?.data?.message || 'Gagal menghapus massal dokumen.');
    }
  });

  // Toggle selection for all currently displayed rows
  const handleSelectAllCurrentPage = () => {
    const currentIds = docItems.map((d) => d.id);
    const allSelected = currentIds.every((id) => selectedIds.includes(id));
    if (allSelected) {
      setSelectedIds((prev) => prev.filter((id) => !currentIds.includes(id)));
    } else {
      setSelectedIds((prev) => Array.from(new Set([...prev, ...currentIds])));
    }
  };

  const handleToggleSelect = (id) => {
    setSelectedIds((prev) => 
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    const ok = await confirm({
      title: 'Hapus Massal Dokumen Publik',
      message: `Apakah Anda yakin ingin menghapus ${selectedIds.length} dokumen terpilih sekaligus? Tindakan ini tidak dapat dibatalkan.`,
      confirmText: `Ya, Hapus ${selectedIds.length} Dokumen`,
      variant: 'danger'
    });
    if (ok) {
      bulkDeleteMutation.mutate(selectedIds);
    }
  };

  const isAllCurrentSelected = docItems.length > 0 && docItems.every((d) => selectedIds.includes(d.id));
  const isSomeCurrentSelected = docItems.some((d) => selectedIds.includes(d.id)) && !isAllCurrentSelected;

  const copyUrl = (url) => {
    const full = url.startsWith('http') ? url : `${window.location.origin}${url}`;
    navigator.clipboard.writeText(full);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Helper to test if file is image
  const isImageFile = (url) => {
    if (!url) return false;
    return /\.(jpe?g|png|webp|gif|svg)(\?.*)?$/i.test(url);
  };

  // Helper to test if file is PDF
  const isPdfFile = (url) => {
    if (!url) return false;
    return /\.pdf(\?.*)?$/i.test(url) || url.includes('/download/documents/');
  };

  const columns = [
    {
      header: (
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
      ),
      width: '45px',
      align: 'center',
      render: (doc) => (
        <div className="flex items-center justify-center">
          <input
            type="checkbox"
            checked={selectedIds.includes(doc.id)}
            onChange={() => handleToggleSelect(doc.id)}
            className="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
          />
        </div>
      )
    },
    {
      header: 'No',
      width: '50px',
      align: 'center',
      render: (_, index) => <span className="font-mono text-slate-400 font-bold">#{index}</span>
    },
    {
      header: 'Nama Dokumen & Regulasi',
      accessor: 'judul',
      render: (doc) => (
        <div className="flex items-center gap-3">
          <div 
            onClick={() => setPreviewDoc(doc)}
            className="p-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-xl shrink-0 cursor-pointer transition-colors shadow-2xs"
            title="Klik untuk Pratinjau Dokumen"
          >
            <FileText className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <button
              type="button"
              onClick={() => setPreviewDoc(doc)}
              className="font-bold text-slate-900 hover:text-emerald-800 text-left transition-colors cursor-pointer block truncate max-w-md"
              title="Klik untuk Pratinjau Dokumen"
            >
              {doc.judul}
            </button>
            <div className="flex items-center gap-2 mt-0.5">
              {doc.file_url && (
                <button
                  type="button"
                  onClick={() => setPreviewDoc(doc)}
                  className="text-[11px] text-emerald-700 hover:text-emerald-900 font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <Eye className="w-3 h-3" />
                  <span>Pratinjau</span>
                </button>
              )}
              {doc.file_url && <span className="text-slate-300">&bull;</span>}
              {doc.file_url && (
                <a 
                  href={doc.file_url} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="text-[11px] text-slate-500 hover:text-slate-800 hover:underline font-mono"
                >
                  Unduh Berkas
                </a>
              )}
            </div>
          </div>
        </div>
      )
    },
    {
      header: 'Nomor Surat',
      accessor: 'nomor_surat',
      render: (doc) => <span className="font-mono text-slate-600 font-medium">{doc.nomor_surat || '-'}</span>
    },
    {
      header: 'Kategori',
      accessor: 'kategori',
      render: (doc) => (
        <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
          {doc.kategori}
        </span>
      )
    },
    {
      header: 'Tahun',
      accessor: 'tahun',
      align: 'center',
      render: (doc) => <span className="font-bold text-slate-700 font-mono">{doc.tahun}</span>
    },
    {
      header: 'Aksi',
      align: 'right',
      render: (doc) => (
        <div className="flex items-center justify-end gap-1.5">
          {/* Quick Preview Button */}
          {doc.file_url && (
            <button
              type="button"
              onClick={() => setPreviewDoc(doc)}
              className="p-1.5 text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
              title="Pratinjau Dokumen"
            >
              <Eye className="w-4 h-4" />
            </button>
          )}

          {/* Direct Download Button */}
          {doc.file_url && (
            <a
              href={doc.file_url}
              target="_blank"
              rel="noreferrer"
              className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              title="Unduh Dokumen"
            >
              <Download className="w-4 h-4" />
            </a>
          )}

          {/* Single Delete Button */}
          <button
            type="button"
            onClick={async () => {
              const ok = await confirm({
                title: 'Hapus Dokumen Publik',
                message: `Apakah Anda yakin ingin menghapus dokumen "${doc.judul}"?`,
                confirmText: 'Ya, Hapus Dokumen',
                variant: 'danger'
              });
              if (ok) {
                deleteMutation.mutate(doc.id);
              }
            }}
            className="text-red-500 hover:text-red-700 p-1.5 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
            title="Hapus Dokumen"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-6 shadow-sm">
      
      {/* Toast Alert */}
      {toastMessage && (
        <div className="p-3.5 bg-emerald-900 text-white rounded-2xl shadow-lg flex items-center gap-2.5 text-xs font-bold animate-bounce">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header and Action Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-black text-slate-900">Dokumen Publik & Regulasi Kepegawaian</h2>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
              {totalDocsCount} Dokumen
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Kelola arsip PDF regulasi resmi, Surat Edaran, Perbup, dan formulir kepegawaian ASN.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          {/* Bulk Delete Trigger Button */}
          {selectedIds.length > 0 && (
            <button
              type="button"
              onClick={handleBulkDelete}
              disabled={bulkDeleteMutation.isPending}
              className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm transition-all animate-fadeIn cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
              <span>Hapus ({selectedIds.length}) Terpilih</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setShowModal(true)}
            className="px-4 py-2.5 bg-emerald-800 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Dokumen</span>
          </button>
        </div>
      </div>

      {/* Bulk Selection Notification Bar */}
      {selectedIds.length > 0 && (
        <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-2xl flex items-center justify-between text-xs text-red-800 animate-fadeIn">
          <div className="flex items-center gap-2 font-bold">
            <CheckSquare className="w-4 h-4 text-red-600" />
            <span>{selectedIds.length} dokumen telah dipilih.</span>
          </div>
          <button
            type="button"
            onClick={() => setSelectedIds([])}
            className="text-red-700 hover:text-red-950 font-bold underline cursor-pointer"
          >
            Batalkan Pilihan
          </button>
        </div>
      )}

      {/* Main Data Table */}
      <DataTable
        columns={columns}
        data={docItems}
        isLoading={isLoading}
        serverSide={true}
        totalItems={totalDocsCount}
        currentPage={page}
        pageSize={limit}
        onPageChange={setPage}
        onPageSizeChange={(newSize) => {
          setLimit(newSize);
          setPage(1);
        }}
        onSearchChange={(query) => {
          setSearch(query);
          setPage(1);
        }}
        onFilterChange={(filters) => {
          setKategori(filters.kategori || '');
          setPage(1);
        }}
        searchPlaceholder="Cari nama dokumen atau nomor surat..."
        filters={[
          {
            key: 'kategori',
            label: 'Kategori',
            options: [
              { label: 'Semua Kategori', value: '' },
              { label: 'SURAT_EDARAN', value: 'SURAT_EDARAN' },
              { label: 'PERBUP', value: 'PERBUP' },
              { label: 'PERATURAN_BUPATI', value: 'PERATURAN_BUPATI' },
              { label: 'JUKNIS', value: 'JUKNIS' },
              { label: 'FORMULIR', value: 'FORMULIR' },
              { label: 'PENGUMUMAN', value: 'PENGUMUMAN' }
            ]
          }
        ]}
        emptyMessage="Belum ada dokumen publik yang terdaftar."
      />

      {/* MODAL 1: PREVIEW DOKUMEN (PDF & GAMBAR) */}
      {previewDoc && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-xs animate-fadeIn"
          onClick={() => setPreviewDoc(null)}
        >
          <div 
            className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between gap-4 shrink-0">
              <div className="flex items-center gap-3 min-w-0">
                <div className="p-2 bg-white rounded-xl shadow-2xs border border-slate-200 shrink-0">
                  <FileText className="w-5 h-5 text-emerald-700" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm font-black text-slate-900 truncate">
                    {previewDoc.judul}
                  </h3>
                  <p className="text-[11px] text-slate-500 font-mono truncate">
                    {previewDoc.nomor_surat || 'Tanpa Nomor Surat'} &bull; Tahun {previewDoc.tahun} &bull; {previewDoc.kategori}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {previewDoc.file_url && (
                  <a
                    href={previewDoc.file_url}
                    download
                    target="_blank"
                    rel="noreferrer"
                    className="px-3.5 py-1.5 bg-emerald-800 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5 text-amber-300" />
                    <span>Unduh</span>
                  </a>
                )}

                <button
                  type="button"
                  onClick={() => setPreviewDoc(null)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
                  title="Tutup (Esc)"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body / Viewer */}
            <div className="flex-1 overflow-auto p-4 sm:p-6 bg-slate-100 flex items-center justify-center min-h-[380px]">
              {!previewDoc.file_url ? (
                <div className="p-8 text-center text-slate-400 space-y-2">
                  <AlertCircle className="w-8 h-8 mx-auto text-amber-500" />
                  <p className="text-sm font-bold text-slate-700">Tautan berkas belum diunggah.</p>
                  <p className="text-xs">Dokumen ini belum memiliki file attachment fisik.</p>
                </div>
              ) : isImageFile(previewDoc.file_url) ? (
                <div className="flex flex-col items-center justify-center max-w-full">
                  <img
                    src={previewDoc.file_url}
                    alt={previewDoc.judul}
                    className="max-h-[68vh] max-w-full rounded-2xl shadow-md object-contain bg-white border border-slate-200"
                  />
                  <p className="mt-2 text-xs text-slate-500 font-mono">
                    Pratinjau Gambar Dokumen
                  </p>
                </div>
              ) : isPdfFile(previewDoc.file_url) ? (
                <div className="w-full h-[70vh] rounded-2xl overflow-hidden shadow-inner bg-white border border-slate-300">
                  <iframe
                    src={`${previewDoc.file_url}#toolbar=1`}
                    title={previewDoc.judul}
                    className="w-full h-full border-0"
                  />
                </div>
              ) : (
                <div className="bg-white p-8 rounded-3xl border border-slate-200 max-w-md w-full text-center space-y-4 shadow-sm">
                  <div className="w-16 h-16 bg-slate-100 text-slate-700 rounded-2xl flex items-center justify-center mx-auto shadow-2xs">
                    <FileText className="w-8 h-8 text-emerald-700" />
                  </div>
                  <div>
                    <h4 className="text-base font-black text-slate-900">{previewDoc.judul}</h4>
                    <p className="text-xs text-slate-500 mt-1">
                      Dokumen dapat diakses dan diunduh langsung melalui tautan di bawah ini.
                    </p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-600 font-mono text-left space-y-1">
                    <p><span className="text-slate-400">Nomor:</span> {previewDoc.nomor_surat || '-'}</p>
                    <p><span className="text-slate-400">Tahun:</span> {previewDoc.tahun}</p>
                    <p><span className="text-slate-400">Kategori:</span> {previewDoc.kategori}</p>
                  </div>
                  <div className="flex gap-2 justify-center pt-2">
                    <a
                      href={previewDoc.file_url}
                      download
                      target="_blank"
                      rel="noreferrer"
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
                Tautan: <code className="bg-slate-100 px-2 py-0.5 rounded text-[11px] font-mono select-all">{previewDoc.file_url || '-'}</code>
              </span>
              {previewDoc.file_url && (
                <button
                  type="button"
                  onClick={() => copyUrl(previewDoc.file_url)}
                  className="text-emerald-800 hover:text-emerald-900 font-bold flex items-center gap-1 cursor-pointer shrink-0"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Tersalin!' : 'Salin Tautan'}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: TAMBAH DOKUMEN BARU */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-4 border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-black text-slate-900">Tambah Dokumen / Surat Edaran</h3>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-slate-500 block mb-1">Nama Dokumen</label>
                <input
                  type="text"
                  placeholder="Contoh: Perbup Tata Kelola Kinerja ASN 2026"
                  value={form.judul}
                  onChange={(e) => setForm({ ...form, judul: e.target.value })}
                  className="w-full p-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-500 block mb-1">Nomor Surat / Regulasi</label>
                <input
                  type="text"
                  placeholder="Contoh: PERBUP NO. 18 TAHUN 2026"
                  value={form.nomor_surat}
                  onChange={(e) => setForm({ ...form, nomor_surat: e.target.value })}
                  className="w-full p-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-500 block mb-1">Kategori</label>
                  <select
                    value={form.kategori}
                    onChange={(e) => setForm({ ...form, kategori: e.target.value })}
                    className="w-full p-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none font-bold text-slate-800"
                  >
                    <option value="SURAT_EDARAN">SURAT_EDARAN</option>
                    <option value="PERBUP">PERBUP</option>
                    <option value="PERATURAN_BUPATI">PERATURAN_BUPATI</option>
                    <option value="JUKNIS">JUKNIS</option>
                    <option value="FORMULIR">FORMULIR</option>
                    <option value="PENGUMUMAN">PENGUMUMAN</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-500 block mb-1">Tahun Terbit</label>
                  <input
                    type="number"
                    value={form.tahun}
                    onChange={(e) => setForm({ ...form, tahun: Number(e.target.value) })}
                    className="w-full p-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none font-mono font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-500 block mb-1">URL File Dokumen (PDF)</label>
                <input
                  type="text"
                  placeholder="/api/v1/storage/download/documents/... atau https://..."
                  value={form.file_url}
                  onChange={(e) => setForm({ ...form, file_url: e.target.value })}
                  className="w-full p-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none font-mono"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={!form.judul.trim() || createMutation.isPending}
                onClick={() => createMutation.mutate(form)}
                className="px-5 py-2 text-xs font-bold bg-emerald-800 text-white rounded-xl shadow hover:bg-emerald-700 disabled:opacity-50 cursor-pointer"
              >
                {createMutation.isPending ? 'Menyimpan...' : 'Simpan Dokumen'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
