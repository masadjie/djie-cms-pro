import React from 'react';
import { X, ExternalLink } from 'lucide-react';

export default function MegaMenuPPID({ onClose, onNavigate }) {
  const ppidItems = [
    {
      title: 'Profil PPID BKPSDM',
      desc: 'Cari tahu tentang Profil PPID Pelaksana BKPSDM, Struktur Organisasi, Visi & Misi, dan SK Tim Pengelola Informasi.',
      href: 'https://bkpsdm.acehtamiangkab.go.id/tentang-ppid',
      renderIcon: () => (
        <svg viewBox="0 0 48 48" className="w-8 h-8" fill="none">
          <path d="M24 6L8 15H40L24 6Z" fill="#1E3A8A" />
          <rect x="11" y="18" width="4" height="16" rx="1" fill="#3B82F6" />
          <rect x="19" y="18" width="4" height="16" rx="1" fill="#3B82F6" />
          <rect x="27" y="18" width="4" height="16" rx="1" fill="#3B82F6" />
          <rect x="35" y="18" width="4" height="16" rx="1" fill="#3B82F6" />
          <rect x="8" y="34" width="32" height="6" rx="2" fill="#F59E0B" />
          <circle cx="24" cy="11" r="2" fill="#FEF08A" />
        </svg>
      )
    },
    {
      title: 'Alur Permohonan Informasi ASN',
      desc: 'Informasi seputar alur dan prosedur pengajuan permohonan informasi publik kepegawaian BKPSDM.',
      href: 'https://bkpsdm.acehtamiangkab.go.id/alur-informasi',
      renderIcon: () => (
        <svg viewBox="0 0 48 48" className="w-8 h-8" fill="none">
          <circle cx="24" cy="12" r="6" fill="#047857" />
          <circle cx="14" cy="34" r="6" fill="#2563EB" />
          <circle cx="34" cy="34" r="6" fill="#F59E0B" />
          <path d="M24 18V26M24 26L17 29M24 26L31 29" stroke="#EAB308" strokeWidth="3" strokeLinecap="round" />
          <circle cx="24" cy="26" r="2.5" fill="#EF4444" />
        </svg>
      )
    },
    {
      title: 'Permohonan Informasi Publik',
      desc: 'Ajukan permohonan informasi publik secara online kepada PPID Utama Kab. Aceh Tamiang.',
      href: 'https://ppid.acehtamiangkab.go.id/permohonan',
      renderIcon: () => (
        <svg viewBox="0 0 48 48" className="w-8 h-8" fill="none">
          <rect x="10" y="8" width="24" height="32" rx="3" fill="#2563EB" />
          <rect x="14" y="14" width="12" height="2" rx="1" fill="#BFDBFE" />
          <rect x="14" y="19" width="16" height="2" rx="1" fill="#BFDBFE" />
          <circle cx="32" cy="30" r="7" fill="#F59E0B" />
          <path d="M30 30L31.5 31.5L34.5 28.5" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    },
    {
      title: 'Pengajuan Keberatan',
      desc: 'Informasi dan tata cara pengajuan keberatan permohonan informasi kepada Atasan PPID Aceh Tamiang.',
      href: 'https://ppid.acehtamiangkab.go.id/keberatan',
      renderIcon: () => (
        <svg viewBox="0 0 48 48" className="w-8 h-8" fill="none">
          <circle cx="24" cy="24" r="16" fill="#EF4444" />
          <circle cx="24" cy="24" r="12" fill="#FEE2E2" />
          <rect x="22.5" y="14" width="3" height="11" rx="1.5" fill="#DC2626" />
          <circle cx="24" cy="29" r="2" fill="#DC2626" />
        </svg>
      )
    },
    {
      title: 'Informasi yang Wajib Tersedia Setiap Saat',
      desc: 'Informasi yang harus disediakan oleh Badan Publik dan siap tersedia apabila terdapat Permohonan Informasi.',
      href: 'https://ppid.acehtamiangkab.go.id/setiap-saat',
      renderIcon: () => (
        <svg viewBox="0 0 48 48" className="w-8 h-8" fill="none">
          <rect x="10" y="12" width="28" height="26" rx="4" fill="#059669" />
          <circle cx="24" cy="25" r="8" fill="#FEF08A" />
          <path d="M24 21V25L27 27" stroke="#065F46" strokeWidth="2" strokeLinecap="round" />
          <rect x="14" y="8" width="6" height="6" rx="1" fill="#F59E0B" />
          <rect x="28" y="8" width="6" height="6" rx="1" fill="#F59E0B" />
        </svg>
      )
    },
    {
      title: 'Informasi Publik Berkala',
      desc: 'Informasi yang wajib diperbaharui kemudian diumumkan ke publik secara rutin sekurang-kurangnya 6 bulan sekali.',
      href: 'https://ppid.acehtamiangkab.go.id/berkala',
      renderIcon: () => (
        <svg viewBox="0 0 48 48" className="w-8 h-8" fill="none">
          <rect x="8" y="12" width="32" height="28" rx="4" fill="#3B82F6" />
          <rect x="8" y="12" width="32" height="8" fill="#1D4ED8" />
          <circle cx="24" cy="28" r="7" fill="#FACC15" />
          <path d="M24 24V28L27 28" stroke="#78350F" strokeWidth="2" strokeLinecap="round" />
        </svg>
      )
    },
    {
      title: 'Informasi Publik Serta Merta',
      desc: 'Informasi berkaitan hajat hidup orang banyak dan ketertiban umum yang wajib diumumkan tanpa penundaan.',
      href: 'https://ppid.acehtamiangkab.go.id/serta-merta',
      renderIcon: () => (
        <svg viewBox="0 0 48 48" className="w-8 h-8" fill="none">
          <circle cx="24" cy="24" r="18" fill="#EA580C" />
          <path d="M14 26V20H20L28 14V32L20 26H14Z" fill="#FEF08A" />
          <path d="M32 18C34 20 34 26 32 28" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
        </svg>
      )
    },
    {
      title: 'Tata Cara Penyelesaian Sengketa',
      desc: 'Informasi tata cara penyelesaian sengketa informasi ke Komisi Informasi Aceh (KIA).',
      href: 'https://ppid.acehtamiangkab.go.id/sengketa',
      renderIcon: () => (
        <svg viewBox="0 0 48 48" className="w-8 h-8" fill="none">
          <rect x="10" y="8" width="28" height="32" rx="3" fill="#4338CA" />
          <path d="M24 14V30M18 30H30" stroke="#FACC15" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M17 18H31" stroke="#FACC15" strokeWidth="2" strokeLinecap="round" />
          <path d="M17 18L14 24H20L17 18Z" fill="#FDE047" />
          <path d="M31 18L28 24H34L31 18Z" fill="#FDE047" />
        </svg>
      )
    },
    {
      title: 'Tata Cara Pengaduan',
      desc: 'Informasi pengaduan penyalahgunaan wewenang atau pelanggaran yang dilakukan oleh Pejabat Badan Publik.',
      href: 'https://ppid.acehtamiangkab.go.id/pengaduan',
      renderIcon: () => (
        <svg viewBox="0 0 48 48" className="w-8 h-8" fill="none">
          <path d="M24 8L38 14V26C38 34 24 40 24 40C24 40 10 34 10 26V14L24 8Z" fill="#0D9488" />
          <circle cx="24" cy="22" r="4" fill="#FACC15" />
          <path d="M18 31C18 28 20.5 26 24 26C27.5 26 30 28 30 31" fill="#FACC15" />
        </svg>
      )
    },
    {
      title: 'Daftar Informasi Dikecualikan',
      desc: 'Daftar informasi yang tidak dapat diakses publik sebagaimana dimaksud dalam UU No 14 Tahun 2008 (KIP).',
      href: 'https://ppid.acehtamiangkab.go.id/dikecualikan',
      renderIcon: () => (
        <svg viewBox="0 0 48 48" className="w-8 h-8" fill="none">
          <path d="M24 6L38 12V24C38 32 24 38 24 38C24 38 10 32 10 24V12L24 6Z" fill="#991B1B" />
          <rect x="18" y="20" width="12" height="10" rx="2" fill="#FACC15" />
          <path d="M21 20V17C21 15.3431 22.3431 14 24 14C25.6569 14 27 15.3431 27 17V20" stroke="#FEF08A" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      )
    }
  ];

  return (
    <div className="w-full bg-[#15803d] text-white border-t border-emerald-600 shadow-2xl py-6 sm:py-8 px-4 sm:px-6 lg:px-12 transition-all max-h-[85vh] overflow-y-auto">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between border-b border-emerald-600/70 pb-4">
          <h2 className="text-2xl font-black text-white tracking-tight">
            Pejabat Pengelola Informasi & Dokumentasi (PPID)
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-emerald-800 text-white transition-colors cursor-pointer"
            title="Tutup Menu"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 pt-2 max-h-[520px] overflow-y-auto pr-2 custom-scrollbar">
          {ppidItems.map((item, idx) => (
            <a
              key={idx}
              href={item.href}
              target="_blank"
              rel="noreferrer"
              className="flex items-start gap-3.5 p-3 rounded-2xl hover:bg-emerald-800/60 transition-all group"
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
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
