import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import DataTable from '../common/DataTable';
import {
  Users,
  ShieldCheck,
  ShieldAlert,
  Edit3,
  Building2,
  CheckCircle2,
  User,
  Plus,
  KeyRound,
  Trash2,
  Lock,
  Mail,
  Phone,
  CreditCard,
  Building,
  Check,
  X,
  AlertTriangle,
  RotateCw,
  Eye,
  EyeOff,
  Copy,
  Info
} from 'lucide-react';

const ROLE_BADGE_MAP = {
  SUPER_ADMIN: {
    label: 'Super Admin',
    bg: 'bg-rose-50 text-rose-700 border-rose-200',
    icon: ShieldAlert,
    desc: 'Akses penuh ke seluruh sistem & konfigurasi'
  },
  EDITOR: {
    label: 'Editor / Redaksi',
    bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    icon: Edit3,
    desc: 'Kelola Berita, Halaman, Media & Kategori'
  },
  ADMIN_OPD: {
    label: 'Admin OPD',
    bg: 'bg-blue-50 text-blue-700 border-blue-200',
    icon: Building2,
    desc: 'Kelola Layanan Unit & Berkas Masuk'
  },
  VERIFIKATOR: {
    label: 'Verifikator',
    bg: 'bg-amber-50 text-amber-700 border-amber-200',
    icon: CheckCircle2,
    desc: 'Verifikasi & Validasi Dokumen Pemohon'
  },
  WARGA: {
    label: 'Warga / ASN',
    bg: 'bg-slate-50 text-slate-700 border-slate-200',
    icon: User,
    desc: 'Pengguna Publik & Pemohon Layanan'
  }
};

export default function RbacManagerTab() {
  const queryClient = useQueryClient();
  const { user: currentUser } = useAuth();

  const [activeSubTab, setActiveSubTab] = useState('users'); // 'users' | 'matrix'
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Modals state
  const [userModalOpen, setUserModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create' | 'edit'
  const [selectedUser, setSelectedUser] = useState(null);

  const [resetModalOpen, setResetModalOpen] = useState(false);
  const [userToReset, setUserToReset] = useState(null);
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [tempPasswordResult, setTempPasswordResult] = useState('');
  const [copiedPassword, setCopiedPassword] = useState(false);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const [toastMessage, setToastMessage] = useState({ type: '', text: '' });

  // Form State for Create / Edit
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    nik: '',
    phone: '',
    password: '',
    role: 'EDITOR',
    opd_id: '',
    is_active: true
  });

  const showToast = (text, type = 'success') => {
    setToastMessage({ type, text });
    setTimeout(() => setToastMessage({ type: '', text: '' }), 4000);
  };

  // 1. Fetch RBAC Stats
  const { data: rbacStats } = useQuery({
    queryKey: ['rbacStats'],
    queryFn: async () => {
      const res = await api.get('/rbac/stats');
      return res?.data || null;
    }
  });

  // 2. Fetch Roles & Permissions Matrix
  const { data: rolesMatrix = [] } = useQuery({
    queryKey: ['rbacRolesMatrix'],
    queryFn: async () => {
      const res = await api.get('/rbac/roles');
      return res?.data || [];
    }
  });

  // 3. Fetch Master OPD for Dropdown Assignment
  const { data: opdList = [] } = useQuery({
    queryKey: ['masterOpdList'],
    queryFn: async () => {
      const res = await api.get('/master/opd');
      return res?.data || [];
    }
  });

  // 4. Fetch Users List (Server-side paginated & filtered)
  const { data: usersData, isLoading: isLoadingUsers } = useQuery({
    queryKey: ['rbacUsersList', page, limit, search, roleFilter, statusFilter],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit)
      });
      if (search) params.append('search', search);
      if (roleFilter) params.append('role', roleFilter);
      if (statusFilter !== '') params.append('is_active', statusFilter);

      const res = await api.get(`/rbac/users?${params.toString()}`);
      return res || { data: [], meta: { total: 0 } };
    }
  });

  const userItems = usersData?.data || [];
  const totalUsers = usersData?.meta?.total || 0;

  // Mutations
  const createMutation = useMutation({
    mutationFn: (payload) => api.post('/rbac/users', payload),
    onSuccess: (res) => {
      queryClient.invalidateQueries(['rbacUsersList']);
      queryClient.invalidateQueries(['rbacStats']);
      setUserModalOpen(false);
      showToast(res.message || 'Pengguna baru berhasil ditambahkan.');
    },
    onError: (err) => {
      showToast(err.response?.data?.message || err.message || 'Gagal menambahkan pengguna', 'error');
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }) => api.put(`/rbac/users/${id}`, payload),
    onSuccess: (res) => {
      queryClient.invalidateQueries(['rbacUsersList']);
      queryClient.invalidateQueries(['rbacStats']);
      setUserModalOpen(false);
      showToast(res.message || 'Data pengguna berhasil diperbarui.');
    },
    onError: (err) => {
      showToast(err.response?.data?.message || err.message || 'Gagal memperbarui pengguna', 'error');
    }
  });

  const toggleStatusMutation = useMutation({
    mutationFn: (id) => api.post(`/rbac/users/${id}/toggle-status`),
    onSuccess: (res) => {
      queryClient.invalidateQueries(['rbacUsersList']);
      queryClient.invalidateQueries(['rbacStats']);
      showToast(res.message || 'Status pengguna berhasil diperbarui.');
    },
    onError: (err) => {
      showToast(err.response?.data?.message || err.message || 'Gagal mengubah status', 'error');
    }
  });

  const resetPasswordMutation = useMutation({
    mutationFn: ({ id, new_password }) => api.post(`/rbac/users/${id}/reset-password`, { new_password }),
    onSuccess: (res) => {
      queryClient.invalidateQueries(['rbacUsersList']);
      if (res.temp_password) {
        setTempPasswordResult(res.temp_password);
      } else {
        setResetModalOpen(false);
        showToast('Password pengguna berhasil direset.');
      }
    },
    onError: (err) => {
      showToast(err.response?.data?.message || err.message || 'Gagal mereset password', 'error');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/rbac/users/${id}`),
    onSuccess: (res) => {
      queryClient.invalidateQueries(['rbacUsersList']);
      queryClient.invalidateQueries(['rbacStats']);
      setDeleteModalOpen(false);
      showToast(res.message || 'Pengguna berhasil dihapus.');
    },
    onError: (err) => {
      showToast(err.response?.data?.message || err.message || 'Gagal menghapus pengguna', 'error');
    }
  });

  // Modal Open Handlers
  const handleOpenCreate = () => {
    setModalMode('create');
    setSelectedUser(null);
    setFormData({
      name: '',
      email: '',
      nik: '',
      phone: '',
      password: '',
      role: 'EDITOR',
      opd_id: '',
      is_active: true
    });
    setUserModalOpen(true);
  };

  const handleOpenEdit = (user) => {
    setModalMode('edit');
    setSelectedUser(user);
    setFormData({
      name: user.name || '',
      email: user.email || '',
      nik: user.nik || '',
      phone: user.phone || '',
      password: '',
      role: user.role || 'EDITOR',
      opd_id: user.opd_id || '',
      is_active: user.is_active !== undefined ? user.is_active : true
    });
    setUserModalOpen(true);
  };

  const handleOpenReset = (user) => {
    setUserToReset(user);
    setNewPasswordInput('');
    setTempPasswordResult('');
    setCopiedPassword(false);
    setResetModalOpen(true);
  };

  const handleOpenDelete = (user) => {
    setUserToDelete(user);
    setDeleteModalOpen(true);
  };

  const handleSubmitUser = (e) => {
    e.preventDefault();
    if (modalMode === 'create') {
      createMutation.mutate(formData);
    } else {
      updateMutation.mutate({ id: selectedUser.id, payload: formData });
    }
  };

  const handleCopyPassword = () => {
    navigator.clipboard.writeText(tempPasswordResult);
    setCopiedPassword(true);
    setTimeout(() => setCopiedPassword(false), 2000);
  };

  // Columns for DataTable
  const userColumns = useMemo(() => [
    {
      header: 'Nama & Akun',
      accessor: 'name',
      render: (row) => {
        const isSelf = currentUser?.id === row.id;
        return (
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-800 text-white font-bold flex items-center justify-center text-xs shrink-0 shadow-2xs">
              {row.name ? row.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-slate-900 truncate">{row.name}</span>
                {isSelf && (
                  <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                    Saya
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 truncate">{row.email}</p>
            </div>
          </div>
        );
      }
    },
    {
      header: 'Hak Akses (Role)',
      accessor: 'role',
      render: (row) => {
        const config = ROLE_BADGE_MAP[row.role] || {
          label: row.role,
          bg: 'bg-slate-100 text-slate-700',
          icon: User
        };
        const Icon = config.icon;
        return (
          <div className="space-y-0.5">
            <span className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-lg border ${config.bg}`}>
              <Icon className="w-3.5 h-3.5" />
              <span>{config.label}</span>
            </span>
            {row.opd && (
              <p className="text-[10px] text-slate-500 truncate max-w-48 font-medium">
                {row.opd.nama_opd}
              </p>
            )}
          </div>
        );
      }
    },
    {
      header: 'Identitas & Kontak',
      accessor: 'nik',
      render: (row) => (
        <div className="text-xs space-y-0.5 text-slate-600">
          <p className="font-mono">{row.nik ? `NIK: ${row.nik}` : '-'}</p>
          <p className="text-[11px] text-slate-400">{row.phone || '-'}</p>
        </div>
      )
    },
    {
      header: 'Status',
      accessor: 'is_active',
      render: (row) => {
        const isSelf = currentUser?.id === row.id;
        return (
          <button
            type="button"
            disabled={isSelf || toggleStatusMutation.isPending}
            onClick={() => toggleStatusMutation.mutate(row.id)}
            title={isSelf ? 'Tidak dapat menonaktifkan akun sendiri' : 'Klik untuk ubah status'}
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
              row.is_active
                ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
            } ${isSelf ? 'opacity-60 cursor-not-allowed' : ''}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${row.is_active ? 'bg-emerald-600' : 'bg-slate-400'}`} />
            <span>{row.is_active ? 'Aktif' : 'Non-aktif'}</span>
          </button>
        );
      }
    },
    {
      header: 'Aksi',
      accessor: 'id',
      align: 'right',
      render: (row) => {
        const isSelf = currentUser?.id === row.id;
        return (
          <div className="flex items-center justify-end gap-1">
            <button
              type="button"
              onClick={() => handleOpenEdit(row)}
              className="p-1.5 text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
              title="Edit Data & Role"
            >
              <Edit3 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => handleOpenReset(row)}
              className="p-1.5 text-slate-600 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors cursor-pointer"
              title="Reset Password"
            >
              <KeyRound className="w-4 h-4" />
            </button>
            {!isSelf && (
              <button
                type="button"
                onClick={() => handleOpenDelete(row)}
                className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                title="Hapus Pengguna"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        );
      }
    }
  ], [currentUser, toggleStatusMutation.isPending]);

  return (
    <div className="space-y-6">
      
      {/* Toast Notification */}
      {toastMessage.text && (
        <div className={`p-4 rounded-xl border flex items-center justify-between text-xs font-bold animate-in fade-in ${
          toastMessage.type === 'error'
            ? 'bg-rose-50 text-rose-800 border-rose-200'
            : 'bg-emerald-50 text-emerald-800 border-emerald-200'
        }`}>
          <div className="flex items-center gap-2">
            {toastMessage.type === 'error' ? (
              <AlertTriangle className="w-4 h-4 text-rose-600" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            )}
            <span>{toastMessage.text}</span>
          </div>
          <button type="button" onClick={() => setToastMessage({ type: '', text: '' })} className="cursor-pointer">
            <X className="w-4 h-4 opacity-60 hover:opacity-100" />
          </button>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-teal-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-8 w-64 h-64 bg-emerald-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-800/80 border border-emerald-700/60 text-amber-300 text-xs font-bold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Role-Based Access Control (RBAC) Engine</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Manajemen Pengguna & Hak Akses
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100/80 leading-relaxed">
              Atur hak akses operasional untuk Super Admin, Redaktur Berita, Admin OPD, Verifikator SIASN, dan Pengguna Publik secara aman dan tersentralisasi.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleOpenCreate}
              className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 active:scale-95 text-slate-950 font-black rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Pengguna</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500">Total User</span>
            <Users className="w-4 h-4 text-slate-400" />
          </div>
          <p className="text-xl font-black text-slate-900 mt-2">{rbacStats?.totalUsers || totalUsers || 0}</p>
          <span className="text-[10px] text-emerald-600 font-bold">● {rbacStats?.activeUsers || 0} Aktif</span>
        </div>

        <div className="p-4 bg-rose-50/50 rounded-2xl border border-rose-200/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-rose-800">Super Admin</span>
            <ShieldAlert className="w-4 h-4 text-rose-600" />
          </div>
          <p className="text-xl font-black text-rose-950 mt-2">{rbacStats?.byRole?.SUPER_ADMIN || 0}</p>
          <span className="text-[10px] text-rose-600 font-medium">Akses Penuh</span>
        </div>

        <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-200/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-emerald-800">Editor / Redaksi</span>
            <Edit3 className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-xl font-black text-emerald-950 mt-2">{rbacStats?.byRole?.EDITOR || 0}</p>
          <span className="text-[10px] text-emerald-600 font-medium">Konten Berita/CMS</span>
        </div>

        <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-200/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-blue-800">Admin OPD</span>
            <Building2 className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-xl font-black text-blue-950 mt-2">{rbacStats?.byRole?.ADMIN_OPD || 0}</p>
          <span className="text-[10px] text-blue-600 font-medium">Unit Kerja</span>
        </div>

        <div className="p-4 bg-amber-50/50 rounded-2xl border border-amber-200/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-amber-800">Verifikator</span>
            <CheckCircle2 className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-xl font-black text-amber-950 mt-2">{rbacStats?.byRole?.VERIFIKATOR || 0}</p>
          <span className="text-[10px] text-amber-600 font-medium">Validasi Berkas</span>
        </div>

        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-600">Warga / ASN</span>
            <User className="w-4 h-4 text-slate-500" />
          </div>
          <p className="text-xl font-black text-slate-900 mt-2">{rbacStats?.byRole?.WARGA || 0}</p>
          <span className="text-[10px] text-slate-500 font-medium">Pemohon Layanan</span>
        </div>
      </div>

      {/* Sub-tab Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200">
        <button
          type="button"
          onClick={() => setActiveSubTab('users')}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
            activeSubTab === 'users'
              ? 'border-emerald-700 text-emerald-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Daftar Akun Pengguna ({totalUsers})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('matrix')}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
            activeSubTab === 'matrix'
              ? 'border-emerald-700 text-emerald-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Matriks Hak Akses & Izin (Role Matrix)</span>
        </button>
      </div>

      {/* SUB-TAB 1: USERS LIST */}
      {activeSubTab === 'users' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-black text-slate-900">Daftar Pengguna Sistem</h2>
              <p className="text-xs text-slate-500">Cari, saring berdasarkan role atau status akun, dan kelola kredensial pengguna.</p>
            </div>
          </div>

          <DataTable
            columns={userColumns}
            data={userItems}
            isLoading={isLoadingUsers}
            serverSide={true}
            totalItems={totalUsers}
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
              setRoleFilter(filters.role || '');
              setStatusFilter(filters.is_active || '');
              setPage(1);
            }}
            searchPlaceholder="Cari nama, email, NIK, atau no HP..."
            filters={[
              {
                key: 'role',
                label: 'Hak Akses (Role)',
                options: [
                  { label: 'SUPER_ADMIN', value: 'SUPER_ADMIN' },
                  { label: 'EDITOR', value: 'EDITOR' },
                  { label: 'ADMIN_OPD', value: 'ADMIN_OPD' },
                  { label: 'VERIFIKATOR', value: 'VERIFIKATOR' },
                  { label: 'WARGA', value: 'WARGA' }
                ]
              },
              {
                key: 'is_active',
                label: 'Status Akun',
                options: [
                  { label: 'Aktif', value: 'true' },
                  { label: 'Non-aktif', value: 'false' }
                ]
              }
            ]}
            emptyMessage="Tidak ada pengguna yang sesuai dengan kriteria pencarian."
          />
        </div>
      )}

      {/* SUB-TAB 2: ROLE & PERMISSION MATRIX */}
      {activeSubTab === 'matrix' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {rolesMatrix.map((item) => (
              <div
                key={item.role}
                className="bg-white rounded-3xl border border-slate-200/90 p-6 space-y-4 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <span className={`px-3 py-1 rounded-xl text-xs font-bold border ${item.badgeColor}`}>
                    {item.role}
                  </span>
                  <span className="text-xs font-bold text-slate-400">
                    {rbacStats?.byRole?.[item.role] || 0} Akun
                  </span>
                </div>

                <div>
                  <h3 className="font-black text-slate-900 text-base">{item.name}</h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">{item.description}</p>
                </div>

                <div className="border-t border-slate-100 pt-3 space-y-2">
                  <p className="text-[11px] font-black uppercase text-slate-400 tracking-wider">
                    Izin Modul Sistem:
                  </p>
                  <div className="space-y-1.5">
                    {item.permissions.map((p, idx) => (
                      <div key={idx} className="flex items-start justify-between gap-2 text-xs py-1 border-b border-slate-50 last:border-0">
                        <span className="font-bold text-slate-700">{p.module}</span>
                        <span className={`text-[11px] text-right font-medium ${
                          p.access.includes('Full') 
                            ? 'text-emerald-700 font-bold' 
                            : p.access.includes('Tidak') 
                              ? 'text-slate-400' 
                              : 'text-blue-700'
                        }`}>
                          {p.access}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL: CREATE / EDIT USER */}
      {userModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-black text-slate-900">
                  {modalMode === 'create' ? 'Tambah Pengguna Baru' : `Edit Pengguna: ${selectedUser?.name}`}
                </h3>
                <p className="text-xs text-slate-500">
                  {modalMode === 'create' 
                    ? 'Buat kredensial akun dan tentukan hak akses peran (RBAC).' 
                    : 'Perbarui data identitas atau ubah hak akses pengguna.'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setUserModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitUser} className="space-y-4">
              {/* Nama Lengkap */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span>Nama Lengkap *</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Contoh: Muhammad Ilham, S.STP"
                  className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                />
              </div>

              {/* Email & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span>Email Resmi *</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="nama@acehtamiangkab.go.id"
                    className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>No. WhatsApp / HP</span>
                  </label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="081234567890"
                    className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>
              </div>

              {/* NIK */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5 text-slate-400" />
                  <span>NIK KTP (16 Digit Warga / ASN)</span>
                </label>
                <input
                  type="text"
                  maxLength={16}
                  value={formData.nik}
                  onChange={(e) => setFormData({ ...formData, nik: e.target.value })}
                  placeholder="1116xxxxxxxxxxxx"
                  className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none font-mono"
                />
              </div>

              {/* Password (Required on create, optional on edit) */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-slate-400" />
                  <span>{modalMode === 'create' ? 'Password Akun *' : 'Ubah Password (Kosongkan jika tidak diganti)'}</span>
                </label>
                <input
                  type="password"
                  required={modalMode === 'create'}
                  minLength={6}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder={modalMode === 'create' ? 'Minimal 6 karakter...' : 'Ketik password baru...'}
                  className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                />
              </div>

              {/* Role Selection */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Hak Akses Peran (RBAC Role) *</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {Object.entries(ROLE_BADGE_MAP).map(([key, cfg]) => {
                    const isSelected = formData.role === key;
                    const Icon = cfg.icon;
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setFormData({ ...formData, role: key })}
                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-start gap-2.5 ${
                          isSelected
                            ? 'bg-emerald-50 border-emerald-600 ring-2 ring-emerald-600/20'
                            : 'bg-white border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <Icon className={`w-4 h-4 mt-0.5 shrink-0 ${isSelected ? 'text-emerald-700' : 'text-slate-400'}`} />
                        <div>
                          <p className={`text-xs font-bold ${isSelected ? 'text-emerald-900' : 'text-slate-800'}`}>
                            {cfg.label}
                          </p>
                          <p className="text-[10px] text-slate-400 leading-tight mt-0.5">{cfg.desc}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* OPD Assignment (If ADMIN_OPD or VERIFIKATOR) */}
              {(formData.role === 'ADMIN_OPD' || formData.role === 'VERIFIKATOR') && (
                <div className="space-y-1 pt-2">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-blue-600" />
                    <span>Penugasan Unit / OPD Terkait</span>
                  </label>
                  <select
                    value={formData.opd_id}
                    onChange={(e) => setFormData({ ...formData, opd_id: e.target.value })}
                    className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  >
                    <option value="">-- Pilih Instansi / OPD --</option>
                    {opdList.map((opd) => (
                      <option key={opd.id} value={opd.id}>
                        {opd.nama_opd} ({opd.kode_opd || 'OPD'})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Active Toggle */}
              <div className="pt-2 flex items-center gap-2">
                <input
                  type="checkbox"
                  id="user_active_checkbox"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="w-4 h-4 rounded text-emerald-800 focus:ring-emerald-600"
                />
                <label htmlFor="user_active_checkbox" className="text-xs font-bold text-slate-700 cursor-pointer">
                  Akun Aktif (Dapat Login ke Sistem)
                </label>
              </div>

              <div className="pt-4 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setUserModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                  className="px-5 py-2 text-xs font-bold bg-emerald-800 hover:bg-emerald-700 text-white rounded-xl shadow-xs transition-all cursor-pointer disabled:opacity-50"
                >
                  {createMutation.isPending || updateMutation.isPending ? 'Menyimpan...' : 'Simpan Pengguna'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: RESET PASSWORD */}
      {resetModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-amber-600" />
                <h3 className="text-base font-black text-slate-900">Reset Password Pengguna</h3>
              </div>
              <button
                type="button"
                onClick={() => setResetModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-4 text-xs space-y-1">
              <p className="font-bold text-amber-900">Pengguna Target:</p>
              <p className="text-slate-700 font-semibold">{userToReset?.name} ({userToReset?.email})</p>
              <p className="text-slate-500 text-[11px]">Role: {userToReset?.role}</p>
            </div>

            {tempPasswordResult ? (
              <div className="space-y-4">
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-2">
                  <p className="text-xs font-bold text-emerald-900">Password Baru Berhasil Dibuat:</p>
                  <div className="flex items-center justify-between bg-white p-2.5 rounded-xl border border-emerald-300 font-mono text-sm font-black text-emerald-950">
                    <span>{tempPasswordResult}</span>
                    <button
                      type="button"
                      onClick={handleCopyPassword}
                      className="px-2.5 py-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 text-xs rounded-lg font-sans font-bold flex items-center gap-1 cursor-pointer"
                    >
                      {copiedPassword ? <Check className="w-3.5 h-3.5 text-emerald-700" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedPassword ? 'Tersalin' : 'Salin'}</span>
                    </button>
                  </div>
                  <p className="text-[10px] text-slate-500">Berikan password ini kepada pengguna untuk dapat login kembali.</p>
                </div>

                <button
                  type="button"
                  onClick={() => setResetModalOpen(false)}
                  className="w-full py-2.5 bg-emerald-800 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold cursor-pointer"
                >
                  Selesai
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">
                    Password Baru (Opsional - Kosongkan untuk password default <code className="bg-slate-100 px-1 py-0.5 rounded text-amber-700">Tamiang2026!</code>)
                  </label>
                  <input
                    type="text"
                    value={newPasswordInput}
                    onChange={(e) => setNewPasswordInput(e.target.value)}
                    placeholder="Contoh: PasswordBaru123!"
                    className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none font-mono"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setResetModalOpen(false)}
                    className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="button"
                    disabled={resetPasswordMutation.isPending}
                    onClick={() => resetPasswordMutation.mutate({ id: userToReset.id, new_password: newPasswordInput })}
                    className="px-5 py-2 text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white rounded-xl shadow-xs cursor-pointer disabled:opacity-50"
                  >
                    {resetPasswordMutation.isPending ? 'Mereset...' : 'Reset Sekarang'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL: CONFIRM DELETE USER */}
      {deleteModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 text-center">
            <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-2xl mx-auto flex items-center justify-center">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900">Hapus Akun Pengguna?</h3>
              <p className="text-xs text-slate-500 mt-1">
                Apakah Anda yakin ingin menghapus akun <span className="font-bold text-slate-800">'{userToDelete?.name}'</span> ({userToDelete?.email})? Tindakan ini tidak dapat dibatalkan.
              </p>
            </div>
            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeleteModalOpen(false)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={deleteMutation.isPending}
                onClick={() => deleteMutation.mutate(userToDelete.id)}
                className="px-5 py-2 text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white rounded-xl shadow-xs cursor-pointer disabled:opacity-50"
              >
                {deleteMutation.isPending ? 'Menghapus...' : 'Ya, Hapus'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
