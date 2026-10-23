import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../../services/api';
import { 
  Search, 
  Bell, 
  Grid, 
  Maximize, 
  Settings, 
  LogOut, 
  ChevronDown, 
  ExternalLink,
  Shield,
  Layers,
  LayoutDashboard,
  Palette,
  Sliders,
  Newspaper,
  MessageSquare,
  Building2,
  FolderOpen,
  Image as ImageIcon,
  Activity,
  Tag,
  Calendar,
  HardDrive,
  Users,
  Database,
  FileText,
  Menu as MenuIcon,
  ChevronRight,
  ShieldCheck,
  Sparkles,
  KeyRound,
  Star,
  Layout,
  AlertTriangle,
  Clock,
  CheckCircle2,
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import ChangePasswordModal from './ChangePasswordModal';
import VersionModal from './VersionModal';
import { CMS_APP_VERSION } from '../../config/versionConfig';

// Master structure for categorized admin groups
const NAVIGATION_GROUPS = [
  {
    id: 'core',
    label: 'Dashboard',
    type: 'single',
    tabKey: 'overview',
    icon: LayoutDashboard
  },
  {
    id: 'publishing',
    label: 'Publikasi & Konten',
    icon: Newspaper,
    type: 'group',
    items: [
      {
        key: 'berita',
        label: 'Berita & Artikel',
        icon: Newspaper,
        desc: 'Tulis, jadwalkan, & kelola artikel publikasi resmi'
      },
      {
        key: 'komentar',
        label: 'Moderasi Komentar',
        icon: MessageSquare,
        desc: 'Persetujuan & peninjauan tanggapan masyarakat'
      },
      {
        key: 'kategori',
        label: 'Kategori Berita',
        icon: Tag,
        desc: 'Kelola kategori & klasifikasi topik artikel'
      },
      {
        key: 'pages',
        label: 'Halaman Statis (Pages)',
        icon: FolderOpen,
        desc: 'Profil, visi misi, tupoksi, & halaman publik'
      },
      {
        key: 'agenda',
        label: 'Agenda Kegiatan',
        icon: Calendar,
        desc: 'Jadwal acara, rapat kedinasan, & agenda resmi'
      }
    ]
  },
  {
    id: 'media_storage',
    label: 'Media & Berkas',
    icon: HardDrive,
    type: 'group',
    items: [
      {
        key: 'files',
        label: 'Manajemen File & MinIO',
        icon: HardDrive,
        desc: 'S3 Object storage, dokumen lampiran, & kuota'
      },
      {
        key: 'dokumen',
        label: 'Dokumen Publik',
        icon: FileText,
        desc: 'Regulasi, Surat Edaran, Juknis, & Formulir Unduhan'
      },
      {
        key: 'galeri',
        label: 'Galeri Media',
        icon: ImageIcon,
        desc: 'Foto, infografis, & dokumentasi kegiatan resmi'
      },
      {
        key: 'banner',
        label: 'Banner Slider',
        icon: Sliders,
        desc: 'Slider utama visual beranda portal'
      },
      {
        key: 'testimoni',
        label: 'Testimoni & Rating',
        icon: Star,
        desc: 'Ulasan survei kepuasan masyarakat & pengguna layanan'
      }
    ]
  },
  {
    id: 'services',
    label: 'Katalog Layanan',
    type: 'single',
    tabKey: 'layanan',
    icon: Building2
  },
  {
    id: 'system_rbac',
    label: 'Sistem & Hak Akses',
    icon: ShieldCheck,
    type: 'group',
    items: [
      {
        key: 'rbac',
        label: 'Pengguna & RBAC',
        icon: Users,
        desc: 'Kelola akun user, role, izin, & reset password'
      },
      {
        key: 'menu',
        label: 'Menu Navigasi Portal',
        icon: Sliders,
        desc: 'Struktur header menu, dropdown, & URL navigasi'
      },
      {
        key: 'widget',
        label: 'Manajemen Sidebar & Widget',
        icon: Layout,
        desc: 'Atur widget sidebar kanan, live visitor, & kontak'
      },
      {
        key: 'theme',
        label: 'Pengaturan Tema',
        icon: Palette,
        desc: 'Kustomisasi warna, font, & branding daerah'
      },
      {
        key: 'settings',
        label: 'Pengaturan Aplikasi & SEO',
        icon: Sliders,
        desc: 'Identitas portal, metadata SEO Google, alamat kantor, & kontak'
      },
      {
        key: 'audit',
        label: 'Audit Trail & Keamanan',
        icon: Activity,
        desc: 'Riwayat log aktivitas seluruh administrator'
      },
      {
        key: 'maintenance',
        label: 'Pemeliharaan & Backup',
        icon: Database,
        desc: 'Status sistem, cache Redis, & utilitas data'
      }
    ]
  }
];

export default function AdminHeader({ activeTab, setActiveTab, allowedTabs = [] }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showAppsMenu, setShowAppsMenu] = useState(false);
  const [showNotificationMenu, setShowNotificationMenu] = useState(false);
  const [openGroupDropdown, setOpenGroupDropdown] = useState(null); // 'publishing' | 'media_storage' | 'system_rbac' | null
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [isVersionModalOpen, setIsVersionModalOpen] = useState(false);
  const [mobileDrawerGroup, setMobileDrawerGroup] = useState(null); // active mobile slide-up sheet

  // Universal Quick Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchInputRef = useRef(null);

  // Real-time Admin Notifications Query (Polls every 30s)
  const { data: notificationData } = useQuery({
    queryKey: ['adminNotifications'],
    queryFn: async () => {
      try {
        const res = await api.get('/cms/notifications');
        return res?.data || res || { totalUnread: 0, data: [] };
      } catch (err) {
        return { totalUnread: 0, data: [] };
      }
    },
    refetchInterval: 30000
  });

  const notifications = notificationData?.data || [];
  const unreadCount = notificationData?.totalUnread || notifications.length;

  const navRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setOpenGroupDropdown(null);
        setShowProfileMenu(false);
        setShowAppsMenu(false);
        setShowNotificationMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  // Filter groups based on allowedTabs from RBAC
  const allowedKeys = new Set(allowedTabs.map((t) => t.key));

  const filteredGroups = NAVIGATION_GROUPS.map((group) => {
    if (group.type === 'single') {
      return allowedKeys.has(group.tabKey) ? group : null;
    }
    // Group type
    const accessibleItems = group.items.filter((item) => allowedKeys.has(item.key));
    if (accessibleItems.length === 0) return null;
    return {
      ...group,
      items: accessibleItems
    };
  }).filter(Boolean);

  // Flatten all navigable items for universal search
  const allNavItems = React.useMemo(() => {
    const list = [];
    NAVIGATION_GROUPS.forEach((g) => {
      if (g.type === 'single') {
        list.push({
          type: 'MENU',
          key: g.tabKey,
          label: g.label,
          group: 'Menu Navigasi',
          icon: g.icon,
          desc: `Menuju tab ${g.label}`
        });
      } else if (g.items) {
        g.items.forEach((item) => {
          list.push({
            type: 'MENU',
            key: item.key,
            label: item.label,
            group: g.label,
            icon: item.icon,
            desc: item.desc
          });
        });
      }
    });
    return list;
  }, []);

  // Universal Search Query: Fetches live Berita & Layanan from API when typing
  const { data: searchResultsData, isFetching: isSearching } = useQuery({
    queryKey: ['adminGlobalSearch', searchQuery],
    queryFn: async () => {
      if (!searchQuery.trim() || searchQuery.trim().length < 2) return { berita: [], layanan: [] };
      try {
        const [beritaRes, layananRes] = await Promise.all([
          api.get(`/berita?search=${encodeURIComponent(searchQuery)}&limit=4`).catch(() => ({ data: [] })),
          api.get(`/layanan?search=${encodeURIComponent(searchQuery)}&limit=4`).catch(() => ({ data: [] }))
        ]);
        return {
          berita: beritaRes?.data?.berita || beritaRes?.data || [],
          layanan: layananRes?.data || []
        };
      } catch (err) {
        return { berita: [], layanan: [] };
      }
    },
    enabled: searchQuery.trim().length >= 2,
    staleTime: 30000
  });

  // Filter local menus by search query
  const matchedMenus = React.useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return allNavItems.filter((item) => 
      item.label.toLowerCase().includes(q) || 
      (item.desc && item.desc.toLowerCase().includes(q))
    ).slice(0, 5);
  }, [searchQuery, allNavItems]);

  const hasSearchResults = matchedMenus.length > 0 || 
    (searchResultsData?.berita && searchResultsData.berita.length > 0) || 
    (searchResultsData?.layanan && searchResultsData.layanan.length > 0);

  return (
    <header ref={navRef} className="sticky top-0 z-40 shadow-md">
      
      {/* 1. TOP NAV BAR (Dark Slate/Emerald) */}
      <div className="bg-[#1e293b] text-white px-4 sm:px-6 lg:px-8 xl:px-10 py-3 flex items-center justify-between border-b border-slate-700/60">
        
        {/* Left: Brand Logo & Search */}
        <div className="flex items-center gap-6">
          <Link to="/admin" className="flex items-center gap-3 shrink-0 group">
            {/* Logo Lambang Daerah Aceh Tamiang */}
            <img 
              src="/logo-tamiang.png" 
              alt="Logo Aceh Tamiang" 
              className="w-8 h-8 sm:w-9 sm:h-9 object-contain drop-shadow-sm group-hover:scale-105 transition-transform" 
            />

            {/* Logo Resmi DJIE CMS PRO (Horizontal HD) */}
            <div className="flex items-center">
              <img 
                src="/logo-djie-cms-pro-horizontal.png" 
                alt="Djie CMS PRO - BKPSDM Aceh Tamiang" 
                className="h-8 sm:h-9 w-auto object-contain filter drop-shadow-sm hover:brightness-105 transition-all" 
              />
            </div>
          </Link>

          {/* Quick Universal Search Input & Popover Results */}
          <div className="relative hidden md:block w-72 lg:w-80">
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsSearchOpen(true);
              }}
              onFocus={() => setIsSearchOpen(true)}
              placeholder="Cari menu, layanan, berita..."
              className="w-full pl-9 pr-8 py-1.5 bg-slate-800/90 border border-slate-700 rounded-xl text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all shadow-inner"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setIsSearchOpen(false);
                }}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-0.5 rounded cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}

            {/* Live Search Results Dropdown */}
            {isSearchOpen && searchQuery.trim().length >= 1 && (
              <div className="absolute left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-200 text-slate-800 z-50 animate-in fade-in zoom-in-95 duration-150 overflow-hidden divide-y divide-slate-100 max-h-96 overflow-y-auto">
                
                {/* 1. Matched Admin Menus */}
                {matchedMenus.length > 0 && (
                  <div className="p-2 space-y-1">
                    <span className="text-[10px] font-black uppercase text-slate-400 px-2.5 py-1 block tracking-wider">
                      Navigasi Menu Admin
                    </span>
                    {matchedMenus.map((m) => {
                      const IconComp = m.icon || FolderOpen;
                      return (
                        <button
                          key={m.key}
                          type="button"
                          onClick={() => {
                            setActiveTab(m.key);
                            setIsSearchOpen(false);
                            setSearchQuery('');
                          }}
                          className="w-full text-left p-2 hover:bg-emerald-50 rounded-xl transition-colors flex items-center gap-2.5 cursor-pointer group"
                        >
                          <div className="p-1.5 bg-slate-100 group-hover:bg-emerald-100 rounded-lg text-slate-700 group-hover:text-emerald-800 transition-colors">
                            <IconComp className="w-3.5 h-3.5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-slate-900 group-hover:text-emerald-800 truncate">
                                {m.label}
                              </span>
                              <span className="text-[10px] font-medium text-slate-400">
                                {m.group}
                              </span>
                            </div>
                            {m.desc && (
                              <p className="text-[10px] text-slate-500 truncate">{m.desc}</p>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* 2. Matched Berita / Articles */}
                {searchResultsData?.berita && searchResultsData.berita.length > 0 && (
                  <div className="p-2 space-y-1">
                    <span className="text-[10px] font-black uppercase text-slate-400 px-2.5 py-1 block tracking-wider">
                      Artikel & Berita
                    </span>
                    {searchResultsData.berita.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          setActiveTab('berita');
                          setIsSearchOpen(false);
                          setSearchQuery('');
                        }}
                        className="w-full text-left p-2 hover:bg-slate-50 rounded-xl transition-colors flex items-center gap-2.5 cursor-pointer group"
                      >
                        <div className="p-1.5 bg-amber-50 text-amber-700 rounded-lg shrink-0">
                          <Newspaper className="w-3.5 h-3.5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-slate-900 group-hover:text-amber-800 truncate">
                            {item.title}
                          </p>
                          <p className="text-[10px] text-slate-400">
                            Status: <span className="font-semibold text-slate-600">{item.status || 'PUBLISHED'}</span> • {item.views_count || 0} views
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {/* 3. Matched Layanan Publik */}
                {searchResultsData?.layanan && searchResultsData.layanan.length > 0 && (
                  <div className="p-2 space-y-1">
                    <span className="text-[10px] font-black uppercase text-slate-400 px-2.5 py-1 block tracking-wider">
                      Katalog Layanan Publik
                    </span>
                    {searchResultsData.layanan.map((lay) => (
                      <button
                        key={lay.id}
                        type="button"
                        onClick={() => {
                          setActiveTab('layanan');
                          setIsSearchOpen(false);
                          setSearchQuery('');
                        }}
                        className="w-full text-left p-2 hover:bg-slate-50 rounded-xl transition-colors flex items-center gap-2.5 cursor-pointer group"
                      >
                        <div className="p-1.5 bg-blue-50 text-blue-700 rounded-lg shrink-0">
                          <Building2 className="w-3.5 h-3.5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-slate-900 group-hover:text-blue-800 truncate">
                            {lay.nama_layanan || lay.nama || lay.title}
                          </p>
                          <p className="text-[10px] text-slate-400 truncate">
                            {lay.deskripsi_singkat || lay.deskripsi || 'Layanan Masyarakat'}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {/* No results state */}
                {!hasSearchResults && !isSearching && searchQuery.trim().length >= 2 && (
                  <div className="p-6 text-center space-y-1 text-slate-400">
                    <Search className="w-6 h-6 mx-auto text-slate-300" />
                    <p className="text-xs font-bold text-slate-600">Tidak ada hasil ditemukan</p>
                    <p className="text-[11px] text-slate-400">Coba kata kunci lain seperti &apos;berita&apos;, &apos;tema&apos;, &apos;layanan&apos;</p>
                  </div>
                )}

                {/* Searching indicator */}
                {isSearching && (
                  <div className="p-4 text-center text-xs text-slate-500 font-medium">
                    Mencari di seluruh database...
                  </div>
                )}
              </div>
            )}
          </div>

          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="hidden lg:flex items-center gap-1.5 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold border border-slate-700 transition-colors"
          >
            <span>Lihat Portal Publik</span>
            <ExternalLink className="w-3 h-3 text-amber-400" />
          </a>
        </div>

        {/* Right: Tools, Notifications & User Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Quick Apps Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowAppsMenu(!showAppsMenu)}
              className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
              title="Aplikasi Kepegawaian Terintegrasi"
            >
              <Grid className="w-4 h-4" />
            </button>

            {showAppsMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-slate-200 p-2 text-slate-800 z-50 animate-in fade-in zoom-in-95 duration-150">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1 block">Aplikasi Terintegrasi</span>
                <div className="space-y-1 text-xs font-semibold">
                  <a href="https://sikepo.acehtamiangkab.go.id" target="_blank" rel="noreferrer" className="flex items-center gap-2 p-2 hover:bg-emerald-50 rounded-xl transition-colors">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span>SiKEPO Online Hub</span>
                  </a>
                  <a href="https://siasn.bkn.go.id" target="_blank" rel="noreferrer" className="flex items-center gap-2 p-2 hover:bg-blue-50 rounded-xl transition-colors">
                    <span className="w-2 h-2 rounded-full bg-blue-500" />
                    <span>SIASN BKN RI</span>
                  </a>
                  <a href="https://kinerja.bkn.go.id" target="_blank" rel="noreferrer" className="flex items-center gap-2 p-2 hover:bg-amber-50 rounded-xl transition-colors">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    <span>e-Kinerja BKN</span>
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* System Version Badge Button */}
          <button
            type="button"
            onClick={() => setIsVersionModalOpen(true)}
            className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 text-[11px] font-bold transition-all cursor-pointer"
            title="Klik untuk melihat catatan rilis & pembaruan versi"
          >
            <Sparkles className="w-3 h-3 text-amber-300 animate-pulse" />
            <span className="font-mono">v1.0 Patch 2</span>
          </button>

          {/* Fullscreen Toggle */}
          <button
            onClick={toggleFullscreen}
            className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors hidden sm:block cursor-pointer"
            title="Layar Penuh"
          >
            <Maximize className="w-4 h-4" />
          </button>

          {/* Notifications Bell & Dropdown */}
          <div className="relative">
            <button 
              onClick={() => {
                setShowNotificationMenu(!showNotificationMenu);
                setShowProfileMenu(false);
                setShowAppsMenu(false);
              }}
              className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors relative cursor-pointer"
              title="Notifikasi Sistem & Moderasi"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 min-w-[16px] h-4 px-1 rounded-full bg-rose-500 text-white font-mono text-[9px] font-black flex items-center justify-center ring-2 ring-slate-800 animate-pulse">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {showNotificationMenu && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 text-slate-800 z-50 animate-in fade-in zoom-in-95 duration-150 overflow-hidden">
                <div className="px-4 py-3 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-amber-400" />
                    <span className="text-xs font-black tracking-wider uppercase">Pemberitahuan Sistem</span>
                  </div>
                  <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-rose-500 text-white">
                    {unreadCount} Baru
                  </span>
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                  {notifications.length === 0 ? (
                    <div className="p-8 text-center text-slate-400 space-y-2">
                      <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-500" />
                      <p className="text-xs font-bold text-slate-700">Semua Terkendali!</p>
                      <p className="text-[11px] text-slate-400">Tidak ada komentar pending atau serangan berbahaya.</p>
                    </div>
                  ) : (
                    notifications.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          setActiveTab(item.targetTab);
                          setShowNotificationMenu(false);
                        }}
                        className="w-full text-left p-3.5 hover:bg-slate-50 transition-colors flex items-start gap-3 cursor-pointer group"
                      >
                        <div className={`p-2 rounded-xl shrink-0 mt-0.5 ${
                          item.severity === 'danger' 
                            ? 'bg-rose-50 text-rose-600 border border-rose-200' 
                            : 'bg-amber-50 text-amber-600 border border-amber-200'
                        }`}>
                          {item.type === 'SECURITY' ? (
                            <AlertTriangle className="w-4 h-4" />
                          ) : (
                            <MessageSquare className="w-4 h-4" />
                          )}
                        </div>

                        <div className="flex-1 min-w-0 space-y-0.5">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-xs font-bold text-slate-900 group-hover:text-emerald-700 transition-colors truncate">
                              {item.title}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono shrink-0">
                              {item.time ? new Date(item.time).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : ''}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">
                            {item.message}
                          </p>
                        </div>
                      </button>
                    ))
                  )}
                </div>

                <div className="p-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('komentar');
                      setShowNotificationMenu(false);
                    }}
                    className="text-emerald-700 hover:text-emerald-900 cursor-pointer"
                  >
                    Buka Moderasi Komentar →
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('audit');
                      setShowNotificationMenu(false);
                    }}
                    className="text-slate-500 hover:text-slate-800 cursor-pointer"
                  >
                    Log Keamanan & Audit →
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* User Profile Pill */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 bg-slate-800/80 hover:bg-slate-800 rounded-xl border border-slate-700/80 transition-all cursor-pointer"
            >
              <div className="w-7 h-7 rounded-lg bg-emerald-700 text-amber-300 font-bold flex items-center justify-center text-xs shadow-xs">
                {user?.name ? user.name.charAt(0) : 'A'}
              </div>
              <div className="text-left hidden sm:block">
                <p className="text-xs font-bold text-white line-clamp-1 max-w-[120px]">{user?.name || 'Administrator'}</p>
                <p className="text-[10px] text-amber-400 font-semibold">{user?.role || 'SUPER_ADMIN'}</p>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-slate-200 p-2 text-slate-800 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 py-2 border-b border-slate-100">
                  <p className="text-xs font-bold text-slate-900">{user?.name}</p>
                  <p className="text-[11px] text-slate-500 truncate">{user?.email}</p>
                </div>
                <div className="py-1 text-xs font-medium space-y-0.5">
                  <button
                    onClick={() => { setIsChangePasswordOpen(true); setShowProfileMenu(false); }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-slate-700 hover:bg-slate-50 rounded-xl text-left cursor-pointer"
                  >
                    <KeyRound className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Ganti Kata Sandi</span>
                  </button>
                  <button
                    onClick={() => { setActiveTab('theme'); setShowProfileMenu(false); }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-slate-700 hover:bg-slate-50 rounded-xl text-left cursor-pointer"
                  >
                    <Palette className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Pengaturan Tema</span>
                  </button>
                  <button
                    onClick={() => { setActiveTab('audit'); setShowProfileMenu(false); }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-slate-700 hover:bg-slate-50 rounded-xl text-left cursor-pointer"
                  >
                    <Activity className="w-3.5 h-3.5 text-amber-600" />
                    <span>Riwayat Audit</span>
                  </button>
                  <button
                    onClick={() => { setIsVersionModalOpen(true); setShowProfileMenu(false); }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-slate-700 hover:bg-emerald-50 rounded-xl text-left cursor-pointer group"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600 group-hover:scale-110 transition-transform" />
                    <div className="flex-1 flex items-center justify-between">
                      <span>Versi & Changelog</span>
                      <span className="text-[9px] font-black px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                        {CMS_APP_VERSION.version} P2
                      </span>
                    </div>
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-xl text-left font-bold cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Keluar Sistem</span>
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>

      </div>

      {/* Change Password Modal */}
      <ChangePasswordModal 
        isOpen={isChangePasswordOpen}
        onClose={() => setIsChangePasswordOpen(false)}
      />

      {/* Version & Changelog Modal */}
      <VersionModal 
        isOpen={isVersionModalOpen}
        onClose={() => setIsVersionModalOpen(false)}
      />

      {/* 2. GROUPED MEGA MENU SUBNAV BAR (Desktop & Tablet only - md:block) */}
      <div className="hidden md:block bg-white border-b border-slate-200/90 px-4 sm:px-6 lg:px-8 xl:px-10 shadow-2xs relative z-30">
        <div className="flex flex-wrap items-center gap-1.5 py-2 text-xs font-bold">
          
          {filteredGroups.map((group) => {
            // Case A: Single Direct Tab (Dashboard, Katalog Layanan)
            if (group.type === 'single') {
              const Icon = group.icon;
              const isActive = activeTab === group.tabKey;
              return (
                <button
                  key={group.id}
                  onClick={() => {
                    setActiveTab(group.tabKey);
                    setOpenGroupDropdown(null);
                  }}
                  className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-2 shrink-0 cursor-pointer font-bold ${
                    isActive
                      ? 'bg-emerald-900 text-amber-300 shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-amber-300' : 'text-slate-400'}`} />
                  <span>{group.label}</span>
                </button>
              );
            }

            // Case B: Group with Mega Menu Dropdown (Publikasi, Media, Sistem)
            const GroupIcon = group.icon;
            const isChildActive = group.items.some((item) => item.key === activeTab);
            const isDropdownOpen = openGroupDropdown === group.id;
            const activeItem = group.items.find((item) => item.key === activeTab);

            return (
              <div key={group.id} className="relative shrink-0">
                <button
                  type="button"
                  onClick={() => setOpenGroupDropdown(isDropdownOpen ? null : group.id)}
                  className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-2 cursor-pointer font-bold ${
                    isChildActive
                      ? 'bg-emerald-900 text-amber-300 shadow-xs'
                      : isDropdownOpen
                        ? 'bg-slate-100 text-slate-900'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <GroupIcon className={`w-4 h-4 ${isChildActive ? 'text-amber-300' : 'text-slate-400'}`} />
                  <span>{group.label}</span>
                  {isChildActive && (
                    <span className="text-[10px] font-extrabold px-1.5 py-0.2 rounded bg-amber-400 text-slate-950 ml-0.5">
                      {activeItem?.label.split(' ')[0]}
                    </span>
                  )}
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    isDropdownOpen ? 'rotate-180' : ''
                  } ${isChildActive ? 'text-amber-300' : 'text-slate-400'}`} />
                </button>

                {/* MEGA MENU POPOVER */}
                {isDropdownOpen && (
                  <div className="absolute left-0 top-full mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200/90 p-3 text-slate-800 z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-3 py-1.5 border-b border-slate-100 mb-2 flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                        {group.label}
                      </span>
                      <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md">
                        {group.items.length} Menu
                      </span>
                    </div>

                    <div className="grid grid-cols-1 gap-1.5">
                      {group.items.map((item) => {
                        const ItemIcon = item.icon;
                        const isItemSelected = activeTab === item.key;
                        return (
                          <button
                            key={item.key}
                            type="button"
                            onClick={() => {
                              setActiveTab(item.key);
                              setOpenGroupDropdown(null);
                            }}
                            className={`w-full p-2.5 rounded-xl transition-all text-left flex items-start gap-3 cursor-pointer ${
                              isItemSelected
                                ? 'bg-emerald-50 border border-emerald-200/80 shadow-2xs'
                                : 'hover:bg-slate-50 border border-transparent'
                            }`}
                          >
                            <div className={`p-2 rounded-xl shrink-0 ${
                              isItemSelected ? 'bg-emerald-800 text-amber-300 shadow-2xs' : 'bg-slate-100 text-slate-600'
                            }`}>
                              <ItemIcon className="w-4 h-4" />
                            </div>

                            <div className="min-w-0 flex-1">
                              <div className="flex items-center justify-between gap-1">
                                <p className={`text-xs font-bold ${
                                  isItemSelected ? 'text-emerald-950' : 'text-slate-900'
                                }`}>
                                  {item.label}
                                </p>
                                {isItemSelected && (
                                  <span className="w-2 h-2 rounded-full bg-emerald-600 shrink-0" />
                                )}
                              </div>
                              <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                                {item.desc}
                              </p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}

        </div>
      </div>

      {/* 3. MOBILE BOTTOM NAVIGATION BAR (FIXED BOTTOM FOR MOBILE) */}
      <nav 
        aria-label="Mobile Admin Navigation"
        className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#1e293b]/95 backdrop-blur-md border-t border-slate-700/80 px-2 py-1.5 shadow-[0_-4px_20px_rgba(0,0,0,0.3)]"
      >
        <div className="flex items-center justify-around">
          
          {/* Item 1: Dashboard (Direct) */}
          <button
            type="button"
            onClick={() => {
              setActiveTab('overview');
              setMobileDrawerGroup(null);
            }}
            className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-colors cursor-pointer min-w-[56px] ${
              activeTab === 'overview'
                ? 'text-amber-400'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className={`p-1 rounded-lg ${activeTab === 'overview' ? 'bg-emerald-900/80' : ''}`}>
              <LayoutDashboard className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-bold mt-0.5">Beranda</span>
          </button>

          {/* Item 2: Publikasi & Konten */}
          <button
            type="button"
            onClick={() => setMobileDrawerGroup(mobileDrawerGroup === 'publishing' ? null : 'publishing')}
            className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-colors cursor-pointer min-w-[56px] ${
              ['berita', 'komentar', 'kategori', 'pages', 'agenda'].includes(activeTab) || mobileDrawerGroup === 'publishing'
                ? 'text-amber-400 font-black'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className={`p-1 rounded-lg ${
              ['berita', 'komentar', 'kategori', 'pages', 'agenda'].includes(activeTab) || mobileDrawerGroup === 'publishing'
                ? 'bg-emerald-900/80'
                : ''
            }`}>
              <Newspaper className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-bold mt-0.5">Publikasi</span>
          </button>

          {/* Item 3: Media & Berkas */}
          <button
            type="button"
            onClick={() => setMobileDrawerGroup(mobileDrawerGroup === 'media_storage' ? null : 'media_storage')}
            className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-colors cursor-pointer min-w-[56px] ${
              ['files', 'dokumen', 'galeri', 'banner'].includes(activeTab) || mobileDrawerGroup === 'media_storage'
                ? 'text-amber-400 font-black'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className={`p-1 rounded-lg ${
              ['files', 'dokumen', 'galeri', 'banner'].includes(activeTab) || mobileDrawerGroup === 'media_storage'
                ? 'bg-emerald-900/80'
                : ''
            }`}>
              <HardDrive className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-bold mt-0.5">Media</span>
          </button>

          {/* Item 4: Katalog Layanan */}
          <button
            type="button"
            onClick={() => {
              setActiveTab('layanan');
              setMobileDrawerGroup(null);
            }}
            className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-colors cursor-pointer min-w-[56px] ${
              activeTab === 'layanan'
                ? 'text-amber-400 font-black'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className={`p-1 rounded-lg ${activeTab === 'layanan' ? 'bg-emerald-900/80' : ''}`}>
              <Building2 className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-bold mt-0.5">Layanan</span>
          </button>

          {/* Item 5: Sistem & Menu Lainnya */}
          <button
            type="button"
            onClick={() => setMobileDrawerGroup(mobileDrawerGroup === 'system_rbac' ? null : 'system_rbac')}
            className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-colors cursor-pointer min-w-[56px] ${
              ['rbac', 'menu', 'theme', 'audit', 'maintenance'].includes(activeTab) || mobileDrawerGroup === 'system_rbac'
                ? 'text-amber-400 font-black'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className={`p-1 rounded-lg ${
              ['rbac', 'menu', 'theme', 'audit', 'maintenance'].includes(activeTab) || mobileDrawerGroup === 'system_rbac'
                ? 'bg-emerald-900/80'
                : ''
            }`}>
              <ShieldCheck className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-bold mt-0.5">Sistem</span>
          </button>

        </div>
      </nav>

      {/* 4. MOBILE SLIDE-UP DRAWER SHEET */}
      {mobileDrawerGroup && (
        <div 
          className="md:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex flex-col justify-end animate-fadeIn"
          onClick={() => setMobileDrawerGroup(null)}
        >
          <div 
            className="bg-white rounded-t-3xl max-h-[75vh] overflow-y-auto p-5 pb-24 shadow-2xl space-y-4 animate-in slide-in-from-bottom duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header Drawer */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-1 bg-slate-300 rounded-full mx-auto absolute top-2.5 left-1/2 -translate-x-1/2" />
                <h3 className="text-sm font-black text-slate-900">
                  {filteredGroups.find((g) => g.id === mobileDrawerGroup)?.label || 'Menu Navigasi'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setMobileDrawerGroup(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Item List in Drawer */}
            <div className="grid grid-cols-1 gap-2">
              {filteredGroups
                .find((g) => g.id === mobileDrawerGroup)
                ?.items?.map((item) => {
                  const ItemIcon = item.icon;
                  const isItemSelected = activeTab === item.key;
                  return (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() => {
                        setActiveTab(item.key);
                        setMobileDrawerGroup(null);
                      }}
                      className={`w-full p-3 rounded-2xl transition-all text-left flex items-center gap-3.5 cursor-pointer ${
                        isItemSelected
                          ? 'bg-emerald-900 text-white shadow-xs'
                          : 'bg-slate-50 hover:bg-slate-100 text-slate-800'
                      }`}
                    >
                      <div className={`p-2.5 rounded-xl shrink-0 ${
                        isItemSelected ? 'bg-emerald-800 text-amber-300' : 'bg-white text-slate-700 shadow-2xs'
                      }`}>
                        <ItemIcon className="w-5 h-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-bold truncate">{item.label}</p>
                          {isItemSelected && (
                            <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-amber-400 text-slate-950">
                              Aktif
                            </span>
                          )}
                        </div>
                        <p className={`text-[11px] truncate mt-0.5 ${isItemSelected ? 'text-emerald-200' : 'text-slate-400'}`}>
                          {item.desc}
                        </p>
                      </div>
                    </button>
                  );
                })}
            </div>

            {/* Quick Link to Portal Publik */}
            <div className="pt-2 border-t border-slate-100">
              <a
                href="/"
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center justify-center gap-2"
              >
                <ExternalLink className="w-4 h-4 text-emerald-700" />
                <span>Buka Portal Publik BKPSDM</span>
              </a>
            </div>

          </div>
        </div>
      )}

    </header>
  );
}
