import React from 'react';
import { Link } from 'react-router-dom';
import { X, ExternalLink, BarChart3, PieChart, Users, Network, FileSpreadsheet } from 'lucide-react';
import { DynamicIcon } from '../common/IconPickerModal';

export default function MegaMenuData({ onClose, onNavigate, items = [] }) {
  const hasDynamic = items && items.length > 0;

  return (
    <div className="w-full bg-[#064e3b] text-white border-t border-emerald-700 shadow-2xl py-6 sm:py-8 px-4 sm:px-6 lg:px-12 transition-all max-h-[85vh] overflow-y-auto">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between pb-5 border-b border-emerald-600/60">
          <div>
            <h3 className="text-2xl font-black text-white tracking-tight">
              Data & Statistik ASN Aceh Tamiang
            </h3>
            <p className="text-xs text-emerald-100 mt-0.5">
              Portal data terbuka, analisis bezetting formasi, dan transparansi manajemen kepegawaian daerah
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-emerald-200 hover:text-white hover:bg-emerald-800/80 transition-colors cursor-pointer"
            title="Tutup Menu"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {hasDynamic ? (
            items.map((menuItem) => {
              const route = menuItem.tipe === 'PAGE'
                ? (menuItem.page_slug ? `/page/${menuItem.page_slug}` : menuItem.url)
                : menuItem.url;
              const isExternal = menuItem.tipe === 'EXTERNAL' || (route && route.startsWith('http'));

              const CardContent = (
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-emerald-900/30 hover:bg-emerald-800/60 border border-emerald-700/40 hover:border-amber-400/40 transition-all group cursor-pointer w-full">
                  <div className="w-14 h-14 rounded-2xl bg-white shadow-md flex items-center justify-center shrink-0 p-2 group-hover:scale-105 transition-transform text-emerald-800">
                    {menuItem.icon ? (
                      <DynamicIcon name={menuItem.icon} className="w-8 h-8 text-emerald-700" fallback={<BarChart3 className="w-8 h-8 text-emerald-700" />} />
                    ) : (
                      <BarChart3 className="w-8 h-8 text-emerald-700" />
                    )}
                  </div>
                  <div className="space-y-1.5 min-w-0 flex-1">
                    <h4 className="font-extrabold text-white text-base group-hover:text-amber-300 transition-colors flex items-center gap-1.5 truncate">
                      <span className="truncate">{menuItem.label}</span>
                      <ExternalLink className="w-3.5 h-3.5 opacity-70 text-amber-300 shrink-0" />
                    </h4>
                    <p className="text-xs text-emerald-100/90 leading-relaxed line-clamp-2">
                      {menuItem.deskripsi || menuItem.excerpt || 'Data statistik dan visualisasi demografi aparatur sipil negara Aceh Tamiang'}
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
            <>
              {/* Item 1: Satu Data ASN Tamiang */}
              <a
                href="https://satudata.acehtamiangkab.go.id"
                target="_blank"
                rel="noreferrer"
                className="flex items-start gap-4 p-4 rounded-2xl bg-emerald-900/30 hover:bg-emerald-800/60 border border-emerald-700/40 hover:border-amber-400/40 transition-all group cursor-pointer"
              >
                <div className="w-14 h-14 rounded-2xl bg-white shadow-md flex items-center justify-center shrink-0 p-2 group-hover:scale-105 transition-transform">
                  <svg viewBox="0 0 48 48" className="w-10 h-10" fill="none">
                    <path d="M24 10L38 17L24 24L10 17L24 10Z" fill="#F59E0B" />
                    <path d="M10 21L24 28L38 21L38 24L24 31L10 24V21Z" fill="#10B981" />
                    <path d="M10 28L24 35L38 28L38 31L24 38L10 31V28Z" fill="#0284C7" />
                    <path d="M10 35L24 42L38 35L38 37L24 44L10 37V35Z" fill="#6366F1" />
                  </svg>
                </div>
                <div className="space-y-1.5">
                  <h4 className="font-extrabold text-white text-base group-hover:text-amber-300 transition-colors flex items-center gap-1.5">
                    <span>Satu Data ASN Tamiang</span>
                    <ExternalLink className="w-3.5 h-3.5 opacity-70 text-amber-300" />
                  </h4>
                  <p className="text-xs text-emerald-100/90 leading-relaxed">
                    Menyajikan dataset terbuka sebaran PNS & PPPK menurut OPD, tingkat pendidikan, jenjang jabatan, dan usia.
                  </p>
                </div>
              </a>

              {/* Item 2: Peta Jabatan & ANJAB (Coming Soon) */}
              <button
                type="button"
                onClick={() => onNavigate('/page/peta-jabatan-anjab')}
                className="flex items-start text-left gap-4 p-4 rounded-2xl bg-emerald-900/30 hover:bg-emerald-800/60 border border-emerald-700/40 hover:border-amber-400/40 transition-all group cursor-pointer w-full"
              >
                <div className="w-14 h-14 rounded-2xl bg-white shadow-md flex items-center justify-center shrink-0 p-2 group-hover:scale-105 transition-transform">
                  <svg viewBox="0 0 48 48" className="w-10 h-10" fill="none">
                    <circle cx="24" cy="18" r="11" fill="#3B82F6" />
                    <circle cx="24" cy="18" r="4.5" fill="#FFFFFF" />
                    <path d="M17 24L24 34L31 24H17Z" fill="#3B82F6" />
                    <ellipse cx="24" cy="38" rx="12" ry="4" fill="#F59E0B" />
                    <ellipse cx="24" cy="38" rx="7" ry="2" fill="#EF4444" />
                  </svg>
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <h4 className="font-extrabold text-white text-base group-hover:text-amber-300 transition-colors">
                      Peta Jabatan & ANJAB
                    </h4>
                    <span className="px-2 py-0.5 rounded-full bg-amber-400/20 border border-amber-400/60 text-[10px] font-black text-amber-300 tracking-wide uppercase">
                      Akan Hadir
                    </span>
                  </div>
                  <p className="text-xs text-emerald-100/90 leading-relaxed">
                    Peta bezetting formasi ASN, analisis beban kerja, dan proyeksi kebutuhan pegawai di lingkungan Pemkab Aceh Tamiang.
                  </p>
                </div>
              </button>

              {/* Item 3: Dashboard Statistik & Merit System */}
              <button
                type="button"
                onClick={() => onNavigate('/katalog?tab=statistik')}
                className="flex items-start text-left gap-4 p-4 rounded-2xl bg-emerald-900/30 hover:bg-emerald-800/60 border border-emerald-700/40 hover:border-amber-400/40 transition-all group cursor-pointer w-full"
              >
                <div className="w-14 h-14 rounded-2xl bg-white shadow-md flex items-center justify-center shrink-0 p-2 group-hover:scale-105 transition-transform">
                  <svg viewBox="0 0 48 48" className="w-10 h-10" fill="none">
                    <path d="M14 14C14 20.6274 19.3726 26 26 26H26V14H14Z" fill="#FACC15" />
                    <path d="M26 22C26 28.6274 31.3726 34 38 34V22H26Z" fill="#3B82F6" />
                    <rect x="14" y="28" width="10" height="10" rx="5" fill="#10B981" />
                  </svg>
                </div>
                <div className="space-y-1.5">
                  <h4 className="font-extrabold text-white text-base group-hover:text-amber-300 transition-colors">
                    Dashboard Merit System
                  </h4>
                  <p className="text-xs text-emerald-100/90 leading-relaxed">
                    Menyajikan metrik capaian Indeks Profesionalitas ASN (IP-ASN), kepatuhan e-Kinerja BKN, dan disiplin presensi.
                  </p>
                </div>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
