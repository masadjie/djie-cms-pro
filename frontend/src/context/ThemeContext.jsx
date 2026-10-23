import React, { createContext, useContext, useState, useEffect } from 'react';

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
  // Read saved theme synchronously from localStorage on initial render (no initial 'emerald' flash)
  const [currentTheme, setCurrentTheme] = useState(() => {
    return localStorage.getItem('tamiang_theme') || 'editorial';
  });

  useEffect(() => {
    const savedTheme = localStorage.getItem('tamiang_theme') || 'editorial';
    setCurrentTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

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
