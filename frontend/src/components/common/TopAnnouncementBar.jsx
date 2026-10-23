import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../../services/api';
import { Megaphone, ChevronRight, X, Sparkles } from 'lucide-react';

export default function TopAnnouncementBar() {
  const [dismissed, setDismissed] = useState(() => {
    return sessionStorage.getItem('dismissed_top_announcement') === 'true';
  });

  const { data: settingsData } = useQuery({
    queryKey: ['cmsWebSettings'],
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
  const isEnabled = settings.flash_announcement_enabled === 'true';
  const text = settings.flash_announcement_text || 'Pengumuman Resmi: Periode Kenaikan Pangkat ASN & Pemutakhiran Data MyASN 2026 Sedang Berlangsung.';
  const link = settings.flash_announcement_link || '/berita';
  const linkText = settings.flash_announcement_link_text || 'Lihat Rincian';
  const variant = settings.flash_announcement_variant || 'amber'; // 'amber' | 'emerald' | 'rose'

  if (!isEnabled || dismissed) return null;

  const bgClasses = {
    amber: 'bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 text-slate-950 border-amber-400/80',
    emerald: 'bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 text-white border-emerald-600',
    rose: 'bg-gradient-to-r from-rose-700 via-rose-600 to-red-700 text-white border-rose-500'
  }[variant] || 'bg-amber-400 text-slate-950 border-amber-300';

  const handleDismiss = () => {
    setDismissed(true);
    sessionStorage.setItem('dismissed_top_announcement', 'true');
  };

  return (
    <div className={`relative z-50 w-full py-2 px-3 sm:px-6 text-xs font-bold border-b transition-all shadow-sm ${bgClasses}`}>
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 truncate flex-1">
          <span className="p-1 rounded-lg bg-black/10 shrink-0">
            <Megaphone className="w-3.5 h-3.5 animate-pulse" />
          </span>
          <span className="truncate text-[11px] sm:text-xs">
            {text}
          </span>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {link && (
            <a
              href={link}
              className="inline-flex items-center gap-1 text-[11px] underline underline-offset-2 hover:opacity-80 transition-opacity font-extrabold"
            >
              <span>{linkText}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </a>
          )}
          <button
            type="button"
            onClick={handleDismiss}
            className="p-1 rounded-lg hover:bg-black/10 transition-colors cursor-pointer"
            title="Tutup Pengumuman"
            aria-label="Tutup"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
