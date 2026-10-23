import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../../services/api';
import { 
  ShieldCheck, 
  ExternalLink, 
  Megaphone, 
  ChevronRight, 
  ArrowRight,
  Smartphone,
  Compass,
  Award,
  FileText
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import SearchInput from '../common/SearchInput';
import Badge from '../common/Badge';

export default function HeroSection({ searchQuery, setSearchQuery, onSearchSubmit }) {
  const navigate = useNavigate();
  const { activeTheme } = useTheme();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Fetch Live Banners from CMS
  const { data: bannerData } = useQuery({
    queryKey: ['portalLiveBanners'],
    queryFn: async () => {
      try {
        const res = await api.get('/cms/banner');
        return Array.isArray(res?.data) ? res.data : (Array.isArray(res) ? res : []);
      } catch (err) {
        return [];
      }
    }
  });

  const bannerList = Array.isArray(bannerData) ? bannerData : [];
  
  // Hero slider active item (if any)
  const heroBanners = bannerList.filter(b => b.tipe === 'HERO_SLIDER' && (b.is_active === true || b.is_active === 1 || b.is_active === 'true'));
  const alertBanners = bannerList.filter(b => (b.tipe === 'POPUP_ALERT' || b.tipe === 'SIDEBAR_BANNER') && (b.is_active === true || b.is_active === 1 || b.is_active === 'true'));
  
  const [activeHeroIdx, setActiveHeroIdx] = useState(0);

  useEffect(() => {
    if (heroBanners.length <= 1) return;
    const interval = setInterval(() => {
      setActiveHeroIdx(prev => (prev + 1) % heroBanners.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [heroBanners.length]);

  const currentHeroBanner = heroBanners[activeHeroIdx] || null;

  // Subtle interactive parallax reaction to mouse
  const handleMouseMove = (e) => {
    const { clientX, clientY, currentTarget } = e;
    const { width, height, left, top } = currentTarget.getBoundingClientRect();
    const x = ((clientX - left) / width - 0.5) * 20; // -10px to +10px
    const y = ((clientY - top) / height - 0.5) * 20;
    setMousePos({ x, y });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: 0, y: 0 });
  };

  const heroBgImage = currentHeroBanner?.gambar_url || '/hero-tamiang.webp';

  return (
    <section 
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full min-h-[480px] xs:min-h-[520px] sm:min-h-[640px] lg:min-h-[680px] text-white flex items-center justify-center px-4 sm:px-6 lg:px-12 pt-28 sm:pt-36 lg:pt-40 pb-12 sm:pb-20 overflow-hidden border-b border-black/30"
    >
      {/* Living Animated Background Image Container */}
      <div 
        className="absolute inset-[-40px] pointer-events-none transition-transform duration-700 ease-out"
        style={{
          transform: `translate3d(${mousePos.x * -0.5}px, ${mousePos.y * -0.5}px, 0)`
        }}
      >
        <img
          src={heroBgImage}
          alt="BKPSDM Kabupaten Aceh Tamiang"
          width="1920"
          height="1080"
          fetchPriority="high"
          loading="eager"
          decoding="sync"
          className="w-full h-full object-cover animate-kenburns opacity-90 transition-all duration-1000"
        />
      </div>

      {/* Living Light Sweep Beam Effect */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="w-1/2 h-full bg-gradient-to-r from-transparent via-amber-300/10 to-transparent transform -skew-x-12 animate-light-sweep" />
      </div>
      
      {/* Dynamic Theme Gradient Overlay */}
      <div className={`absolute inset-0 bg-gradient-to-t ${activeTheme.heroGradient} opacity-90 backdrop-blur-[0.5px] transition-colors duration-500`} />

      {/* Living Ambient Floating Light Orbs */}
      <div 
        className="absolute top-10 right-1/4 w-[420px] h-[420px] rounded-full bg-amber-400/20 blur-[100px] pointer-events-none animate-orb-1"
        style={{
          transform: `translate3d(${mousePos.x * 0.8}px, ${mousePos.y * 0.8}px, 0)`
        }}
      />
      <div 
        className="absolute bottom-10 left-1/4 w-[450px] h-[450px] rounded-full bg-emerald-500/25 blur-[110px] pointer-events-none animate-orb-2"
        style={{
          transform: `translate3d(${mousePos.x * -0.8}px, ${mousePos.y * -0.8}px, 0)`
        }}
      />

      {/* Main Content Layer */}
      <div 
        className="relative z-10 max-w-5xl w-full mx-auto text-center space-y-4 sm:space-y-6 transition-transform duration-500 ease-out px-2 sm:px-0"
        style={{
          transform: `translate3d(${mousePos.x * 0.3}px, ${mousePos.y * 0.3}px, 0)`
        }}
      >
        {/* Dynamic Alert Banner Announcement (jika ada banner alert/pengumuman aktif) */}
        {alertBanners.length > 0 && (
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-400/95 text-slate-950 text-xs font-bold shadow-lg border border-amber-300 backdrop-blur-sm max-w-xl mx-auto animate-bounce-slow">
            <Megaphone className="w-3.5 h-3.5 shrink-0 text-slate-950 animate-pulse" />
            <span className="truncate">{alertBanners[0].judul}</span>
            {alertBanners[0].target_url && (
              <a 
                href={alertBanners[0].target_url} 
                className="underline hover:text-emerald-950 inline-flex items-center gap-0.5 ml-1 shrink-0 font-black text-[11px]"
              >
                <span>Lihat</span>
                <ChevronRight className="w-3 h-3" />
              </a>
            )}
          </div>
        )}

        {/* Hero Slider Dots (jika ada lebih dari 1 hero banner) */}
        {heroBanners.length > 1 && (
          <div className="flex items-center justify-center gap-1 pb-1">
            {heroBanners.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveHeroIdx(idx)}
                aria-label={`Pilih Slide Banner ${idx + 1}`}
                className="p-2 cursor-pointer flex items-center justify-center"
              >
                <span className={`h-2 rounded-full transition-all block ${
                  activeHeroIdx === idx ? 'w-6 bg-amber-400 shadow-sm' : 'w-2.5 bg-white/40 hover:bg-white/70'
                }`} />
              </button>
            ))}
          </div>
        )}

        {/* Main Hero Headline with Smooth Initial Entrance Animation */}
        <h1 className="animate-hero-title text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight sm:leading-[1.15] drop-shadow-lg break-words">
          {currentHeroBanner ? (
            currentHeroBanner.judul
          ) : (
            <>
              Portal Layanan Kepegawaian{' '}
              <span className="block sm:inline">& Pengembangan SDM ASN</span>{' '}
              <span className="block sm:inline text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 animate-hero-glow">
                Kab. Aceh Tamiang
              </span>
            </>
          )}
        </h1>

        {/* Subtitle with Staggered Entrance Animation */}
        <p className="animate-hero-subtitle text-emerald-100/95 text-xs xs:text-sm sm:text-base max-w-2xl mx-auto leading-relaxed drop-shadow-sm font-medium px-2">
          {currentHeroBanner?.subjudul || (
            <>
              Pusat layanan karir ASN, seleksi CASN/PPPK, kenaikan pangkat SIASN, izin belajar, e-Kinerja, dan aplikasi manajemen kepegawaian <strong>SiKEPO</strong> Kabupaten Aceh Tamiang.
            </>
          )}
        </p>

        {/* Search Bar Partial with Staggered Entrance Animation */}
        <div className="animate-hero-search max-w-2xl w-full mx-auto pt-1 sm:pt-2">
          <SearchInput
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onSubmit={onSearchSubmit}
            placeholder="Ketik layanan (contoh: Kenaikan Pangkat, SiKEPO, Cuti)..."
            buttonText="Cari"
            variant="dark"
          />
        </div>
      </div>
    </section>
  );
}

