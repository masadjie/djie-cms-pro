import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../services/api';
import { 
  Star, 
  Plus, 
  Trash2, 
  Edit3, 
  CheckCircle2, 
  X, 
  MessageSquare, 
  User, 
  Building2, 
  Briefcase, 
  Image as ImageIcon,
  Check,
  RefreshCw,
  Sparkles
} from 'lucide-react';
import { useConfirm } from '../common/ConfirmDialog';

export default function TestimoniManagerTab() {
  const confirm = useConfirm();
  const queryClient = useQueryClient();

  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [form, setForm] = useState({
    nama: '',
    jabatan: '',
    instansi: '',
    avatar_url: '',
    rating: 5,
    pesan: '',
    urutan: 0,
    is_active: true
  });
  const [toastMsg, setToastMsg] = useState('');

  // 1. Fetch Testimoni
  const { data: testimoniList = [], isLoading } = useQuery({
    queryKey: ['adminTestimoniList'],
    queryFn: async () => {
      try {
        const res = await api.get('/cms/testimoni');
        return res?.data || res || [];
      } catch (err) {
        return [];
      }
    }
  });

  // 2. Mutations
  const createMutation = useMutation({
    mutationFn: async (payload) => await api.post('/cms/testimoni', payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminTestimoniList'] });
      queryClient.invalidateQueries({ queryKey: ['homeTestimoniAparatur'] });
      setShowModal(false);
      resetForm();
      showToast('Testimoni & rating berhasil ditambahkan!');
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, payload }) => await api.put(`/cms/testimoni/${id}`, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminTestimoniList'] });
      queryClient.invalidateQueries({ queryKey: ['homeTestimoniAparatur'] });
      setShowModal(false);
      resetForm();
      showToast('Testimoni berhasil diperbarui!');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => await api.delete(`/cms/testimoni/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminTestimoniList'] });
      queryClient.invalidateQueries({ queryKey: ['homeTestimoniAparatur'] });
      showToast('Testimoni berhasil dihapus.');
    }
  });

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  const resetForm = () => {
    setEditingItem(null);
    setForm({
      nama: '',
      jabatan: '',
      instansi: '',
      avatar_url: '',
      rating: 5,
      pesan: '',
      urutan: 0,
      is_active: true
    });
  };

  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setForm({
      nama: item.nama || '',
      jabatan: item.jabatan || '',
      instansi: item.instansi || '',
      avatar_url: item.avatar_url || '',
      rating: item.rating || 5,
      pesan: item.pesan || '',
      urutan: item.urutan || 0,
      is_active: item.is_active !== false
    });
    setShowModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.nama.trim() || !form.pesan.trim()) {
      alert('Nama dan isi testimoni wajib diisi.');
      return;
    }

    if (editingItem) {
      updateMutation.mutate({ id: editingItem.id, payload: form });
    } else {
      createMutation.mutate(form);
    }
  };

  const handleDelete = async (id, nama) => {
    const ok = await confirm({
      title: 'Hapus Testimoni',
      message: `Apakah Anda yakin ingin menghapus testimoni dari "${nama}"?`,
      confirmText: 'Ya, Hapus',
      variant: 'danger'
    });
    if (ok) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6 shadow-sm">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-xl flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-black text-slate-900">Manajemen Testimoni & Rating Aparatur</h2>
            <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-black uppercase">
              Ulasan Publik
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Kelola ulasan kepuasan layanan dari ASN/PNS/PPPK dan masyarakat yang tampil di beranda portal.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Testimoni Baru</span>
        </button>
      </div>

      {/* Grid of Testimonials */}
      {isLoading ? (
        <div className="py-16 text-center text-slate-400 text-xs flex items-center justify-center gap-2">
          <RefreshCw className="w-4 h-4 animate-spin text-emerald-600" />
          <span>Memuat data testimoni & ulasan...</span>
        </div>
      ) : testimoniList.length === 0 ? (
        <div className="py-16 text-center border-2 border-dashed border-slate-200 rounded-2xl p-6">
          <MessageSquare className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <p className="text-xs font-bold text-slate-600">Belum Ada Testimoni Tersimpan</p>
          <p className="text-[11px] text-slate-400 mt-1">Klik tombol di atas untuk menambahkan ulasan aparatur pertama.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {testimoniList.map((item) => (
            <div
              key={item.id}
              className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                item.is_active 
                  ? 'bg-slate-50/70 border-slate-200 hover:shadow-md' 
                  : 'bg-slate-100/50 border-slate-200 opacity-60'
              }`}
            >
              <div className="space-y-3">
                {/* Rating Stars & Status */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(item.rating || 5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                    ))}
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    item.is_active ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                  }`}>
                    {item.is_active ? 'Aktif' : 'Non-aktif'}
                  </span>
                </div>

                {/* Pesan / Ulasan */}
                <p className="text-xs text-slate-700 leading-relaxed italic line-clamp-4">
                  "{item.pesan}"
                </p>
              </div>

              {/* Author & Actions */}
              <div className="pt-4 mt-4 border-t border-slate-200/80 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <img
                    src={item.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
                    alt={item.nama}
                    className="w-8 h-8 rounded-full object-cover ring-2 ring-emerald-500/20 shrink-0"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80';
                    }}
                  />
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-slate-900 truncate">{item.nama}</h4>
                    <p className="text-[10px] text-slate-500 truncate">
                      {item.jabatan || 'Aparatur'} {item.instansi ? `• ${item.instansi}` : ''}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(item)}
                    className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-600 hover:text-emerald-700 transition-colors"
                    title="Edit Testimoni"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(item.id, item.nama)}
                    className="p-1.5 hover:bg-rose-100 rounded-lg text-slate-600 hover:text-rose-600 transition-colors"
                    title="Hapus Testimoni"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Add / Edit */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
                  <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900">
                    {editingItem ? 'Edit Testimoni Aparatur' : 'Tambah Testimoni & Rating Baru'}
                  </h3>
                  <p className="text-[11px] text-slate-500">Ulasan kepuasan pelayanan kepegawaian</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="p-1.5 hover:bg-slate-100 rounded-xl text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nama Lengkap Aparatur / Pemberi Ulasan *
                </label>
                <input
                  type="text"
                  required
                  value={form.nama}
                  onChange={(e) => setForm({ ...form, nama: e.target.value })}
                  placeholder="Misal: Dr. Hendra Wijaya, M.Si"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Jabatan / Pangkat
                  </label>
                  <input
                    type="text"
                    value={form.jabatan}
                    onChange={(e) => setForm({ ...form, jabatan: e.target.value })}
                    placeholder="Misal: Analis SDM Aparatur"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Instansi / Unit Kerja
                  </label>
                  <input
                    type="text"
                    value={form.instansi}
                    onChange={(e) => setForm({ ...form, instansi: e.target.value })}
                    placeholder="Misal: Dinas Kesehatan / BKPSDM"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Rating Bintang (1 - 5)
                  </label>
                  <div className="flex items-center gap-1.5 pt-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setForm({ ...form, rating: star })}
                        className="p-1 hover:scale-110 transition-transform cursor-pointer"
                      >
                        <Star
                          className={`w-5 h-5 ${
                            star <= form.rating
                              ? 'text-amber-400 fill-amber-400'
                              : 'text-slate-300'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="text-xs font-bold text-slate-600 ml-2 font-mono">
                      {form.rating} / 5
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Status Tampil
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer pt-2">
                    <input
                      type="checkbox"
                      checked={form.is_active}
                      onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                      className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500 cursor-pointer"
                    />
                    <span className="text-xs text-slate-700 font-semibold">Tampilkan di Beranda</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Foto Avatar URL (Opsional)
                </label>
                <input
                  type="url"
                  value={form.avatar_url}
                  onChange={(e) => setForm({ ...form, avatar_url: e.target.value })}
                  placeholder="https://... (Kosongkan untuk avatar bawaan)"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-hidden font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Isi Pesan / Testimoni Kepuasan *
                </label>
                <textarea
                  required
                  rows={4}
                  value={form.pesan}
                  onChange={(e) => setForm({ ...form, pesan: e.target.value })}
                  placeholder="Tulis ulasan kepuasan layanan kepegawaian..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-hidden resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>{editingItem ? 'Simpan Perubahan' : 'Terbitkan Testimoni'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
