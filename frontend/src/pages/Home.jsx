import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import SEOHead from '../components/common/SEOHead';
import FloatingActionBars from '../components/common/FloatingActionBars';
import HeroSection from '../components/home/HeroSection';
import BeritaSection from '../components/home/BeritaSection';
import BannerSikepoSection from '../components/home/BannerSikepoSection';
import LayananTerpopulerSection from '../components/home/LayananTerpopulerSection';
import AgendaSection from '../components/home/AgendaSection';
import GaleriVideoSection from '../components/home/GaleriVideoSection';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  // 1. Data Fetching for Agendas (Direct from Database CMS)
  const { data: agendaData } = useQuery({
    queryKey: ['homeAgenda'],
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
        title="Portal Resmi BKPSDM Kab. Aceh Tamiang | Layanan Kepegawaian & SiKEPO"
        description="Pusat layanan karir ASN, seleksi CASN/PPPK, kenaikan pangkat SIASN, izin belajar, e-Kinerja, dan aplikasi manajemen kepegawaian SiKEPO Kabupaten Aceh Tamiang."
        canonicalUrl="https://bkpsdm.acehtamiangkab.go.id"
      />

      {/* Reusable Floating Action Bars (Sosial Media & Aksesibilitas) */}
      <FloatingActionBars />

      {/* 1. Hero Section Partial */}
      <HeroSection
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSearchSubmit={handleSearchSubmit}
      />

      {/* 2. Berita & Pengumuman Kepegawaian Partial */}
      <BeritaSection />

      {/* 3. Banner Promosi SiKEPO & Helpdesk ASN Partial */}
      <BannerSikepoSection />

      {/* 4. Layanan Terpopuler Multi-Sektor Partial */}
      <LayananTerpopulerSection />

      {/* 5. Galeri Foto & Video Dokumentasi Kegiatan ASN (YouTube, Instagram Reels, TikTok) */}
      <GaleriVideoSection />

      {/* 6. Agenda Resmi BKPSDM & Kalender Partial */}
      <AgendaSection agendaData={agendaData} />
    </div>
  );
}
