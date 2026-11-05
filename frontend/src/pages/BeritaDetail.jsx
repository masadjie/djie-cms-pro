import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import SEOHead from '../components/common/SEOHead';
import FloatingActionBars from '../components/common/FloatingActionBars';
import Badge from '../components/common/Badge';
import SocialShareButtons from '../components/common/SocialShareButtons';
import TrendingNewsWidget from '../components/berita/TrendingNewsWidget';
import BeritaKomentarSection from '../components/berita/BeritaKomentarSection';
import { BeritaDetailSkeleton } from '../components/berita/BeritaSkeleton';
import { 
  Calendar, 
  Clock, 
  Eye, 
  Building2, 
  ChevronRight, 
  ArrowLeft,
  Sparkles,
  Paperclip,
  Download,
  FileText,
  FileSpreadsheet,
  FileCheck,
  X,
  Maximize2,
  ZoomIn
} from 'lucide-react';

export default function BeritaDetail() {
  const { slug } = useParams();
  const [previewImage, setPreviewImage] = useState(null); // { src, alt, caption }
  const [previewDoc, setPreviewDoc] = useState(null); // { url, name, extension, size, category }

  // Scroll to top on slug change or initial load
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    if (document.documentElement) document.documentElement.scrollTop = 0;
    if (document.body) document.body.scrollTop = 0;
  }, [slug]);

  // Fetch News Detail & SEO Schema
  const { data: response, isLoading, isError } = useQuery({
    queryKey: ['beritaDetail', slug],
    queryFn: async () => await api.get(`/berita/${slug}`)
  });

  // Fetch Trending News for sidebar
  const { data: trendingNews } = useQuery({
    queryKey: ['trendingBerita'],
    queryFn: async () => (await api.get('/berita/trending?limit=4')).data
  });

  // Fetch Web Settings for dynamic sidebar & agency identity
  const { data: settingsData } = useQuery({
    queryKey: ['cmsWebSettingsBeritaDetail'],
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

  const article = response?.data;
  const seoData = response?.seo;
  const currentUrl = typeof window !== 'undefined' ? window.location.href : `https://bkpsdm.acehtamiangkab.go.id/berita/${slug}`;

  if (isLoading) {
    return <BeritaDetailSkeleton />;
  }

  if (isError || !article) {
    return (
      <div className="min-h-screen bg-[#f8faf8] flex items-center justify-center pt-24 px-4">
        <div className="bg-white p-8 rounded-3xl border border-red-100 max-w-md text-center space-y-4 shadow-sm">
          <h2 className="text-xl font-bold text-slate-800">Berita Tidak Ditemukan</h2>
          <p className="text-xs text-slate-500">Artikel yang Anda cari mungkin telah dipindahkan atau sudah tidak tersedia.</p>
          <Link
            to="/berita"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Berita</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#f8faf8] pb-24 pt-28 sm:pt-32">
      {/* High Performance Dynamic SEO Head */}
      <SEOHead
        title={seoData?.title || article.title}
        description={seoData?.description || article.excerpt}
        keywords={seoData?.keywords}
        canonicalUrl={seoData?.canonicalUrl || currentUrl}
        ogImage={seoData?.ogImage || article.cover_image}
        ogType="article"
        publishedTime={article.published_at}
        author={article.author_name}
        schemaJsonLd={seoData?.schemaJsonLd}
      />

      <FloatingActionBars />

      {/* Scheduled Alert Notice for Admins */}
      {article?.status === 'PUBLISHED' && article?.published_at && new Date(article.published_at) > new Date() && (
        <div className="w-full max-w-[1600px] mx-auto px-3 xs:px-4 sm:px-6 lg:px-12 mb-4">
          <div className="bg-sky-50 border border-sky-200 text-sky-900 px-4 py-3 rounded-2xl flex items-center justify-between gap-3 text-xs sm:text-sm">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-500 animate-pulse shrink-0" />
              <span>
                <strong>Mode Pratinjau Administrator:</strong> Artikel ini dijadwalkan terbit pada{' '}
                <span className="font-bold underline">
                  {new Date(article.published_at).toLocaleString('id-ID', { dateStyle: 'long', timeStyle: 'short' })}
                </span>{' '}
                dan saat ini belum dapat dilihat oleh publik / pengunjung umum.
              </span>
            </div>
            <Link
              to={`/admin/berita/edit/${article.id}`}
              className="px-3 py-1.5 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl text-xs shrink-0 shadow-xs transition-colors"
            >
              Edit Berita Ini
            </Link>
          </div>
        </div>
      )}

      <div className="w-full max-w-[1600px] mx-auto px-3 xs:px-4 sm:px-6 lg:px-12 space-y-6 sm:space-y-8">
        
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 sm:gap-2 text-xs text-slate-400 font-medium overflow-x-auto no-scrollbar py-1">
          <Link to="/" className="hover:text-emerald-700 shrink-0">Beranda</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-300 shrink-0" />
          <Link to="/berita" className="hover:text-emerald-700 shrink-0">Berita</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-300 shrink-0" />
          <span className="text-emerald-800 font-bold truncate max-w-[180px] xs:max-w-xs sm:max-w-md">
            {article.kategori?.nama_kategori || 'Kabar ASN'}
          </span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-start">
          
          {/* Main Article (8 Cols) */}
          <article className="lg:col-span-8 bg-white rounded-3xl p-4 xs:p-6 sm:p-10 border border-emerald-100 shadow-sm space-y-5 sm:space-y-6 overflow-hidden">
            
            {/* Category & Meta badges */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs">
              <Badge variant="emerald" size="sm">
                {article.kategori?.nama_kategori || 'Pengumuman'}
              </Badge>
              <span className="flex items-center gap-1 text-slate-400 text-xs">
                <Clock className="w-3.5 h-3.5" />
                {article.read_time_minutes || 3} menit baca
              </span>
              <span className="flex items-center gap-1 text-slate-400 text-xs">
                <Eye className="w-3.5 h-3.5" />
                {Number(article.views_count || 0).toLocaleString('id-ID')} pembaca
              </span>
            </div>

            {/* Article Title */}
            <h1 className="text-xl xs:text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 leading-tight tracking-tight break-words">
              {article.title}
            </h1>

            {/* Author and Date Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 py-3.5 sm:py-4 border-y border-slate-100 text-xs text-slate-500">
              <div className="flex items-center gap-2.5 sm:gap-3">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-emerald-800 text-amber-300 flex items-center justify-center font-black shrink-0">
                  <Building2 className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-slate-900 truncate">{article.author_name || 'Humas BKPSDM'}</p>
                  <p className="text-[10px] sm:text-[11px] text-slate-400 truncate">Pemerintah Kabupaten Aceh Tamiang</p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-700" />
                <span className="text-[11px] sm:text-xs">
                  {new Date(article.published_at || article.created_at).toLocaleDateString('id-ID', {
                    weekday: 'short',
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                  })}
                </span>
              </div>
            </div>

            {/* Featured Cover Image with Click to Zoom/Preview */}
            {article.cover_image && (
              <figure className="space-y-2">
                <div 
                  onClick={() => setPreviewImage({
                    src: article.cover_image,
                    alt: article.title,
                    caption: article.cover_caption || article.title
                  })}
                  className="group relative rounded-2xl overflow-hidden bg-slate-900 max-h-[460px] cursor-zoom-in"
                  title="Klik untuk memperbesar gambar"
                >
                  <img
                    src={article.cover_image}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                  />
                  {/* Subtle hover overlay badge */}
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                    <div className="px-3.5 py-1.5 rounded-full bg-black/60 backdrop-blur-md text-white text-xs font-semibold flex items-center gap-1.5 shadow-lg">
                      <ZoomIn className="w-3.5 h-3.5 text-amber-300" />
                      <span>Klik untuk Pratinjau Penuh</span>
                    </div>
                  </div>
                </div>
                {article.cover_caption && (
                  <figcaption className="text-[11px] text-slate-400 italic text-center">
                    Foto: {article.cover_caption}
                  </figcaption>
                )}
              </figure>
            )}

            {/* Article Body Content (Supports click to preview any embedded img) */}
            <div 
              onClick={(e) => {
                const target = e.target;
                if (target && target.tagName === 'IMG') {
                  e.preventDefault();
                  setPreviewImage({
                    src: target.currentSrc || target.src,
                    alt: target.alt || article.title,
                    caption: target.alt || target.title || 'Ilustrasi Dokumentasi Berita'
                  });
                }
              }}
              className="prose prose-emerald max-w-none text-slate-700 leading-relaxed space-y-4 text-xs xs:text-sm sm:text-base break-words overflow-hidden [word-break:break-word] [&_img]:cursor-zoom-in [&_img]:rounded-2xl [&_img]:shadow-md hover:[&_img]:opacity-95 transition-opacity"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />

            {/* Lampiran & Dokumen Resmi Terkait (MinIO S3 Attachments) */}
            {article.lampiran && article.lampiran.length > 0 && (
              <div className="bg-emerald-50/70 rounded-3xl p-4 sm:p-6 border border-emerald-200/80 space-y-3.5 sm:space-y-4 my-6 sm:my-8 overflow-hidden">
                <div className="flex items-start sm:items-center gap-2.5">
                  <div className="p-2 bg-emerald-800 text-amber-300 rounded-xl shadow-2xs shrink-0 mt-0.5 sm:mt-0">
                    <Paperclip className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-black text-slate-900 uppercase tracking-wide leading-snug">
                      Dokumen Lampiran & Berkas Unduhan Resmi
                    </h3>
                    <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5">
                      Silakan unduh dokumen surat edaran, petunjuk teknis, atau format lampiran di bawah ini.
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  {article.lampiran.map((att) => (
                    <div 
                      key={att.id}
                      className="bg-white p-3.5 sm:p-4 rounded-2xl border border-emerald-100 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-emerald-300 transition-all overflow-hidden"
                    >
                      <div className="flex items-start sm:items-center gap-3 min-w-0 flex-1">
                        <div className="p-2.5 bg-slate-50 text-emerald-800 rounded-xl shrink-0 mt-0.5 sm:mt-0">
                          {att.file_extension === 'pdf' ? (
                            <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" />
                          ) : att.file_extension === 'xlsx' || att.file_extension === 'xls' ? (
                            <FileSpreadsheet className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600" />
                          ) : (
                            <FileCheck className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1 space-y-1">
                          <p className="font-bold text-slate-900 text-xs sm:text-sm leading-snug break-words" title={att.nama_lampiran}>
                            {att.nama_lampiran}
                          </p>
                          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[10px] sm:text-[11px] text-slate-400 font-mono">
                            <span className="bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded font-sans font-bold border border-emerald-200">
                              {att.kategori_dokumen}
                            </span>
                            <span>&bull;</span>
                            <span>{att.file_size_bytes ? (att.file_size_bytes / 1024).toFixed(0) + ' KB' : 'PDF'}</span>
                            <span>&bull;</span>
                            <span>{att.downloads_count || 0}x diunduh</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
                        {/* Tombol Lihat / Pratinjau Dokumen */}
                        <button
                          type="button"
                          onClick={() => setPreviewDoc({
                            url: att.file_url,
                            name: att.nama_lampiran,
                            extension: att.file_extension || (att.file_url && att.file_url.split('.').pop().toLowerCase()),
                            size: att.file_size_bytes ? (att.file_size_bytes / 1024).toFixed(0) + ' KB' : 'Dokumen',
                            category: att.kategori_dokumen
                          })}
                          className="flex-1 sm:flex-initial px-3.5 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300/80 active:scale-95 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer group/view"
                          title="Lihat Pratinjau Dokumen"
                        >
                          <Eye className="w-3.5 h-3.5 text-emerald-700 group-hover/view:scale-110 transition-transform" />
                          <span>Lihat</span>
                        </button>

                        {/* Tombol Unduh Dokumen */}
                        <a
                          href={att.file_url}
                          target="_blank"
                          rel="noreferrer"
                          download
                          className="flex-1 sm:flex-initial px-4 py-2.5 bg-emerald-800 hover:bg-emerald-700 active:scale-95 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                        >
                          <Download className="w-3.5 h-3.5 text-amber-300" />
                          <span>Unduh Dokumen</span>
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Interactive Social Share Bar with Real-Time Analytics */}
            <div className="pt-8 border-t border-slate-100">
              <SocialShareButtons 
                title={article.title} 
                url={currentUrl} 
                slug={article.slug} 
              />
            </div>

            {/* Public News Comments & Feedback Section with Admin Moderation */}
            <BeritaKomentarSection slug={slug} articleTitle={article.title} />

          </article>

          {/* Sidebar (4 Cols) */}
          <aside className="lg:col-span-4 space-y-6">
            <TrendingNewsWidget trendingNews={trendingNews} />

            {/* Dynamic Agency & Service Quick Access Card */}
            <div className="bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-900 text-white rounded-3xl p-6 space-y-4 border border-blue-600/50 shadow-md">
              <span className="text-[10px] font-black uppercase text-blue-200 tracking-wider">
                {settings.site_name || 'Layanan & Informasi'}
              </span>
              <h4 className="font-bold text-sm">
                {settings.site_tagline || 'Pusat Informasi & Pelayanan Terpadu'}
              </h4>
              <p className="text-xs text-blue-100/90 leading-relaxed">
                {settings.site_description || 'Akses dokumen resmi, arsip pengumuman, formulir pelayanan, dan panduan publik terverifikasi.'}
              </p>
              <div className="pt-2 flex flex-col gap-2">
                <Link
                  to="/katalog"
                  className="block w-full py-2.5 text-center bg-white text-blue-900 hover:bg-blue-50 font-black rounded-xl text-xs transition-colors shadow-sm"
                >
                  Katalog Layanan & Arsip →
                </Link>
                <Link
                  to="/berita"
                  className="block w-full py-2.5 text-center bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl text-xs border border-white/20 transition-colors"
                >
                  Indeks Seluruh Berita
                </Link>
              </div>
            </div>

          </aside>

        </div>

      </div>

      {/* ======================================================== */}
      {/* Lightbox Image Preview Modal (High-Res Zoom & Dark Backdrop) */}
      {/* ======================================================== */}
      {previewImage && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn"
          onClick={() => setPreviewImage(null)}
          onKeyDown={(e) => { if (e.key === 'Escape') setPreviewImage(null); }}
          tabIndex={-1}
        >
          {/* Modal Container */}
          <div 
            className="relative max-w-5xl w-full max-h-[94vh] flex flex-col items-center justify-center animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Close & Download / Open Original Toolbar */}
            <div className="w-full flex items-center justify-between pb-3 text-white">
              <span className="text-xs font-semibold text-slate-300 truncate max-w-md">
                {previewImage.caption || previewImage.alt || 'Pratinjau Gambar'}
              </span>

              <div className="flex items-center gap-2">
                <a
                  href={previewImage.src}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-medium backdrop-blur-md transition-colors flex items-center gap-1.5 cursor-pointer"
                  title="Buka gambar di tab baru"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Ukuran Penuh</span>
                </a>

                <button
                  type="button"
                  onClick={() => setPreviewImage(null)}
                  aria-label="Tutup Pratinjau Gambar"
                  className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Main Image Viewer */}
            <div className="relative rounded-2xl overflow-hidden bg-black/50 border border-white/10 shadow-2xl flex items-center justify-center max-h-[82vh]">
              <img
                src={previewImage.src}
                alt={previewImage.alt || 'Pratinjau Gambar'}
                className="max-h-[82vh] max-w-full w-auto h-auto object-contain select-none"
              />
            </div>

            {/* Bottom Caption Pill */}
            {previewImage.caption && (
              <p className="text-center text-xs text-slate-400 mt-3 px-4 line-clamp-2">
                {previewImage.caption}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Modal Pratinjau Dokumen PDF / Berkas Lampiran */}
      {previewDoc && (
        <div 
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200"
          onClick={() => setPreviewDoc(null)}
        >
          <div 
            className="bg-white rounded-3xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-5 sm:px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-3 min-w-0 pr-2">
                <div className="p-2 rounded-xl bg-emerald-700 text-amber-300 shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h4 className="font-extrabold text-sm sm:text-base text-white truncate max-w-md sm:max-w-xl" title={previewDoc.name}>
                    {previewDoc.name}
                  </h4>
                  <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono mt-0.5">
                    <span className="uppercase text-emerald-400 font-bold">{previewDoc.extension || 'PDF'}</span>
                    <span>&bull;</span>
                    <span>{previewDoc.size}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <a
                  href={previewDoc.url}
                  target="_blank"
                  rel="noreferrer"
                  download
                  className="px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 active:scale-95 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
                  title="Unduh file dokumen"
                >
                  <Download className="w-3.5 h-3.5 text-amber-300" />
                  <span className="hidden sm:inline">Unduh</span>
                </a>

                <a
                  href={previewDoc.url}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                  title="Buka di Tab Baru"
                >
                  <Maximize2 className="w-4 h-4" />
                </a>

                <button
                  type="button"
                  onClick={() => setPreviewDoc(null)}
                  aria-label="Tutup Pratinjau Dokumen"
                  className="p-2 rounded-xl bg-slate-800 hover:bg-rose-900/60 text-slate-400 hover:text-rose-200 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Modal Body: Viewer iframe for PDF or Fallback Card for Excel/Doc */}
            <div className="flex-1 bg-slate-100 p-2 sm:p-4 min-h-[60vh] max-h-[75vh] overflow-auto flex items-center justify-center">
              {['pdf'].includes(String(previewDoc.extension || '').toLowerCase()) || String(previewDoc.url || '').toLowerCase().includes('.pdf') ? (
                <iframe
                  src={`${previewDoc.url}#toolbar=1`}
                  title={previewDoc.name}
                  className="w-full h-full min-h-[60vh] rounded-2xl border border-slate-300 bg-white shadow-inner"
                />
              ) : (
                <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 max-w-md w-full text-center space-y-4 shadow-sm my-auto">
                  <div className="w-16 h-16 bg-emerald-50 text-emerald-800 rounded-2xl flex items-center justify-center mx-auto shadow-2xs">
                    <FileText className="w-8 h-8 text-emerald-700" />
                  </div>
                  <div>
                    <h4 className="text-base font-black text-slate-900">{previewDoc.name}</h4>
                    <p className="text-xs text-slate-500 mt-1">
                      Format dokumen <span className="font-bold text-slate-700 uppercase">{previewDoc.extension}</span> dapat langsung dibuka dan diedit setelah diunduh ke perangkat Anda.
                    </p>
                  </div>
                  <div className="pt-2">
                    <a
                      href={previewDoc.url}
                      download
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-800 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
                    >
                      <Download className="w-4 h-4 text-amber-300" />
                      <span>Unduh Berkas Sekarang</span>
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-5 sm:px-6 py-3 bg-white border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
              <span className="truncate max-w-md text-[11px]">
                Pratinjau Resmi Dokumen Kedinasan &bull; BKPSDM Aceh Tamiang
              </span>
              <button
                type="button"
                onClick={() => setPreviewDoc(null)}
                className="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg transition-colors cursor-pointer text-xs"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
