import React, { useRef, useState } from 'react';
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
  Share2,
  PlusCircle,
  Send
} from 'lucide-react';
import WaRequestPublicationModal from '../common/WaRequestPublicationModal';

export default function MedsosAsnSection() {
  const scrollRef = useRef(null);
  const [isWaModalOpen, setIsWaModalOpen] = useState(false);

  // Fetch settings for destination phone
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
  const whatsappNumber = settings.kontak_wa || settings.social_whatsapp || settings.contact_phone || '081168814767';

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

  // Determine dynamic container style based on items length
  // If only 1 or 2 items: display as adaptive responsive grid so it doesn't look empty/asymmetric
  const isFew = items.length <= 2;

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-12">
      <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 rounded-3xl p-6 sm:p-8 md:p-10 border border-slate-800 shadow-xl relative overflow-hidden text-white">
        
        {/* Glow Ambient */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 relative z-10">
          <div className="space-y-2.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Sorotan Multimedia</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2.5 flex-wrap">
              <span>Medsos ASN</span>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-pink-500/20 text-pink-300 border border-pink-500/30">
                Official Reels & Highlights
              </span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              <span className="text-emerald-400 font-bold">Setiap ASN punya cerita</span>, dan setiap pengabdian layak untuk didengar. Mari berbagi gagasan, pengalaman, dan kisah inspiratif dari tempat tugas masing-masing, agar kita saling belajar, saling menguatkan, dan tumbuh bersama.
            </p>
          </div>

          {/* Controls / Action Header Button */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => setIsWaModalOpen(true)}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 hover:text-white border border-emerald-500/30 text-xs font-bold backdrop-blur-md transition-all cursor-pointer shadow-sm hover:scale-[1.02] active:scale-95"
              title="Kirim liputan atau reels medsos ASN"
            >
              <Send className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Kirim Cerita ASN</span>
            </button>

            {items.length > 3 && (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleScroll('left')}
                  aria-label="Geser ke kiri"
                  className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 text-white flex items-center justify-center transition-all border border-white/10 cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleScroll('right')}
                  aria-label="Geser ke kanan"
                  className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 text-white flex items-center justify-center transition-all border border-white/10 cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Story/Highlight Style Cards */}
        {isFew ? (
          /* Grid Mode when items are few (1 or 2 items) with complementary Invitation Card so it fills the space harmoniously */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 relative z-10">
            {items.map((item, idx) => (
              <a
                key={item.id || idx}
                href={item.url}
                target="_blank"
                rel="noreferrer"
                className="group relative w-full h-[380px] sm:h-[410px] rounded-3xl overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1.5 shadow-md hover:shadow-2xl border border-white/15 bg-slate-800 flex flex-col justify-between"
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
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-slate-900/20 group-hover:opacity-90 transition-opacity" />

                {/* Top Badge: Platform Pill & Tag */}
                <div className="relative top-4 inset-x-0 px-4 flex items-center justify-between gap-2 z-10">
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
                <div className="relative bottom-4 inset-x-0 px-4 flex flex-col justify-end space-y-2.5 z-10">
                  <h4 className="text-sm sm:text-base font-bold text-white leading-snug line-clamp-3 drop-shadow-sm group-hover:text-emerald-300 transition-colors">
                    {item.judul}
                  </h4>

                  <div className="pt-1 flex items-center justify-between text-[11px] text-slate-300/90 font-medium">
                    <span className="inline-flex items-center gap-1 text-emerald-400 group-hover:translate-x-1 transition-transform font-bold">
                      <span>Buka di {getPlatformName(item.platform)}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </a>
            ))}

            {/* Complementary CTA Card: "Punya Cerita / Video Inspiratif?" */}
            <div 
              onClick={() => setIsWaModalOpen(true)}
              className="group relative w-full h-[380px] sm:h-[410px] rounded-3xl border-2 border-dashed border-emerald-500/40 hover:border-emerald-400/80 bg-gradient-to-b from-white/5 to-emerald-950/20 backdrop-blur-sm p-6 sm:p-7 flex flex-col justify-between cursor-pointer transition-all duration-300 hover:-translate-y-1.5 shadow-sm hover:shadow-xl"
            >
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30 group-hover:scale-110 group-hover:bg-emerald-500 group-hover:text-slate-950 transition-all">
                  <PlusCircle className="w-6 h-6" />
                </div>
                <div className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Kolaborasi Terbuka
                </div>
                <h4 className="text-base sm:text-lg font-black text-white leading-snug group-hover:text-emerald-300 transition-colors">
                  Ingin Video atau Liputan Medsos Anda Tampil di Sini?
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Bagikan tautan Reels, TikTok, atau video kegiatan inspiratif kedinasan dari instansi/unit Anda untuk disorot di portal resmi ASN Aceh Tamiang.
                </p>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-400 group-hover:underline flex items-center gap-1.5">
                  <span>Kirim Tautan Medsos</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
                <span className="text-[10px] text-slate-400">Tim Redaksi</span>
              </div>
            </div>
          </div>
        ) : (
          /* Slider Carousel Mode when items are 3 or more */
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
        )}

        {/* Publication Request Modal */}
        <WaRequestPublicationModal
          isOpen={isWaModalOpen}
          onClose={() => setIsWaModalOpen(false)}
          destinationPhone={whatsappNumber}
        />

      </div>
    </section>
  );
}
