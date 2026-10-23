import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../../services/api';
import { useTheme } from '../../context/ThemeContext';
import { 
  Facebook, 
  Instagram, 
  Twitter, 
  Youtube, 
  MessageSquare, 
  Volume2, 
  Accessibility, 
  Timer,
  Clock,
  X,
  MapPin,
  Phone,
  Calendar,
  CheckCircle2
} from 'lucide-react';
import AccessibilityModal from './AccessibilityModal';

export default function FloatingActionBars() {
  const [isAccessibilityOpen, setIsAccessibilityOpen] = useState(false);
  const [isHoursModalOpen, setIsHoursModalOpen] = useState(false);
  const { currentTheme } = useTheme();

  // Fetch live web settings from CMS
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
  const isTemplateA = currentTheme === 'editorial' || settings.home_layout_mode === 'EDITORIAL';

  // Dynamic Theme Colors for Floating Buttons (Blue for Template A, Emerald for Template B)
  const socialBg = isTemplateA 
    ? 'bg-[#0f172a]/90 hover:bg-blue-600 text-white border-blue-400/30' 
    : 'bg-[#052e16]/85 hover:bg-amber-400 hover:text-slate-950 text-white border-emerald-700/50';

  const actionBtnClass = isTemplateA
    ? 'w-11 h-11 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center shadow-lg hover:scale-105 transition-all border border-blue-400/40 cursor-pointer group'
    : 'w-11 h-11 rounded-2xl bg-emerald-700 hover:bg-emerald-600 text-white flex items-center justify-center shadow-lg hover:scale-105 transition-all border border-emerald-600/50 cursor-pointer group';

  const actionIconClass = isTemplateA ? 'w-5 h-5 group-hover:scale-110 transition-transform text-white' : 'w-5 h-5 group-hover:scale-110 transition-transform text-amber-300';

  // Social media links & show/hide flags (defaults provided if not configured)
  const isSocialBarVisible = settings.show_social_floating !== 'false' && settings.show_social_floating !== false;
  const isAccessibilityBarVisible = settings.show_accessibility_floating !== 'false' && settings.show_accessibility_floating !== false;

  const socialLinks = [
    {
      key: 'facebook',
      icon: Facebook,
      href: settings.social_facebook || 'https://facebook.com',
      title: 'Facebook Resmi',
      show: settings.show_facebook !== 'false' && settings.show_facebook !== false
    },
    {
      key: 'instagram',
      icon: Instagram,
      href: settings.social_instagram || 'https://instagram.com',
      title: 'Instagram Resmi',
      show: settings.show_instagram !== 'false' && settings.show_instagram !== false
    },
    {
      key: 'twitter',
      icon: Twitter,
      href: settings.social_twitter || 'https://x.com',
      title: 'X / Twitter',
      show: settings.show_twitter !== 'false' && settings.show_twitter !== false
    },
    {
      key: 'youtube',
      icon: Youtube,
      href: settings.social_youtube || 'https://youtube.com',
      title: 'YouTube Official',
      show: settings.show_youtube !== 'false' && settings.show_youtube !== false
    }
  ].filter(s => s.show);

  const whatsappNumber = settings.social_whatsapp || '081269494591';
  const whatsappUrl = `https://wa.me/${whatsappNumber.replace(/^0/, '62').replace(/[^0-9]/g, '')}?text=Halo%20Admin,%20saya%20ingin%20konsultasi`;

  return (
    <>
      {/* 1. Left Social Media Float Bar (Manageable via Admin Panel) */}
      {isSocialBarVisible && socialLinks.length > 0 && (
        <div className="hidden lg:flex fixed left-4 top-1/2 -translate-y-1/2 z-40 flex-col gap-2.5 animate-in fade-in slide-in-from-left-4 duration-300">
          {socialLinks.map((item) => (
            <a
              key={item.key}
              href={item.href}
              target="_blank"
              rel="noreferrer"
              title={item.title}
              className={`w-10 h-10 rounded-xl flex items-center justify-center backdrop-blur-md transition-all shadow-md hover:scale-110 group cursor-pointer border ${socialBg}`}
            >
              <item.icon className="w-4 h-4 group-hover:scale-110 transition-transform" />
            </a>
          ))}
        </div>
      )}

      {/* 2. Right Accessibility & Quick Help Float Bar */}
      {isAccessibilityBarVisible && (
        <div className="hidden lg:flex fixed right-4 top-1/2 -translate-y-1/2 z-40 flex-col gap-2.5 animate-in fade-in slide-in-from-right-4 duration-300">
          
          {/* Button 1: WhatsApp Consultation */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
            aria-label="Konsultasi via WhatsApp"
            title="Konsultasi via WhatsApp"
            className={actionBtnClass}
          >
            <MessageSquare className={actionIconClass} />
          </a>

          {/* Button 2: Text to Speech (Tuna Netra Screen Reader) */}
          <button
            type="button"
            onClick={() => setIsAccessibilityOpen(true)}
            aria-label="Fitur Tuna Netra dan Pembaca Suara Layar"
            title="Fitur Tuna Netra / Pembaca Suara (Screen Reader)"
            className={actionBtnClass}
          >
            <Volume2 className={`${actionIconClass} animate-pulse`} />
          </button>

          {/* Button 3: Accessibility Hub */}
          <button
            type="button"
            onClick={() => setIsAccessibilityOpen(true)}
            aria-label="Pusat Aksesibilitas dan Ramah Disabilitas"
            title="Pusat Aksesibilitas & Ramah Disabilitas (WCAG 2.1)"
            className={actionBtnClass}
          >
            <Accessibility className={actionIconClass} />
          </button>

          {/* Button 4: Service Hours Modal */}
          <button
            type="button"
            onClick={() => setIsHoursModalOpen(true)}
            aria-label="Jadwal Jam Pelayanan Terpadu"
            title="Jadwal Jam Pelayanan Terpadu"
            className={actionBtnClass}
          >
            <Timer className={actionIconClass} />
          </button>
        </div>
      )}

      {/* Accessibility Modal Component */}
      <AccessibilityModal
        isOpen={isAccessibilityOpen}
        onClose={() => setIsAccessibilityOpen(false)}
      />

      {/* Service Hours Modal */}
      {isHoursModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl space-y-5 border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className={`p-2 rounded-xl text-white ${isTemplateA ? 'bg-blue-600' : 'bg-emerald-700'}`}>
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-base">Jadwal Pelayanan</h3>
                  <span className="text-[11px] text-slate-500">{settings.site_name || 'Portal Pelayanan Publik'}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsHoursModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-2xl flex items-center justify-between border border-slate-200">
                <span className="font-bold text-slate-700">Senin - Kamis</span>
                <span className={`font-black ${isTemplateA ? 'text-blue-700' : 'text-emerald-800'}`}>08:00 - 16:30 WIB</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-2xl flex items-center justify-between border border-slate-200">
                <span className="font-bold text-slate-700">Jumat</span>
                <span className={`font-black ${isTemplateA ? 'text-blue-700' : 'text-emerald-800'}`}>08:00 - 17:00 WIB</span>
              </div>
              <div className="p-3 bg-rose-50 rounded-2xl flex items-center justify-between border border-rose-200 text-rose-700 font-bold">
                <span>Sabtu, Minggu & Hari Libur</span>
                <span className="font-black">Tutup</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-500 leading-relaxed italic text-center">
              Layanan digital online dan konsultasi via WhatsApp tetap dapat diakses 24 jam.
            </p>

            <button
              type="button"
              onClick={() => setIsHoursModalOpen(false)}
              className={`w-full py-2.5 text-white font-bold rounded-xl transition-all cursor-pointer ${
                isTemplateA ? 'bg-blue-600 hover:bg-blue-700' : 'bg-emerald-800 hover:bg-emerald-700'
              }`}
            >
              Mengerti
            </button>
          </div>
        </div>
      )}
    </>
  );
}
