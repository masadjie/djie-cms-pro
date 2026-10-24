import React, { createContext, useContext, useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../services/api';

const ThemeContext = createContext(null);

export const themes = [
  {
    id: 'emerald',
    name: 'Aceh Tamiang Zamrud Hijau & Emas (Utama)',
    primaryColor: '#064e3b', // Deep Emerald Green
    accentColor: '#f59e0b',  // Golden Amber / Yellow
    badgeBg: 'bg-emerald-900/90',
    heroGradient: 'from-[#021f0f] via-[#052e16] to-[#064e3b]',
    navbarBg: 'bg-[#052e16]',
    accentText: 'text-amber-300',
    primaryBtn: 'bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 hover:from-amber-300 hover:to-yellow-400',
    badgeText: 'text-emerald-300'
  },
  {
    id: 'sikepo',
    name: 'SiKEPO Royal Indigo & Gold',
    primaryColor: '#3730a3', // Royal Indigo
    accentColor: '#f59e0b',  // Golden Amber
    badgeBg: 'bg-indigo-900/80',
    heroGradient: 'from-[#120f38] via-[#1e1b4b] to-[#312e81]',
    navbarBg: 'bg-[#181447]',
    accentText: 'text-amber-400',
    primaryBtn: 'bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 hover:from-amber-300 hover:to-yellow-400',
    badgeText: 'text-amber-300'
  },
  {
    id: 'sapphire',
    name: 'Oceanic Sapphire Blue',
    primaryColor: '#1e3a8a', // Gov Blue
    accentColor: '#38bdf8',  // Sky Cyan
    badgeBg: 'bg-blue-900/80',
    heroGradient: 'from-[#07132e] via-[#0f2452] to-[#1e3a8a]',
    navbarBg: 'bg-[#091838]',
    accentText: 'text-sky-300',
    primaryBtn: 'bg-gradient-to-r from-sky-400 to-blue-400 text-slate-950 hover:from-sky-300 hover:to-blue-300',
    badgeText: 'text-sky-300'
  },
  {
    id: 'cyberdark',
    name: 'Midnight Dark & Gold',
    primaryColor: '#0f172a', // Slate Dark
    accentColor: '#f59e0b',  // Golden Amber
    badgeBg: 'bg-slate-900/80',
    heroGradient: 'from-[#080b11] via-[#0f172a] to-[#1e293b]',
    navbarBg: 'bg-[#0b1120]',
    accentText: 'text-amber-400',
    primaryBtn: 'bg-amber-400 hover:bg-amber-300 text-slate-950',
    badgeText: 'text-amber-300'
  },
  {
    id: 'editorial',
    name: 'Revision Editorial News & Magazine (Royal Blue Brand)',
    primaryColor: '#0058fb', // Brand Royal Blue
    accentColor: '#38bdf8',  // Sky Cyan
    badgeBg: 'bg-blue-50',
    heroGradient: 'from-white via-[#f8fafc] to-[#eff6ff]',
    navbarBg: 'bg-white',
    accentText: 'text-blue-600',
    primaryBtn: 'bg-blue-600 hover:bg-blue-700 text-white font-bold',
    badgeText: 'text-blue-700'
  }
];

export const ThemeProvider = ({ children }) => {
  // 1. Initial State: sync from cached setting or default
  const [currentTheme, setCurrentTheme] = useState(() => {
    const cachedMode = localStorage.getItem('djie_layout_mode');
    const cachedTheme = localStorage.getItem('tamiang_theme');
    if (cachedMode === 'EDITORIAL') return 'editorial';
    if (cachedMode === 'PORTAL') return cachedTheme && cachedTheme !== 'editorial' ? cachedTheme : 'emerald';
    return cachedTheme || 'editorial';
  });

  // 2. Fetch Centralized Web Settings from Backend (Always Single Source of Truth for ALL Visitors)
  const { data: settingsData } = useQuery({
    queryKey: ['cmsWebSettingsThemeGlobal'],
    queryFn: async () => {
      try {
        const res = await api.get('/cms/pengaturan');
        return res?.data || res || {};
      } catch (err) {
        return {};
      }
    },
    staleTime: 1000 * 5, // 5 seconds fresh check
    refetchInterval: 1000 * 30 // Check periodically
  });

  // 3. Whenever admin updates settings in DB, automatically synchronize theme for all visitors
  useEffect(() => {
    if (!settingsData || Object.keys(settingsData).length === 0) return;

    let targetTheme = null;
    if (settingsData.home_layout_mode === 'PORTAL') {
      targetTheme = settingsData.site_theme || (currentTheme !== 'editorial' ? currentTheme : 'emerald');
    } else if (settingsData.home_layout_mode === 'EDITORIAL') {
      targetTheme = 'editorial';
    } else if (settingsData.site_theme) {
      targetTheme = settingsData.site_theme;
    }

    if (targetTheme && targetTheme !== currentTheme) {
      setCurrentTheme(targetTheme);
      localStorage.setItem('tamiang_theme', targetTheme);
      if (settingsData.home_layout_mode) {
        localStorage.setItem('djie_layout_mode', settingsData.home_layout_mode);
      }
      document.documentElement.setAttribute('data-theme', targetTheme);
    }
  }, [settingsData, currentTheme]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', currentTheme);
  }, [currentTheme]);

  const changeTheme = (themeId) => {
    setCurrentTheme(themeId);
    localStorage.setItem('tamiang_theme', themeId);
    document.documentElement.setAttribute('data-theme', themeId);
  };

  const activeThemeObj = themes.find((t) => t.id === currentTheme) || themes[0];

  return (
    <ThemeContext.Provider value={{ currentTheme, activeTheme: activeThemeObj, changeTheme, themes }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
