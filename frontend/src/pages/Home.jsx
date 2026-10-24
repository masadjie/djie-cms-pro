import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useTheme } from '../context/ThemeContext';
import SEOHead from '../components/common/SEOHead';
import FloatingActionBars from '../components/common/FloatingActionBars';
import HeroSection from '../components/home/HeroSection';
import BeritaSection from '../components/home/BeritaSection';
import BannerSikepoSection from '../components/home/BannerSikepoSection';
import LayananTerpopulerSection from '../components/home/LayananTerpopulerSection';
import AgendaSection from '../components/home/AgendaSection';
import GaleriVideoSection from '../components/home/GaleriVideoSection';
import EditorialNewsHome from '../components/home/EditorialNewsHome';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const { currentTheme } = useTheme();

  // Cached layout mode to eliminate flash of unstyled theme on page refresh
  const cachedLayout = localStorage.getItem('djie_layout_mode') || 'EDITORIAL';

  // 1. Fetch CMS Web Settings for Layout Mode override
  const { data: settingsData, isLoading: isSettingsLoading } = useQuery({
    queryKey: ['cmsWebSettings'],
    queryFn: async () => {
      try {
        const res = await api.get('/cms/pengaturan');
        const data = res?.data || res || {};
        if (data.home_layout_mode) {
          localStorage.setItem('djie_layout_mode', data.home_layout_mode);
        }
        return data;
      } catch (e) {
        return {};
      }
    },
    staleTime: 1000 * 30 // 30 seconds cache for rapid admin updates
  });

  const settings = settingsData || {};
  // The database setting (settings.home_layout_mode) is the absolute authority for layout!
  const isEditorialMode = settings.home_layout_mode 
    ? settings.home_layout_mode === 'EDITORIAL'
    : (currentTheme === 'editorial' || cachedLayout === 'EDITORIAL');

  // 2. Data Fetching for Agendas (Direct from Database CMS)
  const { data: agendaData } = useQuery({
    queryKey: ['homeAgenda'],
    enabled: !isEditorialMode,
    queryFn: async () => {
      try {
        const res = await api.get('/cms/agenda');
        const items = Array.isArray(res?.data) ? res.data : (Array.isArray(res) ? res : []);
        return items.filter(a => a.is_active !== false && a.is_active !== 0);
      } catch (e) {
        return [];
      }
    }
  });

  // Handle Search Submission
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/katalog?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div className="w-full relative min-h-screen bg-[#f8faf8] text-slate-800">
      {/* Dynamic SEO Meta & Schema.org Structured Data */}
      <SEOHead
        title={settings.site_title || "Djie CMS Pro | Portal Berita & Content Management System"}
        description={settings.site_description || "Portal berita modern, publikasi artikel terpercaya, dan ekosistem konten digital berkecepatan tinggi."}
        canonicalUrl={settings.seo_canonical_url || "http://localhost:3000"}
      />

      {/* Reusable Floating Action Bars (Sosial Media & Aksesibilitas) */}
      <FloatingActionBars />

      {/* CONDITIONAL RENDER: EDITORIAL MAGAZINE / DEFAULT PORTAL */}
      {isEditorialMode ? (
        <EditorialNewsHome />
      ) : (
        <>
          {/* 1. Hero Section Partial */}
          <HeroSection
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onSearchSubmit={handleSearchSubmit}
          />

          {/* 2. Berita & Pengumuman Kepegawaian Partial */}
          <BeritaSection />

          {/* 3. Banner Promosi & Layanan Unggulan Partial */}
          <BannerSikepoSection />

          {/* 4. Layanan Terpopuler Multi-Sektor Partial */}
          <LayananTerpopulerSection />

          {/* 5. Galeri Foto & Video Dokumentasi Kegiatan (YouTube, Instagram Reels, TikTok) */}
          <GaleriVideoSection />

          {/* 6. Agenda Resmi & Kalender Partial */}
          <AgendaSection agendaData={agendaData} />
        </>
      )}
    </div>
  );
}
