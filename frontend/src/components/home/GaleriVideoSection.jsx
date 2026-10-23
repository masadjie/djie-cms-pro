import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { 
  Play, 
  Image as ImageIcon, 
  Video, 
  ExternalLink, 
  ArrowRight, 
  Sparkles,
  Star,
  Quote,
  X,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { 
  detectVideoPlatform, 
  getEmbedUrl, 
  getVideoThumbnail 
} from '../../utils/videoEmbedHelper';

export default function GaleriVideoSection() {
  const [selectedMedia, setSelectedMedia] = useState(null);

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

  // Hanya gunakan data dari database, tidak ada data palsu / placeholder hardcoded
  const items = Array.isArray(mediaList) ? mediaList.filter(Boolean) : [];

  const getItem = (idx) => {
    if (!items || items.length === 0) return null;
    return items[idx % items.length];
  };

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

  // Testimonials — hanya dari database, tidak ada fallback hardcoded
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

  // Jika di database baik galeri media maupun testimoni keduanya kosong, jangan tampilkan section ini sama sekali
  if (items.length === 0 && testimonials.length === 0) {
    return null;
  }

  return (
    <section className="w-full py-16 sm:py-20 bg-white border-t border-b border-slate-100 overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* ======================================================== */}
        {/* TOP MOSAIC GALLERY: Hanya tampil jika ada media di DB     */}
        {/* ======================================================== */}
        {items.length > 0 && (
          <div className="relative">
            <div className="flex items-center justify-center gap-2 sm:gap-3.5 md:gap-4 overflow-x-auto pb-4 pt-2 no-scrollbar px-2">
            
            {/* Column 1: Two stacked medium/small pills */}
            <div className="flex flex-col gap-3 shrink-0 w-24 sm:w-32 md:w-36 pt-8 sm:pt-10">
              <div 
                onClick={() => setSelectedMedia(getItem(0))}
                className="group relative h-28 sm:h-36 md:h-40 rounded-2xl sm:rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer bg-slate-100"
              >
                <img 
                  src={getThumb(getItem(0))} 
                  alt={getItem(0)?.judul} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
                <div className="absolute inset-0 bg-emerald-950/20 group-hover:bg-transparent transition-colors" />
                {isVideo(getItem(0)) && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-white/90 flex items-center justify-center shadow">
                      <Play className="w-3.5 h-3.5 fill-slate-900 ml-0.5 text-slate-900" />
                    </div>
                  </div>
                )}
              </div>
              <div 
                onClick={() => setSelectedMedia(getItem(1))}
                className="group relative h-32 sm:h-40 md:h-44 rounded-2xl sm:rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer bg-slate-100"
              >
                <img 
                  src={getThumb(getItem(1))} 
                  alt={getItem(1)?.judul} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
                <div className="absolute inset-0 bg-emerald-950/20 group-hover:bg-transparent transition-colors" />
                {isVideo(getItem(1)) && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-white/90 flex items-center justify-center shadow">
                      <Play className="w-3.5 h-3.5 fill-slate-900 ml-0.5 text-slate-900" />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Column 2: Two medium stacked pills */}
            <div className="flex flex-col gap-3 shrink-0 w-24 sm:w-32 md:w-36 pt-4 sm:pt-5">
              <div 
                onClick={() => setSelectedMedia(getItem(2))}
                className="group relative h-36 sm:h-44 md:h-48 rounded-2xl sm:rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer bg-slate-100"
              >
                <img 
                  src={getThumb(getItem(2))} 
                  alt={getItem(2)?.judul} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
                <div className="absolute inset-0 bg-emerald-950/20 group-hover:bg-transparent transition-colors" />
                {isVideo(getItem(2)) && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-white/90 flex items-center justify-center shadow">
                      <Play className="w-3.5 h-3.5 fill-slate-900 ml-0.5 text-slate-900" />
                    </div>
                  </div>
                )}
              </div>
              <div 
                onClick={() => setSelectedMedia(getItem(3))}
                className="group relative h-28 sm:h-36 md:h-40 rounded-2xl sm:rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer bg-slate-100"
              >
                <img 
                  src={getThumb(getItem(3))} 
                  alt={getItem(3)?.judul} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
                <div className="absolute inset-0 bg-emerald-950/20 group-hover:bg-transparent transition-colors" />
                {isVideo(getItem(3)) && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-white/90 flex items-center justify-center shadow">
                      <Play className="w-3.5 h-3.5 fill-slate-900 ml-0.5 text-slate-900" />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Column 3: The Center Pinnacle Tall Pill (Hero Focal Card) */}
            <div className="flex flex-col gap-3 shrink-0 w-28 sm:w-36 md:w-44 pt-0">
              <div 
                onClick={() => setSelectedMedia(getItem(4))}
                className="group relative h-64 sm:h-80 md:h-92 rounded-2xl sm:rounded-3xl overflow-hidden shadow-md hover:shadow-2xl ring-4 ring-emerald-600/10 hover:ring-emerald-600/30 transition-all duration-300 cursor-pointer bg-slate-900"
              >
                <img 
                  src={getThumb(getItem(4))} 
                  alt={getItem(4)?.judul} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/80 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <span className="text-[10px] font-bold text-amber-300 uppercase tracking-wider block mb-0.5">
                    {getItem(4)?.album || 'Dokumentasi Utama'}
                  </span>
                  <p className="text-xs font-black line-clamp-2 leading-tight">
                    {getItem(4)?.judul}
                  </p>
                </div>
                {isVideo(getItem(4)) && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/95 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <Play className="w-5 h-5 fill-slate-900 ml-0.5 text-slate-900" />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Column 4: Medium Pill Stack */}
            <div className="flex flex-col gap-3 shrink-0 w-24 sm:w-32 md:w-36 pt-4 sm:pt-5">
              <div 
                onClick={() => setSelectedMedia(getItem(5))}
                className="group relative h-36 sm:h-44 md:h-48 rounded-2xl sm:rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer bg-slate-100"
              >
                <img 
                  src={getThumb(getItem(5))} 
                  alt={getItem(5)?.judul} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
                <div className="absolute inset-0 bg-emerald-950/20 group-hover:bg-transparent transition-colors" />
                {isVideo(getItem(5)) && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-white/90 flex items-center justify-center shadow">
                      <Play className="w-3.5 h-3.5 fill-slate-900 ml-0.5 text-slate-900" />
                    </div>
                  </div>
                )}
              </div>
              <div 
                onClick={() => setSelectedMedia(getItem(6))}
                className="group relative h-28 sm:h-36 md:h-40 rounded-2xl sm:rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer bg-slate-100"
              >
                <img 
                  src={getThumb(getItem(6))} 
                  alt={getItem(6)?.judul} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
                <div className="absolute inset-0 bg-emerald-950/20 group-hover:bg-transparent transition-colors" />
                {isVideo(getItem(6)) && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-white/90 flex items-center justify-center shadow">
                      <Play className="w-3.5 h-3.5 fill-slate-900 ml-0.5 text-slate-900" />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Column 5: Right outer stack */}
            <div className="flex flex-col gap-3 shrink-0 w-24 sm:w-32 md:w-36 pt-8 sm:pt-10">
              <div 
                onClick={() => setSelectedMedia(getItem(7))}
                className="group relative h-28 sm:h-36 md:h-40 rounded-2xl sm:rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer bg-slate-100"
              >
                <img 
                  src={getThumb(getItem(7))} 
                  alt={getItem(7)?.judul} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
                <div className="absolute inset-0 bg-emerald-950/20 group-hover:bg-transparent transition-colors" />
                {isVideo(getItem(7)) && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-white/90 flex items-center justify-center shadow">
                      <Play className="w-3.5 h-3.5 fill-slate-900 ml-0.5 text-slate-900" />
                    </div>
                  </div>
                )}
              </div>
              <div 
                onClick={() => setSelectedMedia(getItem(0))}
                className="group relative h-32 sm:h-40 md:h-44 rounded-2xl sm:rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer bg-slate-100"
              >
                <img 
                  src={getThumb(getItem(0))} 
                  alt={getItem(0)?.judul} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
                <div className="absolute inset-0 bg-emerald-950/20 group-hover:bg-transparent transition-colors" />
              </div>
            </div>

          </div>
        </div>
        )}

        {/* ======================================================== */}
        {/* CENTER SECTION HEADING & BADGE */}
        {/* ======================================================== */}
        <div className="text-center space-y-3 max-w-2xl mx-auto pt-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-slate-200 bg-slate-50 text-slate-700 text-xs font-semibold">
            <span>Dokumentasi & Aspirasi</span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
            Transparansi Layanan & Dedikasi Aparatur
          </h2>
          <p className="text-sm sm:text-base text-slate-500 leading-relaxed">
            Potret kegiatan resmi kedinasan dan testimoni integritas pelayanan kepegawaian Pemerintah Kabupaten Aceh Tamiang.
          </p>
        </div>

        {/* ======================================================== */}
        {/* BOTTOM: 3-COLUMN USER TESTIMONIALS — hanya tampil jika ada data DB */}
        {/* ======================================================== */}
        {testimonials.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 pt-4">
            {testimonials.map((testi, idx) => (
              <div 
                key={testi.id || idx}
                className="flex flex-col justify-between p-6 sm:p-7 rounded-3xl bg-slate-50/70 hover:bg-slate-50 border border-slate-100 transition-all group"
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
                <div className="flex items-center gap-3.5 pt-6 mt-4 border-t border-slate-200/60">
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
        )}

        {/* Bottom Fast Action Link to Dedicated /galeri Page — hanya jika ada media */}
        {items.length > 0 && (
          <div className="flex justify-center pt-2">
            <Link
              to="/galeri"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-900 hover:bg-emerald-900 text-white text-xs font-bold transition-all shadow-sm hover:shadow-md cursor-pointer"
            >
              <span>Buka Seluruh Galeri & Arsip Video</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}

      </div>

      {/* ======================================================== */}
      {/* Lightbox / Video Modal Popup */}
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
