import React, { useState, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { 
  Play, 
  Image as ImageIcon, 
  Video, 
  ExternalLink, 
  ArrowRight, 
  Star, 
  X, 
  ChevronLeft, 
  ChevronRight,
  Eye,
  Calendar,
  Sparkles
} from 'lucide-react';
import { 
  detectVideoPlatform, 
  getEmbedUrl, 
  getVideoThumbnail 
} from '../../utils/videoEmbedHelper';

export default function GaleriVideoSection() {
  const [selectedMedia, setSelectedMedia] = useState(null);
  const scrollRef = useRef(null);

  // Fetch Galeri Media from CMS API
  const { data: mediaData } = useQuery({
    queryKey: ['homeGaleriVideo'],
    queryFn: async () => {
      try {
        const res = await api.get('/cms/galeri?limit=12');
        if (Array.isArray(res?.data)) return res.data;
        if (Array.isArray(res)) return res;
        if (Array.isArray(res?.data?.data)) return res.data.data;
        return [];
      } catch (err) {
        return [];
      }
    }
  });

  // Fetch Testimoni & Rating Aparatur from CMS API
  const { data: testimoniData } = useQuery({
    queryKey: ['homeTestimoniAparatur'],
    queryFn: async () => {
      try {
        const res = await api.get('/cms/testimoni?status=active');
        if (Array.isArray(res?.data)) return res.data;
        if (Array.isArray(res)) return res;
        return [];
      } catch (err) {
        return [];
      }
    }
  });

  const mediaList = Array.isArray(mediaData) ? mediaData : [];
  const items = Array.isArray(mediaList) ? mediaList.filter(Boolean) : [];

  const getItemPlatform = (item) => {
    if (!item?.media_url) return 'YOUTUBE';
    return detectVideoPlatform(item.media_url) || 'YOUTUBE';
  };

  const isVideo = (item) => {
    if (!item) return false;
    return item.tipe === 'VIDEO' || (item.media_url && detectVideoPlatform(item.media_url) !== null);
  };

  const getThumb = (item) => {
    if (!item) return '/hero-tamiang.jpg';
    if (item.thumbnail_url) return item.thumbnail_url;
    if (isVideo(item)) {
      const platform = getItemPlatform(item);
      const ytThumb = platform === 'YOUTUBE' ? getVideoThumbnail(item.media_url, 'YOUTUBE') : null;
      return ytThumb || item.media_url || '/hero-tamiang.jpg';
    }
    return item.media_url || '/hero-tamiang.jpg';
  };

  const handleScroll = (direction) => {
    if (!scrollRef.current) return;
    const { clientWidth } = scrollRef.current;
    const scrollAmount = direction === 'left' ? -clientWidth * 0.75 : clientWidth * 0.75;
    scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  // Testimonials — hanya dari database
  const testimonials = (Array.isArray(testimoniData) && testimoniData.length > 0)
    ? testimoniData.map(t => ({
        id: t.id,
        name: t.nama,
        role: t.jabatan ? `${t.jabatan}${t.instansi ? ' — ' + t.instansi : ''}` : (t.instansi || 'Aparatur Sipil Negara'),
        avatar: t.avatar_url || null,
        rating: t.rating || 5,
        quote: t.pesan
      }))
    : [];

  // Jika di database baik galeri media maupun testimoni keduanya kosong, jangan tampilkan section ini
  if (items.length === 0 && testimonials.length === 0) {
    return null;
  }

  return (
    <section className="w-full py-16 sm:py-24 bg-gradient-to-b from-white via-slate-50/50 to-white border-t border-b border-slate-100/80 overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* ======================================================== */}
        {/* SECTION HEADER (EDITORIAL / LIFESTYLE STYLE)             */}
        {/* ======================================================== */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/60 text-emerald-800 text-xs font-semibold tracking-wide uppercase">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Dokumentasi & Aspirasi</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-[1.15]">
              Transparansi Layanan & Dedikasi Aparatur
            </h2>

            <p className="text-sm sm:text-base text-slate-500 leading-relaxed font-normal">
              Potret kegiatan resmi kedinasan, arsip multimedia, serta testimoni integritas pelayanan kepegawaian Pemerintah Kabupaten Aceh Tamiang.
            </p>
          </div>

          {/* Carousel Navigation Controls & Link */}
          {items.length > 0 && (
            <div className="flex items-center gap-3 shrink-0 pt-2 md:pt-0">
              <Link
                to="/galeri"
                className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 text-xs font-bold transition-all shadow-xs"
              >
                <span>Lihat Semua</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleScroll('left')}
                  aria-label="Geser ke kiri"
                  className="w-11 h-11 rounded-full border border-slate-200/90 bg-white hover:bg-slate-50 active:scale-95 text-slate-700 hover:text-slate-950 flex items-center justify-center transition-all shadow-xs hover:shadow-md cursor-pointer"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleScroll('right')}
                  aria-label="Geser ke kanan"
                  className="w-11 h-11 rounded-full border border-slate-200/90 bg-white hover:bg-slate-50 active:scale-95 text-slate-700 hover:text-slate-950 flex items-center justify-center transition-all shadow-xs hover:shadow-md cursor-pointer"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ======================================================== */}
        {/* CAROUSEL GALLERY POST CARDS                               */}
        {/* ======================================================== */}
        {items.length > 0 && (
          <div className="relative -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
            <div
              ref={scrollRef}
              className="flex gap-5 sm:gap-6 overflow-x-auto pb-6 pt-2 scroll-smooth no-scrollbar snap-x snap-mandatory"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {items.map((item, idx) => {
                const itemIsVideo = isVideo(item);
                const thumb = getThumb(item);
                const albumName = item.album || (itemIsVideo ? 'VIDEO DOKUMENTASI' : 'FOTO KEGIATAN');

                return (
                  <div
                    key={item.id || idx}
                    onClick={() => setSelectedMedia(item)}
                    className="group relative flex-none w-[280px] sm:w-[340px] md:w-[380px] h-[440px] sm:h-[480px] rounded-3xl overflow-hidden cursor-pointer snap-start transition-all duration-300 hover:-translate-y-1.5 shadow-sm hover:shadow-2xl border border-slate-200/70 bg-slate-900"
                  >
                    {/* Media Background Image */}
                    <img
                      src={thumb}
                      alt={item.judul || 'Dokumentasi BKPSDM'}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      loading="lazy"
                      onError={(e) => { e.currentTarget.src = '/hero-tamiang.jpg'; }}
                    />

                    {/* Gradient Overlay for high-contrast typography & editorial feel */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/45 to-slate-900/10 opacity-90 group-hover:opacity-95 transition-opacity" />

                    {/* Card Top: Badges */}
                    <div className="absolute top-5 inset-x-5 flex items-center justify-between gap-2 z-10">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-black tracking-wider uppercase bg-white/95 text-slate-900 backdrop-blur-md shadow-xs">
                        {albumName}
                      </span>

                      {itemIsVideo ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-500/90 text-white backdrop-blur-md shadow-xs">
                          <Play className="w-3 h-3 fill-white" />
                          <span>Video</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-600/90 text-white backdrop-blur-md shadow-xs">
                          <ImageIcon className="w-3 h-3" />
                          <span>Foto</span>
                        </span>
                      )}
                    </div>

                    {/* Center Floating Play Icon for Video */}
                    {itemIsVideo && (
                      <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white/20 backdrop-blur-md border border-white/40 flex items-center justify-center group-hover:scale-110 group-hover:bg-white text-white group-hover:text-emerald-900 shadow-xl transition-all duration-300">
                          <Play className="w-6 h-6 fill-current translate-x-0.5" />
                        </div>
                      </div>
                    )}

                    {/* Card Bottom: Content & Action Button */}
                    <div className="absolute bottom-5 inset-x-5 flex flex-col justify-end space-y-3.5 z-10">
                      <div className="space-y-1.5">
                        <h3 className="text-lg sm:text-xl font-black text-white leading-snug line-clamp-2 drop-shadow-xs group-hover:text-emerald-300 transition-colors">
                          {item.judul}
                        </h3>

                        {item.caption && (
                          <p className="text-xs text-slate-300/90 line-clamp-2 leading-relaxed">
                            {item.caption}
                          </p>
                        )}
                      </div>

                      {/* Action Pill Button */}
                      <div className="pt-1">
                        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/95 hover:bg-white text-slate-900 text-xs font-black shadow-md group-hover:shadow-lg group-hover:bg-emerald-500 group-hover:text-white transition-all duration-200">
                          {itemIsVideo ? (
                            <>
                              <Play className="w-3.5 h-3.5 fill-current" />
                              <span>Putar Video</span>
                            </>
                          ) : (
                            <>
                              <Eye className="w-3.5 h-3.5" />
                              <span>Buka Galeri</span>
                            </>
                          )}
                          <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TESTIMONIALS SECTION                                     */}
        {/* ======================================================== */}
        {testimonials.length > 0 && (
          <div className="pt-6 border-t border-slate-200/70">
            <div className="text-center max-w-xl mx-auto mb-8 space-y-1">
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
                Aspirasi & Kepuasan Aparatur
              </h3>
              <p className="text-xs sm:text-sm text-slate-500">
                Pengalaman nyata pegawai ASN terhadap pelayanan dan transparansi kepegawaian.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              {testimonials.map((testi, idx) => (
                <div 
                  key={testi.id || idx}
                  className="flex flex-col justify-between p-6 sm:p-7 rounded-3xl bg-white hover:bg-slate-50/80 border border-slate-200/80 hover:border-slate-300 transition-all shadow-xs group"
                >
                  <div className="space-y-4">
                    {/* Stars sesuai rating */}
                    <div className="flex items-center gap-1 text-amber-400">
                      {[...Array(Math.min(testi.rating, 5))].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400" />
                      ))}
                    </div>

                    {/* Testimonial Quote */}
                    <p className="text-xs sm:text-[13px] text-slate-600 leading-relaxed italic">
                      &ldquo;{testi.quote}&rdquo;
                    </p>
                  </div>

                  {/* Author Info */}
                  <div className="flex items-center gap-3.5 pt-6 mt-4 border-t border-slate-100">
                    {testi.avatar ? (
                      <img 
                        src={testi.avatar} 
                        alt={testi.name} 
                        className="w-10 h-10 rounded-full object-cover ring-2 ring-emerald-600/20"
                        onError={(e) => { e.currentTarget.style.display = 'none'; }}
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-emerald-100 ring-2 ring-emerald-600/20 flex items-center justify-center text-emerald-800 font-bold text-sm shrink-0">
                        {testi.name?.charAt(0) || 'A'}
                      </div>
                    )}
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-slate-900 truncate">
                        {testi.name}
                      </h4>
                      <p className="text-[11px] text-slate-500 truncate">
                        {testi.role}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Mobile View All Link */}
        {items.length > 0 && (
          <div className="flex sm:hidden justify-center pt-2">
            <Link
              to="/galeri"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-900 hover:bg-emerald-900 text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
            >
              <span>Buka Seluruh Galeri & Arsip Video</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}

      </div>

      {/* ======================================================== */}
      {/* Lightbox / Video Modal Popup                             */}
      {/* ======================================================== */}
      {selectedMedia && (
        <div 
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fadeIn"
          onClick={() => setSelectedMedia(null)}
        >
          <div 
            className="bg-white rounded-3xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between gap-4">
              <div className="min-w-0">
                <span className="text-[10px] font-black uppercase text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                  {selectedMedia.album || 'Dokumentasi BKPSDM'}
                </span>
                <h3 className="text-sm font-black text-slate-900 mt-1 truncate">
                  {selectedMedia.judul}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedMedia(null)}
                aria-label="Tutup Pratinjau Media"
                className="p-2 text-slate-400 hover:text-slate-800 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body: Media Viewer */}
            <div className="flex-1 bg-black overflow-hidden flex items-center justify-center min-h-[360px]">
              {isVideo(selectedMedia) ? (
                <div className={`w-full ${getItemPlatform(selectedMedia) === 'YOUTUBE' ? 'h-[55vh] max-h-[480px]' : 'h-[70vh] max-h-[580px] max-w-sm mx-auto'}`}>
                  <iframe
                    src={getEmbedUrl(selectedMedia.media_url, getItemPlatform(selectedMedia))}
                    title={selectedMedia.judul}
                    className="w-full h-full border-0 bg-black"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              ) : (
                <img
                  src={selectedMedia.media_url}
                  alt={selectedMedia.judul}
                  className="max-h-[70vh] max-w-full object-contain"
                  onError={(e) => { e.currentTarget.src = '/hero-tamiang.jpg'; }}
                />
              )}
            </div>

            {/* Modal Footer Caption */}
            <div className="p-5 bg-white border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <p className="text-slate-600 line-clamp-2 max-w-xl">
                {selectedMedia.caption || 'Dokumentasi kegiatan resmi Badan Kepegawaian & Pengembangan Sumber Daya Manusia Kabupaten Aceh Tamiang.'}
              </p>
              <a
                href={selectedMedia.media_url}
                target="_blank"
                rel="noreferrer"
                className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold shrink-0 flex items-center gap-1.5 transition-colors self-end sm:self-auto"
              >
                <span>Buka Sumber</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
              </a>
            </div>

          </div>
        </div>
      )}
    </section>
  );
}
