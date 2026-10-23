import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import { FileText, Eye, Calendar, Clock, ChevronRight, Share2, Shield, ArrowLeft } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import Badge from '../components/common/Badge';

export default function PageView() {
  const { slug } = useParams();

  const { data: page, isLoading, isError } = useQuery({
    queryKey: ['cmsPageDetail', slug],
    queryFn: async () => {
      try {
        const res = await api.get(`/cms/pages/${slug}`);
        return res?.data || res || null;
      } catch (err) {
        return null;
      }
    }
  });

  if (isLoading) {
    return (
      <div className="min-h-screen pt-32 pb-20 px-4 max-w-4xl mx-auto">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-slate-200 rounded-xl w-3/4"></div>
          <div className="h-4 bg-slate-200 rounded-lg w-1/3"></div>
          <div className="h-64 bg-slate-200 rounded-2xl"></div>
        </div>
      </div>
    );
  }

  if (isError || !page || page?.template === 'COMING_SOON') {
    const pageTitle = page?.title || slug?.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Halaman Layanan';
    return (
      <div className="min-h-screen pt-28 pb-20 px-4 flex items-center justify-center bg-gradient-to-b from-slate-50 via-white to-emerald-50/30">
        <Helmet>
          <title>{pageTitle} - Segera Hadir | BKPSDM Aceh Tamiang</title>
        </Helmet>
        <div className="max-w-lg w-full text-center space-y-6 p-8 sm:p-10 bg-white rounded-3xl border border-slate-200/90 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-emerald-600 via-teal-500 to-amber-400" />
          
          <div className="w-20 h-20 bg-gradient-to-tr from-emerald-800 to-teal-600 text-white rounded-3xl flex items-center justify-center mx-auto shadow-xl shadow-emerald-700/20">
            <Clock className="w-10 h-10 animate-pulse text-amber-300" />
          </div>

          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 font-bold text-[11px] uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
              <span>Segera Hadir / Under Development</span>
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight">
              {pageTitle}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed max-w-sm mx-auto">
              Konten, dokumen SOP, atau modul layanan ini sedang dalam tahap penyusunan dan digitalisasi oleh tim BKPSDM Kabupaten Aceh Tamiang.
            </p>
          </div>

          {page?.content && page.template === 'COMING_SOON' && (
            <div 
              className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-xs text-slate-600 leading-relaxed text-left max-h-48 overflow-y-auto"
              dangerouslySetHtml={{ __html: page.content }}
            />
          )}

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-emerald-800 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md transition-all cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Kembali ke Beranda</span>
            </Link>
            <Link
              to="/katalog"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer"
            >
              <span>Katalog Layanan Lain</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 pt-28 pb-20 text-slate-800">
      <Helmet>
        <title>{page.title} - BKPSDM Kab. Aceh Tamiang</title>
        <meta name="description" content={page.excerpt || page.title} />
      </Helmet>

      {/* Hero Breadcrumb Header */}
      <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 text-white py-12 px-4 sm:px-6 lg:px-8 border-b border-emerald-950">
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="flex items-center gap-2 text-xs text-emerald-200 font-semibold">
            <Link to="/" className="hover:text-white transition-colors">Beranda</Link>
            <ChevronRight className="w-3.5 h-3.5 text-emerald-400" />
            <span>Halaman Resmi</span>
            <ChevronRight className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-amber-300 font-bold truncate max-w-xs">{page.title}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight">
            {page.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs text-emerald-200/90 pt-2">
            <div className="flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-amber-400" />
              <span>BKPSDM Kab. Aceh Tamiang</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-emerald-300" />
              <span>{new Date(page.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1.5 font-mono">
              <Eye className="w-4 h-4 text-emerald-300" />
              <span>{page.views_count || 0} Dilihat</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content Container */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <article className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-sm space-y-6">
          
          {page.excerpt && (
            <div className="p-4 bg-emerald-50/80 border-l-4 border-emerald-700 rounded-r-2xl text-xs sm:text-sm font-semibold text-emerald-900 leading-relaxed italic">
              {page.excerpt}
            </div>
          )}

          {page.cover_image && (
            <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-xs">
              <img src={page.cover_image} alt={page.title} className="w-full h-80 object-cover" loading="lazy" decoding="async" />
            </div>
          )}

          {/* Render HTML Content */}
          <div 
            className="prose prose-sm sm:prose-base max-w-none text-slate-700 leading-relaxed space-y-4"
            dangerouslySetHtml={{ __html: page.content }}
          />

          <div className="pt-8 border-t border-slate-200 flex items-center justify-between">
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Kembali</span>
            </Link>
            <span className="text-xs text-slate-400 font-mono">
              Terakhir diperbarui: {new Date(page.updated_at || page.created_at).toLocaleDateString('id-ID')}
            </span>
          </div>
        </article>
      </main>
    </div>
  );
}
