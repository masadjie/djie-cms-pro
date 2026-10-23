import React from 'react';
import { Link } from 'react-router-dom';
import { X, ExternalLink, Building2, UserCheck, ShieldCheck, HelpCircle } from 'lucide-react';
import { DynamicIcon } from '../common/IconPickerModal';

export default function MegaMenuProfil({ onClose, onNavigate, items = [] }) {
  const defaultProfileItems = [
    {
      title: 'Selayang Pandang BKPSDM',
      desc: 'Kilas perjalanan transformasi BKPSDM Aceh Tamiang dalam mewujudkan birokrasi ASN berkelas dunia.',
      route: '/page/selayang-pandang',
      renderIcon: () => (
        <svg viewBox="0 0 48 48" className="w-9 h-9" fill="none">
          <rect x="10" y="8" width="24" height="32" rx="4" fill="#0D9488" />
          <rect x="14" y="14" width="12" height="2.5" rx="1" fill="#CCFBF1" />
          <rect x="14" y="19" width="16" height="2.5" rx="1" fill="#CCFBF1" />
          <rect x="14" y="24" width="10" height="2.5" rx="1" fill="#CCFBF1" />
          <circle cx="28" cy="28" r="8" fill="#38BDF8" fillOpacity="0.4" stroke="#F59E0B" strokeWidth="3.5" />
          <path d="M34 34L42 42" stroke="#D97706" strokeWidth="4" strokeLinecap="round" />
        </svg>
      )
    },
    {
      title: 'Visi, Misi & Struktur Organisasi',
      desc: 'Cari tahu susunan pimpinan, tugas pokok fungsi tiap bidang, dan arah kebijakan SDM aparatur daerah.',
      route: '/page/visi-misi',
      renderIcon: () => (
        <svg viewBox="0 0 48 48" className="w-9 h-9" fill="none">
          <circle cx="24" cy="24" r="18" fill="#2563EB" />
          <path d="M12 36L18 30H30L36 36L24 33L12 36Z" fill="#F59E0B" />
          <circle cx="24" cy="16" r="3" fill="#FEF08A" />
          <rect x="22" y="21" width="4" height="10" rx="2" fill="#FFFFFF" />
        </svg>
      )
    },
    {
      title: 'Maklumat Pelayanan Kepegawaian',
      desc: 'Komitmen pelayanan prima BKPSDM yang transparan, tepat waktu, serta bebas biaya (Zero Pungli).',
      route: '/page/maklumat-pelayanan',
      renderIcon: () => (
        <svg viewBox="0 0 48 48" className="w-9 h-9" fill="none">
          <path d="M8 14C8 11.7909 9.79086 10 12 10H20L24 14H36C38.2091 14 40 15.7909 40 18V34C40 36.2091 38.2091 38 36 38H12C9.79086 38 8 36.2091 8 34V14Z" fill="#EA580C" />
          <rect x="14" y="14" width="20" height="12" rx="2" fill="#FFFFFF" />
          <rect x="16" y="17" width="12" height="2" fill="#3B82F6" />
          <path d="M6 20C6 18.8954 6.89543 18 8 18H40C41.1046 18 42 18.8954 42 20L39 36C39 37.1046 38.1046 38 37 38H11C9.89543 38 9 37.1046 9 36L6 20Z" fill="#F59E0B" />
        </svg>
      )
    },
    {
      title: 'Regulasi Kepegawaian & SOP',
      desc: 'Akses dan unduh Perbup, Surat Edaran Bupati, serta Standar Operasional Prosedur (SOP) layanan.',
      route: '/page/regulasi-kepegawaian-sop',
      renderIcon: () => (
        <svg viewBox="0 0 48 48" className="w-9 h-9" fill="none">
          <rect x="10" y="8" width="28" height="32" rx="3" fill="#4338CA" />
          <rect x="10" y="8" width="6" height="32" rx="1" fill="#312E81" />
          <path d="M24 14V30M18 30H30" stroke="#FACC15" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M17 18H31" stroke="#FACC15" strokeWidth="2" strokeLinecap="round" />
          <path d="M17 18L14 24H20L17 18Z" fill="#FDE047" />
          <path d="M31 18L28 24H34L31 18Z" fill="#FDE047" />
        </svg>
      )
    },
    {
      title: 'Kode Etik & Disiplin ASN',
      desc: 'Pedoman perilaku ASN BerAKHLAK dan tata cara pelaporan penegakan disiplin aparatur sipil negara.',
      route: '/page/kode-etik-disiplin-asn',
      renderIcon: () => (
        <svg viewBox="0 0 48 48" className="w-9 h-9" fill="none">
          <rect x="10" y="14" width="28" height="24" rx="4" fill="#059669" />
          <path d="M10 22H38" stroke="#047857" strokeWidth="3" />
          <rect x="18" y="8" width="12" height="8" rx="2" stroke="#F59E0B" strokeWidth="3" fill="none" />
          <circle cx="24" cy="30" r="5" fill="#FACC15" />
          <path d="M22 30L23.5 31.5L26 28.5" stroke="#052E16" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    },
    {
      title: 'Galeri Foto & Video ASN',
      desc: 'Dokumentasi visual kegiatan kedinasan, pelantikan, bimtek, serta video edukasi kepegawaian (YouTube, Reels, TikTok).',
      route: '/galeri',
      renderIcon: () => (
        <svg viewBox="0 0 48 48" className="w-9 h-9" fill="none">
          <rect x="8" y="10" width="32" height="28" rx="4" fill="#047857" />
          <circle cx="18" cy="20" r="4" fill="#FACC15" />
          <path d="M12 34L20 25L26 31L34 21L40 34H12Z" fill="#34D399" />
          <circle cx="34" cy="18" r="6" fill="#EF4444" />
          <path d="M33 15L37 18L33 21V15Z" fill="#FFFFFF" />
        </svg>
      )
    }
  ];

  const hasDynamic = items && items.length > 0;

  return (
    <div className="w-full bg-[#064e3b] text-white border-t border-emerald-700 shadow-2xl py-6 sm:py-8 px-4 sm:px-6 lg:px-12 transition-all max-h-[85vh] overflow-y-auto">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between border-b border-emerald-600/60 pb-4">
          <div>
            <h2 className="text-2xl font-black text-white tracking-tight">
              Profil BKPSDM Kabupaten Aceh Tamiang
            </h2>
            <p className="text-xs text-emerald-100 mt-0.5">
              Mengenal lebih dekat Badan Kepegawaian dan Pengembangan Sumber Daya Manusia
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
          {hasDynamic ? (
            items.map((menuItem) => {
              const route = menuItem.tipe === 'PAGE'
                ? (menuItem.page_slug ? `/page/${menuItem.page_slug}` : menuItem.url)
                : menuItem.url;
              const isExternal = menuItem.tipe === 'EXTERNAL' || (route && route.startsWith('http'));

              const CardContent = (
                <div className="flex items-start gap-3.5 p-3.5 rounded-2xl hover:bg-emerald-800/60 border border-transparent hover:border-emerald-600/50 transition-all group cursor-pointer w-full">
                  <div className="w-13 h-13 rounded-2xl bg-white flex items-center justify-center font-bold shrink-0 shadow-sm group-hover:scale-105 transition-transform p-1.5 text-emerald-800">
                    {menuItem.icon ? (
                      <DynamicIcon name={menuItem.icon} className="w-7 h-7 text-emerald-700" fallback={<Building2 className="w-7 h-7 text-emerald-700" />} />
                    ) : (
                      <Building2 className="w-7 h-7 text-emerald-700" />
                    )}
                  </div>
                  <div className="space-y-1 min-w-0 flex-1">
                    <h3 className="font-extrabold text-white text-sm group-hover:text-amber-300 transition-colors flex items-center gap-1.5 leading-snug truncate">
                      <span className="truncate">{menuItem.label}</span>
                      <ExternalLink className="w-3.5 h-3.5 opacity-60 text-amber-300 shrink-0" />
                    </h3>
                    <p className="text-xs text-emerald-100 leading-relaxed line-clamp-2">
                      {menuItem.deskripsi || menuItem.excerpt || 'Profil dan tata kelola kelembagaan BKPSDM Kabupaten Aceh Tamiang'}
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
            defaultProfileItems.map((item, idx) => (
              <Link
                key={idx}
                to={item.route}
                onClick={onClose}
                className="flex items-start gap-3.5 p-3.5 rounded-2xl hover:bg-emerald-800/60 border border-transparent hover:border-emerald-600/50 transition-all group cursor-pointer"
              >
                <div className="w-13 h-13 rounded-2xl bg-white flex items-center justify-center font-bold shrink-0 shadow-sm group-hover:scale-105 transition-transform p-1.5">
                  {item.renderIcon()}
                </div>
                <div className="space-y-1">
                  <h3 className="font-extrabold text-white text-sm group-hover:text-amber-300 transition-colors flex items-center gap-1.5 leading-snug">
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
