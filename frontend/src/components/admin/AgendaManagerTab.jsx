import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../services/api';
import { 
  Calendar, 
  Plus, 
  Trash2, 
  Edit3, 
  MapPin, 
  Clock, 
  ExternalLink, 
  CheckCircle2, 
  AlertCircle,
  CheckSquare,
  Sparkles,
  X,
  Eye,
  Layers,
  ChevronRight
} from 'lucide-react';
import DataTable from '../common/DataTable';
import Badge from '../common/Badge';
import { useConfirm } from '../common/ConfirmDialog';

export default function AgendaManagerTab() {
  const confirm = useConfirm();
  const queryClient = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [toastMessage, setToastMessage] = useState('');

  const [form, setForm] = useState({
    title: '',
    kategori: 'Pengembangan Karir',
    deskripsi: '',
    lokasi: 'Aula BKPSDM Kab. Aceh Tamiang',
    tipe_pelaksanaan: 'OFFLINE',
    start_time: new Date().toISOString().slice(0, 16),
    end_time: new Date(Date.now() + 3600000 * 3).toISOString().slice(0, 16),
    is_active: true,
    link_pendaftaran: ''
  });

  const { data: agendaList = [], isLoading } = useQuery({
    queryKey: ['adminAgendaList'],
    queryFn: async () => {
      try {
        const res = await api.get('/cms/agenda');
        return res?.data || [];
      } catch (err) {
        return [];
      }
    }
  });

  const saveMutation = useMutation({
    mutationFn: async (payload) => {
      if (editId) {
        return await api.put(`/cms/agenda/${editId}`, payload);
      }
      return await api.post('/cms/agenda', payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminAgendaList'] });
      queryClient.invalidateQueries({ queryKey: ['cmsAnalytics'] });
      setShowModal(false);
      setEditId(null);
      setToastMessage(editId ? 'Agenda kegiatan berhasil diperbarui!' : 'Agenda kegiatan baru berhasil ditambahkan!');
      setTimeout(() => setToastMessage(''), 3000);
      setForm({
        title: '',
        kategori: 'Pengembangan Karir',
        deskripsi: '',
        lokasi: 'Aula BKPSDM Kab. Aceh Tamiang',
        tipe_pelaksanaan: 'OFFLINE',
        start_time: new Date().toISOString().slice(0, 16),
        end_time: new Date(Date.now() + 3600000 * 3).toISOString().slice(0, 16),
        is_active: true,
        link_pendaftaran: ''
      });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => await api.delete(`/cms/agenda/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminAgendaList'] });
      queryClient.invalidateQueries({ queryKey: ['cmsAnalytics'] });
      setSelectedIds((prev) => prev.filter((item) => item !== deleteMutation.variables));
      setToastMessage('Agenda berhasil dihapus.');
      setTimeout(() => setToastMessage(''), 3000);
    }
  });

  const bulkDeleteMutation = useMutation({
    mutationFn: async (ids) => await api.post('/cms/agenda/bulk-delete', { ids }),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['adminAgendaList'] });
      queryClient.invalidateQueries({ queryKey: ['cmsAnalytics'] });
      setSelectedIds([]);
      setToastMessage(res?.message || 'Agenda terpilih berhasil dihapus massal!');
      setTimeout(() => setToastMessage(''), 3500);
    },
    onError: (err) => {
      alert(err.response?.data?.message || 'Gagal menghapus massal agenda.');
    }
  });

  const handleOpenEdit = (item) => {
    setEditId(item.id);
    setForm({
      title: item.title,
      kategori: item.kategori || 'Pengembangan Karir',
      deskripsi: item.deskripsi || '',
      lokasi: item.lokasi || 'Aula BKPSDM Kab. Aceh Tamiang',
      tipe_pelaksanaan: item.tipe_pelaksanaan || 'OFFLINE',
      start_time: item.start_time ? new Date(item.start_time).toISOString().slice(0, 16) : new Date().toISOString().slice(0, 16),
      end_time: item.end_time ? new Date(item.end_time).toISOString().slice(0, 16) : new Date().toISOString().slice(0, 16),
      is_active: item.is_active !== undefined ? item.is_active : true,
      link_pendaftaran: item.link_pendaftaran || ''
    });
    setShowModal(true);
  };

  // Bulk Selection Handlers
  const isAllSelected = agendaList.length > 0 && agendaList.every((a) => selectedIds.includes(a.id));
  const isSomeSelected = agendaList.some((a) => selectedIds.includes(a.id)) && !isAllSelected;

  const handleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(agendaList.map((a) => a.id));
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
      title: 'Hapus Massal Agenda Kegiatan',
      message: `Apakah Anda yakin ingin menghapus ${selectedIds.length} agenda kegiatan yang dipilih sekaligus? Tindakan ini tidak dapat dibatalkan.`,
      confirmText: `Ya, Hapus ${selectedIds.length} Agenda`,
      variant: 'danger'
    });
    if (ok) {
      bulkDeleteMutation.mutate(selectedIds);
    }
  };

  const columns = [
    {
      header: (
        <div className="flex items-center justify-center">
          <input
            type="checkbox"
            checked={isAllSelected}
            ref={(el) => { if (el) el.indeterminate = isSomeSelected; }}
            onChange={handleSelectAll}
            className="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
            title="Pilih Semua Agenda"
          />
        </div>
      ),
      width: '45px',
      align: 'center',
      render: (item) => (
        <div className="flex items-center justify-center">
          <input
            type="checkbox"
            checked={selectedIds.includes(item.id)}
            onChange={() => handleToggleSelect(item.id)}
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
      header: 'Nama Kegiatan & Agenda',
      accessor: 'title',
      render: (item) => (
        <div className="flex items-start gap-3">
          <div 
            onClick={() => handleOpenEdit(item)}
            className="p-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-xl shrink-0 mt-0.5 cursor-pointer transition-colors shadow-2xs"
            title="Klik untuk Edit Agenda"
          >
            <Calendar className="w-4 h-4 text-emerald-700" />
          </div>
          <div className="min-w-0">
            <button
              type="button"
              onClick={() => handleOpenEdit(item)}
              className="font-bold text-slate-900 hover:text-emerald-800 text-left transition-colors cursor-pointer block truncate max-w-md"
              title="Klik untuk Edit Agenda"
            >
              {item.title}
            </button>
            <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
              {item.deskripsi || 'Kegiatan resmi kedinasan BKPSDM Kabupaten Aceh Tamiang'}
            </p>
          </div>
        </div>
      )
    },
    {
      header: 'Kategori & Tipe',
      render: (item) => (
        <div className="space-y-1">
          <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200/80 px-2.5 py-0.5 rounded-full block w-fit">
            {item.kategori}
          </span>
          <span className="text-[9px] font-mono font-semibold px-2 py-0.2 rounded bg-slate-100 text-slate-600 uppercase inline-block">
            {item.tipe_pelaksanaan}
          </span>
        </div>
      )
    },
    {
      header: 'Waktu & Lokasi',
      render: (item) => (
        <div className="space-y-1 text-xs">
          <div className="flex items-center gap-1.5 font-bold text-slate-800">
            <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span>
              {new Date(item.start_time).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
            </span>
            <span className="text-slate-400 font-mono text-[11px]">
              ({new Date(item.start_time).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })})
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate max-w-xs">{item.lokasi}</span>
          </div>
        </div>
      )
    },
    {
      header: 'Status',
      align: 'center',
      render: (item) => (
        <Badge variant={item.is_active ? 'emerald' : 'amber'} size="sm">
          {item.is_active ? 'Aktif Tayang' : 'Disembunyikan'}
        </Badge>
      )
    },
    {
      header: 'Aksi',
      align: 'right',
      render: (item) => (
        <div className="flex items-center justify-end gap-1.5">
          {item.link_pendaftaran && (
            <a
              href={item.link_pendaftaran}
              target="_blank"
              rel="noreferrer"
              className="p-1.5 text-slate-600 hover:text-emerald-700 bg-slate-100 hover:bg-emerald-50 rounded-lg text-xs transition-colors"
              title="Buka Tautan Pendaftaran"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
          <button
            type="button"
            onClick={() => handleOpenEdit(item)}
            className="p-1.5 text-blue-700 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 rounded-lg text-xs font-bold inline-flex items-center gap-1 cursor-pointer transition-colors"
            title="Edit Agenda"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit</span>
          </button>
          <button
            type="button"
            onClick={async () => {
              const ok = await confirm({
                title: 'Hapus Agenda Kegiatan',
                message: `Apakah Anda yakin ingin menghapus agenda "${item.title}"? Tindakan ini tidak dapat dibatalkan.`,
                confirmText: 'Ya, Hapus Agenda',
                variant: 'danger'
              });
              if (ok) {
                deleteMutation.mutate(item.id);
              }
            }}
            className="p-1.5 text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 rounded-lg text-xs cursor-pointer transition-colors"
            title="Hapus Agenda"
          >
            <Trash2 className="w-3.5 h-3.5" />
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

      {/* Header and Bulk Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-black text-slate-900">Manajemen Agenda & Jadwal Kegiatan Kedinasan</h2>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
              {agendaList.length} Jadwal
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Kelola jadwal ujian seleksi CASN, bimtek, sosialisasi kepegawaian, dan agenda resmi BKPSDM Aceh Tamiang.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          {/* Bulk Delete Trigger */}
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
            onClick={() => {
              setEditId(null);
              setForm({
                title: '',
                kategori: 'Pengembangan Karir',
                deskripsi: '',
                lokasi: 'Aula BKPSDM Kab. Aceh Tamiang',
                tipe_pelaksanaan: 'OFFLINE',
                start_time: new Date().toISOString().slice(0, 16),
                end_time: new Date(Date.now() + 3600000 * 3).toISOString().slice(0, 16),
                is_active: true,
                link_pendaftaran: ''
              });
              setShowModal(true);
            }}
            className="px-4 py-2.5 bg-emerald-800 hover:bg-emerald-700 active:scale-95 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 text-amber-300" />
            <span>Tambah Agenda Baru</span>
          </button>
        </div>
      </div>

      {/* Bulk Selection Notification Bar */}
      {selectedIds.length > 0 && (
        <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-2xl flex items-center justify-between text-xs text-red-800 animate-fadeIn">
          <div className="flex items-center gap-2 font-bold">
            <CheckSquare className="w-4 h-4 text-red-600" />
            <span>{selectedIds.length} agenda kegiatan telah dipilih.</span>
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
        data={agendaList}
        isLoading={isLoading}
        searchPlaceholder="Cari judul agenda atau lokasi..."
        searchKeys={['title', 'lokasi', 'kategori']}
        filters={[
          {
            key: 'kategori',
            label: 'Kategori',
            options: [
              { label: 'Semua Kategori', value: '' },
              { label: 'Pengembangan Karir', value: 'Pengembangan Karir' },
              { label: 'Mutasi & Kepangkatan', value: 'Mutasi & Kepangkatan' },
              { label: 'Kesejahteraan & Disiplin', value: 'Kesejahteraan & Disiplin' },
              { label: 'Pengadaan CASN', value: 'Pengadaan CASN' },
              { label: 'Sosialisasi Regulasi', value: 'Sosialisasi Regulasi' }
            ]
          },
          {
            key: 'tipe_pelaksanaan',
            label: 'Tipe',
            options: [
              { label: 'Semua Tipe', value: '' },
              { label: 'OFFLINE', value: 'OFFLINE' },
              { label: 'ONLINE', value: 'ONLINE' },
              { label: 'HYBRID', value: 'HYBRID' }
            ]
          }
        ]}
        defaultPageSize={10}
        emptyMessage="Belum ada agenda kegiatan kedinasan."
      />

      {/* Modal Tambah / Edit Agenda */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-black text-slate-900">
                {editId ? 'Edit Agenda Kegiatan' : 'Tambah Agenda Kegiatan Baru'}
              </h3>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Nama / Judul Kegiatan</label>
                <input
                  type="text"
                  placeholder="Contoh: Bimbingan Teknis e-Kinerja SIASN 2026"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full p-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Kategori</label>
                  <select
                    value={form.kategori}
                    onChange={(e) => setForm({ ...form, kategori: e.target.value })}
                    className="w-full p-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none font-bold text-slate-800"
                  >
                    <option value="Pengembangan Karir">Pengembangan Karir</option>
                    <option value="Mutasi & Kepangkatan">Mutasi & Kepangkatan</option>
                    <option value="Kesejahteraan & Disiplin">Kesejahteraan & Disiplin</option>
                    <option value="Pengadaan CASN">Pengadaan CASN</option>
                    <option value="Sosialisasi Regulasi">Sosialisasi Regulasi</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Tipe Pelaksanaan</label>
                  <select
                    value={form.tipe_pelaksanaan}
                    onChange={(e) => setForm({ ...form, tipe_pelaksanaan: e.target.value })}
                    className="w-full p-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none font-bold text-slate-800"
                  >
                    <option value="OFFLINE">OFFLINE (Tatap Muka)</option>
                    <option value="ONLINE">ONLINE (Daring)</option>
                    <option value="HYBRID">HYBRID (Campuran)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Lokasi / Tempat</label>
                <input
                  type="text"
                  placeholder="Contoh: Aula Utama BKPSDM Kab. Aceh Tamiang atau Zoom Meeting"
                  value={form.lokasi}
                  onChange={(e) => setForm({ ...form, lokasi: e.target.value })}
                  className="w-full p-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Waktu Mulai</label>
                  <input
                    type="datetime-local"
                    value={form.start_time}
                    onChange={(e) => setForm({ ...form, start_time: e.target.value })}
                    className="w-full p-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Waktu Selesai</label>
                  <input
                    type="datetime-local"
                    value={form.end_time}
                    onChange={(e) => setForm({ ...form, end_time: e.target.value })}
                    className="w-full p-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Tautan Registrasi / Dokumen (Opsional)</label>
                <input
                  type="url"
                  placeholder="https://s.id/daftar-bimtek-2026"
                  value={form.link_pendaftaran}
                  onChange={(e) => setForm({ ...form, link_pendaftaran: e.target.value })}
                  className="w-full p-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Deskripsi / Catatan Agenda</label>
                <textarea
                  rows={3}
                  placeholder="Jelaskan sasaran peserta, instruktur, dan hal yang perlu dipersiapkan..."
                  value={form.deskripsi}
                  onChange={(e) => setForm({ ...form, deskripsi: e.target.value })}
                  className="w-full p-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="agenda_is_active"
                  checked={form.is_active}
                  onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                  className="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                />
                <label htmlFor="agenda_is_active" className="text-xs font-bold text-slate-700 cursor-pointer">
                  Publikasikan secara aktif di portal publik
                </label>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={!form.title.trim() || saveMutation.isPending}
                onClick={() => saveMutation.mutate(form)}
                className="px-5 py-2.5 text-xs font-bold bg-emerald-800 text-white rounded-xl shadow hover:bg-emerald-700 disabled:opacity-50 cursor-pointer"
              >
                {saveMutation.isPending ? 'Menyimpan...' : (editId ? 'Simpan Perubahan' : 'Tambah Agenda')}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
