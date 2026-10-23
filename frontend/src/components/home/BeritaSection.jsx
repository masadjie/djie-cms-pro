import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../../services/api';
import { 
  ExternalLink, 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  Eye, 
  Sparkles,
  ArrowRight,
  Flame
} from 'lucide-react';

export default function BeritaSection() {
  const [activeTab, setActiveTab] = useState('TERBARU'); // 'TERBARU' | 'TERPOPULER'
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const autoSlideTimerRef = useRef(null);

  // 1. Fetch Latest News from Database
  const { data: latestNewsData, isLoading: isLoadingLatest } = useQuery({
    queryKey: ['homeBeritaLatest'],
    queryFn: async () => {
      try {
        const res = await api.get('/berita?limit=6&sort=latest');
        return Array.isArray(res?.data) ? res.data : (Array.isArray(res) ? res : []);
      } catch (err) {
        return [];
      }
    }
  });

  // 2. Fetch Popular News from Database
  const { data: popularNewsData, isLoading: isLoadingPopular } = useQuery({
    queryKey: ['homeBeritaPopular'],
    queryFn: async () => {
      try {
        const res = await api.get('/berita?limit=6&sort=popular');
        return Array.isArray(res?.data) ? res.data : (Array.isArray(res) ? res : []);
      } catch (err) {
        return [];
      }
    }
  });

  const latestList = Array.isArray(latestNewsData) ? latestNewsData : [];
  const popularList = Array.isArray(popularNewsData) ? popularNewsData : [];

  // Use real news from database for featured carousel: prioritize pinned/featured or latest
  const featuredSlides = latestList.length > 0
    ? [...latestList].sort((a, b) => (b.is_pinned ? 1 : 0) - (a.is_pinned ? 1 : 0)).slice(0, 4)
    : [];
  const activeSideNews = activeTab === 'TERPOPULER' 
    ? (popularList.length > 0 ? popularList.slice(0, 4) : latestList.slice(0, 4)) 
    : latestList.slice(0, 4);

  // Auto-Slide logic (every 5.5 seconds, pauses on hover)
  useEffect(() => {
    if (featuredSlides.length <= 1 || isPaused) return;

    autoSlideTimerRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % featuredSlides.length);
    }, 5500);

    return () => {
      if (autoSlideTimerRef.current) clearInterval(autoSlideTimerRef.current);
    };
  }, [featuredSlides.length, isPaused]);

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % featuredSlides.length);
  };

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + featuredSlides.length) % featuredSlides.length);
  };

  const currentFeatured = featuredSlides[currentSlide] || featuredSlides[0];

  return (
    <section className="w-full px-3 sm:px-6 lg:px-12 -mt-6 sm:-mt-10 mb-6 sm:mb-10 relative z-20">
      <div className="w-full max-w-[1600px] mx-auto bg-white rounded-3xl p-4 sm:p-8 shadow-2xl border border-emerald-100/80">
        
        {/* Section Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-4 sm:pb-5 mb-5 sm:mb-6 gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
              </span>
              <h2 className="text-lg sm:text-2xl font-black text-slate-900 tracking-tight">
                Berita & Informasi Resmi Kepegawaian
              </h2>
            </div>
            <p className="text-[11px] sm:text-xs text-slate-500">
              Warta kedinasan, kebijakan CASN, dan pengumuman mutasi Badan Kepegawaian & Pengembangan SDM Kab. Aceh Tamiang
            </p>
          </div>

          <Link
            to="/berita"
            className="px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-xl border border-emerald-800 text-emerald-800 hover:bg-emerald-800 hover:text-white text-xs font-black transition-all flex items-center gap-1.5 self-start sm:self-auto shadow-xs group"
          >
            <span>Semua Berita & Pengumuman</span>
            <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* 2-Column Balanced Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* ================= COLUMN 1: AESTHETIC FEATURED CAROUSEL (7 COLS) ================= */}
          <div 
            className="lg:col-span-7 xl:col-span-7 relative rounded-3xl overflow-hidden shadow-lg shadow-slate-200/60 min-h-[460px] xs:min-h-[480px] sm:min-h-[440px] md:min-h-[460px] flex flex-col justify-end bg-slate-900 ring-1 ring-slate-900/5 group select-none"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {isLoadingLatest && featuredSlides.length === 0 ? (
              <div className="absolute inset-0 flex flex-col justify-center items-center bg-slate-900 text-slate-400 gap-3">
                <div className="w-8 h-8 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                <span className="text-xs font-semibold">Memuat Warta Terkini...</span>
              </div>
            ) : featuredSlides.length === 0 ? (
              <div className="absolute inset-0 flex flex-col justify-center items-center bg-slate-900 text-slate-400 gap-2 p-6 text-center">
                <span className="text-sm font-bold text-slate-300">Belum ada warta berita</span>
                <span className="text-xs text-slate-500">Berita resmi akan segera dipublikasikan melalui portal ini.</span>
              </div>
            ) : (
              <div className="relative w-full h-full min-h-[460px] xs:min-h-[480px] sm:min-h-[440px] md:min-h-[460px] flex flex-col justify-end">
                {/* Stacked Slides for Silky Smooth Crossfade & Slide Transition */}
                {featuredSlides.map((slide, idx) => {
                  const isActive = idx === currentSlide;
                  return (
                    <div
                      key={slide.id || idx}
                      inert={!isActive ? '' : undefined}
                      className={`absolute inset-0 flex flex-col justify-end p-4 xs:p-5 sm:p-7 md:p-8 pb-12 sm:pb-7 transition-all duration-700 ease-in-out ${
                        isActive
                          ? 'opacity-100 scale-100 pointer-events-auto z-10'
                          : 'opacity-0 scale-105 pointer-events-none z-0 invisible'
                      }`}
                    >
                      {/* Background Cover Image with Ken Burns / Zoom Effect */}
                      <img
                        src={slide.cover_image || 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80'}
                        alt={slide.title || 'Berita Utama ASN'}
                        width="850"
                        height="460"
                        loading={idx === 0 ? 'eager' : 'lazy'}
                        fetchPriority={idx === 0 ? 'high' : 'auto'}
                        decoding={idx === 0 ? 'sync' : 'async'}
                        className={`absolute inset-0 w-full h-full object-cover opacity-75 group-hover:scale-105 transition-transform duration-1000 ease-out`}
                      />

                      {/* Smooth Modern Gradient Overlay (Softer, clean contrast without harsh dark box) */}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/50 to-transparent" />
                      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-transparent pointer-events-none" />

                      {/* Top Carousel Badges & Counter */}
                      <div className="absolute top-3.5 xs:top-4 sm:top-5 left-3.5 xs:left-4 sm:left-5 right-3.5 xs:right-4 sm:right-5 flex items-center justify-between z-20">
                        <span className="px-2.5 sm:px-3 py-1 rounded-full bg-amber-400 text-slate-950 text-[9px] sm:text-[10px] font-black uppercase tracking-wider shadow-md">
                          {slide.kategori?.nama_kategori || 'WARTA UTAMA'}
                        </span>

                        <div className="flex items-center gap-1.5 px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-[10px] sm:text-[11px] font-mono font-bold text-white shadow-sm">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          <span>{idx + 1} / {featuredSlides.length}</span>
                        </div>
                      </div>

                      {/* Slide Content Box */}
                      <div className={`relative z-10 space-y-2 sm:space-y-3 pt-12 sm:pt-16 pb-2 sm:pb-0 transition-all duration-700 delay-100 ${
                        isActive ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                      }`}>
                        <h3 className="text-sm xs:text-base sm:text-xl lg:text-2xl font-black text-white leading-snug sm:leading-snug line-clamp-2 sm:line-clamp-3 group-hover:text-emerald-200 transition-colors">
                          <Link to={`/berita/${slide.slug || ''}`} tabIndex={!isActive ? -1 : 0}>
                            {slide.title}
                          </Link>
                        </h3>

                        {/* Meta Info */}
                        <div className="flex items-center gap-2 sm:gap-3 text-[10px] xs:text-[11px] sm:text-xs text-emerald-100/90 font-medium flex-wrap pt-0.5">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-amber-400" />
                            {slide.published_at 
                              ? new Date(slide.published_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) 
                              : 'Hari ini'}
                          </span>
                          <span>•</span>
                          <span className="truncate max-w-[120px] xs:max-w-[150px] sm:max-w-none">{slide.author_name || 'Humas BKPSDM'}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1 font-mono text-amber-300 font-semibold">
                            <Eye className="w-3 sm:w-3.5 h-3 sm:h-3.5" />
                            {(slide.views_count || 0).toLocaleString('id-ID')} views
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Shared Navigation Dots / Pill Progress Bars (Positioned cleanly at bottom right with backdrop pill) */}
                {featuredSlides.length > 1 && (
                  <div className="absolute bottom-3 right-3 sm:bottom-5 sm:right-6 z-20 flex items-center bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10 gap-1.5">
                    {featuredSlides.map((_, idx) => {
                      const isActive = idx === currentSlide;
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setCurrentSlide(idx)}
                          aria-label={`Pindah ke Slide ${idx + 1}`}
                          className="p-1 cursor-pointer flex items-center justify-center focus:outline-none"
                        >
                          <span className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 ease-out block ${
                            isActive 
                              ? 'w-6 sm:w-8 bg-amber-400 shadow-xs shadow-amber-400 scale-100' 
                              : 'w-2 sm:w-2.5 bg-white/40 hover:bg-white/80'
                          }`} />
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Left & Right Arrow Navigation Controls */}
                {featuredSlides.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={handlePrevSlide}
                      aria-label="Slide Berita Sebelumnya"
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 hover:bg-emerald-600 text-white flex items-center justify-center backdrop-blur-md border border-white/20 opacity-0 group-hover:opacity-100 transition-all duration-300 z-30 cursor-pointer shadow-xl hover:scale-110 active:scale-95"
                      title="Slide Sebelumnya"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      type="button"
                      onClick={handleNextSlide}
                      aria-label="Slide Berita Selanjutnya"
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 hover:bg-emerald-600 text-white flex items-center justify-center backdrop-blur-md border border-white/20 opacity-0 group-hover:opacity-100 transition-all duration-300 z-30 cursor-pointer shadow-xl hover:scale-110 active:scale-95"
                      title="Slide Selanjutnya"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}
              </div>
            )}
          </div>

          {/* ================= COLUMN 2: RIGHT DATABASE NEWS LIST (5 COLS) ================= */}
          <div className="lg:col-span-5 xl:col-span-5 flex flex-col justify-between space-y-4">
            
            {/* Tab Header: TERBARU vs TERPOPULER (Clean Professional Design, Non-AI) */}
            <div>
              <div className="flex items-center gap-1 border-b border-slate-200 pb-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('TERBARU')}
                  className={`py-1.5 px-3.5 text-xs font-bold transition-all rounded-lg cursor-pointer flex items-center gap-2 ${
                    activeTab === 'TERBARU'
                      ? 'bg-emerald-800 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${activeTab === 'TERBARU' ? 'bg-amber-400' : 'bg-slate-400'}`} />
                  <span className="tracking-wide">Terbaru</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('TERPOPULER')}
                  className={`py-1.5 px-3.5 text-xs font-bold transition-all rounded-lg cursor-pointer flex items-center gap-2 ${
                    activeTab === 'TERPOPULER'
                      ? 'bg-emerald-800 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${activeTab === 'TERPOPULER' ? 'bg-amber-400' : 'bg-slate-400'}`} />
                  <span className="tracking-wide">Terpopuler</span>
                </button>
              </div>

              {/* News Items List from Database */}
              <div className="space-y-3 pt-3">
                {activeSideNews.length === 0 ? (
                  <div className="py-8 text-center text-xs text-slate-400">
                    Memuat berita kepegawaian...
                  </div>
                ) : (
                  activeSideNews.map((news, idx) => (
                    <Link
                      key={news.id || idx}
                      to={`/berita/${news.slug}`}
                      className="block group space-y-1 pb-3 border-b border-slate-100 last:border-0 hover:bg-slate-50/80 -mx-2 px-2.5 py-2 rounded-xl transition-all"
                    >
                      <div className="flex items-center gap-2 text-[10px] font-bold">
                        <span className="text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                          {news.kategori?.nama_kategori || 'Kepegawaian'}
                        </span>
                        <span className="text-slate-600 font-normal">•</span>
                        <span className="text-slate-600 font-mono font-medium">
                          {news.published_at 
                            ? new Date(news.published_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }) 
                            : 'Baru'}
                        </span>
                        {news.views_count !== undefined && (
                          <span className="ml-auto text-slate-600 flex items-center gap-1 font-mono font-semibold">
                            <Eye className="w-3 h-3 text-slate-500" />
                            {news.views_count}
                          </span>
                        )}
                      </div>

                      <h4 className="font-bold text-xs sm:text-[13px] text-slate-900 group-hover:text-emerald-800 transition-colors leading-snug line-clamp-2">
                        {news.title}
                      </h4>
                    </Link>
                  ))
                )}
              </div>
            </div>

            {/* Bottom Link to Portal Berita */}
            <Link
              to="/berita"
              className="py-2.5 px-4 bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 text-slate-700 hover:text-emerald-800 rounded-2xl text-xs font-bold flex items-center justify-between transition-all group"
            >
              <span>Lihat Indeks Berita Lengkap</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform text-emerald-700" />
            </Link>

          </div>

        </div>

      </div>
    </section>
  );
}
