import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../services/api';
import {
  Tag,
  Plus,
  Edit,
  Trash2,
  Check,
  X,
  FolderOpen,
  Newspaper,
  Layers,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  Search,
  Sliders,
  ChevronRight
} from 'lucide-react';
import DataTable from '../common/DataTable';
import Badge from '../common/Badge';
import { useConfirm } from '../common/ConfirmDialog';

export default function CategoryManagerTab() {
  const confirm = useConfirm();
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [search, setSearch] = useState('');
  const [toastMessage, setToastMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    nama_kategori: '',
    slug: '',
    deskripsi: '',
    urutan: 0,
    is_active: true
  });
  const [isAutoSlug, setIsAutoSlug] = useState(true);

  // 1. Fetch Categories for Admin
  const { data: categories = [], isLoading } = useQuery({
    queryKey: ['adminKategoriBeritaList'],
    queryFn: async () => {
      const res = await api.get('/berita/kategori/admin');
      return res?.data || [];
    }
  });

  // Open Create Modal
  const handleOpenCreate = () => {
    setEditingCategory(null);
    setFormData({
      nama_kategori: '',
      slug: '',
      deskripsi: '',
      urutan: categories.length + 1,
      is_active: true
    });
    setIsAutoSlug(true);
    setModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (cat) => {
    setEditingCategory(cat);
    setFormData({
      nama_kategori: cat.nama_kategori,
      slug: cat.slug,
      deskripsi: cat.deskripsi || '',
      urutan: cat.urutan || 0,
      is_active: !!cat.is_active
    });
    setIsAutoSlug(false);
    setModalOpen(true);
  };

  // Auto-slug generator
  const handleNameChange = (e) => {
    const val = e.target.value;
    const generatedSlug = val
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');

    setFormData((prev) => ({
      ...prev,
      nama_kategori: val,
      slug: isAutoSlug ? generatedSlug : prev.slug
    }));
  };

  // 2. Create / Update Mutation
  const saveMutation = useMutation({
    mutationFn: async (payload) => {
      if (editingCategory) {
        return await api.put(`/berita/kategori/${editingCategory.id}`, payload);
      } else {
        return await api.post('/berita/kategori', payload);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminKategoriBeritaList'] });
      queryClient.invalidateQueries({ queryKey: ['kategoriBeritaList'] });
      setToastMessage(editingCategory ? 'Kategori berhasil diperbarui!' : 'Kategori baru berhasil dibuat!');
      setModalOpen(false);
      setTimeout(() => setToastMessage(''), 3000);
    },
    onError: (err) => {
      setErrorMessage(err.response?.data?.message || 'Gagal menyimpan kategori.');
      setTimeout(() => setErrorMessage(''), 4000);
    }
  });

  // 3. Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      return await api.delete(`/berita/kategori/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminKategoriBeritaList'] });
      queryClient.invalidateQueries({ queryKey: ['kategoriBeritaList'] });
      setToastMessage('Kategori berhasil dihapus!');
      setTimeout(() => setToastMessage(''), 3000);
    },
    onError: (err) => {
      alert(err.response?.data?.message || 'Gagal menghapus kategori.');
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.nama_kategori.trim()) {
      alert('Nama kategori wajib diisi.');
      return;
    }
    saveMutation.mutate(formData);
  };

  // Quick Toggle Active Status
  const toggleActiveStatus = (cat) => {
    saveMutation.mutate({
      nama_kategori: cat.nama_kategori,
      is_active: !cat.is_active
    });
  };

  const totalArticles = categories.reduce((sum, c) => sum + (c.total_berita || 0), 0);
  const activeCount = categories.filter((c) => c.is_active).length;

  const filteredCategories = categories.filter((c) => {
    if (!search) return true;
    return (
      c.nama_kategori.toLowerCase().includes(search.toLowerCase()) ||
      c.slug.toLowerCase().includes(search.toLowerCase()) ||
      (c.deskripsi && c.deskripsi.toLowerCase().includes(search.toLowerCase()))
    );
  });

  const columns = [
    {
      header: 'Nama Kategori & Slug',
      accessor: 'nama_kategori',
      render: (cat) => (
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-50 text-emerald-800 rounded-xl shrink-0 border border-emerald-100">
            <Tag className="w-4 h-4 text-emerald-700" />
          </div>
          <div className="min-w-0">
            <p className="font-bold text-slate-900 text-xs sm:text-sm">{cat.nama_kategori}</p>
            <span className="font-mono text-[10px] text-emerald-800 bg-emerald-50/70 px-2 py-0.5 rounded border border-emerald-200/60 inline-block mt-0.5">
              /{cat.slug}
            </span>
          </div>
        </div>
      )
    },
    {
      header: 'Deskripsi Cakupan',
      accessor: 'deskripsi',
      render: (cat) => (
        <p className="text-xs text-slate-500 max-w-sm line-clamp-2">
          {cat.deskripsi || <span className="italic text-slate-300">Tidak ada deskripsi</span>}
        </p>
      )
    },
    {
      header: 'Jumlah Artikel',
      accessor: 'total_berita',
      render: (cat) => (
        <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-slate-100 text-slate-700 border border-slate-200">
          {cat.total_berita || 0} Berita
        </span>
      )
    },
    {
      header: 'Urutan',
      accessor: 'urutan',
      render: (cat) => (
        <span className="font-mono font-bold text-xs text-slate-600 bg-slate-50 px-2 py-1 rounded-lg border">
          #{cat.urutan || 0}
        </span>
      )
    },
    {
      header: 'Status',
      accessor: 'is_active',
      render: (cat) => (
        <button
          type="button"
          onClick={() => toggleActiveStatus(cat)}
          className={`px-3 py-1 rounded-full text-[11px] font-bold border transition-all cursor-pointer ${
            cat.is_active
              ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
              : 'bg-slate-100 text-slate-500 border-slate-300 hover:bg-slate-200'
          }`}
          title="Klik untuk mengubah status aktif/nonaktif"
        >
          {cat.is_active ? '● Aktif' : '○ Nonaktif'}
        </button>
      )
    },
    {
      header: 'Aksi',
      align: 'right',
      render: (cat) => (
        <div className="flex items-center gap-1.5 justify-end">
          <button
            type="button"
            onClick={() => handleOpenEdit(cat)}
            className="p-1.5 hover:bg-emerald-50 text-emerald-700 rounded-lg transition-colors cursor-pointer"
            title="Edit Kategori"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={async () => {
              const ok = await confirm({
                title: 'Hapus Kategori',
                message: `Yakin ingin menghapus kategori "${cat.nama_kategori}"? Kategori yang sudah memiliki relasi berita mungkin tidak dapat dihapus.`,
                confirmText: 'Ya, Hapus Kategori',
                variant: 'danger'
              });
              if (ok) {
                deleteMutation.mutate(cat.id);
              }
            }}
            className="p-1.5 hover:bg-red-50 text-red-500 rounded-lg transition-colors cursor-pointer"
            title="Hapus Kategori"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      
      {/* Toast Alert */}
      {toastMessage && (
        <div className="bg-emerald-900 text-white px-4 py-3 rounded-2xl shadow-lg flex items-center gap-2.5 text-xs font-bold animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}
      {errorMessage && (
        <div className="bg-red-900 text-white px-4 py-3 rounded-2xl shadow-lg flex items-center gap-2.5 text-xs font-bold animate-pulse">
          <AlertCircle className="w-4 h-4 text-red-400" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* 1. SUMMARY STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-2xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Kategori</span>
            <div className="p-2 bg-emerald-50 text-emerald-800 rounded-xl">
              <Tag className="w-4 h-4 text-emerald-700" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 font-mono">{categories.length}</p>
          <p className="text-[11px] text-slate-500">Kategori berita & informasi ASN</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-2xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Kategori Aktif</span>
            <div className="p-2 bg-blue-50 text-blue-800 rounded-xl">
              <Layers className="w-4 h-4 text-blue-700" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 font-mono">{activeCount}</p>
          <p className="text-[11px] text-slate-500">Tampil pada navigasi & filter publik</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-2xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Berita Terkategori</span>
            <div className="p-2 bg-amber-50 text-amber-800 rounded-xl">
              <Newspaper className="w-4 h-4 text-amber-700" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 font-mono">{totalArticles}</p>
          <p className="text-[11px] text-slate-500">Artikel & pengumuman aktif</p>
        </div>

      </div>

      {/* 2. TABLE CONTAINER & HEADER */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <h2 className="text-lg font-black text-slate-900">Manajemen Kategori Berita & Pengumuman</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Atur taksonomi, topik, dan pengelompokan berita kedinasan BKPSDM Kabupaten Aceh Tamiang.
            </p>
          </div>

          <button
            type="button"
            onClick={handleOpenCreate}
            className="px-4 py-2.5 bg-emerald-800 hover:bg-emerald-700 active:scale-95 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm transition-all cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-4 h-4 text-amber-300" />
            <span>Tambah Kategori Baru</span>
          </button>
        </div>

        <DataTable
          columns={columns}
          data={categories}
          isLoading={isLoading}
          searchPlaceholder="Cari nama kategori, slug atau deskripsi..."
          searchKeys={['nama_kategori', 'slug', 'deskripsi']}
          emptyMessage="Belum ada kategori yang terdaftar."
        />
      </div>

      {/* 3. MODAL CREATE / EDIT KATEGORI */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-emerald-100 text-emerald-800 rounded-xl">
                  <Tag className="w-4 h-4 text-emerald-800" />
                </div>
                <h3 className="text-sm font-black uppercase tracking-wider text-slate-900">
                  {editingCategory ? 'Edit Kategori Berita' : 'Tambah Kategori Baru'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="p-1.5 bg-slate-200 hover:bg-slate-300 rounded-full text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              
              {/* Nama Kategori */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Nama Kategori *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Seleksi CASN 2026, Mutasi Pegawai, dll."
                  value={formData.nama_kategori}
                  onChange={handleNameChange}
                  className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none font-semibold text-slate-900"
                />
              </div>

              {/* Slug */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <label className="font-bold text-slate-700">URL Slug *</label>
                  <button
                    type="button"
                    onClick={() => setIsAutoSlug(!isAutoSlug)}
                    className="text-[10px] font-bold text-emerald-700 hover:underline cursor-pointer"
                  >
                    {isAutoSlug ? 'Mode Manual' : 'Mode Otomatis'}
                  </button>
                </div>
                <input
                  type="text"
                  required
                  placeholder="seleksi-casn-2026"
                  value={formData.slug}
                  onChange={(e) => {
                    setFormData({ ...formData, slug: e.target.value });
                    setIsAutoSlug(false);
                  }}
                  className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none font-mono text-emerald-900"
                />
              </div>

              {/* Deskripsi */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Deskripsi Cakupan (Opsional)</label>
                <textarea
                  rows={3}
                  placeholder="Informasi seputar pengadaan CPNS, PPPK, dan tahapan seleksi kedinasan..."
                  value={formData.deskripsi}
                  onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
                  className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none text-slate-800"
                />
              </div>

              {/* Urutan & Status */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Urutan Tampilan</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.urutan}
                    onChange={(e) => setFormData({ ...formData, urutan: parseInt(e.target.value || '0', 10) })}
                    className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none font-mono"
                  />
                </div>

                <div className="space-y-1.5 flex flex-col justify-end">
                  <label className="flex items-center gap-2 p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.is_active}
                      onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                      className="w-4 h-4 rounded text-emerald-800 focus:ring-emerald-600"
                    />
                    <span>Kategori Aktif</span>
                  </label>
                </div>
              </div>

              {/* Modal Buttons */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={saveMutation.isPending}
                  className="px-5 py-2 bg-emerald-800 hover:bg-emerald-700 active:scale-95 text-white text-xs font-bold rounded-xl transition-all shadow-sm cursor-pointer flex items-center gap-1.5"
                >
                  {saveMutation.isPending ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-300" />
                      <span>Menyimpan...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-3.5 h-3.5 text-amber-300" />
                      <span>{editingCategory ? 'Perbarui Kategori' : 'Simpan Kategori'}</span>
                    </>
                  )}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
