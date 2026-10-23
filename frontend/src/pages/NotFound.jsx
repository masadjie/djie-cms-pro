import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Home, 
  Search, 
  ArrowLeft, 
  FileText, 
  Layers, 
  HelpCircle, 
  Compass, 
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import SEOHead from '../components/common/SEOHead';

export default function NotFound({ attemptedSlug }) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/katalog?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const quickLinks = [
    {
      title: 'Katalog Layanan ASN',
      desc: 'Pengajuan cuti, mutasi, kenaikan pangkat & pensiun',
      to: '/katalog',
      icon: Layers,
      color: 'bg-emerald-50 text-emerald-700 border-emerald-200'
    },
    {
      title: 'Warta & Pengumuman',
      desc: 'Kabar seleksi CASN, diklat, dan surat edaran terbaru',
      to: '/berita',
      icon: FileText,
      color: 'bg-blue-50 text-blue-700 border-blue-200'
    },
    {
      title: 'Portal SIKEPO Mobile',
      desc: 'Akses presensi online & laporan kinerja mandiri',
      to: '/sikepo',
      icon: Compass,
      color: 'bg-amber-50 text-amber-700 border-amber-200'
    },
    {
      title: 'Lacak Berkas Pelayanan',
      desc: 'Cek status disposisi & progres verifikasi dokumen',
      to: '/tracking',
      icon: ShieldCheck,
      color: 'bg-purple-50 text-purple-700 border-purple-200'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between pt-28 pb-16">
      <SEOHead 
        title="404 - Halaman Tidak Ditemukan"
        description="Halaman yang Anda tuju di portal BKPSDM Aceh Tamiang tidak ditemukan atau telah dipindahkan."
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full my-auto">
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl shadow-slate-200/40 overflow-hidden">
          {/* Header Accent Bar */}
          <div className="h-2 bg-gradient-to-r from-emerald-600 via-teal-500 to-amber-500" />

          <div className="p-6 sm:p-10 lg:p-12 text-center">
            {/* Visual 404 Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-6">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              Kode Status HTTP: 404
            </div>

            <div className="relative mb-6">
              <h1 className="text-7xl sm:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-b from-slate-900 to-slate-400 tracking-tight select-none">
                404
              </h1>
              <p className="absolute inset-0 flex items-center justify-center text-sm sm:text-base font-bold text-emerald-800 tracking-widest uppercase opacity-20 pointer-events-none">
                Page Not Found
              </p>
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-slate-900 mb-3">
              Halaman atau Dokumen Tidak Ditemukan
            </h2>

            <p className="text-sm text-slate-600 max-w-lg mx-auto leading-relaxed mb-6">
              Maaf, tautan 
              {attemptedSlug ? (
                <code className="mx-1 px-2 py-0.5 bg-slate-100 rounded text-emerald-800 font-mono font-bold text-xs">
                  /{attemptedSlug}
                </code>
              ) : ' yang Anda tuju '} 
              tidak tersedia di portal ini, mungkin telah dihapus, diperbarui, atau alamat URL yang dimasukkan salah.
            </p>

            {/* Quick Search Form */}
            <form onSubmit={handleSearch} className="max-w-md mx-auto mb-8">
              <div className="relative flex items-center">
                <input
                  type="text"
                  placeholder="Cari layanan, informasi, atau regulasi..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-24 py-3 rounded-2xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/10 text-sm text-slate-800 placeholder-slate-400 transition-all outline-none"
                />
                <Search className="w-5 h-5 text-slate-400 absolute left-3.5 pointer-events-none" />
                <button
                  type="submit"
                  className="absolute right-1.5 px-4 py-2 bg-emerald-800 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  Cari
                </button>
              </div>
            </form>

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
              <button
                onClick={() => navigate(-1)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all shadow-sm cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                Kembali ke Halaman Sebelumnya
              </button>
              <Link
                to="/"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-md shadow-emerald-900/10 cursor-pointer"
              >
                <Home className="w-4 h-4" />
                Ke Beranda Utama
              </Link>
            </div>

            {/* Recommended Hub Nav */}
            <div className="border-t border-slate-100 pt-8 text-left">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 text-center sm:text-left">
                Mungkin Anda Sedang Mencari:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {quickLinks.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={idx}
                      to={item.to}
                      className="group flex items-start gap-3.5 p-3.5 rounded-2xl border border-slate-100 hover:border-emerald-200 hover:bg-emerald-50/40 transition-all"
                    >
                      <div className={`p-2 rounded-xl border ${item.color} shrink-0 group-hover:scale-105 transition-transform`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-slate-800 group-hover:text-emerald-800 transition-colors flex items-center gap-1">
                          {item.title}
                        </div>
                        <div className="text-[11px] text-slate-500 truncate mt-0.5">
                          {item.desc}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Helpdesk Footer */}
            <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
              <span className="flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-slate-400" />
                Butuh bantuan navigasi kepegawaian?
              </span>
              <a
                href="https://wa.me/6281234567890?text=Halo%20Admin%20BKPSDM%20Aceh%20Tamiang,%20saya%20mengalami%20kendala%20mencari%20halaman"
                target="_blank"
                rel="noreferrer"
                className="font-bold text-emerald-800 hover:text-emerald-700 hover:underline flex items-center gap-1"
              >
                Hubungi Helpdesk BKPSDM
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
