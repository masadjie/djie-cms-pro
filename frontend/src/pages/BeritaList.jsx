import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';
import SEOHead from '../components/common/SEOHead';
import FloatingActionBars from '../components/common/FloatingActionBars';
import Badge from '../components/common/Badge';
import SearchInput from '../components/common/SearchInput';
import BeritaCard from '../components/berita/BeritaCard';
import TrendingNewsWidget from '../components/berita/TrendingNewsWidget';
import { BeritaCardSkeleton, TrendingNewsSkeleton } from '../components/berita/BeritaSkeleton';
import { Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';

export default function BeritaList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const kategoriParam = searchParams.get('kategori') || '';
  const searchParam = searchParams.get('search') || '';
  const pageParam = parseInt(searchParams.get('page') || '1', 10);
  const sortParam = searchParams.get('sort') || 'latest';

  const [searchInput, setSearchInput] = useState(searchParam);

  // Fetch Categories
  const { data: kategoriList } = useQuery({
    queryKey: ['kategoriBerita'],
    queryFn: async () => (await api.get('/berita/kategori')).data
  });

  // Fetch Trending News
  const { data: trendingNews, isLoading: isTrendingLoading } = useQuery({
    queryKey: ['trendingBerita'],
    queryFn: async () => (await api.get('/berita/trending?limit=5')).data
  });

  // Fetch News List (6 items per page for clean visual pagination)
  const pageSize = 6;
  const { data: newsData, isLoading } = useQuery({
    queryKey: ['beritaList', kategoriParam, searchParam, pageParam, sortParam],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (kategoriParam) params.append('kategori', kategoriParam);
      if (searchParam) params.append('search', searchParam);
      if (pageParam) params.append('page', String(pageParam));
      if (sortParam) params.append('sort', sortParam);
      params.append('limit', String(pageSize));
      return await api.get(`/berita?${params.toString()}`);
    }
  });

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const newParams = new URLSearchParams(searchParams);
    if (searchInput.trim()) {
      newParams.set('search', searchInput.trim());
    } else {
      newParams.delete('search');
    }
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const handleKategoriClick = (slug) => {
    const newParams = new URLSearchParams(searchParams);
    if (slug) {
      newParams.set('kategori', slug);
    } else {
      newParams.delete('kategori');
    }
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const handleSortChange = (sortVal) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('sort', sortVal);
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const handlePageChange = (newPage) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', newPage.toString());
    setSearchParams(newParams);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="w-full min-h-screen bg-[#f8faf8] pb-20 pt-28 sm:pt-32">
      <SEOHead
        title="Berita & Pengumuman Resmi ASN | BKPSDM Kab. Aceh Tamiang"
        description="Pusat informasi berita kepegawaian terkini, pengumuman seleksi CASN/PPPK, kenaikan pangkat, uji kompetensi, dan kebijakan ASN Kabupaten Aceh Tamiang."
        canonicalUrl="https://bkpsdm.acehtamiangkab.go.id/berita"
      />

      <FloatingActionBars />

      <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-12 space-y-8">
        
        {/* Header Title */}
        <div className="space-y-1.5 border-b border-emerald-100/80 pb-6">
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Kabar Kepegawaian & SDM Aparatur
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-2xl leading-relaxed">
            Informasi terkini pelaksanaan manajemen ASN, seleksi CASN, diklat aparatur, dan regulasi kepegawaian Pemerintah Kabupaten Aceh Tamiang.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white p-4 sm:p-6 rounded-3xl border border-emerald-100 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="w-full sm:max-w-md">
              <SearchInput
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onSubmit={handleSearchSubmit}
                placeholder="Cari pengumuman, CASN, pangkat..."
                buttonText="Cari"
                variant="light"
              />
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 self-end sm:self-center">
              <span className="text-xs font-bold text-slate-500">Urutkan:</span>
              <select
                value={sortParam}
                onChange={(e) => handleSortChange(e.target.value)}
                className="text-xs font-bold px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 text-slate-700 cursor-pointer"
              >
                <option value="latest">Terbaru</option>
                <option value="popular">Terpopuler</option>
                <option value="featured">Pilihan Redaksi</option>
              </select>
            </div>
          </div>

          {/* Category Chips */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => handleKategoriClick('')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                !kategoriParam
                  ? 'bg-emerald-700 text-white shadow-sm'
                  : 'bg-slate-100 hover:bg-emerald-50 text-slate-600'
              }`}
            >
              Semua Kategori
            </button>
            {kategoriList?.map((k) => (
              <button
                key={k.id}
                type="button"
                onClick={() => handleKategoriClick(k.slug)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  kategoriParam === k.slug
                    ? 'bg-emerald-700 text-white shadow-sm'
                    : 'bg-slate-100 hover:bg-emerald-50 text-slate-600'
                }`}
              >
                {k.nama_kategori}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* News List (8 Cols) */}
          <div className="lg:col-span-8 space-y-6">
            {isLoading ? (
              <div className="space-y-6">
                {Array.from({ length: pageSize }).map((_, idx) => (
                  <BeritaCardSkeleton key={idx} />
                ))}
              </div>
            ) : newsData?.data?.length === 0 ? (
              <div className="p-16 text-center text-slate-500 bg-white rounded-3xl border border-emerald-100 space-y-2">
                <p className="font-bold text-sm">Tidak ada berita yang sesuai dengan kriteria pencarian.</p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchInput('');
                    setSearchParams({});
                  }}
                  className="px-4 py-2 text-xs font-bold text-emerald-700 hover:underline cursor-pointer"
                >
                  Reset Pencarian
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {newsData?.data?.map((berita) => (
                  <BeritaCard key={berita.id} berita={berita} />
                ))}

                {/* Pagination Controls & Page Info */}
                {newsData?.totalPages > 1 && (
                  <div className="pt-8 pb-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-200/80">
                    <p className="text-xs text-slate-500 font-medium">
                      Menampilkan halaman <strong className="text-slate-800">{pageParam}</strong> dari <strong className="text-slate-800">{newsData.totalPages}</strong> (Total <strong className="text-emerald-700">{newsData.total}</strong> Berita)
                    </p>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        disabled={pageParam <= 1}
                        onClick={() => handlePageChange(pageParam - 1)}
                        className="px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-200 disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-slate-700 disabled:cursor-not-allowed transition-all cursor-pointer flex items-center gap-1 shadow-xs"
                      >
                        <ChevronLeft className="w-3.5 h-3.5" />
                        <span>Sebelumnya</span>
                      </button>

                      <div className="flex items-center gap-1 px-1">
                        {Array.from({ length: newsData.totalPages }).map((_, idx) => {
                          const p = idx + 1;
                          // If many pages, only show nearby
                          if (
                            newsData.totalPages > 7 &&
                            p !== 1 &&
                            p !== newsData.totalPages &&
                            Math.abs(p - pageParam) > 1
                          ) {
                            if (p === 2 || p === newsData.totalPages - 1) {
                              return <span key={p} className="text-slate-400 text-xs px-1">...</span>;
                            }
                            return null;
                          }

                          const isActive = pageParam === p;
                          return (
                            <button
                              key={p}
                              type="button"
                              onClick={() => handlePageChange(p)}
                              className={`w-9 h-9 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                                isActive
                                  ? 'bg-emerald-700 text-white font-black shadow-sm ring-2 ring-emerald-600/30'
                                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-emerald-50 hover:border-emerald-200'
                              }`}
                            >
                              {p}
                            </button>
                          );
                        })}
                      </div>

                      <button
                        type="button"
                        disabled={pageParam >= newsData.totalPages}
                        onClick={() => handlePageChange(pageParam + 1)}
                        className="px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-200 disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-slate-700 disabled:cursor-not-allowed transition-all cursor-pointer flex items-center gap-1 shadow-xs"
                      >
                        <span>Selanjutnya</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sidebar (4 Cols) */}
          <div className="lg:col-span-4 space-y-6">
            {isTrendingLoading ? (
              <TrendingNewsSkeleton />
            ) : (
              <TrendingNewsWidget trendingNews={trendingNews} />
            )}

            {/* RSS & Sitemap Syndicate Box */}
            <div className="bg-gradient-to-br from-[#052e16] to-[#064e3b] rounded-3xl p-6 text-white space-y-3 border border-emerald-800 shadow-md">
              <span className="text-[10px] font-black uppercase text-amber-300">Sindikasi Berita</span>
              <h4 className="font-bold text-sm leading-snug">Berlangganan Kabar ASN Melalui RSS Feed & Google News</h4>
              <p className="text-xs text-emerald-200 leading-relaxed">
                Dapatkan update otomatis pengumuman kepegawaian melalui XML RSS resmi BKPSDM.
              </p>
              <div className="pt-2 flex items-center gap-2">
                <a
                  href="/rss.xml"
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black rounded-xl text-xs shadow-sm transition-colors"
                >
                  Buka RSS Feed
                </a>
                <a
                  href="/sitemap.xml"
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl text-xs border border-white/20 transition-colors"
                >
                  XML Sitemap
                </a>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
