import React from 'react';
import { Link } from 'react-router-dom';
import { X, ExternalLink, Newspaper, BookOpen, Megaphone, Calendar, FileText } from 'lucide-react';
import { DynamicIcon } from '../common/IconPickerModal';

export default function MegaMenuBerita({ onClose, items = [] }) {
  const defaultNewsCategories = [
    {
      title: 'Seleksi CASN & PPPK',
      desc: 'Informasi resmi formasi, jadwal, hasil seleksi CPNS dan PPPK Kab. Aceh Tamiang.',
      slug: 'seleksi-casn-pppk',
      route: '/berita?kategori=pengumuman',
      renderIcon: () => (
        <svg viewBox="0 0 48 48" className="w-9 h-9" fill="none">
          <circle cx="24" cy="14" r="6" fill="#1E3A8A" />
          <path d="M12 36C12 29.5 17 25 24 25C31 25 36 29.5 36 36" fill="#3B82F6" />
          <circle cx="34" cy="32" r="7" fill="#F59E0B" />
          <path d="M31.5 32L33.5 34L37 30" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    },
    {
      title: 'Mutasi & Kenaikan Pangkat',
      desc: 'Pemberitahuan periodisasi Kenaikan Pangkat (KP) 6 kali setahun dan alur mutasi pegawai.',
      slug: 'mutasi-kenaikan-pangkat',
      route: '/katalog?search=Kenaikan',
      renderIcon: () => (
        <svg viewBox="0 0 48 48" className="w-9 h-9" fill="none">
          <rect x="10" y="28" width="6" height="12" rx="2" fill="#10B981" />
          <rect x="19" y="20" width="6" height="20" rx="2" fill="#047857" />
          <rect x="28" y="14" width="6" height="26" rx="2" fill="#F59E0B" />
          <path d="M12 24L22 14L30 18L38 8" stroke="#EF4444" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M32 8H38V14" stroke="#EF4444" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    },
    {
      title: 'Diklat & Tugas Belajar',
      desc: 'Peluang beasiswa tugas belajar, izin belajar, dan pelatihan kepemimpinan (PKP/PKA).',
      slug: 'diklat-tugas-belajar',
      route: '/katalog?search=Belajar',
      renderIcon: () => (
        <svg viewBox="0 0 48 48" className="w-9 h-9" fill="none">
          <path d="M24 10L6 18L24 26L42 18L24 10Z" fill="#1D4ED8" />
          <path d="M12 21.5V31C12 31 16 36 24 36C32 36 36 31 36 31V21.5" fill="#3B82F6" />
          <path d="M38 20V32" stroke="#F59E0B" strokeWidth="3" strokeLinecap="round" />
          <circle cx="38" cy="33" r="2.5" fill="#F59E0B" />
          <path d="M18 38H30" stroke="#FBBF24" strokeWidth="2" strokeLinecap="round" />
        </svg>
      )
    },
    {
      title: 'Kinerja, SKP & TPP ASN',
      desc: 'Petunjuk teknis penilaian kinerja aparatur terintegrasi e-Kinerja BKN dan Tunjangan TPP.',
      slug: 'kinerja-skp-tpp',
      route: '/page/kinerja-skp-tpp',
      renderIcon: () => (
        <svg viewBox="0 0 48 48" className="w-9 h-9" fill="none">
          <rect x="10" y="8" width="28" height="32" rx="4" fill="#059669" />
          <circle cx="24" cy="22" r="7" fill="#FEF08A" />
          <path d="M21 22L23 24L27 20" stroke="#065F46" strokeWidth="2" strokeLinecap="round" />
          <rect x="14" y="32" width="20" height="3" rx="1.5" fill="#A7F3D0" />
        </svg>
      )
    },
    {
      title: 'Disiplin & Kode Etik ASN',
      desc: 'Sosialisasi penegakan disiplin PNS (PP 94/2021) dan pembinaan nilai BerAKHLAK.',
      slug: 'disiplin-kode-etik-asn',
      route: '/page/disiplin-kode-etik-asn',
      renderIcon: () => (
        <svg viewBox="0 0 48 48" className="w-9 h-9" fill="none">
          <path d="M24 6L10 12V22C10 32 16 39 24 42C32 39 38 32 38 22V12L24 6Z" fill="#1E40AF" />
          <path d="M24 10L14 15V22C14 30 18.5 35.5 24 38C29.5 35.5 34 30 34 22V15L24 10Z" fill="#3B82F6" />
          <path d="M24 16L27 22H33L28 26L30 32L24 28L18 32L20 26L15 22H21L24 16Z" fill="#FBBF24" />
        </svg>
      )
    },
    {
      title: 'Kesejahteraan & Pensiun',
      desc: 'Informasi ketetapan pensiun BUP, janda/duda, klaim Taspen, dan penghargaan Satyalancana.',
      slug: 'kesejahteraan-pensiun',
      route: '/katalog?search=Pensiun',
      renderIcon: () => (
        <svg viewBox="0 0 48 48" className="w-9 h-9" fill="none">
          <path d="M24 40C24 40 8 28 8 16C8 10 12 6 18 6C21.5 6 24 8.5 24 8.5C24 8.5 26.5 6 30 6C36 6 40 10 40 16C40 28 24 40 24 40Z" fill="#EF4444" />
          <path d="M14 20H20L22 15L26 25L28 20H34" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    },
    {
      title: 'Merit System & Manajemen Talenta',
      desc: 'Implementasi Sistem Merit, pemetaan kompetensi (Assessment Center), dan suksesi jabatan.',
      slug: 'merit-system-manajemen-talenta',
      route: '/page/merit-system-manajemen-talenta',
      renderIcon: () => (
        <svg viewBox="0 0 48 48" className="w-9 h-9" fill="none">
          <rect x="14" y="14" width="20" height="20" rx="4" fill="#6366F1" />
          <rect x="19" y="19" width="10" height="10" rx="2" fill="#FACC15" />
          <path d="M19 10V14M24 10V14M29 10V14" stroke="#06B6D4" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M19 34V38M24 34V38M29 34V38" stroke="#06B6D4" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M10 19H14M10 24H14M10 29H14" stroke="#06B6D4" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M34 19H38M34 24H38M34 29H38" stroke="#06B6D4" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      )
    }
  ];

  // If dynamic items exist in DB, use them; otherwise fallback to default
  const hasDynamic = items && items.length > 0;

  return (
    <div className="w-full bg-[#064e3b] text-white border-t border-emerald-700 shadow-2xl py-6 sm:py-8 px-4 sm:px-6 lg:px-12 transition-all max-h-[85vh] overflow-y-auto">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between border-b border-emerald-600/60 pb-4">
          <div>
            <h2 className="text-2xl font-black text-white tracking-tight">
              Berita & Informasi Kepegawaian ASN
            </h2>
            <p className="text-xs text-emerald-100 mt-0.5">
              Pembaruan resmi seputar CASN, mutasi, diklat, dan regulasi aparatur Kabupaten Aceh Tamiang
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 pt-2">
          {hasDynamic ? (
            items.map((menuItem) => {
              const route = menuItem.tipe === 'PAGE' 
                ? (menuItem.page_slug ? `/page/${menuItem.page_slug}` : menuItem.url)
                : menuItem.url;
              const isExternal = menuItem.tipe === 'EXTERNAL' || (route && route.startsWith('http'));

              const CardContent = (
                <div className="flex items-start gap-3.5 p-3 rounded-2xl hover:bg-emerald-800/60 border border-transparent hover:border-emerald-600/50 transition-all group cursor-pointer w-full">
                  <div className="w-13 h-13 rounded-2xl bg-white flex items-center justify-center font-bold shrink-0 shadow-sm group-hover:scale-105 transition-transform p-1.5 text-emerald-800">
                    {menuItem.icon ? (
                      <DynamicIcon name={menuItem.icon} className="w-7 h-7 text-emerald-700" fallback={<FileText className="w-7 h-7 text-emerald-700" />} />
                    ) : (
                      <Newspaper className="w-7 h-7 text-emerald-700" />
                    )}
                  </div>
                  <div className="space-y-1 min-w-0 flex-1">
                    <h3 className="font-extrabold text-white text-sm group-hover:text-amber-300 transition-colors flex items-center gap-1.5 truncate">
                      <span className="truncate">{menuItem.label}</span>
                      <ExternalLink className="w-3.5 h-3.5 opacity-60 text-amber-300 shrink-0" />
                    </h3>
                    <p className="text-xs text-emerald-100 leading-relaxed line-clamp-2">
                      {menuItem.deskripsi || menuItem.excerpt || 'Informasi dan publikasi resmi BKPSDM Kabupaten Aceh Tamiang'}
                    </p>
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
                <Link
                  key={menuItem.id || menuItem.label}
                  to={route}
                  onClick={onClose}
                >
                  {CardContent}
                </Link>
              );
            })
          ) : (
            defaultNewsCategories.map((item, idx) => (
              <Link
                key={idx}
                to={item.route}
                onClick={onClose}
                className="flex items-start gap-3.5 p-3 rounded-2xl hover:bg-emerald-800/60 border border-transparent hover:border-emerald-600/50 transition-all group cursor-pointer"
              >
                <div className="w-13 h-13 rounded-2xl bg-white flex items-center justify-center font-bold shrink-0 shadow-sm group-hover:scale-105 transition-transform p-1.5">
                  {item.renderIcon()}
                </div>
                <div className="space-y-1">
                  <h3 className="font-extrabold text-white text-sm group-hover:text-amber-300 transition-colors flex items-center gap-1.5">
                    <span>{item.title}</span>
                    <ExternalLink className="w-3.5 h-3.5 opacity-60 text-amber-300 shrink-0" />
                  </h3>
                  <p className="text-xs text-emerald-100 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
