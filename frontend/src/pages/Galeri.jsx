import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useTheme } from '../context/ThemeContext';
import SEOHead from '../components/common/SEOHead';
import FloatingActionBars from '../components/common/FloatingActionBars';
import { 
  Play, 
  Image as ImageIcon, 
  Video, 
  Search, 
  Filter, 
  ExternalLink, 
  ChevronLeft, 
  ChevronRight,
  Layers,
  Sparkles,
  ArrowRight,
  X
} from 'lucide-react';
import { 
  detectVideoPlatform, 
  extractYouTubeId, 
  getEmbedUrl, 
  getVideoThumbnail 
} from '../utils/videoEmbedHelper';

export default function Galeri() {
  const { currentTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('ALL'); // 'ALL' | 'FOTO' | 'VIDEO'
  const [search, setSearch] = useState('');
  const [selectedAlbum, setSelectedAlbum] = useState('ALL');
  const [page, setPage] = useState(1);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const limit = 12;

  // 1. Fetch CMS Web Settings for Dynamic Global Branding & Instansi Name
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
  const isTemplateA = currentTheme === 'editorial' || settings.home_layout_mode === 'EDITORIAL';

  // Dynamic branding variables
  const siteName = settings.site_name || 'Portal Resmi Pemerintahan';
  const instansiName = settings.instansi_name || 'Pemerintah Daerah';

  // Fetch Galeri Data with query params
  const { data: galeriRes, isLoading } = useQuery({
    queryKey: ['publicGaleriPage', page, limit, search, activeTab, selectedAlbum],
    queryFn: async () => {
      try {
        const params = new URLSearchParams({
          page: String(page),
          limit: String(limit)
        });
        if (search) params.append('search', search);
        if (activeTab !== 'ALL') params.append('tipe', activeTab);
        if (selectedAlbum !== 'ALL') params.append('album', selectedAlbum);

        const res = await api.get(`/cms/galeri?${params.toString()}`);
        return res?.data || res || { data: [], pagination: { total: 0 } };
      } catch (e) {
        return { data: [], pagination: { total: 0 } };
      }
    }
  });

  const rawList = Array.isArray(galeriRes) 
    ? galeriRes 
    : (Array.isArray(galeriRes?.data) ? galeriRes.data : []);

  const totalPages = galeriRes?.pagination?.totalPages || Math.ceil((galeriRes?.pagination?.total || rawList.length) / limit) || 1;
  const totalItems = galeriRes?.pagination?.total || rawList.length;

  // Fallback demo data if database is empty - fully global & dynamic
  const defaultList = [
    {
      id: 'demo-1',
      judul: `Dokumentasi Rapat Koordinasi Layanan ${instansiName}`,
      tipe: 'FOTO',
      album: 'Kegiatan Publikasi',
      media_url: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80',
      caption: 'Pertemuan koordinasi peningkatan mutu standar pelayanan publik.'
    },
    {
      id: 'demo-2',
      judul: 'Sosialisasi Digitalisasi Dokumen & Layanan Publik',
      tipe: 'FOTO',
      album: 'Kegiatan Publikasi',
      media_url: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=800&q=80',
      caption: 'Penyuluhan pemanfaatan platform digital terintegrasi.'
    },
    {
      id: 'demo-3',
      judul: 'Bimbingan Teknis Transformasi Layanan Digital Terpadu',
      tipe: 'FOTO',
      album: 'Pengembangan Kapasitas',
      media_url: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80',
      caption: 'Bimbingan teknis optimalisasi layanan administrasi mandiri masyarakat.'
    },
    {
      id: 'demo-4',
      judul: `Tutorial Penggunaan Portal Layanan Mandiri ${siteName}`,
      tipe: 'VIDEO',
      album: 'Edukasi Publik',
      media_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      caption: 'Panduan teknis pengajuan permohonan dan pelacakan berkas secara daring.'
    }
  ];

  const items = rawList.length > 0 ? rawList : defaultList;

  const getItemPlatform = (item) => {
    return detectVideoPlatform(item.media_url) || 'YOUTUBE';
  };

  const isVideo = (item) => {
    return item.tipe === 'VIDEO' || detectVideoPlatform(item.media_url) !== null;
  };

  // Distinct albums
  const albums = ['ALL', ...Array.from(new Set(items.map(i => i.album).filter(Boolean)))];

  return (
    <div className="w-full min-h-screen bg-[#f8faf8] text-slate-800 pt-28 pb-16">
      <SEOHead
        title={`Galeri & Dokumentasi Kegiatan | ${siteName}`}
        description={`Arsip visual dan dokumentasi resmi kegiatan, publikasi program, dan video edukasi ${instansiName}.`}
        canonicalUrl="/galeri"
      />

      <FloatingActionBars />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Page Hero Banner: Dynamic color matching Template A (Royal Blue) or Classic (Emerald) */}
        <div className={`rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden ${
          isTemplateA 
            ? 'bg-gradient-to-br from-blue-950 via-blue-900 to-slate-900' 
            : 'bg-gradient-to-br from-emerald-950 via-emerald-900 to-slate-900'
        }`}>
          <div className={`absolute -right-16 -top-16 w-72 h-72 rounded-full blur-3xl pointer-events-none ${
            isTemplateA ? 'bg-blue-500/15' : 'bg-emerald-500/10'
          }`} />
          <div className="relative z-10 max-w-2xl space-y-3">
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
              isTemplateA
                ? 'bg-blue-800/80 border border-blue-700/80 text-blue-200'
                : 'bg-emerald-800/80 border border-emerald-700/80 text-amber-300'
            }`}>
              <Sparkles className="w-3.5 h-3.5" />
              <span>Multimedia & Dokumentasi Resmi</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight">
              {settings.editorial_gallery_heading || 'Galeri Foto & Video Dokumentasi'}
            </h1>
            <p className={`text-sm sm:text-base leading-relaxed ${
              isTemplateA ? 'text-blue-100/90' : 'text-emerald-100/90'
            }`}>
              {settings.editorial_gallery_subheading || `Arsip visual kegiatan resmi, peluncuran program prioritas, serta tayangan video edukasi dan liputan publik ${instansiName}.`}
            </p>
          </div>
        </div>

        {/* Toolbar & Filter */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <input
              type="text"
              placeholder="Cari dokumentasi atau kegiatan..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className={`w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 ${
                isTemplateA ? 'focus:ring-blue-600' : 'focus:ring-emerald-700'
              }`}
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          </div>

          {/* Type Filters & Album Selection */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            
            {/* Type tabs */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold">
              <button
                type="button"
                onClick={() => { setActiveTab('ALL'); setPage(1); }}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  activeTab === 'ALL' 
                    ? (isTemplateA ? 'bg-white text-blue-600 shadow-xs' : 'bg-white text-emerald-900 shadow-xs')
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Semua
              </button>
              <button
                type="button"
                onClick={() => { setActiveTab('FOTO'); setPage(1); }}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 ${
                  activeTab === 'FOTO' 
                    ? (isTemplateA ? 'bg-white text-blue-600 shadow-xs' : 'bg-white text-emerald-900 shadow-xs')
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <ImageIcon className="w-3.5 h-3.5" />
                <span>Foto</span>
              </button>
              <button
                type="button"
                onClick={() => { setActiveTab('VIDEO'); setPage(1); }}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 ${
                  activeTab === 'VIDEO' ? 'bg-white text-rose-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Video className="w-3.5 h-3.5" />
                <span>Video</span>
              </button>
            </div>

            {/* Album selector */}
            {albums.length > 2 && (
              <select
                value={selectedAlbum}
                onChange={(e) => { setSelectedAlbum(e.target.value); setPage(1); }}
                className={`px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 ${
                  isTemplateA ? 'focus:ring-blue-600' : 'focus:ring-emerald-700'
                }`}
              >
                <option value="ALL">Semua Album</option>
                {albums.filter(a => a !== 'ALL').map(alb => (
                  <option key={alb} value={alb}>{alb}</option>
                ))}
              </select>
            )}

          </div>
        </div>

        {/* Media Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {items.map((item) => {
            const itemIsVideo = isVideo(item);
            const platform = itemIsVideo ? getItemPlatform(item) : null;
            const ytThumb = platform === 'YOUTUBE' ? getVideoThumbnail(item.media_url, 'YOUTUBE') : null;

            return (
              <div
                key={item.id}
                onClick={() => setSelectedMedia(item)}
                className={`group bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-2xs hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between ${
                  isTemplateA ? 'hover:border-blue-400' : 'hover:border-emerald-400'
                }`}
              >
                {/* Thumbnail Container */}
                <div className="relative aspect-4/3 w-full bg-slate-900 overflow-hidden">
                  {itemIsVideo ? (
                    ytThumb ? (
                      <img
                        src={ytThumb}
                        alt={item.judul}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-center">
                        <Video className="w-9 h-9 text-rose-400 mb-2 opacity-80" />
                        <span className="text-xs font-extrabold text-white line-clamp-2 px-2">{item.judul}</span>
                      </div>
                    )
                  ) : (
                    <img
                      src={item.media_url}
                      alt={item.judul}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => { 
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80'; 
                      }}
                    />
                  )}

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

                  {/* Badge Platform */}
                  <div className="absolute top-3 left-3">
                    {itemIsVideo ? (
                      <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-lg text-white shadow-md flex items-center gap-1 ${
                        platform === 'INSTAGRAM' ? 'bg-gradient-to-r from-yellow-500 via-pink-500 to-purple-600' :
                        platform === 'TIKTOK' ? 'bg-black border border-slate-700' : 'bg-red-600'
                      }`}>
                        <Play className="w-3 h-3 fill-white" />
                        <span>{platform}</span>
                      </span>
                    ) : (
                      <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-lg shadow-md flex items-center gap-1 ${
                        isTemplateA 
                          ? 'text-blue-950 bg-blue-200' 
                          : 'text-emerald-950 bg-emerald-300'
                      }`}>
                        <ImageIcon className="w-3 h-3" />
                        <span>Foto</span>
                      </span>
                    )}
                  </div>

                  {/* Play Button Icon */}
                  {itemIsVideo && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center shadow-xl group-hover:scale-115 group-hover:bg-amber-400 transition-all">
                        <Play className="w-5 h-5 text-slate-900 fill-slate-900 ml-0.5" />
                      </div>
                    </div>
                  )}

                  {/* Album Name */}
                  <div className="absolute bottom-2.5 left-3 right-3 text-white">
                    <span className={`text-[11px] font-semibold block truncate ${
                      isTemplateA ? 'text-blue-200' : 'text-emerald-200'
                    }`}>
                      {item.album || 'Dokumentasi Resmi'}
                    </span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-4 flex-1 flex flex-col justify-between gap-3">
                  <h3 className={`font-extrabold text-sm text-slate-900 transition-colors line-clamp-2 leading-snug ${
                    isTemplateA ? 'group-hover:text-blue-600' : 'group-hover:text-emerald-800'
                  }`}>
                    {item.judul}
                  </h3>

                  {item.caption && (
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {item.caption}
                    </p>
                  )}

                  <div className={`pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-bold transition-colors ${
                    isTemplateA 
                      ? 'text-blue-600 group-hover:text-blue-700' 
                      : 'text-emerald-800 group-hover:text-amber-600'
                  }`}>
                    <span>{itemIsVideo ? 'Tonton Video' : 'Lihat Foto'}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 pt-6">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage(p => Math.max(1, p - 1))}
              className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 disabled:opacity-40 hover:bg-slate-50 transition-colors"
            >
              Sebelumnya
            </button>
            <span className="text-xs font-bold text-slate-500 px-3">
              Halaman {page} dari {totalPages}
            </span>
            <button
              type="button"
              disabled={page >= totalPages}
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 disabled:opacity-40 hover:bg-slate-50 transition-colors"
            >
              Berikutnya
            </button>
          </div>
        )}

      </div>

      {/* Lightbox Modal */}
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
                <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                  isTemplateA ? 'text-blue-700 bg-blue-50' : 'text-emerald-800 bg-emerald-50'
                }`}>
                  {selectedMedia.album || 'Dokumentasi Resmi'}
                </span>
                <h3 className="text-sm font-black text-slate-900 mt-1 truncate">
                  {selectedMedia.judul}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedMedia(null)}
                className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
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
                  onError={(e) => { 
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80'; 
                  }}
                />
              )}
            </div>

            {/* Modal Footer Caption */}
            <div className="p-5 bg-white border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <p className="text-slate-600 line-clamp-2 max-w-xl">
                {selectedMedia.caption || `Dokumentasi kegiatan resmi publikasi dan keterbukaan informasi ${instansiName}.`}
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
    </div>
  );
}
