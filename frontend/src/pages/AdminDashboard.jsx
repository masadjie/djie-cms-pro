import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { 
  Building2, 
  LayoutDashboard,
  Newspaper,
  MessageSquare,
  FolderOpen,
  Image as ImageIcon,
  Sliders,
  Activity,
  Plus,
  Palette,
  Lock,
  ExternalLink,
  ChevronRight,
  Eye,
  Edit,
  Trash2,
  Calendar,
  Database,
  HardDrive,
  Users,
  Tag,
  CheckSquare,
  Square,
  Filter,
  SlidersHorizontal,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ArrowUpDown,
  RefreshCw,
  Layout,
  Star,
  X
} from 'lucide-react';
import Badge from '../components/common/Badge';
import DataTable from '../components/common/DataTable';
import { useConfirm } from '../components/common/ConfirmDialog';

// Sub-components
import AdminHeader from '../components/admin/AdminHeader';
import AdminOverviewTab from '../components/admin/AdminOverviewTab';
import MenuManagerTab from '../components/admin/MenuManagerTab';
import DokumenManagerTab from '../components/admin/DokumenManagerTab';
import GaleriManagerTab from '../components/admin/GaleriManagerTab';
import BannerManagerTab from '../components/admin/BannerManagerTab';
import ThemeSettingTab from '../components/admin/ThemeSettingTab';
import PageManagerTab from '../components/admin/PageManagerTab';
import AgendaManagerTab from '../components/admin/AgendaManagerTab';
import SystemMaintenanceTab from '../components/admin/SystemMaintenanceTab';
import FileManagerTab from '../components/admin/FileManagerTab';
import CategoryManagerTab from '../components/admin/CategoryManagerTab';
import RbacManagerTab from '../components/admin/RbacManagerTab';
import KomentarModerationTab from '../components/admin/KomentarModerationTab';
import PengaturanAplikasiTab from '../components/admin/PengaturanAplikasiTab';
import TestimoniManagerTab from '../components/admin/TestimoniManagerTab';
import AuditSecurityTab from '../components/admin/AuditSecurityTab';
import WidgetManagerTab from '../components/admin/WidgetManagerTab';

export default function AdminDashboard() {
  const confirm = useConfirm();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Define tab access map based on user RBAC role
  const allowedTabs = useMemo(() => {
    if (!user) return [];
    const role = user.role;
    if (role === 'SUPER_ADMIN') {
      return [
        { key: 'overview', label: 'Dashboard', icon: LayoutDashboard },
        { key: 'menu', label: 'Menu Navigasi', icon: Sliders },
        { key: 'pages', label: 'Halaman (Pages)', icon: FolderOpen },
        { key: 'berita', label: 'Berita & Artikel', icon: Newspaper },
        { key: 'komentar', label: 'Moderasi Komentar', icon: MessageSquare },
        { key: 'kategori', label: 'Kategori Berita', icon: Tag },
        { key: 'files', label: 'Manajemen File & MinIO', icon: HardDrive },
        { key: 'rbac', label: 'Pengguna & RBAC', icon: Users },
        { key: 'agenda', label: 'Agenda & Acara', icon: Calendar },
        { key: 'layanan', label: 'Katalog Layanan', icon: Building2 },
        { key: 'dokumen', label: 'Dokumen Publik', icon: FolderOpen },
        { key: 'galeri', label: 'Galeri Media', icon: ImageIcon },
        { key: 'banner', label: 'Banner Slider', icon: Sliders },
        { key: 'testimoni', label: 'Testimoni & Rating', icon: Star },
        { key: 'widget', label: 'Manajemen Widget', icon: Layout },
        { key: 'audit', label: 'Audit Trail', icon: Activity },
        { key: 'theme', label: 'Pengaturan Tema', icon: Palette },
        { key: 'settings', label: 'Pengaturan Aplikasi & SEO', icon: Sliders },
        { key: 'maintenance', label: 'Pemeliharaan & Backup', icon: Database }
      ];
    } else if (role === 'EDITOR') {
      return [
        { key: 'overview', label: 'Dashboard', icon: LayoutDashboard },
        { key: 'pages', label: 'Halaman (Pages)', icon: FolderOpen },
        { key: 'berita', label: 'Berita & Artikel', icon: Newspaper },
        { key: 'komentar', label: 'Moderasi Komentar', icon: MessageSquare },
        { key: 'kategori', label: 'Kategori Berita', icon: Tag },
        { key: 'files', label: 'Manajemen File & MinIO', icon: HardDrive },
        { key: 'agenda', label: 'Agenda & Acara', icon: Calendar },
        { key: 'galeri', label: 'Galeri Media', icon: ImageIcon },
        { key: 'banner', label: 'Banner Slider', icon: Sliders },
        { key: 'testimoni', label: 'Testimoni & Rating', icon: Star },
        { key: 'widget', label: 'Manajemen Widget', icon: Layout },
        { key: 'theme', label: 'Pengaturan Tema', icon: Palette }
      ];
    } else if (role === 'VERIFIKATOR' || role === 'ADMIN_OPD') {
      return [
        { key: 'overview', label: 'Dashboard', icon: LayoutDashboard },
        { key: 'layanan', label: 'Katalog Layanan', icon: Building2 },
        { key: 'dokumen', label: 'Dokumen Publik', icon: FolderOpen }
      ];
    }
    return [{ key: 'overview', label: 'Dashboard', icon: LayoutDashboard }];
  }, [user]);

  // Tab state synced with URL Search Param '?tab=...' for persistence across page refresh
  const activeTab = useMemo(() => {
    const tabUrl = searchParams.get('tab');
    if (tabUrl && allowedTabs.some((t) => t.key === tabUrl)) {
      return tabUrl;
    }
    return 'overview';
  }, [searchParams, allowedTabs]);

  const handleTabChange = (newTab) => {
    setSearchParams({ tab: newTab });
  };

  // Berita Pagination & Comprehensive Filter State (Server-side)
  const [beritaPage, setBeritaPage] = useState(1);
  const [beritaLimit, setBeritaLimit] = useState(10);
  const [beritaSearch, setBeritaSearch] = useState('');
  const [beritaStatus, setBeritaStatus] = useState('');
  const [beritaKategori, setBeritaKategori] = useState('');
  const [beritaSort, setBeritaSort] = useState('latest');
  const [beritaFeatured, setBeritaFeatured] = useState('');
  const [beritaPinned, setBeritaPinned] = useState('');
  const [beritaDateFrom, setBeritaDateFrom] = useState('');
  const [beritaDateTo, setBeritaDateTo] = useState('');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Bulk Selection State for Berita
  const [selectedBeritaIds, setSelectedBeritaIds] = useState([]);
  const [bulkActionType, setBulkActionType] = useState('');
  const [targetKategoriForBulk, setTargetKategoriForBulk] = useState('');
  const [bulkToast, setBulkToast] = useState({ type: '', text: '' });

  // Layanan Pagination & Filter State (Server-side)
  const [layananPage, setLayananPage] = useState(1);
  const [layananLimit, setLayananLimit] = useState(10);
  const [layananSearch, setLayananSearch] = useState('');

  // 1. Fetch Analytics Overview
  const { data: analyticsData } = useQuery({
    queryKey: ['cmsAnalytics'],
    queryFn: async () => {
      try {
        const res = await api.get('/cms/analytics');
        return res?.data || res || null;
      } catch (err) {
        return null;
      }
    }
  });

  // 1b. Fetch Categories for Filter Dropdown
  const { data: categoriesData = [] } = useQuery({
    queryKey: ['beritaKategoriListFilter'],
    queryFn: async () => {
      try {
        const res = await api.get('/berita/kategori');
        return res?.data || [];
      } catch (err) {
        return [];
      }
    }
  });

  // 2. Fetch Berita (Server-Side Paginated with comprehensive filters)
  const { data: beritaData, isLoading: isBeritaLoading } = useQuery({
    queryKey: [
      'adminBeritaList',
      beritaPage,
      beritaLimit,
      beritaSearch,
      beritaStatus,
      beritaKategori,
      beritaSort,
      beritaFeatured,
      beritaPinned,
      beritaDateFrom,
      beritaDateTo
    ],
    queryFn: async () => {
      try {
        const params = new URLSearchParams({
          page: String(beritaPage),
          limit: String(beritaLimit)
        });
        if (beritaSearch) params.append('search', beritaSearch);
        if (beritaStatus) params.append('status', beritaStatus);
        if (beritaKategori) params.append('kategori_id', beritaKategori);
        if (beritaSort) params.append('sort', beritaSort);
        if (beritaFeatured) params.append('is_featured', beritaFeatured);
        if (beritaPinned) params.append('is_pinned', beritaPinned);
        if (beritaDateFrom) params.append('date_from', beritaDateFrom);
        if (beritaDateTo) params.append('date_to', beritaDateTo);

        const res = await api.get(`/berita?${params.toString()}`);
        return res?.data || res || { data: [], total: 0 };
      } catch (err) {
        return { data: [], total: 0 };
      }
    }
  });

  // 3. Fetch Layanan (Server-Side Paginated)
  const { data: layananData, isLoading: isLayananLoading } = useQuery({
    queryKey: ['adminLayananList', layananPage, layananLimit, layananSearch],
    queryFn: async () => {
      try {
        const params = new URLSearchParams({
          page: String(layananPage),
          limit: String(layananLimit)
        });
        if (layananSearch) params.append('search', layananSearch);
        const res = await api.get(`/layanan?${params.toString()}`);
        return res?.data || res || { data: [], meta: { total: 0 } };
      } catch (err) {
        return { data: [], meta: { total: 0 } };
      }
    }
  });

  // Mutations
  const deleteBeritaMutation = useMutation({
    mutationFn: async (beritaId) => await api.delete(`/berita/${beritaId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminBeritaList'] });
      queryClient.invalidateQueries({ queryKey: ['cmsAnalytics'] });
      setBulkToast({ type: 'success', text: 'Berita berhasil dihapus.' });
      setTimeout(() => setBulkToast({ type: '', text: '' }), 3000);
    }
  });

  // Bulk Action Mutation
  const bulkActionMutation = useMutation({
    mutationFn: async ({ action, ids, data }) => {
      return await api.post('/berita/bulk-action', { action, ids, data });
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['adminBeritaList'] });
      queryClient.invalidateQueries({ queryKey: ['cmsAnalytics'] });
      setSelectedBeritaIds([]);
      setBulkActionType('');
      setTargetKategoriForBulk('');
      setBulkToast({
        type: 'success',
        text: res?.message || 'Aksi massal berhasil diterapkan pada berita terpilih!'
      });
      setTimeout(() => setBulkToast({ type: '', text: '' }), 4000);
    },
    onError: (err) => {
      setBulkToast({
        type: 'error',
        text: err?.response?.data?.message || err.message || 'Gagal menjalankan aksi massal.'
      });
      setTimeout(() => setBulkToast({ type: '', text: '' }), 4000);
    }
  });

  const handleToggleSelectAll = (items) => {
    if (!items || items.length === 0) return;
    const currentIds = items.map((i) => i.id);
    const allSelected = currentIds.every((id) => selectedBeritaIds.includes(id));
    if (allSelected) {
      setSelectedBeritaIds((prev) => prev.filter((id) => !currentIds.includes(id)));
    } else {
      setSelectedBeritaIds((prev) => Array.from(new Set([...prev, ...currentIds])));
    }
  };

  const handleToggleSelectOne = (id) => {
    setSelectedBeritaIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleRunBulkAction = async () => {
    if (selectedBeritaIds.length === 0) {
      alert('Pilih setidaknya 1 berita terlebih dahulu.');
      return;
    }
    if (!bulkActionType) {
      alert('Silakan pilih jenis aksi massal.');
      return;
    }

    if (bulkActionType === 'delete') {
      const ok = await confirm({
        title: 'Hapus Berita Massal',
        message: `Apakah Anda yakin ingin menghapus ${selectedBeritaIds.length} berita terpilih secara permanen? Data yang dihapus tidak dapat dipulihkan.`,
        confirmText: `Ya, Hapus (${selectedBeritaIds.length}) Berita`,
        variant: 'danger'
      });
      if (!ok) return;
      bulkActionMutation.mutate({ action: 'delete', ids: selectedBeritaIds });
    } else if (bulkActionType === 'change_category') {
      if (!targetKategoriForBulk) {
        alert('Pilih kategori tujuan pemindahan.');
        return;
      }
      bulkActionMutation.mutate({
        action: 'change_category',
        ids: selectedBeritaIds,
        data: { kategori_id: targetKategoriForBulk }
      });
    } else {
      bulkActionMutation.mutate({ action: bulkActionType, ids: selectedBeritaIds });
    }
  };

  // Memoized lists (MUST be called before any conditional return)
  const counts = analyticsData?.counts || {};

  const beritaItems = useMemo(() => {
    return Array.isArray(beritaData) 
      ? beritaData 
      : (Array.isArray(beritaData?.data) ? beritaData.data : (beritaData?.rows || []));
  }, [beritaData]);

  const totalBerita = useMemo(() => {
    if (typeof beritaData?.total === 'number') return beritaData.total;
    if (Array.isArray(beritaData)) return beritaData.length;
    if (Array.isArray(beritaData?.data)) return beritaData.total || beritaData.data.length;
    return 0;
  }, [beritaData]);

  const layananItems = useMemo(() => {
    return Array.isArray(layananData) 
      ? layananData 
      : (Array.isArray(layananData?.data) ? layananData.data : (layananData?.rows || []));
  }, [layananData]);

  const totalLayanan = useMemo(() => {
    if (typeof layananData?.meta?.total === 'number') return layananData.meta.total;
    if (typeof layananData?.total === 'number') return layananData.total;
    if (Array.isArray(layananData)) return layananData.length;
    if (Array.isArray(layananData?.data)) return layananData.meta?.total || layananData.data.length;
    return 0;
  }, [layananData]);

  const auditItems = useMemo(() => {
    return analyticsData?.recentAudits || [];
  }, [analyticsData]);

  // Auth gate check (placed safely after all hook calls)
  if (!user || user.role === 'WARGA') {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full p-8 bg-white rounded-3xl shadow-2xl text-center space-y-6 border border-slate-200">
          <div className="w-16 h-16 bg-emerald-50 text-emerald-800 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
            <Lock className="w-8 h-8 text-amber-500" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-black text-slate-900">Akses Dibatasi</h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              Silakan masuk menggunakan akun Administrator BKPSDM Kabupaten Aceh Tamiang.
            </p>
          </div>
          <Link
            to="/login"
            className="w-full py-3 px-6 bg-slate-950 hover:bg-slate-900 text-white text-xs font-black rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
          >
            <span>Menuju Halaman Login</span>
            <ExternalLink className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  // Columns Configuration for Berita DataTable
  const isAllCurrentSelected = beritaItems.length > 0 && beritaItems.every((b) => selectedBeritaIds.includes(b.id));

  const beritaColumns = [
    {
      header: (
        <div className="flex items-center justify-center">
          <input
            type="checkbox"
            checked={isAllCurrentSelected}
            onChange={() => handleToggleSelectAll(beritaItems)}
            className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500 cursor-pointer"
            title="Pilih Semua di Halaman Ini"
          />
        </div>
      ),
      width: '45px',
      align: 'center',
      render: (item) => {
        const isSelected = selectedBeritaIds.includes(item.id);
        return (
          <div className="flex items-center justify-center">
            <input
              type="checkbox"
              checked={isSelected}
              onChange={() => handleToggleSelectOne(item.id)}
              className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500 cursor-pointer"
            />
          </div>
        );
      }
    },
    {
      header: 'No',
      width: '55px',
      align: 'center',
      render: (_, index) => <span className="font-mono text-slate-400 font-bold">#{index}</span>
    },
    {
      header: 'Judul Artikel / Berita',
      accessor: 'title',
      render: (item) => (
        <div className="max-w-md space-y-1">
          <div className="flex items-center gap-1.5 flex-wrap">
            <p className="font-bold text-slate-900 line-clamp-1 hover:text-emerald-700 transition-colors">
              {item.title}
            </p>
            {item.is_pinned && (
              <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-300">
                Pinned
              </span>
            )}
            {item.is_featured && (
              <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-purple-100 text-purple-800 border border-purple-300">
                ⭐ Utama
              </span>
            )}
          </div>
          <p className="text-[11px] text-slate-400 font-mono">/berita/{item.slug}</p>
        </div>
      )
    },
    {
      header: 'Kategori',
      render: (item) => (
        <span className="font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 text-xs">
          {item.kategori?.nama_kategori || 'Umum'}
        </span>
      )
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (item) => {
        const isScheduled = item.status === 'PUBLISHED' && item.published_at && new Date(item.published_at) > new Date();
        const isPublished = item.status === 'PUBLISHED' && !isScheduled;
        const isDraft = item.status === 'DRAFT';
        return (
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold border ${
            isScheduled
              ? 'bg-sky-50 text-sky-800 border-sky-200'
              : isPublished
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : isDraft
                  ? 'bg-amber-50 text-amber-800 border-amber-200'
                  : 'bg-slate-100 text-slate-700 border-slate-200'
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${
              isScheduled ? 'bg-sky-600 animate-pulse' : isPublished ? 'bg-emerald-600' : isDraft ? 'bg-amber-500' : 'bg-slate-400'
            }`} />
            <span>
              {isScheduled 
                ? `Terjadwal (${new Date(item.published_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })})` 
                : isPublished 
                  ? 'Terpublikasi' 
                  : isDraft 
                    ? 'Konsep (Draft)' 
                    : (item.status || 'Draft')}
            </span>
          </span>
        );
      }
    },
    {
      header: 'Views',
      accessor: 'views_count',
      align: 'center',
      render: (item) => (
        <span className="font-mono font-black text-slate-700">{item.views_count || 0}</span>
      )
    },
    {
      header: 'Tanggal',
      render: (item) => (
        <span className="text-slate-500">{new Date(item.published_at || item.created_at).toLocaleDateString('id-ID')}</span>
      )
    },
    {
      header: 'Aksi',
      align: 'right',
      render: (item) => (
        <div className="flex items-center justify-end gap-1.5">
          <a 
            href={`/berita/${item.slug}`} 
            target="_blank" 
            rel="noreferrer" 
            className="inline-flex items-center gap-1 text-slate-700 hover:text-slate-900 font-bold bg-slate-100 hover:bg-slate-200 px-2 py-1 rounded-lg transition-colors text-xs"
            title="Lihat Pratinjau Publik"
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Lihat</span>
          </a>

          <button 
            type="button"
            onClick={() => navigate(`/admin/berita/edit/${item.id}`)}
            className="inline-flex items-center gap-1 text-emerald-800 hover:text-emerald-950 font-bold bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded-lg transition-colors text-xs cursor-pointer"
            title="Edit Berita & SEO"
          >
            <Edit className="w-3.5 h-3.5" />
            <span>Edit</span>
          </button>

          <button 
            type="button"
            onClick={async () => {
              const ok = await confirm({
                title: 'Hapus Artikel Berita',
                message: `Apakah Anda yakin ingin menghapus artikel "${item.title}"?`,
                confirmText: 'Ya, Hapus Artikel',
                variant: 'danger'
              });
              if (ok) {
                deleteBeritaMutation.mutate(item.id);
              }
            }}
            className="inline-flex items-center gap-1 text-red-700 hover:text-red-900 font-bold bg-red-50 hover:bg-red-100 p-1 rounded-lg transition-colors text-xs cursor-pointer"
            title="Hapus Berita"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      )
    }
  ];

  // Columns Configuration for Layanan DataTable
  const layananColumns = [
    {
      header: 'No',
      width: '60px',
      align: 'center',
      render: (_, index) => <span className="font-mono text-slate-400 font-bold">#{index}</span>
    },
    {
      header: 'Nama Layanan Kepegawaian',
      accessor: 'nama_layanan',
      render: (item) => (
        <div>
          <p className="font-bold text-slate-900">{item.nama_layanan}</p>
          <p className="text-[11px] text-slate-500 line-clamp-1">{item.deskripsi}</p>
        </div>
      )
    },
    {
      header: 'Kategori Modul',
      render: (item) => (
        <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
          {item.kategori?.nama_kategori || 'Kepegawaian'}
        </span>
      )
    },
    {
      header: 'Estimasi SLA',
      render: (item) => (
        <span className="font-semibold text-slate-600 font-mono text-xs">
          {item.estimasi_waktu || '1-3 Hari'}
        </span>
      )
    },
    {
      header: 'Status',
      render: (item) => (
        <Badge variant={item.is_active !== false ? 'emerald' : 'amber'} size="sm">
          {item.is_active !== false ? 'Aktif' : 'Non-aktif'}
        </Badge>
      )
    }
  ];

  // Columns Configuration for Audit Trail DataTable
  const auditColumns = [
    {
      header: 'No',
      width: '60px',
      align: 'center',
      render: (_, index) => <span className="font-mono text-slate-400 font-bold">#{index}</span>
    },
    {
      header: 'Waktu Aktivitas',
      render: (item) => (
        <span className="font-mono text-slate-600 font-medium">
          {new Date(item.created_at).toLocaleString('id-ID')}
        </span>
      )
    },
    {
      header: 'Administrator / User',
      render: (item) => (
        <div>
          <span className="font-bold text-slate-900">{item.user?.name || 'Administrator'}</span>
          <span className="text-[11px] text-slate-400 block font-mono">{item.user?.email || '-'}</span>
        </div>
      )
    },
    {
      header: 'Aksi (Action)',
      render: (item) => (
        <span className="px-2.5 py-0.5 bg-slate-100 text-slate-800 font-mono font-bold rounded text-[11px]">
          {item.action}
        </span>
      )
    },
    {
      header: 'Modul',
      render: (item) => (
        <Badge variant="blue" size="sm">
          {item.module || 'CMS'}
        </Badge>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-[#f4f7f6] text-slate-800 font-sans pb-24 md:pb-16">
      
      {/* 1. DEDICATED SKOTE ADMIN HEADER & SUBNAV */}
      <AdminHeader 
        activeTab={activeTab} 
        setActiveTab={handleTabChange} 
        allowedTabs={allowedTabs} 
      />

      {/* 2. MAIN FULL-WIDTH FLUID CONTAINER */}
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-10 py-6 space-y-6">
        
        {/* Page Title & Breadcrumbs Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight uppercase">
              Dashboard Manajemen Djie CMS &bull; Portal BKPSDM
            </h1>
            <p className="text-xs text-slate-500">Pusat Pengelolaan Konten, Pemantauan Trafik Pengunjung & Publikasi Informasi Resmi</p>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-xs self-start sm:self-auto">
            <span className="font-bold text-slate-700">Djie CMS</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-emerald-700 font-bold capitalize">
              {allowedTabs.find((t) => t.key === activeTab)?.label || 'Overview'}
            </span>
          </div>
        </div>

        {/* TAB: OVERVIEW */}
        {activeTab === 'overview' && (
          <AdminOverviewTab 
            counts={counts} 
            analyticsData={analyticsData} 
            user={user} 
            setActiveTab={handleTabChange} 
          />
        )}

        {/* TAB: PENGATURAN TEMA & WARNA */}
        {activeTab === 'theme' && <ThemeSettingTab />}

        {/* TAB: MANAJEMEN WIDGET PORTAL */}
        {activeTab === 'widget' && <WidgetManagerTab />}

        {/* TAB: MENU NAVIGASI DINAMIS (WORDPRESS CONCEPT) */}
        {activeTab === 'menu' && <MenuManagerTab />}

        {/* TAB: HALAMAN STATIS CMS (PAGES) */}
        {activeTab === 'pages' && <PageManagerTab />}

        {/* TAB: DOKUMEN & REGULASI */}
        {activeTab === 'dokumen' && <DokumenManagerTab />}

        {/* TAB: GALERI & MEDIA */}
        {activeTab === 'galeri' && <GaleriManagerTab />}

        {/* TAB: BANNER SLIDER */}
        {activeTab === 'banner' && <BannerManagerTab />}

        {/* TAB: BERITA & ARTIKEL */}
        {activeTab === 'berita' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6 shadow-sm">
            {/* Header & Quick Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-black text-slate-900">Manajemen Berita & Artikel Kepegawaian</h2>
                <p className="text-xs text-slate-500">Kelola artikel, informasi seleksi CASN, pengumuman kedinasan, dan optimasi SEO Google.</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowAdvancedFilters((prev) => !prev)}
                  className={`px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer border ${
                    showAdvancedFilters || beritaKategori || beritaSort !== 'latest' || beritaFeatured || beritaPinned || beritaDateFrom || beritaDateTo
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                  }`}
                >
                  <SlidersHorizontal className="w-4 h-4 text-emerald-700" />
                  <span>Filter Lengkap</span>
                  {(beritaKategori || beritaSort !== 'latest' || beritaFeatured || beritaPinned || beritaDateFrom || beritaDateTo) && (
                    <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => handleTabChange('komentar')}
                  className="px-3.5 py-2.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4 text-amber-700" />
                  <span>Moderasi Komentar</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleTabChange('kategori')}
                  className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Tag className="w-4 h-4 text-emerald-700" />
                  <span>Kelola Kategori</span>
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/admin/berita/create')}
                  className="px-4 py-2.5 bg-emerald-800 hover:bg-emerald-700 active:scale-95 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4 text-amber-300" />
                  <span>Tulis Berita</span>
                </button>
              </div>
            </div>

            {/* Bulk Toast Notification */}
            {bulkToast.text && (
              <div
                className={`p-3.5 rounded-xl border flex items-center justify-between text-xs font-bold transition-all ${
                  bulkToast.type === 'error'
                    ? 'bg-rose-50 text-rose-800 border-rose-200'
                    : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                }`}
              >
                <div className="flex items-center gap-2">
                  {bulkToast.type === 'error' ? (
                    <AlertTriangle className="w-4 h-4 text-rose-600" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  )}
                  <span>{bulkToast.text}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setBulkToast({ type: '', text: '' })}
                  className="cursor-pointer opacity-60 hover:opacity-100"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* BULK ACTION TOOLBAR (Appears when 1 or more items checked) */}
            {selectedBeritaIds.length > 0 && (
              <div className="bg-gradient-to-r from-emerald-900 to-teal-900 text-white p-4 rounded-2xl shadow-md flex flex-col md:flex-row md:items-center justify-between gap-3 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-emerald-800/80 flex items-center justify-center font-mono font-bold text-xs text-amber-300 border border-emerald-700">
                    {selectedBeritaIds.length}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">
                      {selectedBeritaIds.length} Berita Dipilih untuk Aksi Massal
                    </p>
                    <p className="text-[10px] text-emerald-200">
                      Terapkan perubahan serentak atau hapus data sekaligus.
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {/* Select Bulk Action */}
                  <select
                    value={bulkActionType}
                    onChange={(e) => setBulkActionType(e.target.value)}
                    className="bg-white/10 text-white text-xs font-bold px-3 py-2 rounded-xl border border-white/20 focus:outline-none focus:ring-2 focus:ring-amber-400 cursor-pointer"
                  >
                    <option value="" className="text-slate-800">-- Pilih Aksi Massal --</option>
                    <option value="publish" className="text-slate-800">Terbitkan Semua (Publish)</option>
                    <option value="draft" className="text-slate-800">Kembalikan ke Konsep (Draft)</option>
                    <option value="toggle_pinned" className="text-slate-800">Sematkan ke Atas (Pin)</option>
                    <option value="toggle_featured" className="text-slate-800">⭐ Tandai Berita Utama (Featured)</option>
                    <option value="change_category" className="text-slate-800">Pindahkan Kategori</option>
                    <option value="delete" className="text-slate-800">Hapus Sekaligus (Bulk Delete)</option>
                  </select>

                  {/* Category Target Selector if change_category is picked */}
                  {bulkActionType === 'change_category' && (
                    <select
                      value={targetKategoriForBulk}
                      onChange={(e) => setTargetKategoriForBulk(e.target.value)}
                      className="bg-white text-slate-800 text-xs font-bold px-3 py-2 rounded-xl border border-white/20 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                    >
                      <option value="">-- Pilih Kategori Tujuan --</option>
                      {categoriesData.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.nama_kategori}
                        </option>
                      ))}
                    </select>
                  )}

                  {/* Execute Button */}
                  <button
                    type="button"
                    onClick={handleRunBulkAction}
                    disabled={bulkActionMutation.isPending || !bulkActionType}
                    className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black rounded-xl shadow transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center gap-1.5"
                  >
                    {bulkActionMutation.isPending ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Memproses...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Terapkan</span>
                      </>
                    )}
                  </button>

                  {/* Cancel Selection */}
                  <button
                    type="button"
                    onClick={() => setSelectedBeritaIds([])}
                    className="px-3 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
                  >
                    Batal
                  </button>
                </div>
              </div>
            )}

            {/* COLLAPSIBLE ADVANCED FILTER PANEL */}
            {showAdvancedFilters && (
              <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-200/90 space-y-4 animate-in fade-in duration-150">
                <div className="flex items-center justify-between border-b border-slate-200/60 pb-2">
                  <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-emerald-700" />
                    <span className="text-xs font-black text-slate-800 uppercase tracking-wider">
                      Filter Terlengkap Berita & Pengumuman
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setBeritaKategori('');
                      setBeritaSort('latest');
                      setBeritaFeatured('');
                      setBeritaPinned('');
                      setBeritaDateFrom('');
                      setBeritaDateTo('');
                      setBeritaStatus('');
                      setBeritaPage(1);
                    }}
                    className="text-[11px] font-bold text-emerald-700 hover:text-emerald-900 cursor-pointer"
                  >
                    Reset Semua Filter
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
                  {/* Filter Kategori */}
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                      Kategori
                    </label>
                    <select
                      value={beritaKategori}
                      onChange={(e) => {
                        setBeritaKategori(e.target.value);
                        setBeritaPage(1);
                      }}
                      className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-2 font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                    >
                      <option value="">Semua Kategori</option>
                      {categoriesData.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.nama_kategori}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Filter Status */}
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                      Status Publikasi
                    </label>
                    <select
                      value={beritaStatus}
                      onChange={(e) => {
                        setBeritaStatus(e.target.value);
                        setBeritaPage(1);
                      }}
                      className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-2 font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                    >
                      <option value="">Semua Status</option>
                      <option value="PUBLISHED">Terpublikasi</option>
                      <option value="DRAFT">Konsep (Draft)</option>
                    </select>
                  </div>

                  {/* Filter Pengurutan (Sort) */}
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                      Urutkan Berdasarkan
                    </label>
                    <select
                      value={beritaSort}
                      onChange={(e) => {
                        setBeritaSort(e.target.value);
                        setBeritaPage(1);
                      }}
                      className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-2 font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                    >
                      <option value="latest">Terbaru (Default)</option>
                      <option value="popular">Terpopuler (Views Terbanyak)</option>
                      <option value="oldest">Terlama</option>
                      <option value="title_asc">Judul A - Z</option>
                      <option value="title_desc">Judul Z - A</option>
                      <option value="featured">Pinned / Utama Teratas</option>
                    </select>
                  </div>

                  {/* Filter Pinned / Utama */}
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                      Sematkan (Pinned)
                    </label>
                    <select
                      value={beritaPinned}
                      onChange={(e) => {
                        setBeritaPinned(e.target.value);
                        setBeritaPage(1);
                      }}
                      className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-2 font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                    >
                      <option value="">Semua</option>
                      <option value="true">Hanya Pinned</option>
                      <option value="false">Tidak Pinned</option>
                    </select>
                  </div>

                  {/* Filter Tanggal Dari */}
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                      Dari Tanggal
                    </label>
                    <input
                      type="date"
                      value={beritaDateFrom}
                      onChange={(e) => {
                        setBeritaDateFrom(e.target.value);
                        setBeritaPage(1);
                      }}
                      className="w-full bg-white border border-slate-200 rounded-xl px-2 py-1.5 font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-600 text-xs"
                    />
                  </div>

                  {/* Filter Tanggal Sampai */}
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                      Sampai Tanggal
                    </label>
                    <input
                      type="date"
                      value={beritaDateTo}
                      onChange={(e) => {
                        setBeritaDateTo(e.target.value);
                        setBeritaPage(1);
                      }}
                      className="w-full bg-white border border-slate-200 rounded-xl px-2 py-1.5 font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-600 text-xs"
                    />
                  </div>
                </div>
              </div>
            )}

            <DataTable
              columns={beritaColumns}
              data={beritaItems}
              isLoading={isBeritaLoading}
              serverSide={true}
              totalItems={totalBerita}
              currentPage={beritaPage}
              pageSize={beritaLimit}
              onPageChange={setBeritaPage}
              onPageSizeChange={(newSize) => {
                setBeritaLimit(newSize);
                setBeritaPage(1);
              }}
              onSearchChange={(query) => {
                setBeritaSearch(query);
                setBeritaPage(1);
              }}
              onFilterChange={(filters) => {
                if (filters.status !== undefined) {
                  setBeritaStatus(filters.status || '');
                }
                setBeritaPage(1);
              }}
              searchPlaceholder="Cari judul berita, ringkasan, atau nama penulis..."
              filters={[
                {
                  key: 'status',
                  label: 'Status',
                  options: [
                    { label: 'PUBLISHED', value: 'PUBLISHED' },
                    { label: 'DRAFT', value: 'DRAFT' }
                  ]
                }
              ]}
              emptyMessage="Belum ada berita atau artikel kepegawaian sesuai kriteria filter."
            />
          </div>
        )}

        {/* TAB: MODERASI KOMENTAR BERITA */}
        {activeTab === 'komentar' && <KomentarModerationTab />}

        {/* TAB: MANAJEMEN KATEGORI BERITA */}
        {activeTab === 'kategori' && <CategoryManagerTab />}

        {/* TAB: MANAJEMEN FILE & MINIO OBJECT STORAGE */}
        {activeTab === 'files' && <FileManagerTab />}

        {/* TAB: MANAJEMEN PENGGUNA & RBAC */}
        {activeTab === 'rbac' && <RbacManagerTab />}

        {/* TAB: KATALOG LAYANAN */}
        {activeTab === 'layanan' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-black text-slate-900">Katalog Layanan Kepegawaian BKPSDM</h2>
                <p className="text-xs text-slate-500">Daftar layanan kepegawaian ASN yang dipublikasikan pada portal resmi.</p>
              </div>
            </div>

            <DataTable
              columns={layananColumns}
              data={layananItems}
              isLoading={isLayananLoading}
              serverSide={true}
              totalItems={totalLayanan}
              currentPage={layananPage}
              pageSize={layananLimit}
              onPageChange={setLayananPage}
              onPageSizeChange={(newSize) => {
                setLayananLimit(newSize);
                setLayananPage(1);
              }}
              onSearchChange={(query) => {
                setLayananSearch(query);
                setLayananPage(1);
              }}
              searchPlaceholder="Cari nama layanan atau deskripsi..."
              emptyMessage="Belum ada layanan kepegawaian terdaftar."
            />
          </div>
        )}

        {/* TAB: AGENDA & ACARA */}
        {activeTab === 'agenda' && <AgendaManagerTab />}

        {/* TAB: AUDIT TRAIL & KEAMANAN SISTEM */}
        {activeTab === 'audit' && <AuditSecurityTab />}

        {/* TAB: PENGATURAN APLIKASI & SEO */}
        {activeTab === 'settings' && <PengaturanAplikasiTab />}

        {/* TAB: TESTIMONI & RATING APARATUR */}
        {activeTab === 'testimoni' && <TestimoniManagerTab />}

        {/* TAB: PEMELIHARAAN & BACKUP SISTEM */}
        {activeTab === 'maintenance' && <SystemMaintenanceTab />}

      </div>
    </div>
  );
}
