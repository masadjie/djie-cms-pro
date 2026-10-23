import React from 'react';
import { Link } from 'react-router-dom';
import { X, ArrowRight, Briefcase, ExternalLink } from 'lucide-react';
import { DynamicIcon } from '../common/IconPickerModal';

export default function MegaMenuLayanan({ onClose, onNavigate, items = [] }) {
  const lifecycleItems = [
    {
      title: 'Pengadaan CASN & PPPK',
      desc: 'Informasi seleksi calon aparatur, penetapan NIP/NIPPPK, dan administrasi pengangkatan awal.',
      tag: 'Rekrutmen ASN',
      route: '/katalog?search=Pengadaan',
      renderIcon: () => (
        <svg viewBox="0 0 48 48" className="w-10 h-10" fill="none">
          <circle cx="24" cy="14" r="6" fill="#1E3A8A" />
          <path d="M12 36C12 29.5 17 25 24 25C31 25 36 29.5 36 36" fill="#3B82F6" />
          <circle cx="34" cy="32" r="7" fill="#F59E0B" />
          <path d="M31.5 32L33.5 34L37 30" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    },
    {
      title: 'Kenaikan Pangkat & Mutasi',
      desc: 'Layanan kenaikan pangkat periodik 6 kali setahun, penyesuaian ijazah, dan mutasi antar-OPD/daerah.',
      tag: 'Karier & Pangkat',
      route: '/katalog?search=Kenaikan',
      renderIcon: () => (
        <svg viewBox="0 0 48 48" className="w-10 h-10" fill="none">
          <rect x="10" y="28" width="6" height="12" rx="2" fill="#10B981" />
          <rect x="19" y="20" width="6" height="20" rx="2" fill="#047857" />
          <rect x="28" y="14" width="6" height="26" rx="2" fill="#F59E0B" />
          <path d="M12 24L22 14L30 18L38 8" stroke="#EF4444" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M32 8H38V14" stroke="#EF4444" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    },
    {
      title: 'Izin Belajar & Tugas Belajar',
      desc: 'Fasilitasi izin melanjutkan studi D-IV/S-1, S-2, S-3, dan keikutsertaan diklat kepemimpinan/teknis.',
      tag: 'Kompetensi',
      route: '/katalog?search=Belajar',
      renderIcon: () => (
        <svg viewBox="0 0 48 48" className="w-10 h-10" fill="none">
          <path d="M24 10L6 18L24 26L42 18L24 10Z" fill="#1D4ED8" />
          <path d="M12 21.5V31C12 31 16 36 24 36C32 36 36 31 36 31V21.5" fill="#3B82F6" />
          <path d="M38 20V32" stroke="#F59E0B" strokeWidth="3" strokeLinecap="round" />
          <circle cx="38" cy="33" r="2.5" fill="#F59E0B" />
          <path d="M18 38H30" stroke="#FBBF24" strokeWidth="2" strokeLinecap="round" />
        </svg>
      )
    },
    {
      title: 'Cuti ASN & Disiplin Pegawai',
      desc: 'Pengajuan cuti tahunan, cuti melahirkan, cuti sakit, serta pendampingan kode etik dan disiplin.',
      tag: 'Hak Pegawai',
      route: '/katalog?search=Cuti',
      renderIcon: () => (
        <svg viewBox="0 0 48 48" className="w-10 h-10" fill="none">
          <rect x="10" y="8" width="28" height="32" rx="4" fill="#047857" />
          <circle cx="24" cy="22" r="7" fill="#FEF08A" />
          <path d="M24 18V22L27 24" stroke="#065F46" strokeWidth="2" strokeLinecap="round" />
          <rect x="14" y="32" width="20" height="3" rx="1.5" fill="#A7F3D0" />
        </svg>
      )
    },
    {
      title: 'Kinerja, SKP & TPP ASN',
      desc: 'Penilaian capaian kinerja periodik dan tahunan (SKP e-Kinerja BKN) dan rekomendasi TPP.',
      tag: 'Kinerja & TPP',
      route: '/katalog?search=Kinerja',
      renderIcon: () => (
        <svg viewBox="0 0 48 48" className="w-10 h-10" fill="none">
          <rect x="10" y="14" width="28" height="24" rx="4" fill="#059669" />
          <path d="M10 22H38" stroke="#047857" strokeWidth="3" />
          <circle cx="24" cy="30" r="5" fill="#FACC15" />
          <path d="M22 30L23.5 31.5L26 28.5" stroke="#052E16" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    },
    {
      title: 'Purna Tugas & Pensiun ASN',
      desc: 'Layanan penetapan SK Pensiun Batas Usia Pensiun (BUP), janda/duda, dan pencairan hak Taspen.',
      tag: 'Purna Tugas',
      route: '/katalog?search=Pensiun',
      renderIcon: () => (
        <svg viewBox="0 0 48 48" className="w-10 h-10" fill="none">
          <circle cx="24" cy="24" r="18" fill="#EF4444" />
          <path d="M24 14V34M14 24H34" stroke="#FFFFFF" strokeWidth="5" strokeLinecap="round" />
          <path d="M32 12C36 16 36 20 32 24" stroke="#FBBF24" strokeWidth="3" strokeLinecap="round" />
        </svg>
      )
    }
  ];

  return (
    <div className="w-full bg-[#064e3b] text-white border-t border-emerald-700 shadow-2xl py-6 sm:py-8 px-4 sm:px-6 lg:px-12 transition-all max-h-[85vh] overflow-y-auto">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between border-b border-emerald-600/60 pb-4">
          <div>
            <h2 className="text-2xl font-black text-white tracking-tight">
              Layanan Kepegawaian ASN
            </h2>
            <p className="text-xs text-emerald-100 mt-0.5">
              Portal siklus pelayanan administrasi ASN Kabupaten Aceh Tamiang dari rekrutmen hingga purna tugas
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-emerald-800 text-white transition-colors cursor-pointer"
            title="Tutup Menu"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-2">
          <div className="lg:col-span-4 space-y-4 pr-4 border-r border-emerald-600/50">
            <span className="text-xs font-bold text-emerald-200 uppercase tracking-wider block">
              Siklus Pelayanan
            </span>
            <h3 className="text-3xl font-black text-white leading-tight">
              Fase Karier ASN
            </h3>
            <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed">
              Dapatkan panduan dan formulir digital resmi untuk seluruh tahapan karier pegawai ASN Pemerintah Kabupaten Aceh Tamiang secara mandiri, transparan, dan terintegrasi SIASN BKN serta SiKEPO.
            </p>

            {/* SiKEPO Special Callout Box */}
            <div className="p-4 rounded-2xl bg-[#052e16] border border-amber-400/40 text-white space-y-2 shadow-lg">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse"></span>
                <span className="text-xs font-black text-amber-300 uppercase tracking-wider">Aplikasi SiKEPO</span>
              </div>
              <p className="text-xs text-emerald-100">
                Sistem Informasi Kepegawaian Online Kab. Aceh Tamiang untuk Pemutakhiran Data Mandiri (PDM), E-Cuti, dan KGB.
              </p>
              <a
                href="https://sikepo.acehtamiangkab.go.id"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black rounded-xl transition-all shadow-sm"
              >
                <span>Masuk SiKEPO</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          <div className="lg:col-span-8 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {items && items.length > 0 ? (
                items.map((menuItem) => {
                  const route = menuItem.tipe === 'PAGE'
                    ? (menuItem.page_slug ? `/page/${menuItem.page_slug}` : menuItem.url)
                    : menuItem.url;
                  const isExternal = menuItem.tipe === 'EXTERNAL' || (route && route.startsWith('http'));

                  const CardContent = (
                    <div className="flex items-start text-left gap-3.5 p-3 rounded-2xl hover:bg-emerald-800/60 border border-transparent hover:border-emerald-600/50 transition-all group w-full cursor-pointer">
                      <div className="w-14 h-14 rounded-2xl bg-white shadow-md flex items-center justify-center shrink-0 p-1.5 group-hover:scale-105 transition-transform text-emerald-800">
                        {menuItem.icon ? (
                          <DynamicIcon name={menuItem.icon} className="w-8 h-8 text-emerald-700" fallback={<Briefcase className="w-8 h-8 text-emerald-700" />} />
                        ) : (
                          <Briefcase className="w-8 h-8 text-emerald-700" />
                        )}
                      </div>
                      <div className="space-y-1 min-w-0 flex-1">
                        <h4 className="font-extrabold text-white text-sm group-hover:text-amber-300 transition-colors flex items-center gap-1.5 truncate">
                          <span className="truncate">{menuItem.label}</span>
                          <ExternalLink className="w-3.5 h-3.5 opacity-60 text-amber-300 shrink-0" />
                        </h4>
                        <p className="text-xs text-emerald-100 leading-relaxed line-clamp-2">
                          {menuItem.deskripsi || menuItem.excerpt || 'Layanan dan standar administrasi kepegawaian BKPSDM Aceh Tamiang'}
                        </p>
                        <span className="inline-block px-2.5 py-0.5 rounded-full border border-emerald-400/50 bg-emerald-800/60 text-[10px] font-bold text-emerald-200 mt-1">
                          Layanan ASN
                        </span>
                      </div>
                    </div>
                  );

                  return isExternal ? (
                    <a
                      key={menuItem.id || menuItem.label}
                      href={route}
                      target="_blank"
                      rel="noreferrer"
                      onClick={onClose}
                    >
                      {CardContent}
                    </a>
                  ) : (
                    <button
                      key={menuItem.id || menuItem.label}
                      type="button"
                      onClick={() => onNavigate(route)}
                      className="w-full text-left"
                    >
                      {CardContent}
                    </button>
                  );
                })
              ) : (
                lifecycleItems.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => onNavigate(item.route)}
                    className="flex items-start text-left gap-3.5 p-3 rounded-2xl hover:bg-emerald-800/60 transition-all group w-full cursor-pointer"
                  >
                    <div className="w-14 h-14 rounded-2xl bg-white shadow-md flex items-center justify-center shrink-0 p-1.5 group-hover:scale-105 transition-transform">
                      {item.renderIcon()}
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-extrabold text-white text-sm group-hover:text-amber-300 transition-colors">
                        {item.title}
                      </h4>
                      <p className="text-xs text-emerald-100 leading-relaxed">
                        {item.desc}
                      </p>
                      <span className="inline-block px-2.5 py-0.5 rounded-full border border-emerald-400/50 bg-emerald-800/60 text-[10px] font-bold text-emerald-200 mt-1">
                        {item.tag}
                      </span>
                    </div>
                  </button>
                ))
              )}
            </div>

            <div className="text-center pt-3 border-t border-emerald-600/60">
              <button
                type="button"
                onClick={() => onNavigate('/katalog')}
                className="inline-flex items-center gap-1.5 text-xs font-black text-amber-300 hover:text-white transition-colors cursor-pointer"
              >
                <span>Lihat Semua Layanan Kepegawaian</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
