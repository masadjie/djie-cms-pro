import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../services/api';
import { 
  MessageSquare, 
  Check, 
  X, 
  Trash2, 
  Search, 
  Filter, 
  RefreshCw, 
  Clock, 
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { useConfirm } from '../common/ConfirmDialog';

export default function KomentarModerationTab() {
  const queryClient = useQueryClient();
  const confirm = useConfirm();

  const [activeStatus, setActiveStatus] = useState('ALL'); // 'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState([]);

  // Fetch comments with pagination and filters
  const { data: response, isLoading, refetch } = useQuery({
    queryKey: ['adminKomentarList', activeStatus, search, page],
    queryFn: async () => {
      const params = {
        page,
        limit: 10,
        status: activeStatus === 'ALL' ? undefined : activeStatus,
        search: search.trim() || undefined
      };
      const res = await api.get('/berita/admin/komentar', { params });
      return res?.data ? res : { data: [], counts: {}, pagination: {} };
    }
  });

  const comments = Array.isArray(response?.data) ? response.data : [];
  const counts = response?.counts || { pending: 0, approved: 0, rejected: 0, all: 0 };
  const pagination = response?.pagination || { total: 0, totalPages: 1 };

  // 1. Single Status Mutation
  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }) => {
      return await api.patch(`/berita/admin/komentar/${id}/status`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminKomentarList'] });
    }
  });

  // 2. Single Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      return await api.delete(`/berita/admin/komentar/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminKomentarList'] });
    }
  });

  // 3. Bulk Action Mutation
  const bulkMutation = useMutation({
    mutationFn: async ({ ids, action }) => {
      return await api.post('/berita/admin/komentar/bulk', { ids, action });
    },
    onSuccess: () => {
      setSelectedIds([]);
      queryClient.invalidateQueries({ queryKey: ['adminKomentarList'] });
    }
  });

  const handleUpdateStatus = (id, newStatus) => {
    updateStatusMutation.mutate({ id, status: newStatus });
  };

  const handleDelete = async (id, nama) => {
    const isConfirmed = await confirm({
      title: 'Hapus Komentar Permanen?',
      message: `Apakah Anda yakin ingin menghapus komentar dari "${nama}"? Aksi ini tidak dapat dibatalkan.`,
      confirmText: 'Ya, Hapus',
      variant: 'danger'
    });
    if (isConfirmed) {
      deleteMutation.mutate(id);
    }
  };

  const handleBulkAction = async (action) => {
    if (selectedIds.length === 0) return;
    const label = action === 'APPROVE' ? 'menyetujui' : action === 'REJECT' ? 'menolak' : 'menghapus permanen';
    const isConfirmed = await confirm({
      title: `Aksi Massal: ${action}`,
      message: `Anda akan ${label} ${selectedIds.length} komentar terpilih. Lanjutkan?`,
      confirmText: 'Lanjutkan',
      variant: action === 'DELETE' ? 'danger' : 'primary'
    });
    if (isConfirmed) {
      bulkMutation.mutate({ ids: selectedIds, action });
    }
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === comments.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(comments.map((c) => c.id));
    }
  };

  const toggleSelectOne = (id) => {
    setSelectedIds((prev) => 
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
            <ShieldCheck className="w-4 h-4 text-emerald-700" />
            <span>Moderasi Komentar Berita</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Persetujuan & Moderasi Komentar Publik
          </h2>
          <p className="text-xs text-slate-500 max-w-xl">
            Tinjau tanggapan, pertanyaan, atau masukan masyarakat sebelum dipublikasikan ke halaman berita resmi BKPSDM Aceh Tamiang.
          </p>
        </div>

        <button
          onClick={() => refetch()}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all shadow-xs self-start md:self-auto cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Segarkan Data</span>
        </button>
      </div>

      {/* Tabs Filter Status */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-2xl overflow-x-auto no-scrollbar">
          <button
            onClick={() => { setActiveStatus('ALL'); setPage(1); }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeStatus === 'ALL'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>Semua</span>
            <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-slate-200 text-slate-700 font-mono">
              {counts.all || 0}
            </span>
          </button>

          <button
            onClick={() => { setActiveStatus('PENDING'); setPage(1); }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeStatus === 'PENDING'
                ? 'bg-amber-400 text-slate-950 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>Perlu Approval</span>
            <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-amber-200 text-amber-900 font-bold font-mono">
              {counts.pending || 0}
            </span>
          </button>

          <button
            onClick={() => { setActiveStatus('APPROVED'); setPage(1); }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeStatus === 'APPROVED'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>Tayang (Approved)</span>
            <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-emerald-700 text-emerald-100 font-mono">
              {counts.approved || 0}
            </span>
          </button>

          <button
            onClick={() => { setActiveStatus('REJECTED'); setPage(1); }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeStatus === 'REJECTED'
                ? 'bg-rose-700 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>Ditolak</span>
            <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-rose-200 text-rose-900 font-mono">
              {counts.rejected || 0}
            </span>
          </button>
        </div>

        {/* Search Input */}
        <div className="relative min-w-[240px]">
          <input
            type="text"
            placeholder="Cari pengirim / isi / email..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10 outline-none transition-all"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>
      </div>

      {/* Bulk Action Bar */}
      {selectedIds.length > 0 && (
        <div className="bg-emerald-950 text-white p-3.5 rounded-2xl flex items-center justify-between gap-3 shadow-md animate-in fade-in">
          <div className="flex items-center gap-2 text-xs">
            <span className="font-bold text-amber-300">{selectedIds.length} komentar dipilih</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleBulkAction('APPROVE')}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Setujui Semua</span>
            </button>
            <button
              onClick={() => handleBulkAction('REJECT')}
              className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
              <span>Tolak Semua</span>
            </button>
            <button
              onClick={() => handleBulkAction('DELETE')}
              className="px-3 py-1.5 bg-rose-700 hover:bg-rose-600 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Hapus</span>
            </button>
          </div>
        </div>
      )}

      {/* Table / List Container */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-16 text-center space-y-3">
            <div className="w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs font-bold text-slate-500">Memuat data komentar...</p>
          </div>
        ) : comments.length === 0 ? (
          <div className="p-16 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 mx-auto">
              <MessageSquare className="w-6 h-6" />
            </div>
            <p className="text-sm font-bold text-slate-800">Tidak Ada Komentar Ditemukan</p>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Belum ada komentar untuk filter status yang Anda pilih. Komentar baru dari pengunjung akan muncul di sini untuk dimoderasi.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {/* Header row */}
            <div className="px-6 py-3 bg-slate-50/80 flex items-center justify-between text-xs font-bold text-slate-600">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={selectedIds.length === comments.length && comments.length > 0}
                  onChange={toggleSelectAll}
                  className="rounded border-slate-300 text-emerald-800 focus:ring-emerald-700 w-4 h-4 cursor-pointer"
                />
                <span>Pilih Semua Komentar di Halaman Ini</span>
              </div>
              <span className="text-slate-400 text-[11px]">Total: {pagination.total} Komentar</span>
            </div>

            {/* Rows */}
            {comments.map((item) => {
              const isSelected = selectedIds.includes(item.id);
              return (
                <div 
                  key={item.id}
                  className={`p-6 transition-all hover:bg-slate-50/70 flex flex-col lg:flex-row lg:items-start justify-between gap-5 ${
                    isSelected ? 'bg-emerald-50/30' : ''
                  }`}
                >
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleSelectOne(item.id)}
                      className="mt-1 rounded border-slate-300 text-emerald-800 focus:ring-emerald-700 w-4 h-4 cursor-pointer"
                    />

                    <div className="space-y-3 flex-1 min-w-0">
                      {/* Author Header */}
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-bold text-sm text-slate-900">
                          {item.nama_pengirim}
                        </span>
                        <span className="text-xs text-slate-400 font-mono">
                          &lt;{item.email_pengirim}&gt;
                        </span>
                        {item.instansi_pengirim && (
                          <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-medium">
                            {item.instansi_pengirim}
                          </span>
                        )}

                        {/* Status Badge */}
                        {item.status === 'PENDING' && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 border border-amber-300">
                            <Clock className="w-3 h-3" />
                            Pending Moderasi
                          </span>
                        )}
                        {item.status === 'APPROVED' && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-900 border border-emerald-300">
                            <CheckCircle2 className="w-3 h-3" />
                            Tayang (Approved)
                          </span>
                        )}
                        {item.status === 'REJECTED' && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-rose-100 text-rose-900 border border-rose-300">
                            <XCircle className="w-3 h-3" />
                            Ditolak
                          </span>
                        )}
                      </div>

                      {/* Isi Komentar */}
                      <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-xs text-slate-800 leading-relaxed whitespace-pre-line">
                        {item.isi_komentar}
                      </div>

                      {/* Associated News Info & Timestamp */}
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-400">
                        {item.berita && (
                          <span className="flex items-center gap-1 text-slate-600 font-medium">
                            <span>Pada Artikel:</span>
                            <a
                              href={`/berita/${item.berita.slug}`}
                              target="_blank"
                              rel="noreferrer"
                              className="text-emerald-800 font-bold hover:underline inline-flex items-center gap-0.5 max-w-xs truncate"
                            >
                              <span>{item.berita.title}</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </span>
                        )}
                        <span>&bull;</span>
                        <span>{formatDate(item.created_at)}</span>
                        {item.moderator && (
                          <>
                            <span>&bull;</span>
                            <span className="text-slate-500">
                              Dimoderasi oleh: <strong>{item.moderator.name || item.moderator.nama_lengkap}</strong>
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex lg:flex-col items-center gap-2 shrink-0 self-end lg:self-start pt-2 lg:pt-0">
                    {item.status !== 'APPROVED' && (
                      <button
                        onClick={() => handleUpdateStatus(item.id, 'APPROVED')}
                        className="px-3 py-1.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
                        title="Setujui agar komentar tampil di website publik"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Setujui</span>
                      </button>
                    )}

                    {item.status !== 'REJECTED' && (
                      <button
                        onClick={() => handleUpdateStatus(item.id, 'REJECTED')}
                        className="px-3 py-1.5 rounded-xl border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                        title="Tolak komentar ini"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>Tolak</span>
                      </button>
                    )}

                    <button
                      onClick={() => handleDelete(item.id, item.nama_pengirim)}
                      className="p-1.5 rounded-xl border border-slate-200 text-slate-400 hover:text-rose-600 hover:bg-rose-50 hover:border-rose-200 transition-all cursor-pointer"
                      title="Hapus komentar permanen"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination Footer */}
        {pagination.totalPages > 1 && (
          <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">
              Halaman {pagination.page} dari {pagination.totalPages}
            </span>
            <div className="flex items-center gap-1.5">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white disabled:opacity-40 hover:bg-slate-100 font-bold"
              >
                Sebelumnya
              </button>
              <button
                disabled={page >= pagination.totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white disabled:opacity-40 hover:bg-slate-100 font-bold"
              >
                Berikutnya
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
