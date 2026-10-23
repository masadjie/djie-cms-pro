import React, { useState, useEffect } from 'react';
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
  Bookmark,
  MessageSquare,
  Play,
  Youtube,
  Rss
} from 'lucide-react';

export default function EditorialNewsHome() {
  const navigate = useNavigate();
  const [selectedTopic, setSelectedTopic] = useState('ALL');
  const [activeTabCat, setActiveTabCat] = useState('ALL');
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSent, setNewsletterSent] = useState(false);
  const [searchWord, setSearchWord] = useState('');
  const [tickerIndex, setTickerIndex] = useState(0);
  const [tickerFade, setTickerFade] = useState(true);

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

  const settings = settingsData || {};

  // Custom highlights & promo banner from database if edited in admin
  const highlightPromoTitle = settings.editorial_promo_title || 'Djie CMS Pro — High-Speed Digital Publishing Engine';
  const highlightPromoDesc = settings.editorial_promo_desc || 'Dapatkan akses penuh ke seluruh modul berita redaksi, integrasi dokumen publik, dan performa tinggi React 18 SPA.';
  const highlightPromoBtn = settings.editorial_promo_btn || 'Masuk Dashboard';
  const highlightPromoUrl = settings.editorial_promo_url || '/admin/login';
  const highlightPromoTag = settings.editorial_promo_tag || 'SPECIAL HIGHLIGHT PROMO';

  // Custom 4 Circular Highlights from Settings
  const customHighlights = [
    {
      num: 1,
      title: settings.editorial_hl1_title || 'Ducati Has All The Cards To Win Championship',
      cat: settings.editorial_hl1_cat || 'SPORTS',
      img: settings.editorial_hl1_img || 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=250&q=80',
      url: settings.editorial_hl1_url || '#'
    },
    {
      num: 2,
      title: settings.editorial_hl2_title || 'If You Went Round The World Which Path To Choose',
      cat: settings.editorial_hl2_cat || 'TRAVEL',
      img: settings.editorial_hl2_img || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=250&q=80',
      url: settings.editorial_hl2_url || '#'
    },
    {
      num: 3,
      title: settings.editorial_hl3_title || 'The Best Ways To Start A Motorsport Career',
      cat: settings.editorial_hl3_cat || 'FASHION',
      img: settings.editorial_hl3_img || 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=250&q=80',
      url: settings.editorial_hl3_url || '#'
    },
    {
      num: 4,
      title: settings.editorial_hl4_title || 'Moon Mission Landings: How Near Are Commercial Bases',
      cat: settings.editorial_hl4_cat || 'HEALTH',
      img: settings.editorial_hl4_img || 'https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=250&q=80',
      url: settings.editorial_hl4_url || '#'
    }
  ];

  // 2. Fetch Categories
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

  // 3. Fetch All Published Articles
  const { data: beritaData, isLoading } = useQuery({
    queryKey: ['editorialNewsListFull'],
    queryFn: async () => {
      try {
        const res = await api.get('/berita', {
          params: { status: 'PUBLISHED', limit: 30 }
        });
        return res?.data || res || { data: [], total: 0 };
      } catch (err) {
        return { data: [], total: 0 };
      }
    }
  });

  const rawArticles = beritaData?.data || (Array.isArray(beritaData) ? beritaData : []);
  const categories = categoriesData || [];

  // Fallback demo articles if DB is fresh / few items
  const fallbackArticles = [
    {
      id: 'fb-1',
      title: 'Budget Issues Force The World Tour To Be Cancelled',
      slug: 'budget-issues-force-the-world-tour-to-be-cancelled',
      excerpt: 'Organizers confirmed earlier this morning that financial constraints and logistical complexities have made the upcoming international season untenable.',
      category: 'FASHION',
      catColor: 'bg-rose-500',
      author: 'Admin',
      date: 'December 9, 2026',
      comments: 8,
      readTime: '4 min',
      image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=80'
    },
    {
      id: 'fb-2',
      title: 'Crafty Cook and Decorate All Of Our Food Dishes With Love',
      slug: 'crafty-cook-and-decorate-all-food-dishes-with-love',
      excerpt: 'Culinary experts share secret plating techniques and artisanal ingredients that turn everyday meals into restaurant-grade experiences.',
      category: 'FOOD',
      catColor: 'bg-amber-500',
      author: 'Admin',
      date: 'December 9, 2026',
      comments: 3,
      readTime: '3 min',
      image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 'fb-3',
      title: 'African Nation Are Struggling To Save Their Native Wildlife',
      slug: 'african-nation-are-struggling-to-save-their-native-wildlife',
      excerpt: 'New satellite conservation tracking reveals shifting habitats and urgent funding gaps needed to protect endangered migratory corridors.',
      category: 'TECHNOLOGY',
      catColor: 'bg-blue-600',
      author: 'Admin',
      date: 'December 8, 2026',
      comments: 5,
      readTime: '5 min',
      image: 'https://images.unsplash.com/photo-1593508512255-86ab42a8e620?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 'fb-4',
      title: 'How To Have Fantastic Trips Without Blowing Your Monthly Budget',
      slug: 'how-to-have-fantastic-trips-without-blowing-your-budget',
      excerpt: 'Mastering off-peak travel passes, local rail networks, and homestays lets digital nomads travel the world on a modest budget.',
      category: 'TRAVEL',
      catColor: 'bg-blue-600',
      author: 'Admin',
      date: 'December 7, 2026',
      comments: 2,
      readTime: '4 min',
      image: 'https://images.unsplash.com/photo-1539635278303-d4002c07eae3?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 'fb-5',
      title: 'How Childhood Viral Infections May Affect Long Term Immunity',
      slug: 'how-childhood-viral-infections-may-affect-long-term-immunity',
      excerpt: 'Longitudinal studies uncover surprising immunological pathways developed during early years that protect against metabolic disorders.',
      category: 'HEALTH',
      catColor: 'bg-cyan-600',
      author: 'Admin',
      date: 'December 6, 2026',
      comments: 1,
      readTime: '3 min',
      image: 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 'fb-6',
      title: 'Animal Conservationists Pioneer AI Acoustic Wildlife Tracking',
      slug: 'animal-conservationists-pioneer-ai-acoustic-wildlife-tracking',
      excerpt: 'Sensors deployed across dense canopies detect acoustic frequencies of rare primates and immediately alert anti-poaching field teams.',
      category: 'SCIENCE',
      catColor: 'bg-indigo-600',
      author: 'Admin',
      date: 'December 5, 2026',
      comments: 4,
      readTime: '5 min',
      image: 'https://images.unsplash.com/photo-1535268647677-300dbf3d78d1?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 'fb-7',
      title: 'If You Went Round The World, Which Hidden Places Could You Not Miss?',
      slug: 'if-you-went-round-the-world-which-hidden-places',
      excerpt: 'A curated itinerary of uncharted islands, alpine villages, and ancient trade routes that remain untouched by mass tourism.',
      category: 'TRAVEL',
      catColor: 'bg-blue-600',
      author: 'Admin',
      date: 'December 4, 2026',
      comments: 9,
      readTime: '6 min',
      image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 'fb-8',
      title: 'Moon Mission Landings: How Close Are Commercial Deep Space Habitats?',
      slug: 'moon-mission-landings-how-close-are-commercial-deep-space-habitats',
      excerpt: 'Modular inflatable lunar base designs achieve pressurized vacuum tests, bringing autonomous extraterrestrial settlements closer to reality.',
      category: 'TECHNOLOGY',
      catColor: 'bg-blue-600',
      author: 'Admin',
      date: 'December 3, 2026',
      comments: 6,
      readTime: '5 min',
      image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80'
    }
  ];

  // Merge real articles with fallbacks
  const articles = rawArticles.length > 0 ? rawArticles.map((a, i) => ({
    id: a.id,
    title: a.title,
    slug: a.slug,
    excerpt: a.excerpt || 'Baca artikel dan liputan informasi mendalam selengkapnya.',
    category: a.kategori?.nama_kategori?.toUpperCase() || (fallbackArticles[i % fallbackArticles.length].category),
    catColor: ['bg-blue-600', 'bg-sky-600', 'bg-indigo-600', 'bg-blue-700', 'bg-slate-700'][i % 5],
    author: a.author_name || 'Admin',
    date: a.published_at ? new Date(a.published_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'December 2026',
    comments: a.comments_count || Math.floor(Math.random() * 8) + 1,
    readTime: `${a.read_time_minutes || 4} min`,
    image: a.cover_image || fallbackArticles[i % fallbackArticles.length].image
  })) : fallbackArticles;

  // Slices for each Neeon magazine section
  const tickerItems = articles.slice(0, 5);
  const heroMain = articles[0];
  const heroSide = articles.slice(1, 4);
  const topStories = articles.slice(0, 4);
  const whatsNewLead = articles[4] || articles[0];
  const whatsNewList = articles.slice(5, 8).length > 0 ? articles.slice(5, 8) : articles.slice(1, 4);
  const circularHighlights = customHighlights;

  // Auto-rotating animated ticker for trending topics
  useEffect(() => {
    if (!tickerItems || tickerItems.length <= 1) return;
    const interval = setInterval(() => {
      setTickerFade(false);
      setTimeout(() => {
        setTickerIndex((prev) => (prev + 1) % tickerItems.length);
        setTickerFade(true);
      }, 300);
    }, 4000);
    return () => clearInterval(interval);
  }, [tickerItems.length]);

  const currentTicker = tickerItems[tickerIndex] || tickerItems[0];

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

  return (
    <div className="w-full bg-[#f8fafc] text-slate-800 min-h-screen pt-20 sm:pt-24 pb-20 font-sans selection:bg-blue-600 selection:text-white">

      {/* ── 1. TOP TICKER STRIP (NEEON STYLE) ─────────────────────────────────── */}
      <div className="bg-[#0f172a] text-slate-300 text-xs py-2 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-3 overflow-hidden w-full md:w-auto">
            <span className="relative inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-blue-600 text-white font-black text-[10px] tracking-wider uppercase shrink-0 shadow-sm overflow-hidden group">
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
              <Flame className="w-3.5 h-3.5 text-amber-300 animate-[bounce_1.5s_infinite]" />
              <span>TRENDING</span>
            </span>
            <div className="flex items-center gap-2 overflow-hidden min-w-0">
              <Link 
                to={`/berita/${currentTicker?.slug || '#'}`} 
                className={`truncate text-slate-200 text-xs font-semibold hover:text-blue-400 transition-all duration-300 transform ${
                  tickerFade ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
                }`}
              >
                {currentTicker?.title || 'Memuat berita trending terkini...'}
              </Link>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-4 text-[11px] text-slate-400 shrink-0">
            <span>{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
            <span>•</span>
            <div className="flex items-center gap-2">
              <span className="text-slate-500">FOLLOW US:</span>
              <a href={settings.social_facebook || '#'} target="_blank" rel="noreferrer" className="hover:text-blue-400 transition-colors"><Facebook className="w-3.5 h-3.5" /></a>
              <a href={settings.social_twitter || '#'} target="_blank" rel="noreferrer" className="hover:text-sky-400 transition-colors"><Twitter className="w-3.5 h-3.5" /></a>
              <a href={settings.social_instagram || '#'} target="_blank" rel="noreferrer" className="hover:text-pink-400 transition-colors"><Instagram className="w-3.5 h-3.5" /></a>
              <a href={settings.social_youtube || '#'} target="_blank" rel="noreferrer" className="hover:text-red-400 transition-colors"><Youtube className="w-3.5 h-3.5" /></a>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 space-y-12">

        {/* ── 2. CIRCULAR NUMBERED HIGHLIGHTS BAR (TOP 4 SLIDER BAR) ──────────── */}
        <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-200/80 shadow-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
            {circularHighlights.map((item, idx) => (
              <div key={idx} className={`flex items-center gap-3.5 ${idx !== 0 ? 'sm:pl-5' : ''} ${idx > 0 ? 'pt-4 sm:pt-0' : ''}`}>
                <div className="relative shrink-0">
                  <img
                    src={item.img}
                    alt={item.title}
                    className="w-16 h-16 rounded-full object-cover shadow-sm ring-2 ring-blue-500/20"
                  />
                  <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-slate-900 text-white font-black text-[10px] flex items-center justify-center border-2 border-white">
                    {item.num}
                  </span>
                </div>
                <div className="space-y-1 min-w-0">
                  <span className="text-[10px] font-black uppercase text-blue-600 tracking-wider block">
                    {item.cat}
                  </span>
                  <Link to={item.url && item.url !== '#' ? item.url : `/berita/${tickerItems[idx % tickerItems.length]?.slug || '#'}`} className="text-xs font-bold text-slate-900 hover:text-blue-600 transition-colors line-clamp-2 leading-snug block">
                    {item.title}
                  </Link>
                  <span className="text-[10px] text-slate-400 block font-medium">
                    {item.date}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── 3. HERO COMPOSITE GRID (1 HUGE FEATURED + 3 SIDEBAR CARDS) ───────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Main Huge Feature Card (Col 8) */}
          <div className="lg:col-span-7 xl:col-span-8 relative rounded-3xl overflow-hidden group shadow-sm bg-slate-900 min-h-[380px] sm:min-h-[460px] flex flex-col justify-end">
            <img
              src={heroMain?.image}
              alt={heroMain?.title}
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90"
            />
            {/* Dark gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

            <div className="relative z-10 p-6 sm:p-8 space-y-3">
              <span className={`inline-block px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-wider text-white ${heroMain?.catColor || 'bg-rose-600'} shadow-sm`}>
                {heroMain?.category || 'FASHION'}
              </span>

              <h1 className="text-2xl sm:text-4xl font-black text-white leading-tight tracking-tight drop-shadow-md">
                <Link to={`/berita/${heroMain?.slug}`} className="hover:underline">
                  {heroMain?.title}
                </Link>
              </h1>

              <div className="flex items-center gap-3 text-xs text-slate-300 font-medium pt-1">
                <span className="text-white font-bold">BY {heroMain?.author?.toUpperCase()}</span>
                <span>•</span>
                <span>{heroMain?.date}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <MessageSquare className="w-3.5 h-3.5" />
                  {heroMain?.comments} COMMENTS
                </span>
              </div>
            </div>
          </div>

          {/* 3 Right Hand Cards (Col 5 / 4) */}
          <div className="lg:col-span-5 xl:col-span-4 flex flex-col justify-between gap-4">
            {heroSide.map((item, idx) => (
              <div 
                key={idx}
                className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex items-center gap-4 group"
              >
                <div className="w-28 h-24 sm:w-32 sm:h-28 rounded-xl overflow-hidden bg-slate-100 shrink-0 relative">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="space-y-1.5 min-w-0">
                  <span className={`inline-block px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider text-white ${item.catColor || 'bg-blue-600'}`}>
                    {item.category}
                  </span>
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
                    <Link to={`/berita/${item.slug}`}>
                      {item.title}
                    </Link>
                  </h3>
                  <div className="text-[10px] text-slate-400 font-medium">
                    BY {item.author.toUpperCase()} • {item.date}
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* ── 4. HORIZONTAL SPONSOR / BANNER DISPLAY ───────────────────────────── */}
        <div className="rounded-3xl overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 p-6 sm:p-8 text-white shadow-md relative flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center shrink-0 border border-white/20">
              <Sparkles className="w-8 h-8 text-amber-300" />
            </div>
            <div>
              <span className="text-[11px] font-black uppercase tracking-widest text-blue-200 block">
                {highlightPromoTag}
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                {highlightPromoTitle}
              </h2>
              <p className="text-xs text-blue-100/90 mt-1 max-w-xl">
                {highlightPromoDesc}
              </p>
            </div>
          </div>
          {highlightPromoUrl.startsWith('http') ? (
            <a
              href={highlightPromoUrl}
              target="_blank"
              rel="noreferrer"
              className="px-6 py-3 bg-white hover:bg-slate-50 text-slate-950 font-black text-xs rounded-xl shadow-lg transition-all shrink-0 active:scale-95 flex items-center gap-1.5"
            >
              <span>{highlightPromoBtn}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          ) : (
            <Link
              to={highlightPromoUrl}
              className="px-6 py-3 bg-white hover:bg-slate-50 text-slate-950 font-black text-xs rounded-xl shadow-lg transition-all shrink-0 active:scale-95"
            >
              {highlightPromoBtn}
            </Link>
          )}
        </div>

        {/* ── 5. TOP STORIES SECTION (4 EQUAL COLUMNS) ─────────────────────────── */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <span>Top Stories</span>
              <span className="w-2 h-2 rounded-full bg-blue-600" />
            </h2>
            <Link to="/berita" className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1">
              <span>Lihat Semua</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {topStories.map((item, idx) => (
              <article 
                key={idx}
                className="bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-xs hover:shadow-lg transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className={`absolute top-3 left-3 px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider text-white ${item.catColor}`}>
                      {item.category}
                    </span>
                  </div>
                  <div className="p-4 space-y-2">
                    <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
                      <Link to={`/berita/${item.slug}`}>
                        {item.title}
                      </Link>
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {item.excerpt}
                    </p>
                  </div>
                </div>

                <div className="px-4 pb-4 pt-1 text-[11px] text-slate-400 font-medium border-t border-slate-50 flex items-center justify-between">
                  <span>BY {item.author.toUpperCase()}</span>
                  <span>{item.date}</span>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* ── 6. WHAT'S NEW SECTION (COMPLEX MAGAZINE 2-COL + SOCIAL WIDGET) ──── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Col (8 Cols): What's New Lead + Mini List */}
          <div className="lg:col-span-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
              <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                <span>What's New</span>
                <span className="w-2 h-2 rounded-full bg-blue-600" />
              </h2>
              {/* Category Pills Tabs */}
              <div className="flex items-center gap-1.5 text-xs font-bold overflow-x-auto pb-1 sm:pb-0">
                {['ALL', 'Travel', 'Food', 'Health', 'Politics'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTabCat(tab)}
                    className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                      activeTabCat === tab
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {/* Lead Card (7 Cols) */}
              <div className="md:col-span-7 bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-xs hover:shadow-lg transition-all group flex flex-col justify-between">
                <div className="relative aspect-[16/11] overflow-hidden bg-slate-100">
                  <img
                    src={whatsNewLead?.image}
                    alt={whatsNewLead?.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className={`absolute top-3 left-3 px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider text-white ${whatsNewLead?.catColor}`}>
                    {whatsNewLead?.category}
                  </span>
                </div>
                <div className="p-5 space-y-2.5">
                  <h3 className="text-base sm:text-lg font-black text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
                    <Link to={`/berita/${whatsNewLead?.slug}`}>
                      {whatsNewLead?.title}
                    </Link>
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">
                    {whatsNewLead?.excerpt}
                  </p>
                  <div className="pt-2 text-[11px] text-slate-400 font-medium flex items-center gap-3">
                    <span>BY {whatsNewLead?.author?.toUpperCase()}</span>
                    <span>•</span>
                    <span>{whatsNewLead?.date}</span>
                  </div>
                </div>
              </div>

              {/* Stacked 3 Horizontal Cards (5 Cols) */}
              <div className="md:col-span-5 flex flex-col justify-between gap-4">
                {whatsNewList.map((item, idx) => (
                  <div
                    key={idx}
                    className="bg-white rounded-2xl p-3 border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex items-center gap-3 group"
                  >
                    <div className="w-24 h-20 rounded-xl overflow-hidden bg-slate-100 shrink-0 relative">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <span className="absolute bottom-1 right-1 w-5 h-5 rounded-md bg-slate-900/80 text-white font-black text-[9px] flex items-center justify-center">
                        {idx + 1}
                      </span>
                    </div>
                    <div className="space-y-1 min-w-0">
                      <span className="text-[9px] font-black text-blue-600 uppercase tracking-wider block">
                        {item.category}
                      </span>
                      <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
                        <Link to={`/berita/${item.slug}`}>
                          {item.title}
                        </Link>
                      </h4>
                      <div className="text-[10px] text-slate-400">
                        {item.date}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Col (4 Cols): Stay Connected & Newsletter */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Stay Connected Widget */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
              <h3 className="text-base font-black text-slate-900 tracking-tight flex items-center gap-2">
                <span>STAY CONNECTED</span>
                <span className="w-2 h-2 rounded-full bg-blue-600" />
              </h3>

              <div className="space-y-2.5">
                <a href={settings.social_facebook || '#'} target="_blank" rel="noreferrer" className="flex items-center justify-between p-3 rounded-xl bg-[#1877f2] text-white font-bold text-xs hover:opacity-95 transition-opacity">
                  <div className="flex items-center gap-3">
                    <Facebook className="w-4 h-4 fill-white" />
                    <span>Facebook</span>
                  </div>
                  <span className="font-normal opacity-90">{settings.social_facebook_fans || '12.5k Fans'}</span>
                </a>

                <a href={settings.social_twitter || '#'} target="_blank" rel="noreferrer" className="flex items-center justify-between p-3 rounded-xl bg-[#1da1f2] text-white font-bold text-xs hover:opacity-95 transition-opacity">
                  <div className="flex items-center gap-3">
                    <Twitter className="w-4 h-4 fill-white" />
                    <span>Twitter / X</span>
                  </div>
                  <span className="font-normal opacity-90">{settings.social_twitter_fans || '28.4k Followers'}</span>
                </a>

                <a href={settings.social_instagram || '#'} target="_blank" rel="noreferrer" className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-xs hover:opacity-95 transition-opacity">
                  <div className="flex items-center gap-3">
                    <Instagram className="w-4 h-4" />
                    <span>Instagram</span>
                  </div>
                  <span className="font-normal opacity-90">{settings.social_instagram_fans || '45.2k Followers'}</span>
                </a>

                <a href={settings.social_youtube || '#'} target="_blank" rel="noreferrer" className="flex items-center justify-between p-3 rounded-xl bg-[#ff0000] text-white font-bold text-xs hover:opacity-95 transition-opacity">
                  <div className="flex items-center gap-3">
                    <Youtube className="w-4 h-4 fill-white" />
                    <span>YouTube</span>
                  </div>
                  <span className="font-normal opacity-90">{settings.social_youtube_fans || '8.9k Subscribers'}</span>
                </a>
              </div>
            </div>

            {/* Newsletter Subscription Box */}
            <div className="bg-gradient-to-b from-white to-blue-50/60 rounded-3xl p-6 border border-blue-200/80 shadow-xs space-y-4 text-center">
              <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center mx-auto shadow-md">
                <Mail className="w-5 h-5" />
              </div>
              <h4 className="text-base font-black text-slate-900">
                Berlangganan Newsletter
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Dapatkan artikel eksklusif, analisis berita, dan rangkuman mingguan langsung ke email Anda.
              </p>

              {newsletterSent ? (
                <div className="p-3 bg-blue-50 border border-blue-200 text-blue-800 rounded-xl text-xs font-bold">
                  ✓ Terima kasih telah bergabung!
                </div>
              ) : (
                <form onSubmit={handleNewsletterSubmit} className="space-y-2">
                  <input
                    type="email"
                    required
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder="Alamat email Anda..."
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 shadow-xs"
                  />
                  <button
                    type="submit"
                    className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
                  >
                    Subscribe Now
                  </button>
                </form>
              )}
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
