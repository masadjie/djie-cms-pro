import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import { useTheme } from '../context/ThemeContext';
import { 
  ExternalLink, 
  Mail, 
  Phone, 
  MapPin, 
  Sparkles, 
  Globe, 
  ArrowUpRight,
  ShieldCheck,
  Send,
  MessageCircle,
  Instagram,
  Youtube,
  Facebook
} from 'lucide-react';

export default function Footer() {
  const { currentTheme } = useTheme();

  // Fetch Web Settings (kontak, sosmed, email, dsb)
  const { data: settingsData } = useQuery({
    queryKey: ['cmsWebSettingsFooter'],
    queryFn: async () => {
      try {
        const res = await api.get('/cms/pengaturan');
        return res?.data || res || {};
      } catch (err) {
        return {};
      }
    },
    staleTime: 300000
  });

  const settings = settingsData || {};
  const isTemplateA = currentTheme === 'editorial' || settings.home_layout_mode === 'EDITORIAL';

  const phone = settings.kontak_telepon || settings.telepon || '0812-6949-4591';
  const email = settings.kontak_email || settings.email || 'redaksi@djiecms.com';
  const wa = (settings.kontak_wa || settings.social_whatsapp || '081269494591').replace(/[^0-9]/g, '');

  return (
    <footer className={`w-full bg-white border-t border-slate-100 text-slate-600 ${
      isTemplateA ? 'mt-4 sm:mt-6' : 'mt-16 sm:mt-24'
    }`}>
      {/* ── TOP HIGHLIGHT BANNER: Floating Clean Curved Container ── */}
      <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${
        isTemplateA ? '-translate-y-4 sm:-translate-y-6' : '-translate-y-8 sm:-translate-y-12'
      }`}>
        <div className={`relative overflow-hidden rounded-3xl text-white p-8 sm:p-12 shadow-xl ${
          isTemplateA 
            ? 'bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 shadow-blue-900/15'
            : 'bg-gradient-to-br from-[#064e3b] via-[#052e16] to-slate-900 shadow-emerald-950/20'
        }`}>
          
          {/* Subtle Organic Background Vector Elements */}
          <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-white/10 blur-2xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-sky-400/20 blur-2xl pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="space-y-3 max-w-2xl text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/15 backdrop-blur-xs text-blue-100 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Pelayanan Terpadu & Responsif</span>
              </div>
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white leading-tight">
                {settings.footer_cta_heading || (isTemplateA ? 'Pusat Informasi & Pelayanan Publik Terpadu' : settings.site_tagline || 'Pusat Informasi & Layanan Terpadu')}
              </h3>
              <p className="text-xs sm:text-sm text-blue-100/90 leading-relaxed font-normal">
                {settings.footer_cta_sub || 'Punya pertanyaan atau memerlukan pendampingan informasi? Hubungi tim helpdesk kami.'}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full sm:w-auto">
              <a
                href={`https://wa.me/62${wa.replace(/^0/, '')}?text=Halo%20Helpdesk,%20saya%20ingin%20berkonsultasi`}
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl bg-white text-slate-900 text-xs font-bold hover:bg-slate-50 transition-all shadow-md hover:shadow-lg active:scale-95 cursor-pointer"
              >
                <MessageCircle className={`w-4 h-4 ${isTemplateA ? 'text-blue-600' : 'text-emerald-700'}`} />
                <span>Hubungi Helpdesk WA</span>
              </a>

              <Link
                to="/katalog"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/20 transition-all cursor-pointer"
              >
                <span>Eksplor Katalog Layanan</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ── MAIN FOOTER CONTENT: Clean Light Aesthetic ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-2 pb-14 sm:pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
          
          {/* Brand & Organization Identity (Col 1-4) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 shadow-xs flex items-center justify-center p-1 overflow-hidden shrink-0">
                <img
                  src={settings.site_logo || "/logo-djie-cms-pro-square.png"}
                  alt={settings.site_name || "Logo Instansi"}
                  width="42"
                  height="42"
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    e.target.src = '/logo-djie-cms-pro-square.png';
                  }}
                />
              </div>
              <div>
                <span className="font-extrabold text-base text-slate-900 leading-tight block">
                  {settings.site_name || 'Djie CMS Pro'}
                </span>
                <span className={`text-xs font-semibold block ${isTemplateA ? 'text-blue-600 font-bold' : 'text-amber-600'}`}>
                  {settings.instansi_name || 'Portal Resmi Publikasi'}
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed pr-4">
              {settings.site_description || 'Portal resmi penyebaran berita terverifikasi, keterbukaan informasi, dan transformasi digital yang melayani publik secara transparan dan terpercaya.'}
            </p>

            {/* Social Media Link Pills */}
            <div className="flex items-center gap-2.5 pt-2">
              <a
                href={settings.social_youtube || "https://youtube.com"}
                target="_blank"
                rel="noreferrer"
                aria-label="YouTube"
                className="w-9 h-9 rounded-full bg-slate-100 hover:bg-red-50 text-slate-500 hover:text-red-600 flex items-center justify-center transition-all cursor-pointer border border-slate-200/60"
              >
                <Youtube className="w-4 h-4" />
              </a>
              <a
                href={settings.social_instagram || "https://instagram.com"}
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="w-9 h-9 rounded-full bg-slate-100 hover:bg-pink-50 text-slate-500 hover:text-pink-600 flex items-center justify-center transition-all cursor-pointer border border-slate-200/60"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href={settings.social_facebook || "https://facebook.com"}
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="w-9 h-9 rounded-full bg-slate-100 hover:bg-blue-50 text-slate-500 hover:text-blue-600 flex items-center justify-center transition-all cursor-pointer border border-slate-200/60"
              >
                <Facebook className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links: Layanan & Informasi (Col 5-6) */}
          <div className="lg:col-span-2 space-y-3.5">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              {isTemplateA ? 'Navigasi Cepat' : 'Layanan ASN'}
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <Link to="/berita" className={`text-slate-600 transition-colors ${isTemplateA ? 'hover:text-blue-600' : 'hover:text-emerald-700'}`}>
                  Berita & Artikel
                </Link>
              </li>
              <li>
                <Link to="/katalog" className={`text-slate-600 transition-colors ${isTemplateA ? 'hover:text-blue-600' : 'hover:text-emerald-700'}`}>
                  Katalog Layanan
                </Link>
              </li>
              <li>
                <Link to="/galeri" className={`text-slate-600 transition-colors ${isTemplateA ? 'hover:text-blue-600' : 'hover:text-emerald-700'}`}>
                  Galeri & Video
                </Link>
              </li>
              <li>
                <Link to="/login" className={`text-slate-600 transition-colors ${isTemplateA ? 'hover:text-blue-600' : 'hover:text-emerald-700'}`}>
                  Masuk Redaksi
                </Link>
              </li>
            </ul>
          </div>

          {/* Ecosystem BKN & Eksternal (Col 7-9) */}
          <div className="lg:col-span-3 space-y-3.5">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Ekosistem Terintegrasi
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <a
                  href={settings.url_sikepo || "https://sikepo.acehtamiangkab.go.id"}
                  target="_blank"
                  rel="noreferrer"
                  className={`text-slate-600 inline-flex items-center gap-1 transition-colors ${isTemplateA ? 'hover:text-blue-600' : 'hover:text-emerald-700'}`}
                >
                  <span>SiKEPO Mobile v2.0</span>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </a>
              </li>
              <li>
                <a
                  href={settings.url_siasn || "https://siasn.bkn.go.id"}
                  target="_blank"
                  rel="noreferrer"
                  className={`text-slate-600 inline-flex items-center gap-1 transition-colors ${isTemplateA ? 'hover:text-blue-600' : 'hover:text-emerald-700'}`}
                >
                  <span>SIASN BKN Pusat</span>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </a>
              </li>
              <li>
                <a
                  href={settings.url_myasn || "https://myasn.bkn.go.id"}
                  target="_blank"
                  rel="noreferrer"
                  className={`text-slate-600 inline-flex items-center gap-1 transition-colors ${isTemplateA ? 'hover:text-blue-600' : 'hover:text-emerald-700'}`}
                >
                  <span>MyASN Pemutakhiran Data</span>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </a>
              </li>
              <li>
                <a
                  href={settings.url_ekinerja || "https://kinerja.bkn.go.id"}
                  target="_blank"
                  rel="noreferrer"
                  className={`text-slate-600 inline-flex items-center gap-1 transition-colors ${isTemplateA ? 'hover:text-blue-600' : 'hover:text-emerald-700'}`}
                >
                  <span>e-Kinerja BKN RI</span>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </a>
              </li>
            </ul>
          </div>

          {/* Contact & Office Address (Col 10-12) */}
          <div className="lg:col-span-3 space-y-3.5">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Kontak & Alamat Kantor
            </h4>
            <div className="space-y-2.5 text-xs text-slate-600">
              <div className="flex items-start gap-2.5">
                <MapPin className={`w-4 h-4 shrink-0 mt-0.5 ${isTemplateA ? 'text-blue-600' : 'text-emerald-600'}`} />
                <div className="space-y-0.5">
                  <p className="leading-relaxed">
                    {settings.kantor_alamat || 'Jl. Ir. H. Juanda No. 1, Komplek Perkantoran Pemkab Aceh Tamiang, Karang Baru'}
                  </p>
                  <a
                    href={settings.kantor_gmaps_url || "https://maps.google.com/?q=BKPSDM+Kabupaten+Aceh+Tamiang"}
                    target="_blank"
                    rel="noreferrer"
                    className={`font-semibold inline-flex items-center gap-1 text-[11px] pt-0.5 hover:underline ${
                      isTemplateA ? 'text-blue-600' : 'text-emerald-700'
                    }`}
                  >
                    <span>Buka Peta Google Maps</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-2.5 pt-1">
                <Phone className={`w-4 h-4 shrink-0 ${isTemplateA ? 'text-blue-600' : 'text-emerald-600'}`} />
                <span>Call Center: {phone}</span>
              </div>

              <div className="flex items-center gap-2.5">
                <Mail className={`w-4 h-4 shrink-0 ${isTemplateA ? 'text-blue-600' : 'text-emerald-600'}`} />
                <span className="truncate">{email}</span>
              </div>
            </div>
          </div>

        </div>

        {/* ── BOTTOM COPYRIGHT & ATTRIBUTION BAR ── */}
        <div className="mt-12 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 {settings.site_name || 'Djie CMS Pro'}. All rights reserved.</p>

          <div className="flex items-center gap-3">
            <span className="text-[11px] text-slate-400">
              Dikembangkan dengan <span className="font-semibold text-slate-700">DJIE CMS PRO</span>
            </span>
            <span className="text-slate-300">•</span>
            <span className="font-semibold text-slate-600">
              Open Source by Adjie Kurniawan
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
}
