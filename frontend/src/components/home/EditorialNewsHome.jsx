import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { 
  Sparkles, 
  ArrowRight, 
  Calendar, 
  User, 
  Eye, 
  Clock, 
  Search, 
  ExternalLink, 
  TrendingUp, 
  CheckCircle2, 
  Mail, 
  Share2, 
  Laptop, 
  Layers, 
  MapPin, 
  Twitter, 
  Facebook, 
  Instagram, 
  Linkedin,
  ChevronLeft,
  ChevronRight,
  Send,
  Flame,
  Globe,
  Tag,
  Briefcase,
  Compass,
  Bookmark
} from 'lucide-react';

export default function EditorialNewsHome() {
  const navigate = useNavigate();
  const [selectedTopic, setSelectedTopic] = useState('ALL');
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSent, setNewsletterSent] = useState(false);
  const [searchWord, setSearchWord] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // 1. Fetch CMS Web Settings
  const { data: settingsData } = useQuery({
    queryKey: ['cmsWebSettings'],
    queryFn: async () => {
      try {
        const res = await api.get('/cms/pengaturan');
        return res?.data || res || {};
      } catch (err) {
        return {};
      }
    }
  });

  // 2. Fetch Categories (Trending Topics)
  const { data: categoriesData } = useQuery({
    queryKey: ['editorialCategories'],
    queryFn: async () => {
      try {
        const res = await api.get('/cms/kategori');
        return Array.isArray(res?.data) ? res.data : (Array.isArray(res) ? res : []);
      } catch (err) {
        return [];
      }
    }
  });

  // 3. Fetch Articles / News
  const { data: beritaData, isLoading } = useQuery({
    queryKey: ['editorialNewsList', selectedTopic, currentPage],
    queryFn: async () => {
      try {
        const params = {
          status: 'PUBLISHED',
          page: currentPage,
          limit: itemsPerPage
        };
        if (selectedTopic !== 'ALL') {
          params.kategori = selectedTopic;
        }
        const res = await api.get('/berita', { params });
        return res?.data || res || { data: [], total: 0 };
      } catch (err) {
        return { data: [], total: 0 };
      }
    }
  });

  // 4. Fetch Featured / Spotlight News (limit 4)
  const { data: featuredData } = useQuery({
    queryKey: ['editorialFeaturedNews'],
    queryFn: async () => {
      try {
        const res = await api.get('/berita', {
          params: { is_featured: true, limit: 4, status: 'PUBLISHED' }
        });
        const list = res?.data?.data || res?.data || res || [];
        return Array.isArray(list) ? list : [];
      } catch (err) {
        return [];
      }
    }
  });

  const settings = settingsData || {};
  const articles = beritaData?.data || (Array.isArray(beritaData) ? beritaData : []);
  const totalArticles = beritaData?.total || articles.length;
  const totalPages = Math.ceil(totalArticles / itemsPerPage) || 1;
  const featuredPosts = Array.isArray(featuredData) ? featuredData : [];
  const mainFeatured = featuredPosts.length > 0 ? featuredPosts[0] : (articles.length > 0 ? articles[0] : null);
  const categories = categoriesData || [];

  const siteName = settings.site_name || 'Djie CMS Pro';
  const editorialHeading = settings.site_tagline || 'Pusat Informasi & Redaksi Publikasi Digital';
  const editorialSub = settings.site_description || 'Portal resmi penyebaran berita terverifikasi, sudut pandang mendalam, liputan eksklusif, dan wawasan terkini setiap hari.';
  const authorName = settings.site_author || settings.instansi_name || 'Redaksi Publikasi';
  const authorDesc = settings.editorial_author_bio || 'Menghadirkan liputan investigasi, ulasan teknologi, tren terkini, dan analisis berbobot dari jurnalis independen.';

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchWord.trim()) {
      navigate(`/berita?search=${encodeURIComponent(searchWord.trim())}`);
    }
  };

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (newsletterEmail) {
      setNewsletterSent(true);
      setTimeout(() => {
        setNewsletterSent(false);
        setNewsletterEmail('');
      }, 4000);
    }
  };

  // Trending Topic Category Pills with clean Royal Blue & Multi-Pastel Accents
  const defaultTopics = [
    { label: 'Semua Berita', slug: 'ALL', icon: '✨', bg: 'bg-blue-50 text-blue-700 border-blue-200' },
    { label: 'Technology', slug: 'teknologi', icon: '💻', bg: 'bg-sky-50 text-sky-700 border-sky-200' },
    { label: 'Business', slug: 'bisnis', icon: '💼', bg: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
    { label: 'Sport', slug: 'olahraga', icon: '⚽', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    { label: 'Trends', slug: 'tren', icon: '🔥', bg: 'bg-rose-50 text-rose-700 border-rose-200' },
    { label: 'Startups', slug: 'startups', icon: '🚀', bg: 'bg-amber-50 text-amber-700 border-amber-200' },
    { label: 'News', slug: 'berita-pengumuman', icon: '📰', bg: 'bg-cyan-50 text-cyan-700 border-cyan-200' }
  ];

  return (
    <div className="w-full bg-[#f8fafc] text-slate-800 min-h-screen pt-24 sm:pt-28 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 sm:space-y-16">
        
        {/* ── 1. EDITORIAL HERO BANNER (ROYAL BLUE BRAND) ────────────────────────── */}
        <div className="text-center max-w-3xl mx-auto space-y-4 pt-2 sm:pt-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 text-xs font-black tracking-wide uppercase shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Digital Magazine & Newsroom</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.15]">
            {editorialHeading.split(':').map((part, idx) => (
              idx === 1 ? (
                <span key={idx}>: <span className="text-blue-600">{part}</span></span>
              ) : (
                <span key={idx}>{part}</span>
              )
            ))}
          </h1>

          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed font-normal">
            {editorialSub}
          </p>

          {/* Quick Search in Hero */}
          <form onSubmit={handleSearchSubmit} className="max-w-md mx-auto pt-2 flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchWord}
                onChange={(e) => setSearchWord(e.target.value)}
                placeholder="Cari topik berita, kata kunci, artikel..."
                className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-2xl shadow-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-xs sm:text-sm font-bold shadow-sm transition-all shrink-0 cursor-pointer"
            >
              Cari
            </button>
          </form>
        </div>

        {/* ── 2. EXPLORE TRENDING TOPICS (CATEGORY PILLS) ─────────────────────────── */}
        <div className="space-y-3 text-center">
          <span className="text-[11px] font-black tracking-widest text-slate-400 uppercase">
            Explore Trending Topics
          </span>
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 max-w-4xl mx-auto">
            {defaultTopics.map((topic) => {
              const isActive = selectedTopic === topic.slug;
              return (
                <button
                  key={topic.slug}
                  onClick={() => { setSelectedTopic(topic.slug); setCurrentPage(1); }}
                  className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 border cursor-pointer ${
                    isActive
                      ? 'bg-blue-600 text-white border-blue-600 shadow-md scale-105'
                      : `${topic.bg} hover:scale-105 hover:shadow-xs`
                  }`}
                >
                  <span>{topic.icon}</span>
                  <span>{topic.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── 3. MAIN EDITORIAL CONTENT: 2-COLUMNS (LEFT: 8 COLS, RIGHT: 4 COLS) ──── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* ── LEFT 8 COLS: 2-COLUMNS ARTICLE GRID CARDS ────────────────────── */}
          <div className="lg:col-span-8 space-y-8">
            
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <div key={n} className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-4 animate-pulse">
                    <div className="h-48 bg-slate-200 rounded-2xl w-full" />
                    <div className="h-4 bg-slate-200 rounded w-1/3" />
                    <div className="h-5 bg-slate-200 rounded w-4/5" />
                    <div className="h-3 bg-slate-200 rounded w-full" />
                  </div>
                ))}
              </div>
            ) : articles.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-xs space-y-3">
                <Compass className="w-12 h-12 text-blue-400 mx-auto" />
                <h3 className="text-lg font-black text-slate-800">Belum Ada Artikel di Topik Ini</h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Belum ada naskah berita yang dipublikasikan pada rubrik ini. Silakan pilih topik lain atau input berita baru dari admin panel.
                </p>
                <button
                  onClick={() => setSelectedTopic('ALL')}
                  className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 cursor-pointer"
                >
                  Lihat Semua Berita
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-7">
                {articles.map((item) => (
                  <article
                    key={item.id}
                    className="group bg-white rounded-3xl border border-slate-200 shadow-xs hover:shadow-xl hover:border-blue-300 transition-all duration-300 flex flex-col justify-between overflow-hidden"
                  >
                    <div>
                      {/* Image Thumbnail with Category Badge Overlay */}
                      <Link to={`/berita/${item.slug}`} className="block relative aspect-[16/10] overflow-hidden bg-slate-100">
                        <img
                          src={item.cover_image || item.gambar_utama || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=800&q=80'}
                          alt={item.title || item.judul}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          onError={(e) => {
                            e.currentTarget.src = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=800&q=80';
                          }}
                        />
                        {/* Category Floating Badges */}
                        <div className="absolute top-3.5 left-3.5 flex flex-wrap gap-1.5 z-10">
                          <span className="px-2.5 py-1 rounded-xl text-[10px] font-black tracking-wider uppercase bg-white/95 backdrop-blur-md text-slate-800 shadow-sm border border-slate-200/60">
                            {item.kategori?.nama_kategori || 'News'}
                          </span>
                        </div>
                      </Link>

                      {/* Content Info */}
                      <div className="p-5 sm:p-6 space-y-3">
                        {/* Meta: Author & Date */}
                        <div className="flex items-center gap-2 text-[11px] text-slate-400 font-medium">
                          <span className="font-bold text-slate-700 hover:text-blue-600 transition-colors">
                            {item.author_name || authorName}
                          </span>
                          <span>•</span>
                          <span>
                            {item.published_at 
                              ? new Date(item.published_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
                              : 'Terbaru'}
                          </span>
                          {(item.read_time_minutes || item.read_time) && (
                            <>
                              <span>•</span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {item.read_time_minutes || item.read_time} mnt
                              </span>
                            </>
                          )}
                        </div>

                        {/* Title */}
                        <h2 className="text-base sm:text-lg font-black text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
                          <Link to={`/berita/${item.slug}`}>
                            {item.title || item.judul}
                          </Link>
                        </h2>

                        {/* Excerpt */}
                        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                          {item.excerpt || item.ringkasan || 'Baca liputan dan informasi mendalam selengkapnya di artikel ini.'}
                        </p>
                      </div>
                    </div>

                    {/* Card Footer: Read More Arrow */}
                    <div className="px-5 sm:px-6 pb-5 pt-2 flex items-center justify-between text-xs font-bold text-blue-600 border-t border-slate-50">
                      <Link to={`/berita/${item.slug}`} className="flex items-center gap-1.5 group-hover:gap-2 transition-all">
                        <span>Baca Selengkapnya</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                      <span className="text-[11px] text-slate-400 font-normal flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        {item.views_count || 120}
                      </span>
                    </div>
                  </article>
                ))}
              </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="pt-6 flex items-center justify-center gap-2">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  className="w-9 h-9 rounded-xl border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-blue-50 hover:text-blue-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-9 h-9 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      currentPage === i + 1
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'border border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  className="w-9 h-9 rounded-xl border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-blue-50 hover:text-blue-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}

          </div>

          {/* ── RIGHT 4 COLS: EDITORIAL SIDEBAR ─────────────────────────────────── */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* 1. Author / Redaksi Bio Profile Card */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">
                About the Redaction
              </span>

              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-black flex items-center justify-center shadow-md text-lg">
                  {authorName.charAt(0)}
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-900">{authorName}</h4>
                  <span className="text-[11px] text-blue-700 font-semibold block">Editorial & Newsroom</span>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                {authorDesc}
              </p>

              <div className="flex items-center gap-1.5 text-xs text-slate-500 pt-1">
                <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span>{settings.kantor_kota || 'Jakarta'}, Indonesia</span>
              </div>

              {/* Social Media Link Icons */}
              <div className="flex items-center gap-2 pt-2 border-t border-slate-100 text-slate-500">
                <a href={settings.social_twitter || '#'} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-xl bg-slate-50 hover:bg-blue-50 hover:text-blue-600 flex items-center justify-center transition-colors">
                  <Twitter className="w-3.5 h-3.5" />
                </a>
                <a href={settings.social_facebook || '#'} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-xl bg-slate-50 hover:bg-blue-50 hover:text-blue-600 flex items-center justify-center transition-colors">
                  <Facebook className="w-3.5 h-3.5" />
                </a>
                <a href={settings.social_instagram || '#'} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-xl bg-slate-50 hover:bg-blue-50 hover:text-blue-600 flex items-center justify-center transition-colors">
                  <Instagram className="w-3.5 h-3.5" />
                </a>
                <a href={settings.social_whatsapp ? `https://wa.me/${settings.social_whatsapp}` : '#'} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-xl bg-slate-50 hover:bg-blue-50 hover:text-blue-600 flex items-center justify-center transition-colors">
                  <Share2 className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* 2. Featured Posts Spotlight Card */}
            {mainFeatured && (
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Featured Post
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-blue-100 text-blue-700 font-bold text-[10px]">
                    Highlight
                  </span>
                </div>

                <Link to={`/berita/${mainFeatured.slug}`} className="block relative aspect-[4/3] rounded-2xl overflow-hidden group shadow-sm">
                  <img
                    src={mainFeatured.cover_image || mainFeatured.gambar_utama || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80'}
                    alt={mainFeatured.title || mainFeatured.judul}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent flex flex-col justify-end p-4 text-white">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-blue-300">
                      {mainFeatured.kategori?.nama_kategori || 'Editorial'}
                    </span>
                    <h5 className="text-sm font-black text-white line-clamp-2 mt-1 leading-snug">
                      {mainFeatured.title || mainFeatured.judul}
                    </h5>
                    <span className="text-[10px] text-slate-300 mt-2 block">
                      {mainFeatured.author_name || authorName} • {mainFeatured.published_at ? new Date(mainFeatured.published_at).toLocaleDateString('id-ID') : 'Terbaru'}
                    </span>
                  </div>
                </Link>
              </div>
            )}

            {/* 3. Editorial Categories / Rubrik Cloud */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-3.5">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">
                Rubrik & Topik Berita
              </span>
              <div className="space-y-2">
                {categories.map((kat) => (
                  <Link
                    key={kat.id}
                    to={`/berita?kategori=${kat.slug}`}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-blue-50/70 transition-colors text-xs font-semibold text-slate-700 group"
                  >
                    <span className="flex items-center gap-2 group-hover:text-blue-700">
                      <Tag className="w-3.5 h-3.5 text-blue-600" />
                      <span>{kat.nama_kategori}</span>
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
                  </Link>
                ))}
              </div>
            </div>

            {/* 4. Curated Reading / External Resources Widget */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">
                Kanal Rekomendasi
              </span>
              <div className="space-y-3 text-xs">
                <a
                  href="/katalog"
                  className="block p-3 rounded-2xl bg-slate-50 hover:bg-blue-50/60 border border-slate-100 transition-all group"
                >
                  <div className="flex items-center justify-between font-bold text-slate-800 group-hover:text-blue-700">
                    <span>Katalog Layanan & Arsip</span>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600" />
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                    Eksplorasi dokumen publik, regulasi, dan prosedur operasional terpadu.
                  </p>
                </a>

                <a
                  href="/galeri"
                  className="block p-3 rounded-2xl bg-slate-50 hover:bg-blue-50/60 border border-slate-100 transition-all group"
                >
                  <div className="flex items-center justify-between font-bold text-slate-800 group-hover:text-blue-700">
                    <span>Dokumentasi Galeri & Video</span>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600" />
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                    Liputan foto kegiatan, dokumentasi siaran pers, dan tayangan liputan.
                  </p>
                </a>
              </div>
            </div>

          </div>

        </div>

        {/* ── 4. NEWSLETTER SUBSCRIPTION BOX (ROYAL BLUE ACCENT) ─────────── */}
        <div className="bg-gradient-to-b from-white to-blue-50/60 rounded-3xl p-8 sm:p-12 border border-blue-100 text-center max-w-2xl mx-auto space-y-4 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center mx-auto shadow-md">
            <Mail className="w-6 h-6" />
          </div>

          <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Subscribe to our Newsletter
          </h3>

          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed max-w-md mx-auto">
            Dapatkan kiriman rangkuman berita terpopuler, liputan eksklusif, dan wawasan mingguan langsung di inbox email Anda.
          </p>

          {newsletterSent ? (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-bold inline-flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Terima kasih! Anda telah terdaftar dalam buletin berkala kami.</span>
            </div>
          ) : (
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row items-center justify-center gap-2 max-w-md mx-auto pt-2">
              <input
                type="email"
                required
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="Ketik alamat email Anda..."
                className="w-full sm:flex-1 px-4 py-3 bg-white border border-slate-200 rounded-2xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-xs"
              />
              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white rounded-2xl text-xs font-bold transition-all shadow-md shrink-0 cursor-pointer"
              >
                Subscribe
              </button>
            </form>
          )}

          <p className="text-[10px] text-slate-400">
            Bebas spam. Anda dapat membatalkan langganan kapan saja dengan 1 klik.
          </p>
        </div>

      </div>
    </div>
  );
}
