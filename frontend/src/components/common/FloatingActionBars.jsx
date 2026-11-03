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
import WaRequestPublicationModal from './WaRequestPublicationModal';

export default function FloatingActionBars() {
  const [isAccessibilityOpen, setIsAccessibilityOpen] = useState(false);
  const [isHoursModalOpen, setIsHoursModalOpen] = useState(false);
  const [isWaModalOpen, setIsWaModalOpen] = useState(false);
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

  const whatsappNumber = settings.kontak_wa || settings.social_whatsapp || settings.contact_phone || '081168814767';

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
          
          {/* Button 1: WhatsApp Consultation & Request Publication Modal */}
          <button
            type="button"
            onClick={() => setIsWaModalOpen(true)}
            aria-label="Request Penerbitan Berita/Artikel/Medsos ASN Aceh Tamiang"
            title="Request Penerbitan Berita/Artikel/Medsos ASN Aceh Tamiang"
            className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white flex items-center justify-center shadow-lg hover:scale-105 transition-all border border-emerald-400/50 cursor-pointer group"
          >
            {/* WhatsApp Icon */}
            <svg className="w-5 h-5 fill-current group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-5.805 1.554zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
            </svg>
          </button>

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

      {/* Wa Request Publication Modal */}
      <WaRequestPublicationModal
        isOpen={isWaModalOpen}
        onClose={() => setIsWaModalOpen(false)}
        destinationPhone={whatsappNumber}
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
