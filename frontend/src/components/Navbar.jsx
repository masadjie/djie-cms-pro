import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { 
  ChevronDown, 
  ExternalLink,
  ShieldCheck,
  LogOut,
  Sliders,
  Menu,
  FileSearch,
  X
} from 'lucide-react';
import MegaMenuBerita from './navbar/MegaMenuBerita';
import MegaMenuLayanan from './navbar/MegaMenuLayanan';
import MegaMenuData from './navbar/MegaMenuData';
import MegaMenuProfil from './navbar/MegaMenuProfil';
import MegaMenuPPID from './navbar/MegaMenuPPID';
import { DynamicIcon } from './common/IconPickerModal';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { activeTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeDropdown, setActiveDropdown] = useState(null); // 'berita' | 'layanan' | 'data' | 'profil' | 'ppid' | null
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const headerRef = useRef(null);

  // Dynamic Menus Fetch from MySQL Database
  const { data: menuList } = useQuery({
    queryKey: ['dynamicMenus'],
    queryFn: async () => {
      try {
        const res = await api.get('/cms/menu');
        return res?.data || res || [];
      } catch (e) {
        return [];
      }
    }
  });

  // Dynamic Web Settings for Site Name & Logo
  const { data: settingsData } = useQuery({
    queryKey: ['cmsWebSettings'],
    queryFn: async () => {
      try {
        const res = await api.get('/cms/pengaturan');
        return res?.data || res || {};
      } catch (e) {
        return {};
      }
    }
  });

  const settings = settingsData || {};
  const isEditorial = activeTheme?.id === 'editorial' || settings?.home_layout_mode === 'EDITORIAL';

  const isHome = location.pathname === '/';
  const isSolid = !isHome || isScrolled || activeDropdown || isEditorial;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (headerRef.current && !headerRef.current.contains(e.target)) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggle = (name) => {
    setActiveDropdown((prev) => (prev === name ? null : name));
  };

  const handleNavigate = (path) => {
    setActiveDropdown(null);
    navigate(path);
  };

  // Helper mapping for menu dropdowns
  const getDropdownKey = (url, label) => {
    const l = (label || '').toLowerCase();
    const u = (url || '').toLowerCase();
    if (u.includes('berita') || l.includes('berita')) return 'berita';
    if (u.includes('layanan') || u.includes('katalog') || l.includes('layanan')) return 'layanan';
    if (u.includes('data') || l.includes('data') || l.includes('statistik')) return 'data';
    if (u.includes('profil') || l.includes('profil')) return 'profil';
    if (u.includes('ppid') || l.includes('ppid')) return 'ppid';
    return null;
  };

  // Official 4 Menus requested: Berita & Info ASN, Layanan Kepegawaian, Data & Statistik ASN, Profile
  const defaultNavs = [
    { id: 1, label: 'Berita & Info ASN', url: '/berita', tipe: 'DROPDOWN' },
    { id: 2, label: 'Layanan Kepegawaian', url: '/katalog', tipe: 'DROPDOWN' },
    { id: 3, label: 'Data & Statistik ASN', url: '/data', tipe: 'DROPDOWN' },
    { id: 4, label: 'Profile', url: '/profil', tipe: 'DROPDOWN' }
  ];

  const rawMenus = (menuList && menuList.length > 0 ? menuList : defaultNavs)
    .filter((m) => m.is_active !== false);

  // Use dynamic menus directly from DB; only filter out parent_id children
  const activeMenus = rawMenus
    .filter((m) => !m.parent_id);

  // Map child sub-menus grouped by parent
  const getChildrenFor = (parentItem) => {
    if (!parentItem) return [];
    // 1. Direct match by parent_id
    const byId = rawMenus.filter((m) => m.parent_id === parentItem.id);
    if (byId.length > 0) return byId;

    // 2. Fallback match by key name or url keyword
    const key = getDropdownKey(parentItem.url, parentItem.label);
    if (!key) return [];

    return rawMenus.filter((m) => {
      if (!m.parent_id) return false;
      const parent = rawMenus.find(p => p.id === m.parent_id);
      if (parent) {
        return getDropdownKey(parent.url, parent.label) === key;
      }
      return false;
    });
  };

  const beritaParent = activeMenus.find(m => getDropdownKey(m.url, m.label) === 'berita');
  const layananParent = activeMenus.find(m => getDropdownKey(m.url, m.label) === 'layanan');
  const dataParent = activeMenus.find(m => getDropdownKey(m.url, m.label) === 'data');
  const profilParent = activeMenus.find(m => getDropdownKey(m.url, m.label) === 'profil');

  const beritaItems = beritaParent ? getChildrenFor(beritaParent) : [];
  const layananItems = layananParent ? getChildrenFor(layananParent) : [];
  const dataItems = dataParent ? getChildrenFor(dataParent) : [];
  const profilItems = profilParent ? getChildrenFor(profilParent) : [];

  return (
    <header 
      ref={headerRef} 
      className={`fixed top-0 left-0 z-50 w-full transition-all duration-300 ${
        isSolid 
          ? (isEditorial 
              ? 'bg-white/95 text-slate-800 shadow-sm border-b border-slate-200/80 backdrop-blur-md'
              : `${activeTheme.navbarBg} text-white shadow-2xl border-b border-white/10 backdrop-blur-md`
            ) 
          : 'bg-transparent text-white border-b border-transparent shadow-none'
      }`}
    >
      {/* Main Navbar */}
      <div className="w-full px-3 sm:px-6 lg:px-12 h-16 sm:h-20 flex items-center justify-between">
        
        {/* Brand Logo & Name (Dynamically Adaptable to Editorial or Portal Theme) */}
        <Link to="/" className="flex items-center gap-2 sm:gap-3 shrink min-w-0 pr-2" onClick={() => setActiveDropdown(null)}>
          {settings.site_logo ? (
            <img
              src={settings.site_logo}
              alt={settings.site_name || 'Logo Instansi'}
              width="40"
              height="40"
              className="w-8 h-8 sm:w-10 sm:h-10 object-contain shrink-0 drop-shadow-sm"
              onError={(e) => {
                e.target.src = '/logo-djie-cms-pro-square.png';
              }}
            />
          ) : isEditorial ? (
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white border border-slate-200 shadow-xs flex items-center justify-center p-1 overflow-hidden shrink-0">
              <img
                src="/logo-djie-cms-pro-square.png"
                alt="Logo CMS"
                width="40"
                height="40"
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </div>
          ) : (
            <img
              src="/logo-djie-cms-pro-square.png"
              alt="Logo Instansi"
              width="40"
              height="40"
              className="w-8 h-8 sm:w-10 sm:h-10 object-contain shrink-0 drop-shadow-sm"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          )}
          <div className="flex flex-col min-w-0">
            <span className={`font-black text-xs xs:text-sm sm:text-[17px] tracking-tight leading-snug truncate ${
              isEditorial ? 'text-slate-900' : 'text-white'
            }`}>
              {settings.site_name || settings.site_title || 'Djie CMS Pro'}
            </span>
            <span className={`text-[9px] xs:text-[10px] sm:text-[11px] tracking-wide font-medium truncate ${
              isEditorial ? 'text-blue-600 font-bold' : 'text-amber-300'
            }`}>
              {settings.instansi_name || settings.site_tagline || 'Media Digital & Publishing'}
            </span>
          </div>
        </Link>

        {/* Dynamic Center Nav Links from CMS Database */}
        <nav className={`hidden lg:flex items-center gap-6 xl:gap-8 text-sm font-bold whitespace-nowrap ${
          isEditorial ? 'text-slate-700' : 'text-emerald-100'
        }`}>
          {activeMenus.map((menu) => {
            const dropdownKey = getDropdownKey(menu.url, menu.label);

            if (menu.tipe === 'DROPDOWN' && dropdownKey) {
              return (
                <button
                  key={menu.id || menu.label}
                  type="button"
                  onClick={() => handleToggle(dropdownKey)}
                  className={`flex items-center gap-2 py-2 transition-colors cursor-pointer whitespace-nowrap ${
                    activeDropdown === dropdownKey 
                      ? (isEditorial ? 'text-blue-600 font-black' : 'text-amber-400') 
                      : (isEditorial ? 'hover:text-blue-600' : 'hover:text-amber-300')
                  }`}
                >
                  {menu.icon && (
                    <DynamicIcon name={menu.icon} className={`w-4 h-4 ${isEditorial ? 'text-blue-600' : 'text-amber-400/90'}`} />
                  )}
                  <span>{menu.label}</span>
                  <ChevronDown className={`w-4 h-4 ${isEditorial ? 'text-blue-600' : 'text-amber-400'} transition-transform ${activeDropdown === dropdownKey ? 'rotate-180' : ''}`} />
                </button>
              );
            }

            if (menu.tipe === 'EXTERNAL' || (menu.url && menu.url.startsWith('http'))) {
              return (
                <a
                  key={menu.id || menu.label}
                  href={menu.url}
                  target="_blank"
                  rel="noreferrer"
                  className={`py-2 transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                    isEditorial ? 'hover:text-blue-600' : 'hover:text-amber-300'
                  }`}
                >
                  {menu.icon && (
                    <DynamicIcon name={menu.icon} className={`w-4 h-4 ${isEditorial ? 'text-blue-600' : 'text-amber-400/90'}`} />
                  )}
                  <span>{menu.label}</span>
                  <ExternalLink className="w-3 h-3 opacity-70" />
                </a>
              );
            }

            return (
              <Link
                key={menu.id || menu.label}
                to={menu.url}
                onClick={() => setActiveDropdown(null)}
                className={`py-2 transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                  isEditorial ? 'hover:text-blue-600' : 'hover:text-amber-300'
                }`}
              >
                {menu.icon && (
                  <DynamicIcon name={menu.icon} className={`w-4 h-4 ${isEditorial ? 'text-blue-600' : 'text-amber-400/90'}`} />
                )}
                <span>{menu.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right Side: Clean Compact User Indicator + Mobile Hamburger Button */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">

          {user && (
            <div className="flex items-center gap-1.5 sm:gap-2">
              {user.role !== 'WARGA' && (
                <Link
                  to="/admin"
                  className={`p-2 rounded-xl transition-all ${
                    isEditorial 
                      ? 'text-blue-600 hover:text-blue-800 hover:bg-blue-50' 
                      : 'text-emerald-200 hover:text-white hover:bg-emerald-800/80'
                  }`}
                  title="Panel Manajemen CMS"
                >
                  <ShieldCheck className={`w-5 h-5 ${isEditorial ? 'text-blue-600' : 'text-amber-400'}`} />
                </Link>
              )}
              <button
                onClick={logout}
                className={`p-2 rounded-xl transition-all cursor-pointer ${
                  isEditorial 
                    ? 'text-slate-500 hover:text-red-600 hover:bg-red-50' 
                    : 'text-emerald-300 hover:text-red-400 hover:bg-emerald-900/60'
                }`}
                title="Keluar"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Hamburger Button for Mobile / Tablet (< lg) */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`lg:hidden p-2 rounded-xl border transition-all cursor-pointer flex items-center justify-center ${
              isEditorial
                ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-800'
                : 'bg-white/10 hover:bg-white/20 border-white/15 text-white'
            }`}
            title={isMobileMenuOpen ? "Tutup Menu" : "Buka Menu"}
            aria-label="Menu Navigasi Mobile"
          >
            {isMobileMenuOpen ? (
              <X className={`w-6 h-6 ${isEditorial ? 'text-blue-600' : 'text-amber-300'}`} />
            ) : (
              <Menu className={`w-6 h-6 ${isEditorial ? 'text-slate-800' : 'text-emerald-200'}`} />
            )}
          </button>
        </div>

      </div>

      {/* Mobile Drawer (Visible on < lg screens) */}
      {isMobileMenuOpen && (
        <div className={`lg:hidden w-full backdrop-blur-xl border-t shadow-2xl max-h-[85vh] overflow-y-auto px-5 py-6 space-y-4 animate-in slide-in-from-top-4 duration-200 ${
          isEditorial
            ? 'bg-white/98 border-slate-200 text-slate-800'
            : 'bg-[#052e16]/98 border-emerald-700/60 text-white'
        }`}>
          <div className={`flex items-center justify-between pb-3 border-b ${
            isEditorial ? 'border-slate-200' : 'border-emerald-800/80'
          }`}>
            <span className={`text-xs font-black uppercase tracking-wider flex items-center gap-2 ${
              isEditorial ? 'text-blue-600' : 'text-amber-400'
            }`}>
              <span>Navigasi {settings.site_name || 'Portal'}</span>
            </span>
            <span className={`text-[10px] font-mono ${
              isEditorial ? 'text-slate-500' : 'text-emerald-300/80'
            }`}>{settings.instansi_name || 'Media Digital'}</span>
          </div>

          <div className="space-y-1">
            {activeMenus.map((menu) => {
              const dropdownKey = getDropdownKey(menu.url, menu.label);

              if (menu.tipe === 'DROPDOWN' && dropdownKey) {
                const isExpanded = activeDropdown === dropdownKey;
                const childItems = getChildrenFor(menu);

                return (
                  <div key={menu.id || menu.label} className={`border-b last:border-0 pb-1 ${
                    isEditorial ? 'border-slate-100' : 'border-emerald-800/40'
                  }`}>
                    <button
                      type="button"
                      onClick={() => handleToggle(dropdownKey)}
                      className={`w-full flex items-center justify-between py-3 px-2 rounded-xl text-left font-bold text-sm transition-colors ${
                        isEditorial
                          ? 'hover:bg-blue-50 text-slate-800'
                          : 'hover:bg-emerald-800/50 text-emerald-100'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        {menu.icon && <DynamicIcon name={menu.icon} className={`w-4 h-4 ${isEditorial ? 'text-blue-600' : 'text-amber-400'}`} />}
                        <span>{menu.label}</span>
                      </div>
                      <ChevronDown className={`w-4 h-4 transition-transform ${
                        isEditorial ? 'text-blue-600' : 'text-amber-400'
                      } ${isExpanded ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Submenu Accordion in Mobile */}
                    {isExpanded && childItems && childItems.length > 0 && (
                      <div className={`pl-4 pr-2 py-2 space-y-1 rounded-xl my-1 border ${
                        isEditorial
                          ? 'bg-slate-50 border-slate-200'
                          : 'bg-emerald-950/60 border-emerald-800/50'
                      }`}>
                        {childItems.map((sub) => {
                          const subRoute = sub.tipe === 'PAGE'
                            ? (sub.page_slug ? `/page/${sub.page_slug}` : sub.url)
                            : sub.url;
                          const isSubExternal = sub.tipe === 'EXTERNAL' || (subRoute && subRoute.startsWith('http'));

                          if (isSubExternal) {
                            return (
                              <a
                                key={sub.id || sub.label}
                                href={subRoute}
                                target="_blank"
                                rel="noreferrer"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={`flex items-center justify-between py-2 px-2.5 rounded-lg text-xs font-semibold transition-colors ${
                                  isEditorial
                                    ? 'text-slate-700 hover:text-blue-600 hover:bg-blue-50/50'
                                    : 'text-emerald-200 hover:text-amber-300 hover:bg-emerald-900/60'
                                }`}
                              >
                                <span className="flex items-center gap-2">
                                  {sub.icon && <DynamicIcon name={sub.icon} className={`w-3.5 h-3.5 ${isEditorial ? 'text-blue-600' : 'text-amber-400'}`} />}
                                  <span>{sub.label}</span>
                                </span>
                                <ExternalLink className={`w-3.5 h-3.5 ${isEditorial ? 'text-blue-600' : 'text-amber-300'} opacity-70`} />
                              </a>
                            );
                          }

                          return (
                            <Link
                              key={sub.id || sub.label}
                              to={subRoute}
                              onClick={() => {
                                setIsMobileMenuOpen(false);
                                setActiveDropdown(null);
                              }}
                              className={`flex items-center justify-between py-2 px-2.5 rounded-lg text-xs font-semibold transition-colors ${
                                isEditorial
                                  ? 'text-slate-700 hover:text-blue-600 hover:bg-blue-50/50'
                                  : 'text-emerald-200 hover:text-amber-300 hover:bg-emerald-900/60'
                              }`}
                            >
                              <span className="flex items-center gap-2">
                                {sub.icon && <DynamicIcon name={sub.icon} className={`w-3.5 h-3.5 ${isEditorial ? 'text-blue-600' : 'text-amber-400'}`} />}
                                <span>{sub.label}</span>
                              </span>
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              }

              if (menu.tipe === 'EXTERNAL' || (menu.url && menu.url.startsWith('http'))) {
                return (
                  <a
                    key={menu.id || menu.label}
                    href={menu.url}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center justify-between py-3 px-2 rounded-xl font-bold text-sm transition-colors border-b last:border-0 ${
                      isEditorial
                        ? 'border-slate-100 hover:bg-blue-50 text-slate-800'
                        : 'border-emerald-800/40 hover:bg-emerald-800/50 text-emerald-100'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      {menu.icon && <DynamicIcon name={menu.icon} className={`w-4 h-4 ${isEditorial ? 'text-blue-600' : 'text-amber-400'}`} />}
                      <span>{menu.label}</span>
                    </div>
                    <ExternalLink className={`w-4 h-4 ${isEditorial ? 'text-blue-600' : 'text-amber-400'} opacity-70`} />
                  </a>
                );
              }

              return (
                <Link
                  key={menu.id || menu.label}
                  to={menu.url}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-2.5 py-3 px-2 rounded-xl font-bold text-sm transition-colors border-b last:border-0 ${
                    isEditorial
                      ? 'border-slate-100 hover:bg-blue-50 text-slate-800'
                      : 'border-emerald-800/40 hover:bg-emerald-800/50 text-emerald-100'
                  }`}
                >
                  {menu.icon && <DynamicIcon name={menu.icon} className={`w-4 h-4 ${isEditorial ? 'text-blue-600' : 'text-amber-400'}`} />}
                  <span>{menu.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Quick Shortcuts in Mobile Menu */}
          <div className={`pt-3 border-t space-y-2 ${isEditorial ? 'border-slate-200' : 'border-emerald-800'}`}>
            <Link
              to="/berita"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`w-full py-2.5 px-4 rounded-xl font-black text-xs flex items-center justify-center gap-2 shadow-sm transition-all ${
                isEditorial 
                  ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                  : 'bg-amber-400 hover:bg-amber-300 text-slate-950'
              }`}
            >
              <span>Semua Berita & Publikasi</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>

            <Link
              to="/katalog"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 border transition-all ${
                isEditorial
                  ? 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200'
                  : 'bg-emerald-800/80 hover:bg-emerald-700 text-white border-emerald-600/50'
              }`}
            >
              <span>Katalog Informasi & Layanan</span>
            </Link>
          </div>
        </div>
      )}

      {/* Mega Menus Rendering */}
      {activeDropdown === 'berita' && (
        <MegaMenuBerita 
          items={beritaItems}
          onClose={() => setActiveDropdown(null)} 
        />
      )}

      {activeDropdown === 'layanan' && (
        <MegaMenuLayanan 
          items={layananItems}
          onClose={() => setActiveDropdown(null)} 
          onNavigate={handleNavigate} 
        />
      )}

      {activeDropdown === 'data' && (
        <MegaMenuData 
          items={dataItems}
          onClose={() => setActiveDropdown(null)} 
          onNavigate={handleNavigate} 
        />
      )}

      {activeDropdown === 'profil' && (
        <MegaMenuProfil 
          items={profilItems}
          onClose={() => setActiveDropdown(null)} 
          onNavigate={handleNavigate} 
        />
      )}

      {activeDropdown === 'ppid' && (
        <MegaMenuPPID 
          onClose={() => setActiveDropdown(null)} 
          onNavigate={handleNavigate} 
        />
      )}

    </header>
  );
}
