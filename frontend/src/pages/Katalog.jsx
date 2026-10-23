import React, { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import { Search, Filter, Clock, Building2, ChevronRight, Layers } from 'lucide-react';

export default function Katalog() {
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get('search') || '';
  const kategori_id = searchParams.get('kategori_id') || '';
  const opd_id = searchParams.get('opd_id') || '';

  const [inputSearch, setInputSearch] = useState(search);

  const { data: opdList } = useQuery({
    queryKey: ['filterOpd'],
    queryFn: async () => (await api.get('/master/opd')).data
  });

  const { data: kategoriList } = useQuery({
    queryKey: ['filterKategori'],
    queryFn: async () => (await api.get('/master/kategori')).data
  });

  const { data: layananData, isLoading } = useQuery({
    queryKey: ['katalogLayanan', search, kategori_id, opd_id],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (kategori_id) params.append('kategori_id', kategori_id);
      if (opd_id) params.append('opd_id', opd_id);
      return await api.get(`/layanan?${params.toString()}`);
    }
  });

  const handleSearch = (e) => {
    e.preventDefault();
    const newParams = new URLSearchParams(searchParams);
    if (inputSearch.trim()) {
      newParams.set('search', inputSearch.trim());
    } else {
      newParams.delete('search');
    }
    setSearchParams(newParams);
  };

  const handleFilterChange = (key, val) => {
    const newParams = new URLSearchParams(searchParams);
    if (val) {
      newParams.set(key, val);
    } else {
      newParams.delete(key);
    }
    setSearchParams(newParams);
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-12 pt-28 sm:pt-32 pb-16 space-y-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Katalog */}
        <div className="space-y-1.5 border-b border-slate-200 pb-5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-emerald-50 text-emerald-800 text-xs font-bold">
            <Layers className="w-3.5 h-3.5 text-emerald-700" />
            Katalog Layanan Kepegawaian & SDM ASN
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Katalog Layanan BKPSDM Kab. Aceh Tamiang
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm max-w-2xl">
            Informasi Standar Pelayanan Publik (SPP), Standar Operasional Prosedur (SOP), kelengkapan berkas, dan pengajuan layanan kepegawaian ASN terpadu.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          {/* Sidebar Filter */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-5">
            <div className="flex items-center gap-2 font-bold text-slate-900 text-sm pb-3 border-b border-slate-100">
              <Filter className="w-4 h-4 text-emerald-600" />
              <span>Saring Layanan Kepegawaian</span>
            </div>

            <form onSubmit={handleSearch} className="space-y-2">
              <label className="text-xs font-bold text-slate-600">Kata Kunci</label>
              <div className="relative">
                <input
                  type="text"
                  value={inputSearch}
                  onChange={(e) => setInputSearch(e.target.value)}
                  placeholder="Ketik nama layanan / usul..."
                  className="w-full text-xs px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-2 p-1 text-slate-400 hover:text-emerald-600"
                >
                  <Search className="w-4 h-4" />
                </button>
              </div>
            </form>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-600">Kategori Kepegawaian</label>
              <select
                value={kategori_id}
                onChange={(e) => handleFilterChange('kategori_id', e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="">Semua Kategori</option>
                {kategoriList?.map((k) => (
                  <option key={k.id} value={k.id}>{k.nama_kategori}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-600">Bidang Pelaksana / Sekretariat</label>
              <select
                value={opd_id}
                onChange={(e) => handleFilterChange('opd_id', e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="">Semua Bidang BKPSDM</option>
                {opdList?.map((o) => (
                  <option key={o.id} value={o.id}>{o.nama_opd}</option>
                ))}
              </select>
            </div>

            {(search || kategori_id || opd_id) && (
              <button
                onClick={() => {
                  setInputSearch('');
                  setSearchParams({});
                }}
                className="w-full py-2 text-xs font-bold text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-red-200"
              >
                Reset Filter
              </button>
            )}
          </div>

          {/* Results List */}
          <div className="lg:col-span-3 space-y-4">
            {isLoading ? (
              <div className="p-16 text-center text-slate-400">
                <div className="animate-spin w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full mx-auto mb-3"></div>
                <p className="text-xs font-semibold">Memuat katalog layanan...</p>
              </div>
            ) : layananData?.data?.length === 0 ? (
              <div className="bg-white p-12 rounded-xl border border-slate-200 text-center space-y-3">
                <Building2 className="w-10 h-10 text-slate-300 mx-auto" />
                <h3 className="font-extrabold text-slate-700 text-sm">Layanan Tidak Ditemukan</h3>
                <p className="text-xs text-slate-400">Silakan ubah kata kunci atau hapus filter.</p>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-xs text-slate-500 font-semibold">
                  Ditemukan <span className="text-slate-900 font-extrabold">{layananData?.meta?.total || layananData?.data?.length}</span> layanan publik
                </p>

                {layananData?.data?.map((layanan) => (
                  <div
                    key={layanan.id}
                    className="bg-white border border-slate-200 hover:border-emerald-500 rounded-xl p-6 shadow-2xs hover:shadow-sm transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-6"
                  >
                    <div className="space-y-2 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 uppercase">
                          {layanan.opd?.singkatan || 'OPD'}
                        </span>
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                          {layanan.kategori?.nama_kategori}
                        </span>
                        <span className="text-xs font-bold text-slate-700 bg-amber-100 px-2 py-0.5 rounded">
                          {layanan.biaya}
                        </span>
                      </div>

                      <h3 className="font-bold text-slate-900 text-base">
                        {layanan.nama_layanan}
                      </h3>
                      <p className="text-slate-600 text-xs sm:text-sm line-clamp-2 leading-relaxed">
                        {layanan.deskripsi}
                      </p>

                      <div className="flex items-center gap-4 text-xs text-slate-500 pt-1">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Estimasi: {layanan.estimasi_waktu}</span>
                        </div>
                        <div>
                          Kode: <span className="font-mono text-slate-800 font-semibold">{layanan.kode_layanan}</span>
                        </div>
                      </div>
                    </div>

                    <div className="shrink-0">
                      <Link
                        to={`/layanan/${layanan.slug}`}
                        className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg shadow-2xs transition-all"
                      >
                        <span>Lihat Syarat & Ajukan</span>
                        <ChevronRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
