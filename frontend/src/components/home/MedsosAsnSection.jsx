import React, { useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../../services/api';
import { 
  Instagram, 
  Youtube, 
  Facebook, 
  Twitter, 
  Video, 
  ExternalLink, 
  Sparkles, 
  ChevronLeft, 
  ChevronRight,
  ArrowRight,
  Share2
} from 'lucide-react';

export default function MedsosAsnSection() {
  const scrollRef = useRef(null);

  // Fetch active Medsos ASN items
  const { data: medsosData } = useQuery({
    queryKey: ['homeMedsosAsn'],
    queryFn: async () => {
      try {
        const res = await api.get('/cms/medsos-asn?status=active');
        const items = Array.isArray(res?.data) ? res.data : (Array.isArray(res) ? res : []);
        return items.filter(it => it.is_active !== false && it.is_active !== 0);
      } catch (e) {
        return [];
      }
    }
  });

  const items = Array.isArray(medsosData) ? medsosData : [];

  if (items.length === 0) {
    return null; // Jangan tampilkan bila belum ada data
  }

  const handleScroll = (direction) => {
    if (!scrollRef.current) return;
    const { clientWidth } = scrollRef.current;
    const amount = direction === 'left' ? -clientWidth * 0.75 : clientWidth * 0.75;
    scrollRef.current.scrollBy({ left: amount, behavior: 'smooth' });
  };

  const getPlatformIcon = (platform) => {
    switch (platform) {
      case 'INSTAGRAM':
        return <Instagram className="w-3.5 h-3.5 text-pink-500" />;
      case 'TIKTOK':
        return <Video className="w-3.5 h-3.5 text-cyan-400" />;
      case 'YOUTUBE':
        return <Youtube className="w-3.5 h-3.5 text-rose-500" />;
      case 'FACEBOOK':
        return <Facebook className="w-3.5 h-3.5 text-blue-500" />;
      case 'TWITTER':
        return <Twitter className="w-3.5 h-3.5 text-sky-400" />;
      default:
        return <Share2 className="w-3.5 h-3.5 text-emerald-400" />;
    }
  };

  const getPlatformName = (platform) => {
    switch (platform) {
      case 'INSTAGRAM': return 'Instagram';
      case 'TIKTOK': return 'TikTok';
      case 'YOUTUBE': return 'YouTube';
      case 'FACEBOOK': return 'Facebook';
      case 'TWITTER': return 'X / Twitter';
      default: return 'Medsos';
    }
  };

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-12">
      <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 rounded-3xl p-6 sm:p-8 md:p-10 border border-slate-800 shadow-xl relative overflow-hidden text-white">
        
        {/* Glow Ambient */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Sorotan Multimedia</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2.5">
              <span>Medsos ASN</span>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-pink-500/20 text-pink-300 border border-pink-500/30">
                Official Reels & Highlights
              </span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              Publikasi konten edukasi, info kepegawaian, dan warta ASN terkini langsung dari media sosial resmi BKPSDM.
            </p>
          </div>

          {/* Controls */}
          {items.length > 2 && (
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => handleScroll('left')}
                aria-label="Geser ke kiri"
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 text-white flex items-center justify-center transition-all border border-white/10 cursor-pointer"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() => handleScroll('right')}
                aria-label="Geser ke kanan"
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 text-white flex items-center justify-center transition-all border border-white/10 cursor-pointer"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>

        {/* Scrollable Track of Story/Highlight Style Cards */}
        <div
          ref={scrollRef}
          className="flex gap-4 sm:gap-5 overflow-x-auto pb-2 scroll-smooth no-scrollbar snap-x snap-mandatory relative z-10"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {items.map((item, idx) => (
            <a
              key={item.id || idx}
              href={item.url}
              target="_blank"
              rel="noreferrer"
              className="group relative flex-none w-[220px] sm:w-[260px] md:w-[280px] h-[360px] sm:h-[390px] rounded-3xl overflow-hidden cursor-pointer snap-start transition-all duration-300 hover:-translate-y-1.5 shadow-md hover:shadow-2xl border border-white/15 bg-slate-800"
            >
              {/* Cover Image */}
              <img
                src={item.cover_image || '/hero-tamiang.jpg'}
                alt={item.judul}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                loading="lazy"
                onError={(e) => { e.currentTarget.src = '/hero-tamiang.jpg'; }}
              />

              {/* Gradient Scrim */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-slate-900/10 group-hover:opacity-90 transition-opacity" />

              {/* Top Badge: Platform Pill & Tag */}
              <div className="absolute top-4 inset-x-4 flex items-center justify-between gap-2 z-10">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-black/60 text-white backdrop-blur-md border border-white/15 shadow-xs">
                  {getPlatformIcon(item.platform)}
                  <span>{getPlatformName(item.platform)}</span>
                </span>

                {item.badge_text && (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-white/95 text-slate-900 backdrop-blur-md shadow-xs">
                    {item.badge_text}
                  </span>
                )}
              </div>

              {/* Center Floating Social Button on Hover */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 z-20 pointer-events-none">
                <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md border border-white/40 flex items-center justify-center group-hover:scale-110 group-hover:bg-white text-white group-hover:text-slate-950 shadow-xl transition-all">
                  <ExternalLink className="w-5 h-5" />
                </div>
              </div>

              {/* Bottom Content */}
              <div className="absolute bottom-4 inset-x-4 flex flex-col justify-end space-y-2.5 z-10">
                <h4 className="text-sm sm:text-base font-bold text-white leading-snug line-clamp-3 drop-shadow-sm group-hover:text-emerald-300 transition-colors">
                  {item.judul}
                </h4>

                <div className="pt-1 flex items-center justify-between text-[11px] text-slate-300/90 font-medium">
                  <span className="inline-flex items-center gap-1 text-emerald-400 group-hover:translate-x-1 transition-transform font-bold">
                    <span>Lihat di {getPlatformName(item.platform)}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </a>
          ))}
        </div>

      </div>
    </section>
  );
}
