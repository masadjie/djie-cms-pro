import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../../services/api';
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

  // Social media links & show/hide flags (defaults provided if not configured)
  const isSocialBarVisible = settings.show_social_floating !== 'false' && settings.show_social_floating !== false;
  const isAccessibilityBarVisible = settings.show_accessibility_floating !== 'false' && settings.show_accessibility_floating !== false;

  const socialLinks = [
    {
      key: 'facebook',
      icon: Facebook,
      href: settings.social_facebook || 'https://facebook.com/bkpsdmatam',
      title: 'Facebook BKPSDM',
      show: settings.show_facebook !== 'false' && settings.show_facebook !== false
    },
    {
      key: 'instagram',
      icon: Instagram,
      href: settings.social_instagram || 'https://instagram.com/bkpsdm_acehtamiang',
      title: 'Instagram Resmi',
      show: settings.show_instagram !== 'false' && settings.show_instagram !== false
    },
    {
      key: 'twitter',
      icon: Twitter,
      href: settings.social_twitter || 'https://x.com/bkpsdmatam',
      title: 'X / Twitter',
      show: settings.show_twitter !== 'false' && settings.show_twitter !== false
    },
    {
      key: 'youtube',
      icon: Youtube,
      href: settings.social_youtube || 'https://www.youtube.com/@asnatam?si=YDmlZ8BoP9MefuHs',
      title: 'YouTube Official',
      show: settings.show_youtube !== 'false' && settings.show_youtube !== false
    }
  ].filter(s => s.show);

  const whatsappNumber = settings.social_whatsapp || '081168814767';
  const whatsappUrl = `https://wa.me/${whatsappNumber.replace(/^0/, '62').replace(/[^0-9]/g, '')}?text=Halo%20Admin%20BKPSDM%20Aceh%20Tamiang,%20saya%20ingin%20konsultasi%20layanan%20kepegawaian`;

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
              className="w-10 h-10 rounded-xl bg-[#052e16]/85 hover:bg-amber-400 hover:text-slate-950 text-white flex items-center justify-center backdrop-blur-md border border-emerald-700/50 transition-all shadow-md hover:scale-110 group cursor-pointer"
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
            aria-label="Konsultasi ASN via WhatsApp"
            title="Konsultasi ASN via WhatsApp"
            className="w-11 h-11 rounded-2xl bg-emerald-700 hover:bg-emerald-600 text-white flex items-center justify-center shadow-lg hover:scale-105 transition-all border border-emerald-600/50 cursor-pointer group"
          >
            <MessageSquare className="w-5 h-5 group-hover:scale-110 transition-transform text-amber-300" />
          </a>

          {/* Button 2: Text to Speech (Tuna Netra Screen Reader) */}
          <button
            type="button"
            onClick={() => setIsAccessibilityOpen(true)}
            aria-label="Fitur Tuna Netra dan Pembaca Suara Layar"
            title="Fitur Tuna Netra / Pembaca Suara (Screen Reader)"
            className="w-11 h-11 rounded-2xl bg-emerald-700 hover:bg-emerald-600 text-white flex items-center justify-center shadow-lg hover:scale-105 transition-all border border-emerald-600/50 cursor-pointer group"
          >
            <Volume2 className="w-5 h-5 group-hover:scale-110 transition-transform text-amber-300 animate-pulse" />
          </button>

          {/* Button 3: Accessibility Hub */}
          <button
            type="button"
            onClick={() => setIsAccessibilityOpen(true)}
            aria-label="Pusat Aksesibilitas dan Ramah Disabilitas"
            title="Pusat Aksesibilitas & Ramah Disabilitas (WCAG 2.1)"
            className="w-11 h-11 rounded-2xl bg-emerald-700 hover:bg-amber-400 hover:text-slate-950 text-white flex items-center justify-center shadow-lg hover:scale-105 transition-all border border-emerald-600/50 cursor-pointer group"
          >
            <Accessibility className="w-5 h-5 group-hover:scale-110 transition-transform" />
          </button>

          {/* Button 4: Service Hours Modal */}
          <button
            type="button"
            onClick={() => setIsHoursModalOpen(true)}
            aria-label="Jadwal Jam Pelayanan Terpadu BKPSDM"
            title="Jadwal Jam Pelayanan Terpadu BKPSDM"
            className="w-11 h-11 rounded-2xl bg-emerald-700 hover:bg-emerald-600 text-white flex items-center justify-center shadow-lg hover:scale-105 transition-all border border-emerald-600/50 cursor-pointer group"
          >
            <Timer className="w-5 h-5 group-hover:scale-110 transition-transform text-amber-300" />
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
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center shadow-xs">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 leading-tight">
                    Jam Pelayanan Terpadu
                  </h3>
                  <p className="text-xs text-slate-500">BKPSDM Kabupaten Aceh Tamiang</p>
                </div>
              </div>
              <button
                onClick={() => setIsHoursModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
                <div className="flex items-center justify-between font-bold text-slate-800">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-emerald-700" />
                    <span>Senin &ndash; Kamis</span>
                  </span>
                  <span className="font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                    08.00 &ndash; 16.30 WIB
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 pl-5">Istirahat: 12.30 &ndash; 13.30 WIB</p>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
                <div className="flex items-center justify-between font-bold text-slate-800">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-emerald-700" />
                    <span>Jumat</span>
                  </span>
                  <span className="font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                    08.00 &ndash; 16.00 WIB
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 pl-5">Istirahat & Shalat Jumat: 12.00 &ndash; 14.00 WIB</p>
              </div>

              <div className="p-3.5 bg-emerald-950 text-white rounded-2xl space-y-1.5">
                <div className="flex items-center gap-2 text-amber-300 font-bold">
                  <MapPin className="w-4 h-4" />
                  <span>Lokasi Kantor Pelayanan:</span>
                </div>
                <p className="text-[11px] text-emerald-100 leading-relaxed">
                  Kompleks Perkantoran Pemerintah Kabupaten Aceh Tamiang, Jl. Ir. H. Juanda No. 1, Karang Baru.
                </p>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setIsHoursModalOpen(false)}
                className="w-full py-2.5 bg-emerald-800 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow transition-all cursor-pointer"
              >
                Tutup Informasi
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
