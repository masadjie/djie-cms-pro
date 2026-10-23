import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../../services/api';
import { 
  ArrowRight, 
  ExternalLink,
  ChevronRight, 
  Sparkles, 
  Calendar, 
  MessageCircle, 
  Phone, 
  HelpCircle,
  MapPin,
  Clock,
  ShieldCheck,
  CheckCircle2,
  TrendingUp,
  FileText,
  UserCheck,
  Laptop,
  Flame,
  Award,
  Layers,
  FileCheck2,
  Headphones,
  Compass,
  ArrowUpRight,
  Activity,
  Users
} from 'lucide-react';

export default function BannerSikepoSection() {
  const [activeTab, setActiveTab] = useState('stats'); // 'stats' | 'agenda' | 'help'

  // 1. Fetch Real Upcoming Agendas from Database
  const { data: agendaData } = useQuery({
    queryKey: ['homeAgendaFlashInfo'],
    queryFn: async () => {
      try {
        const res = await api.get('/cms/agenda');
        const items = Array.isArray(res?.data) ? res.data : (Array.isArray(res) ? res : []);
        return items
          .filter(a => a.is_active !== false && a.is_active !== 0)
          .sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime());
      } catch (err) {
        return [];
      }
    }
  });

  // 2. Fetch Live Web Settings & Widgets from Database
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

  // 3. Fetch Live Visitor Analytics
  const { data: statsData } = useQuery({
    queryKey: ['portalPublicStats'],
    queryFn: async () => {
      try {
        const res = await api.get('/master/stats');
        return res?.data || res || null;
      } catch (err) {
        return null;
      }
    },
    staleTime: 60000,
    refetchInterval: 120000
  });

  // 4. Fetch Live Promo / Highlight Banners from CMS
  const { data: bannersData } = useQuery({
    queryKey: ['homePromoBanners'],
    queryFn: async () => {
      try {
        const res = await api.get('/cms/banner');
        const list = Array.isArray(res?.data) ? res.data : (Array.isArray(res) ? res : []);
        return list.filter(b => 
          (b.tipe === 'PROMO_BANNER' || b.tipe === 'SIKEPO_BANNER') && 
          (b.is_active === true || b.is_active === 1 || b.is_active === 'true')
        ).sort((a, b) => (a.urutan || 1) - (b.urutan || 1));
      } catch (err) {
        return [];
      }
    }
  });

  const settings = settingsData || {};
  const agendasList = Array.isArray(agendaData) ? agendaData : [];
  const upcomingAgenda = agendasList.length > 0 ? agendasList[0] : null;

  const visitor = statsData?.pengunjung || {
    total: 2450,
    hariIni: 142,
    bulanIni: 1890,
    online: 3
  };

  const phoneDisplay = settings.kontak_telepon || settings.telepon || '0811-6881-4767';
  const waNumber = (settings.kontak_wa || settings.whatsapp || '081168814767').replace(/[^0-9]/g, '');

  // Widget settings
  const showVisitorWidget = settings.widget_visitor_active !== 'false' && settings.widget_visitor_active !== false;
  const showAgendaWidget = settings.widget_agenda_active !== 'false' && settings.widget_agenda_active !== false;
  const showCustomWidget = settings.widget_custom_active === 'true';

  // Section Header Settings (Dynamic from Widget & Web Settings)
  const isSectionActive = settings.section_promo_active !== 'false' && settings.section_promo_active !== false;
  const sectionTitle = settings.section_promo_title || 'Satu Pintu Layanan Digital Karir ASN';
  const sectionDesc = settings.section_promo_desc || 'Integrasi terpadu SiKEPO Kabupaten Aceh Tamiang dengan ekosistem BKN RI untuk pelayanan kenaikan pangkat, e-Kinerja, dan mutasi tanpa hambatan.';

  // If entire section is disabled by admin, don't render
  if (!isSectionActive) {
    return null;
  }

  // Get dynamic promo banners from database (fallback to default flagship if empty)
  const promoBanners = Array.isArray(bannersData) ? bannersData : [];
  const mainBanner = promoBanners[0] || null;
  const secondaryBanners = promoBanners.slice(1, 3);

  return (
    <section className="w-full px-4 sm:px-6 lg:px-12 pt-14 sm:pt-20 pb-12 sm:pb-16 bg-[#f8faf9]/80 border-t border-slate-100/60">
      <div className="max-w-7xl mx-auto space-y-10 sm:space-y-12">
        
        {/* Section Header (100% Dynamic from CMS Settings) */}
        <div className="text-center max-w-2xl mx-auto space-y-2.5">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
            {sectionTitle}
          </h2>
          {sectionDesc && (
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {sectionDesc}
            </p>
          )}
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* LEFT 8 COLS: 3 Main Ecosystem Platforms / Dynamic Promo Banners */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            
            {/* Top Large Hero Card: Dynamic from Banner Database (Fallback to SiKEPO default) */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm hover:shadow-md transition-all relative overflow-hidden flex flex-col justify-between">
              
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 z-10">
                <div className="space-y-4 max-w-xl">
                  {/* Banner / Organization Logo */}
                  <div className="flex items-center gap-3">
                    <img 
                      src={mainBanner?.gambar_url || "/logo-sikepo.webp"} 
                      alt={mainBanner?.judul || "Logo Banner"} 
                      width="180"
                      height="48"
                      className="h-10 sm:h-12 w-auto max-w-[200px] object-contain drop-shadow-xs"
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.src = "/logo-sikepo.webp";
                      }}
                    />
                  </div>

                  <h3 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 leading-tight">
                    {mainBanner?.judul || 'SiKEPO (Sistem Kepegawaian Online)'}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                    {mainBanner?.subjudul || 'Sistem resmi pengelolaan administrasi ASN Pemkab Aceh Tamiang. Akses pengusulan Kenaikan Pangkat, Izin Belajar, E-Cuti, dan SK Pensiun secara mandiri.'}
                  </p>

                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <a
                      href={mainBanner?.target_url || "https://sikepo.acehtamiangkab.go.id"}
                      target={mainBanner?.target_url?.startsWith('http') ? "_blank" : "_self"}
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 sm:py-3 bg-emerald-800 hover:bg-emerald-900 active:scale-95 text-white font-black rounded-2xl text-xs sm:text-sm shadow-md hover:shadow-emerald-900/20 transition-all group"
                    >
                      <span>{mainBanner ? 'Kunjungi Layanan' : 'Buka SiKEPO Online'}</span>
                      <ArrowUpRight className="w-4 h-4 text-amber-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </a>

                    <Link
                      to="/katalog"
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 sm:py-3 bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-800 font-bold rounded-2xl text-xs sm:text-sm border border-slate-200 transition-all"
                    >
                      <span>Katalog SOP Layanan</span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-600" />
                    </Link>
                  </div>
                </div>

                {/* Prominent Logo Badge for desktop/tablet */}
                <div className="hidden sm:flex flex-col items-center justify-center p-4 rounded-2xl bg-slate-50 border border-slate-100/90 shadow-2xs shrink-0 self-center">
                  <img 
                    src={mainBanner?.gambar_url || "/logo-sikepo.webp"} 
                    alt="Logo Banner Utama" 
                    width="208"
                    height="64"
                    loading="lazy"
                    className="w-44 sm:w-52 h-auto max-h-24 object-contain hover:scale-105 transition-transform"
                    onError={(e) => {
                      e.currentTarget.src = "/logo-sikepo.webp";
                    }}
                  />
                  <span className="text-[10px] font-bold text-slate-400 mt-2">Versi Resmi 2.0</span>
                </div>
              </div>

              {/* Sub-status bar */}
              <div className="mt-6 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>Domain / Akses: <strong className="text-slate-800 font-bold">{mainBanner?.target_url || 'sikepo.acehtamiangkab.go.id'}</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200/60 px-3 py-1 rounded-full text-[11px]">
                    Terintegrasi MyASN & SIASN
                  </span>
                </div>
              </div>

            </div>

            {/* Bottom 2 Split Cards: Dynamic Secondary Banners (Fallback to ASN Digital & E-Kinerja) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              {/* Card 2: Dynamic / Fallback ASN Digital */}
              {secondaryBanners[0] ? (
                <a
                  href={secondaryBanners[0].target_url || '#'}
                  target={secondaryBanners[0].target_url?.startsWith('http') ? '_blank' : '_self'}
                  rel="noreferrer"
                  className="group bg-white hover:bg-slate-50/80 rounded-3xl p-6 border border-slate-200/90 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="w-full h-24 bg-gradient-to-br from-blue-50 to-indigo-50/60 rounded-2xl p-3 border border-blue-100/80 flex items-center justify-between mb-4 relative overflow-hidden group-hover:scale-[1.01] transition-transform">
                      <div className="bg-white rounded-xl px-3 py-1.5 shadow-sm border border-slate-100 flex items-center gap-2.5 max-w-[80%]">
                        <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center p-1 shrink-0 overflow-hidden">
                          <img 
                            src={secondaryBanners[0].gambar_url || "/logo-bkn.png"} 
                            alt={secondaryBanners[0].judul} 
                            className="w-full h-full object-contain filter drop-shadow-2xs" 
                            onError={(e) => { e.currentTarget.src = "/logo-bkn.png"; }}
                          />
                        </div>
                        <div className="text-left truncate">
                          <span className="text-[10px] text-slate-400 block font-semibold leading-tight">Layanan Prioritas</span>
                          <span className="text-xs font-black text-slate-800 leading-tight truncate block">{secondaryBanners[0].judul}</span>
                        </div>
                      </div>
                      <div className="p-2 rounded-xl bg-blue-600 text-white shadow-sm shrink-0">
                        <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black text-blue-700 uppercase tracking-wider bg-blue-50 px-2 py-0.5 rounded-md">
                          Sorotan
                        </span>
                        <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 transition-colors" />
                      </div>
                      <h4 className="text-base font-black text-slate-900 pt-1 group-hover:text-blue-700 transition-colors line-clamp-1">
                        {secondaryBanners[0].judul}
                      </h4>
                      <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                        {secondaryBanners[0].subjudul || 'Kunjungi tautan resmi layanan informasi dan portal terpadu.'}
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-blue-700">
                    <span className="truncate max-w-[220px]">Buka Tautan</span>
                    <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform shrink-0" />
                  </div>
                </a>
              ) : (
                <a
                  href="https://asndigital.bkn.go.id"
                  target="_blank"
                  rel="noreferrer"
                  className="group bg-white hover:bg-slate-50/80 rounded-3xl p-6 border border-slate-200/90 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="w-full h-24 bg-gradient-to-br from-blue-50 to-indigo-50/60 rounded-2xl p-3 border border-blue-100/80 flex items-center justify-between mb-4 relative overflow-hidden group-hover:scale-[1.01] transition-transform">
                      <div className="bg-white rounded-xl px-3 py-1.5 shadow-sm border border-slate-100 flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center p-1 shrink-0">
                          <img 
                            src="/logo-bkn.png" 
                            alt="Logo BKN" 
                            className="w-full h-full object-contain filter drop-shadow-2xs" 
                          />
                        </div>
                        <div className="text-left">
                          <span className="text-[10px] text-slate-400 block font-semibold leading-tight">Satu Data ASN</span>
                          <span className="text-xs font-black text-slate-800 leading-tight">MyASN Terpadu</span>
                        </div>
                      </div>
                      <div className="p-2 rounded-xl bg-blue-600 text-white shadow-sm">
                        <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black text-blue-700 uppercase tracking-wider bg-blue-50 px-2 py-0.5 rounded-md">
                          BKN Pusat
                        </span>
                        <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 transition-colors" />
                      </div>
                      <h4 className="text-base font-black text-slate-900 pt-1 group-hover:text-blue-700 transition-colors">
                        ASN Digital (BKN)
                      </h4>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        Layanan terintegrasi data kepegawaian nasional untuk pemutakhiran profil, riwayat pangkat, dan SK digital.
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-blue-700">
                    <span>Akses asndigital.bkn.go.id</span>
                    <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </a>
              )}

              {/* Card 3: Dynamic / Fallback E-Kinerja */}
              {secondaryBanners[1] ? (
                <a
                  href={secondaryBanners[1].target_url || '#'}
                  target={secondaryBanners[1].target_url?.startsWith('http') ? '_blank' : '_self'}
                  rel="noreferrer"
                  className="group bg-white hover:bg-slate-50/80 rounded-3xl p-6 border border-slate-200/90 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="w-full h-24 bg-gradient-to-br from-emerald-50 to-teal-50/60 rounded-2xl p-3 border border-emerald-100/80 flex items-center justify-between mb-4 relative overflow-hidden group-hover:scale-[1.01] transition-transform">
                      <div className="bg-white rounded-xl px-3 py-1.5 shadow-sm border border-slate-100 flex items-center gap-2.5 max-w-[80%]">
                        <div className="h-8 max-w-[90px] rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center px-1.5 shrink-0 overflow-hidden">
                          <img 
                            src={secondaryBanners[1].gambar_url || "/logo-ekinerja.png"} 
                            alt={secondaryBanners[1].judul} 
                            className="h-6 w-auto object-contain filter drop-shadow-2xs" 
                            onError={(e) => { e.currentTarget.src = "/logo-ekinerja.png"; }}
                          />
                        </div>
                        <div className="text-left truncate">
                          <span className="text-[10px] text-slate-400 block font-semibold leading-tight">Layanan Mitra</span>
                          <span className="text-xs font-black text-slate-800 leading-tight truncate block">{secondaryBanners[1].judul}</span>
                        </div>
                      </div>
                      <div className="p-2 rounded-xl bg-emerald-700 text-white shadow-sm shrink-0">
                        <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black text-emerald-700 uppercase tracking-wider bg-emerald-50 px-2 py-0.5 rounded-md">
                          Portal Terkait
                        </span>
                        <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-600 transition-colors" />
                      </div>
                      <h4 className="text-base font-black text-slate-900 pt-1 group-hover:text-emerald-700 transition-colors line-clamp-1">
                        {secondaryBanners[1].judul}
                      </h4>
                      <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                        {secondaryBanners[1].subjudul || 'Kunjungi tautan resmi layanan informasi dan portal terpadu.'}
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-700">
                    <span className="truncate max-w-[220px]">Buka Tautan</span>
                    <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform shrink-0" />
                  </div>
                </a>
              ) : (
                <a
                  href="https://kinerja.bkn.go.id/login"
                  target="_blank"
                  rel="noreferrer"
                  className="group bg-white hover:bg-slate-50/80 rounded-3xl p-6 border border-slate-200/90 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="w-full h-24 bg-gradient-to-br from-emerald-50 to-teal-50/60 rounded-2xl p-3 border border-emerald-100/80 flex items-center justify-between mb-4 relative overflow-hidden group-hover:scale-[1.01] transition-transform">
                      <div className="bg-white rounded-xl px-3 py-1.5 shadow-sm border border-slate-100 flex items-center gap-2.5">
                        <div className="h-8 max-w-[90px] rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center px-1.5 shrink-0">
                          <img 
                            src="/logo-ekinerja.png" 
                            alt="Logo e-Kinerja BKN" 
                            className="h-6 w-auto object-contain filter drop-shadow-2xs" 
                          />
                        </div>
                        <div className="text-left">
                          <span className="text-[10px] text-slate-400 block font-semibold leading-tight">SKP Real-Time</span>
                          <span className="text-xs font-black text-slate-800 leading-tight">Evaluasi Periodik</span>
                        </div>
                      </div>
                      <div className="p-2 rounded-xl bg-emerald-700 text-white shadow-sm">
                        <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black text-emerald-700 uppercase tracking-wider bg-emerald-50 px-2 py-0.5 rounded-md">
                          Penilaian SKP
                        </span>
                        <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-600 transition-colors" />
                      </div>
                      <h4 className="text-base font-black text-slate-900 pt-1 group-hover:text-emerald-700 transition-colors">
                        E-Kinerja BKN & SKP
                      </h4>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        Portal penyusunan Sasaran Kinerja Pegawai (SKP), ekspektasi pimpinan, dan pelaporan kinerja ASN berkala.
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-700">
                    <span>Akses kinerja.bkn.go.id</span>
                    <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </a>
              )}

            </div>

          </div>

          {/* RIGHT 4 COLS: RIGHT WIDGET PANEL (STATISTIK, AGENDA, HELPDESK) */}
          <div className="lg:col-span-4 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-sm hover:shadow-md transition-all flex flex-col justify-between gap-6">
            
            <div className="space-y-4">
              
              {/* Header Right Widget Card */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2.5 rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-100 shadow-2xs">
                    <Headphones className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-black text-base text-slate-900 leading-tight">
                      Pusat Informasi & Widget
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Statistik publik, agenda & layanan ASN
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                  2026
                </span>
              </div>

              {/* Segmented Toggle Pills: 3 Tabs (Statistik | Agenda | Bantuan) */}
              <div className="grid grid-cols-3 p-1 bg-slate-100/90 rounded-2xl border border-slate-200 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setActiveTab('stats')}
                  className={`py-2 px-2 rounded-xl flex items-center justify-center gap-1 transition-all cursor-pointer ${
                    activeTab === 'stats'
                      ? 'bg-white text-emerald-900 shadow-xs font-black'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  <Activity className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Statistik</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('agenda')}
                  className={`py-2 px-2 rounded-xl flex items-center justify-center gap-1 transition-all cursor-pointer ${
                    activeTab === 'agenda'
                      ? 'bg-white text-emerald-900 shadow-xs font-black'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  <Calendar className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Agenda</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('help')}
                  className={`py-2 px-2 rounded-xl flex items-center justify-center gap-1 transition-all cursor-pointer ${
                    activeTab === 'help'
                      ? 'bg-white text-emerald-900 shadow-xs font-black'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  <HelpCircle className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Bantuan</span>
                </button>
              </div>

              {/* TAB 1: RIGHT WIDGET STATISTIK PENGUNJUNG REAL-TIME */}
              {activeTab === 'stats' && (
                <div className="space-y-3 animate-fadeIn">
                  <div className="p-4 bg-emerald-950 text-white rounded-2xl border border-emerald-800/80 shadow-md space-y-3">
                    <div className="flex items-center justify-between border-b border-emerald-800/70 pb-2.5">
                      <div className="flex items-center gap-2">
                        <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
                        <span className="font-black text-xs uppercase tracking-wider text-white">
                          {settings.widget_visitor_title || 'Statistik Pengunjung'}
                        </span>
                      </div>
                      <span className="flex items-center gap-1 text-[11px] font-mono text-emerald-400 bg-emerald-900/60 px-2 py-0.5 rounded-full border border-emerald-700/60">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                        <span>{visitor.online || 1} Online</span>
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2.5 text-xs">
                      <div className="p-2.5 bg-emerald-900/40 rounded-xl border border-emerald-800/50">
                        <span className="text-[10px] text-emerald-300 font-bold uppercase tracking-wider block">Hari Ini</span>
                        <p className="font-mono font-black text-amber-300 text-base mt-0.5">
                          {(visitor.hariIni || 0).toLocaleString('id-ID')}
                        </p>
                      </div>
                      <div className="p-2.5 bg-emerald-900/40 rounded-xl border border-emerald-800/50">
                        <span className="text-[10px] text-emerald-300 font-bold uppercase tracking-wider block">Bulan Ini</span>
                        <p className="font-mono font-black text-emerald-200 text-base mt-0.5">
                          {(visitor.bulanIni || 0).toLocaleString('id-ID')}
                        </p>
                      </div>
                    </div>

                    <div className="p-2.5 bg-emerald-900/60 rounded-xl border border-emerald-800/60 flex items-center justify-between">
                      <span className="text-[11px] text-emerald-200 font-semibold">Total Kunjungan Portal:</span>
                      <span className="font-mono font-black text-white text-sm">
                        {(visitor.total || 0).toLocaleString('id-ID')}
                      </span>
                    </div>

                    <p className="text-[10px] text-emerald-300/70 text-center font-medium">
                      {settings.widget_visitor_desc || 'Pencatatan real-time kunjungan publik portal BKPSDM'}
                    </p>
                  </div>

                  {/* Jam Operasional Ringkas */}
                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-emerald-700" />
                      <span className="font-bold text-slate-800">Senin - Jumat</span>
                    </div>
                    <span className="font-mono text-emerald-800 font-bold text-[11px] bg-emerald-50 px-2 py-0.5 rounded">
                      08.00 - 16.30 WIB
                    </span>
                  </div>
                </div>
              )}

              {/* TAB 2: AGENDA KEDINASAN */}
              {activeTab === 'agenda' && (
                <div className="space-y-3 animate-fadeIn">
                  {upcomingAgenda ? (
                    <div className="p-4 bg-emerald-50/70 rounded-2xl border border-emerald-100/80 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-800 text-white text-[10px] font-bold">
                          <Clock className="w-3 h-3" />
                          {upcomingAgenda.tipe_pelaksanaan || 'OFFLINE'}
                        </span>
                        <span className="text-[11px] text-emerald-800 font-bold">
                          {upcomingAgenda.start_time ? new Date(upcomingAgenda.start_time).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Segera'}
                        </span>
                      </div>

                      <p className="text-xs sm:text-sm font-black text-slate-900 leading-snug line-clamp-2">
                        {upcomingAgenda.title}
                      </p>

                      {upcomingAgenda.lokasi && (
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-600 pt-1 border-t border-emerald-200/50">
                          <MapPin className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                          <span className="truncate">{upcomingAgenda.lokasi}</span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 text-center space-y-1">
                      <Calendar className="w-6 h-6 text-slate-400 mx-auto" />
                      <p className="text-xs font-bold text-slate-800">Belum Ada Agenda Terjadwal</p>
                      <p className="text-[11px] text-slate-500">
                        Jadwal kegiatan terbaru BKPSDM akan segera diperbarui.
                      </p>
                    </div>
                  )}

                  {agendasList.length > 1 && (
                    <div className="space-y-1.5 pt-1">
                      <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                        Agenda Mendatang:
                      </span>
                      {agendasList.slice(1, 3).map((item) => (
                        <div key={item.id} className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between text-xs">
                          <span className="text-slate-800 font-medium truncate max-w-[200px] text-[11px]">
                            {item.title}
                          </span>
                          <span className="text-[10px] text-emerald-700 font-bold shrink-0 ml-2">
                            {item.start_time ? new Date(item.start_time).toLocaleDateString('id-ID', { day: 'numeric', month: 'numeric' }) : ''}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: PANDUAN HELPDESK & BANTUAN ASN */}
              {activeTab === 'help' && (
                <div className="space-y-2.5 animate-fadeIn">
                  {/* Quick Ticket Tracking Box */}
                  <div className="p-3.5 bg-emerald-50/80 rounded-2xl border border-emerald-200/80 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-xs text-emerald-950 flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5 text-emerald-700" />
                        <span>Cek Status Permohonan</span>
                      </span>
                      <Link to="/tracking" className="text-[10px] font-bold text-emerald-800 hover:underline">
                        Buka Halaman
                      </Link>
                    </div>
                    <form 
                      onSubmit={(e) => {
                        e.preventDefault();
                        const val = e.target.tiketInput.value.trim();
                        if (val) window.location.href = `/tracking?tiket=${encodeURIComponent(val)}`;
                      }}
                      className="flex items-center gap-1.5"
                    >
                      <input 
                        name="tiketInput"
                        type="text" 
                        placeholder="Ketik No. Tiket..."
                        className="w-full px-2.5 py-1.5 text-xs bg-white rounded-xl border border-slate-200 text-slate-800 font-mono focus:outline-none focus:ring-2 focus:ring-emerald-600"
                      />
                      <button 
                        type="submit"
                        className="px-3 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold shrink-0 transition-colors cursor-pointer"
                      >
                        Cek
                      </button>
                    </form>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-start gap-2.5">
                    <FileCheck2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                    <div className="text-xs">
                      <span className="font-bold text-slate-900 block">Kendala e-Kinerja & SIASN?</span>
                      <span className="text-[11px] text-slate-600 leading-relaxed block mt-0.5">
                        Hubungi tim verifikator BKPSDM untuk sinkronisasi akun & data profil ASN.
                      </span>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-start gap-2.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                    <div className="text-xs">
                      <span className="font-bold text-slate-900 block">Jam Operasional Helpdesk</span>
                      <span className="text-[11px] text-slate-600 leading-relaxed block mt-0.5">
                        Senin – Jumat: 08.00 – 16.30 WIB di Kantor BKPSDM Komplek Perkantoran.
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Custom Announcement Widget jika diaktifkan admin */}
              {showCustomWidget && settings.widget_custom_content && (
                <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-xs space-y-1">
                  <span className="font-black text-amber-900 block flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />
                    <span>{settings.widget_custom_title || 'Pengumuman'}</span>
                  </span>
                  <p className="text-[11px] text-amber-800 leading-relaxed">
                    {settings.widget_custom_content}
                  </p>
                </div>
              )}

            </div>

            {/* Bottom Actions: WhatsApp & Call Center */}
            <div className="space-y-3 pt-3 border-t border-slate-100">
              <a
                href={`https://wa.me/${waNumber.startsWith('0') ? '62' + waNumber.slice(1) : waNumber}?text=Halo%20Admin%20BKPSDM%20Aceh%20Tamiang,%20saya%20ingin%20konsultasi%20layanan%20kepegawaian`}
                target="_blank"
                rel="noreferrer"
                className="w-full py-3 px-4 bg-emerald-800 hover:bg-emerald-900 active:scale-95 text-white font-black rounded-2xl text-xs sm:text-sm transition-all flex items-center justify-center gap-2 shadow-sm hover:shadow-emerald-900/10"
              >
                {/* Clean WhatsApp Outline Icon */}
                <svg
                  className="w-4 h-4 text-amber-300 shrink-0"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                  <path d="M9.5 9.5c.3-.6.6-.6 1-.3.3.3.7 1 .8 1.2.1.2 0 .4-.1.6l-.3.4c-.1.2-.2.3 0 .6.3.5.7 1 1.2 1.3.3.2.4.1.6 0l.4-.3c.2-.1.4-.2.6-.1.2.1.9.5 1.2.8.3.4.3.7-.3 1-.5.3-1.2.4-2.1-.1-1.3-.7-2.3-1.8-3-3.1-.5-.9-.4-1.6-.1-2.1z" />
                </svg>
                <span>Konsultasi ASN (WhatsApp)</span>
              </a>

              <div className="flex items-center justify-between text-xs text-slate-500 px-1">
                <a 
                  href={`tel:${phoneDisplay.replace(/[^0-9]/g, '')}`} 
                  className="flex items-center gap-1.5 hover:text-slate-800 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Call Center: <strong className="text-slate-800 font-bold">{phoneDisplay}</strong></span>
                </a>
                <Link to="/katalog" className="text-emerald-800 font-bold hover:underline flex items-center gap-0.5">
                  <span>SOP</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
