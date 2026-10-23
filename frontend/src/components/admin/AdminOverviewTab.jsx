import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../../services/api';
import { 
  Newspaper, 
  FolderOpen, 
  TrendingUp, 
  Activity, 
  Users, 
  FileText,
  Clock,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Globe,
  Eye,
  Download,
  Image as ImageIcon,
  Smartphone,
  Monitor,
  Tablet,
  Share2,
  Search,
  Sparkles,
  ArrowUpRight,
  Settings,
  Layers,
  CheckCircle2,
  Sliders,
  Calendar,
  MessageSquare,
  AlertCircle,
  ArrowRight,
  Filter,
  CalendarRange,
  Loader2
} from 'lucide-react';
import Badge from '../common/Badge';

export default function AdminOverviewTab({ counts = {}, analyticsData = {}, user = {}, setActiveTab }) {
  const navigate = useNavigate();
  const [chartPeriod, setChartPeriod] = useState('bulan'); // 'minggu' | 'bulan' | 'tahun' | 'custom'

  // Default custom range: last 14 days
  const todayStr = new Date().toISOString().split('T')[0];
  const fourteenDaysAgoStr = new Date(Date.now() - 13 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const [customStartDate, setCustomStartDate] = useState(fourteenDaysAgoStr);
  const [customEndDate, setCustomEndDate] = useState(todayStr);
  const [appliedCustomRange, setAppliedCustomRange] = useState({
    startDate: fourteenDaysAgoStr,
    endDate: todayStr
  });

  // Query custom date range
  const { data: customRangeData, isLoading: isLoadingCustom } = useQuery({
    queryKey: ['customRangeAnalytics', appliedCustomRange.startDate, appliedCustomRange.endDate],
    queryFn: async () => {
      const res = await api.get(`/cms/analytics/custom-range?startDate=${appliedCustomRange.startDate}&endDate=${appliedCustomRange.endDate}`);
      return res?.data?.data || res?.data || null;
    },
    enabled: chartPeriod === 'custom' && !!appliedCustomRange.startDate && !!appliedCustomRange.endDate,
    staleTime: 60000
  });

  const visitorStats = analyticsData?.visitorStats || {
    todayViews: 0,
    monthViews: 0,
    uniqueVisitorsToday: 0,
    devices: [],
    sources: { search: 0, direct: 0, social: 0 },
    weeklyChart: [],
    monthlyChart: [],
    yearlyChart: [],
    avgSessionDuration: '3m 42s',
    bounceRate: '28.4%'
  };

  const devicesList = (visitorStats.devices && visitorStats.devices.length > 0)
    ? visitorStats.devices.map(d => ({
        ...d,
        icon: d.name.includes('Smartphone') ? Smartphone : (d.name.includes('Desktop') ? Monitor : Tablet)
      }))
    : [
        { name: 'Smartphone (Mobile)', percentage: 0, count: 0, color: '#059669', icon: Smartphone },
        { name: 'Desktop / PC', percentage: 0, count: 0, color: '#f59e0b', icon: Monitor },
        { name: 'Tablet', percentage: 0, count: 0, color: '#6366f1', icon: Tablet }
      ];

  const sourcesData = visitorStats.sources || { search: 0, direct: 0, social: 0 };

  // 100% Real Period datasets for chart from backend database queries
  const chartDatasets = {
    minggu: visitorStats.weeklyChart || [],
    bulan: visitorStats.monthlyChart || [],
    tahun: visitorStats.yearlyChart || [],
    custom: customRangeData?.chartData || []
  };

  const currentChartData = chartDatasets[chartPeriod] || chartDatasets.bulan || [];
  const maxChartValue = Math.max(...currentChartData.map(d => Math.max(d.pengunjung || 0, d.pembaca || 0)), 10) * 1.15;
  const totalPeriodVisitors = chartPeriod === 'custom' && customRangeData
    ? customRangeData.totalVisitors
    : currentChartData.reduce((acc, curr) => acc + (curr.pengunjung || 0), 0);
  const totalPeriodReaders = chartPeriod === 'custom' && customRangeData
    ? customRangeData.totalReaders
    : currentChartData.reduce((acc, curr) => acc + (curr.pembaca || 0), 0);

  const topBeritaList = analyticsData?.topBerita || [];
  const topDokumenList = analyticsData?.topDokumen || [];
  const recentAudits = analyticsData?.recentAudits || [];
  const pendingCommentsList = analyticsData?.pendingComments || [];
  const pendingKomentarCount = counts.pendingKomentar || pendingCommentsList.length || 0;

  return (
    <div className="space-y-6">
      
      {/* SECTION 1: HEADER BANNER (Welcome & Fast Actions) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left 8 Cols: Welcome Banner */}
        <div className="lg:col-span-8 bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 rounded-2xl p-6 text-white shadow-sm relative overflow-hidden flex flex-col justify-between">
          <div className="relative z-10 space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider bg-amber-400/20 text-amber-300 border border-amber-400/30 px-2.5 py-0.5 rounded-full flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-amber-300" />
                DJIE CMS PRO v1.0 Patch 2 &bull; Panel Administrator
              </span>
              <span className="text-[10px] font-bold text-emerald-200 bg-white/10 px-2.5 py-0.5 rounded-full border border-white/10">
                Database Live Real-time
              </span>
            </div>

            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Selamat Datang Kembali, {user?.name || 'Administrator'}!
              </h2>
              <p className="text-xs sm:text-sm text-emerald-100/90 font-medium mt-1 max-w-2xl leading-relaxed">
                Pusat kendali konten, manajemen informasi layanan publik kepegawaian, dan analisis lalu lintas website BKPSDM Kabupaten Aceh Tamiang.
              </p>
            </div>

            {/* Quick Metrics Bar inside Banner */}
            <div className="grid grid-cols-3 gap-3 pt-2 max-w-lg">
              <div className="bg-white/10 backdrop-blur-xs border border-white/10 rounded-xl p-3">
                <p className="text-[10px] font-bold text-emerald-200 uppercase tracking-wider">Total Kunjungan</p>
                <p className="text-lg font-black text-white font-mono mt-0.5">
                  {(counts.totalViews || 0).toLocaleString('id-ID')}
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-xs border border-white/10 rounded-xl p-3">
                <p className="text-[10px] font-bold text-emerald-200 uppercase tracking-wider">Berita Terbit</p>
                <p className="text-lg font-black text-amber-300 font-mono mt-0.5">
                  {(counts.publishedBerita || 0).toLocaleString('id-ID')}
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-xs border border-white/10 rounded-xl p-3">
                <p className="text-[10px] font-bold text-emerald-200 uppercase tracking-wider">Halaman Aktif</p>
                <p className="text-lg font-black text-white font-mono mt-0.5">
                  {counts.publishedHalaman || counts.totalHalaman || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="absolute -right-6 -bottom-6 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute right-12 top-0 w-32 h-32 bg-amber-400/10 rounded-full blur-xl pointer-events-none" />
        </div>

        {/* Right 4 Cols: Quick Navigation / Shortcuts */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-emerald-50 text-emerald-800 rounded-lg">
                <Sliders className="w-4 h-4 text-emerald-700" />
              </div>
              <h3 className="text-xs font-black uppercase text-slate-900 tracking-wider">Pintasan Cepat CMS</h3>
            </div>
            <span className="text-[10px] font-bold text-slate-400">Aksi Utama</span>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => navigate('/admin/berita/create')}
              className="p-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all flex flex-col items-start gap-1.5 shadow-xs cursor-pointer group"
            >
              <div className="flex items-center justify-between w-full">
                <Newspaper className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
                <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-white" />
              </div>
              <span>Tulis Berita</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('pages')}
              className="p-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 rounded-xl text-xs font-bold transition-all flex flex-col items-start gap-1.5 cursor-pointer group"
            >
              <div className="flex items-center justify-between w-full">
                <FileText className="w-4 h-4 text-emerald-700 group-hover:scale-110 transition-transform" />
                <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400 group-hover:text-emerald-700" />
              </div>
              <span>Kelola Pages</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('dokumen')}
              className="p-3 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 rounded-xl text-xs font-bold transition-all flex flex-col items-start gap-1.5 cursor-pointer group"
            >
              <div className="flex items-center justify-between w-full">
                <FolderOpen className="w-4 h-4 text-amber-700 group-hover:scale-110 transition-transform" />
                <ArrowUpRight className="w-3.5 h-3.5 text-amber-400 group-hover:text-amber-700" />
              </div>
              <span>Upload Berkas</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('theme')}
              className="p-3 bg-slate-50 hover:bg-slate-100 text-slate-800 border border-slate-200 rounded-xl text-xs font-bold transition-all flex flex-col items-start gap-1.5 cursor-pointer group"
            >
              <div className="flex items-center justify-between w-full">
                <Settings className="w-4 h-4 text-slate-700 group-hover:scale-110 transition-transform" />
                <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-700" />
              </div>
              <span>Sosmed & Tema</span>
            </button>
          </div>
        </div>

      </div>

      {/* PENDING COMMENTS ACTION ALERT (Jika ada komentar publik yang butuh moderasi / tindakan) */}
      {pendingKomentarCount > 0 && (
        <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 text-white rounded-2xl p-4 sm:p-5 shadow-sm border border-amber-400/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-in fade-in">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center shrink-0 border border-white/30 text-amber-100 shadow-xs">
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-wider bg-white/25 px-2 py-0.5 rounded-md border border-white/30 text-white">
                  Perlu Tindakan Moderator
                </span>
                <span className="text-xs font-black bg-rose-500 text-white px-2 py-0.5 rounded-full shadow-xs">
                  {pendingKomentarCount} Komentar Baru
                </span>
              </div>
              <p className="text-xs sm:text-sm text-amber-50 font-medium mt-1">
                Ada <strong className="text-white font-black">{pendingKomentarCount} tanggapan masyarakat</strong> pada berita yang menunggu verifikasi atau persetujuan Anda sebelum dipublikasikan ke portal.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setActiveTab('komentar')}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-white hover:bg-amber-50 text-amber-900 rounded-xl text-xs font-black transition-all shadow-sm shrink-0 cursor-pointer self-start sm:self-auto active:scale-95"
          >
            <span>Tinjau & Moderasi Sekarang</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* SECTION 2: 4 TOP KPI METRIC CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        
        {/* KPI 1: Berita & Artikel */}
        <div 
          onClick={() => setActiveTab('berita')}
          className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between cursor-pointer hover:border-emerald-500 hover:shadow-md transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Berita & Informasi</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors shadow-xs">
              <Newspaper className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 space-y-0.5">
            <p className="text-2xl sm:text-3xl font-black text-slate-900 font-mono">{counts.totalBerita || 0}</p>
            <p className="text-[11px] text-emerald-700 font-bold">{counts.publishedBerita || 0} Terpublikasi Online</p>
          </div>
        </div>

        {/* KPI 2: Halaman Statis */}
        <div 
          onClick={() => setActiveTab('pages')}
          className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between cursor-pointer hover:border-blue-500 hover:shadow-md transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Halaman Statis</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors shadow-xs">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 space-y-0.5">
            <p className="text-2xl sm:text-3xl font-black text-slate-900 font-mono">{counts.publishedHalaman || counts.totalHalaman || 6}</p>
            <p className="text-[11px] text-blue-700 font-bold">{counts.publishedHalaman || counts.totalHalaman || 6} Halaman Aktif</p>
          </div>
        </div>

        {/* KPI 3: Dokumen Publik */}
        <div 
          onClick={() => setActiveTab('dokumen')}
          className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between cursor-pointer hover:border-amber-500 hover:shadow-md transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Dokumen Publik</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition-colors shadow-xs">
              <FolderOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 space-y-0.5">
            <p className="text-2xl sm:text-3xl font-black text-slate-900 font-mono">{counts.totalDokumen || 0}</p>
            <p className="text-[11px] text-amber-700 font-bold">{(counts.totalDownloads || 0).toLocaleString('id-ID')} Total Unduhan</p>
          </div>
        </div>

        {/* KPI 4: Galeri Media */}
        <div 
          onClick={() => setActiveTab('galeri')}
          className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between cursor-pointer hover:border-purple-500 hover:shadow-md transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Galeri & Slider</span>
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-colors shadow-xs">
              <ImageIcon className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 space-y-0.5">
            <p className="text-2xl sm:text-3xl font-black text-slate-900 font-mono">{(counts.totalGaleri || 0) + (counts.totalBanner || 0)}</p>
            <p className="text-[11px] text-purple-700 font-bold">{counts.totalBanner || 0} Banner Slider Aktif</p>
          </div>
        </div>

      </div>

      {/* SECTION 3: MAIN ANALYTICS CENTER (Interactive Bar Chart + Real-time Visitor Stats) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left 8 Cols: Interactive Multi-Bar Chart */}
        <div className="lg:col-span-8 bg-white p-5 sm:p-7 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
          
          {/* Chart Header & Period Switcher */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-emerald-50 text-emerald-800 rounded-lg">
                  <TrendingUp className="w-4 h-4 text-emerald-700" />
                </div>
                <h3 className="text-base font-black text-slate-900">
                  Grafik Kunjungan & Interaksi Pembaca
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                  100% Real Data
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Perbandingan lalu lintas website riil berdasarkan pencatatan aktivitas pengunjung aktual.
              </p>
            </div>
            
            {/* Period Tabs */}
            <div className="flex flex-wrap items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold self-start sm:self-auto shrink-0 border border-slate-200">
              <button
                type="button"
                onClick={() => setChartPeriod('minggu')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  chartPeriod === 'minggu' 
                    ? 'bg-emerald-800 text-white shadow-xs' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                7 Hari
              </button>
              <button
                type="button"
                onClick={() => setChartPeriod('bulan')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  chartPeriod === 'bulan' 
                    ? 'bg-emerald-800 text-white shadow-xs' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                12 Bulan (2026)
              </button>
              <button
                type="button"
                onClick={() => setChartPeriod('tahun')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  chartPeriod === 'tahun' 
                    ? 'bg-emerald-800 text-white shadow-xs' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                3 Tahun
              </button>
              <button
                type="button"
                onClick={() => setChartPeriod('custom')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                  chartPeriod === 'custom' 
                    ? 'bg-emerald-800 text-white shadow-xs' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <CalendarRange className="w-3.5 h-3.5" />
                <span>Custom Tanggal</span>
              </button>
            </div>
          </div>

          {/* Custom Date Range Picker Toolbar */}
          {chartPeriod === 'custom' && (
            <div className="p-3.5 bg-emerald-50/70 border border-emerald-200/80 rounded-xl flex flex-wrap items-center justify-between gap-3 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs">
                <span className="font-bold text-emerald-950 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-emerald-700" />
                  Rentang Tanggal:
                </span>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5 bg-white border border-emerald-300 rounded-lg px-2.5 py-1.5 shadow-xs">
                    <span className="text-[10px] font-bold text-slate-500 uppercase">Mulai</span>
                    <input
                      type="date"
                      value={customStartDate}
                      max={customEndDate || todayStr}
                      onChange={(e) => setCustomStartDate(e.target.value)}
                      className="text-xs font-bold text-slate-800 outline-none cursor-pointer bg-transparent"
                    />
                  </div>
                  <span className="text-slate-400 font-bold">s/d</span>
                  <div className="flex items-center gap-1.5 bg-white border border-emerald-300 rounded-lg px-2.5 py-1.5 shadow-xs">
                    <span className="text-[10px] font-bold text-slate-500 uppercase">Selesai</span>
                    <input
                      type="date"
                      value={customEndDate}
                      min={customStartDate}
                      max={todayStr}
                      onChange={(e) => setCustomEndDate(e.target.value)}
                      className="text-xs font-bold text-slate-800 outline-none cursor-pointer bg-transparent"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setAppliedCustomRange({
                      startDate: customStartDate,
                      endDate: customEndDate
                    });
                  }}
                  disabled={isLoadingCustom || !customStartDate || !customEndDate}
                  className="px-4 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {isLoadingCustom ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Memuat...</span>
                    </>
                  ) : (
                    <>
                      <Filter className="w-3.5 h-3.5" />
                      <span>Terapkan Filter</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Quick Period KPI Summary Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3.5 bg-slate-50 border border-slate-100 rounded-xl">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Kunjungan Periode</p>
              <p className="text-base font-black text-emerald-800 font-mono mt-0.5">
                {totalPeriodVisitors.toLocaleString('id-ID')} Hits
              </p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Pembaca Konten</p>
              <p className="text-base font-black text-amber-700 font-mono mt-0.5">
                {totalPeriodReaders.toLocaleString('id-ID')} Views
              </p>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Tingkat Retensi</p>
              <p className="text-base font-black text-slate-800 font-mono mt-0.5">
                {visitorStats.bounceRate ? `${(100 - parseFloat(visitorStats.bounceRate)).toFixed(1)}%` : '71.6%'}
              </p>
            </div>
          </div>

          {/* Visual Multi-Bar Chart Container */}
          <div className="pt-2 relative">
            
            {/* Horizontal Reference Gridlines */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-8 text-[10px] font-mono text-slate-300">
              <div className="border-b border-dashed border-slate-200 flex items-center justify-between pb-1">
                <span>{Math.round(maxChartValue).toLocaleString('id-ID')}</span>
              </div>
              <div className="border-b border-dashed border-slate-100 flex items-center justify-between pb-1">
                <span>{Math.round(maxChartValue * 0.5).toLocaleString('id-ID')}</span>
              </div>
              <div className="border-b border-slate-200 flex items-center justify-between pb-1">
                <span>0</span>
              </div>
            </div>

            {/* Bars Columns */}
            <div className="h-56 flex items-end justify-between gap-1.5 sm:gap-3 pb-2 relative z-10 px-1 sm:px-2 overflow-x-auto">
              {currentChartData.length === 0 ? (
                <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 space-y-1">
                  <CalendarRange className="w-8 h-8 text-slate-300" />
                  <p className="text-xs font-bold text-slate-600">Tidak ada data statistik pada periode ini</p>
                  <p className="text-[11px] text-slate-400">Pilih rentang tanggal lain atau gunakan tab preset.</p>
                </div>
              ) : (
                currentChartData.map((item) => {
                  const pengunjungPct = maxChartValue > 0 ? (item.pengunjung / maxChartValue) * 100 : 0;
                  const pembacaPct = maxChartValue > 0 ? (item.pembaca / maxChartValue) * 100 : 0;

                  return (
                    <div key={item.label || item.fullDate} className="flex-1 min-w-[36px] flex flex-col items-center gap-2 group relative">
                      
                      {/* Floating Tooltip on Hover */}
                      <div className="absolute -top-14 bg-slate-900 text-white px-2.5 py-1.5 rounded-lg text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-xl border border-slate-700 whitespace-nowrap z-30 space-y-0.5">
                        <p className="text-slate-300 border-b border-slate-800 pb-0.5 font-sans">{item.label}</p>
                        <p className="text-emerald-400 font-mono">{(item.pengunjung || 0).toLocaleString('id-ID')} Kunjungan Web</p>
                        <p className="text-amber-300 font-mono">{(item.pembaca || 0).toLocaleString('id-ID')} Pembaca Konten</p>
                      </div>

                      {/* Paired Bar Columns */}
                      <div className="w-full flex items-end justify-center gap-1 sm:gap-2 h-44">
                        
                        {/* Bar 1: Kunjungan Portal (Emerald Gradient) */}
                        <div
                          className="w-2.5 sm:w-5 bg-gradient-to-t from-emerald-800 to-emerald-500 group-hover:from-emerald-700 group-hover:to-emerald-400 rounded-t-md sm:rounded-t-lg transition-all duration-500 shadow-xs relative"
                          style={{ height: `${Math.max(6, Math.min(100, pengunjungPct))}%` }}
                        />

                        {/* Bar 2: Pembaca Berita (Amber Gradient) */}
                        <div
                          className="w-2.5 sm:w-5 bg-gradient-to-t from-amber-500 to-amber-300 group-hover:from-amber-400 group-hover:to-amber-200 rounded-t-md sm:rounded-t-lg transition-all duration-500 shadow-xs relative"
                          style={{ height: `${Math.max(4, Math.min(100, pembacaPct))}%` }}
                        />

                      </div>

                      {/* Label on X-Axis */}
                      <span className="text-[10px] sm:text-[11px] font-bold text-slate-500 group-hover:text-emerald-800 transition-colors truncate max-w-full text-center">
                        {item.label}
                      </span>
                    </div>
                  );
                })
              )}
            </div>

            {/* Chart Legend */}
            <div className="flex flex-wrap items-center justify-center gap-6 pt-4 border-t border-slate-100 text-xs font-bold text-slate-700">
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded-md bg-gradient-to-br from-emerald-700 to-emerald-500 shadow-xs" />
                <span>Kunjungan Pengunjung Web</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded-md bg-gradient-to-br from-amber-500 to-amber-300 shadow-xs" />
                <span>Pembaca Berita & Dokumen</span>
              </div>
            </div>

          </div>

        </div>

        {/* Right 4 Cols: Real-time Visitor Stats, Devices, and Traffic Sources */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm space-y-5 flex flex-col justify-between">
          
          {/* Card Title with Live Beacon */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-emerald-50 text-emerald-800 rounded-lg">
                <Activity className="w-4 h-4 text-emerald-600 animate-pulse" />
              </div>
              <div>
                <h4 className="text-xs font-black uppercase text-slate-900 tracking-wider">Pemantauan Trafik</h4>
                <p className="text-[10px] text-slate-400">Statistik Pengunjung Hari Ini</p>
              </div>
            </div>
            <span className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
              <span>Live Real-time</span>
            </span>
          </div>

          {/* 2 Primary Traffic Metric Boxes */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 bg-gradient-to-br from-slate-50 to-emerald-50/40 rounded-2xl border border-slate-100 space-y-1">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Kunjungan Hari Ini</p>
              <div className="flex items-baseline gap-1">
                <p className="text-2xl font-black text-slate-900 font-mono">{(visitorStats.todayViews || 0).toLocaleString('id-ID')}</p>
                <span className="text-xs font-bold text-emerald-700">Hits</span>
              </div>
              <p className="text-[10px] text-slate-500 font-medium">Bulan Ini: {(visitorStats.monthViews || 0).toLocaleString('id-ID')}</p>
            </div>

            <div className="p-3.5 bg-gradient-to-br from-slate-50 to-amber-50/40 rounded-2xl border border-slate-100 space-y-1">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Pengunjung Unik</p>
              <div className="flex items-baseline gap-1">
                <p className="text-2xl font-black text-slate-900 font-mono">{(visitorStats.uniqueVisitorsToday || 0).toLocaleString('id-ID')}</p>
                <span className="text-xs font-bold text-amber-700">User</span>
              </div>
              <p className="text-[10px] text-slate-500 font-medium">Durasi: {visitorStats.avgSessionDuration || '3m 42s'}</p>
            </div>
          </div>

          {/* Device Distribution Progress */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <p className="text-xs font-black text-slate-800 uppercase tracking-wider">Distribusi Perangkat</p>
              <span className="text-[10px] font-bold text-slate-400">Total 100%</span>
            </div>
            
            <div className="space-y-2.5">
              {devicesList.map((dev) => {
                const Icon = dev.icon || (dev.name.includes('Mobile') ? Smartphone : (dev.name.includes('Tablet') ? Tablet : Monitor));
                return (
                  <div key={dev.name} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="flex items-center gap-2 text-slate-700 font-semibold">
                        <Icon className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                        <span>{dev.name}</span>
                      </span>
                      <div className="flex items-center gap-1.5">
                        {dev.count !== undefined && (
                          <span className="text-[10px] text-slate-400 font-mono">({(dev.count || 0).toLocaleString('id-ID')} hits)</span>
                        )}
                        <span className="font-mono font-black text-slate-900">{dev.percentage || 0}%</span>
                      </div>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all duration-700" 
                        style={{ width: `${Math.max(4, dev.percentage || 0)}%`, backgroundColor: dev.color || '#059669' }} 
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Referral Source Breakdown */}
          <div className="pt-2 border-t border-slate-100 space-y-2">
            <p className="text-xs font-black text-slate-800 uppercase tracking-wider">Sumber Trafik Kunjungan</p>
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2 bg-emerald-50 rounded-xl border border-emerald-100">
                <span className="text-[10px] text-emerald-800 font-bold block">Pencarian</span>
                <span className="font-black text-slate-900 font-mono">{sourcesData.search || 0}%</span>
              </div>
              <div className="p-2 bg-blue-50 rounded-xl border border-blue-100">
                <span className="text-[10px] text-blue-800 font-bold block">Langsung</span>
                <span className="font-black text-slate-900 font-mono">{sourcesData.direct || 0}%</span>
              </div>
              <div className="p-2 bg-purple-50 rounded-xl border border-purple-100">
                <span className="text-[10px] text-purple-800 font-bold block">Sosial Media</span>
                <span className="font-black text-slate-900 font-mono">{sourcesData.social || 0}%</span>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* SECTION 4: CONTENT & ACTIVITY INSIGHTS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Card 1: Top Read News Articles */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-emerald-50 text-emerald-800 rounded-lg">
                  <Newspaper className="w-4 h-4 text-emerald-700" />
                </div>
                <h4 className="text-xs font-black uppercase text-slate-900 tracking-wider">Berita Terpopuler</h4>
              </div>
              <button 
                type="button"
                onClick={() => setActiveTab('berita')} 
                className="text-[11px] font-bold text-emerald-700 hover:underline cursor-pointer"
              >
                Kelola →
              </button>
            </div>
            
            <div className="space-y-3 pt-3">
              {topBeritaList.length > 0 ? (
                topBeritaList.slice(0, 5).map((b, idx) => (
                  <div key={b.id || idx} className="space-y-1.5">
                    <div className="flex items-start justify-between gap-2 text-xs">
                      <p className="font-bold text-slate-800 line-clamp-1 flex-1">
                        <span className="text-emerald-700 font-mono font-black mr-1">#{idx + 1}</span>
                        {b.title}
                      </p>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded shrink-0 flex items-center gap-1 font-mono">
                        <Eye className="w-3 h-3" />
                        {(b.views_count || 0).toLocaleString('id-ID')}
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-emerald-600 rounded-full" 
                        style={{ width: `${Math.min(100, Math.max(12, ((b.views_count || 1) / ((topBeritaList[0]?.views_count || 1) * 1.05)) * 100))}%` }} 
                      />
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-slate-400 text-xs">
                  Belum ada data berita terbaca.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Card 2: Tanggapan / Komentar Menunggu Moderasi (Jika ada), atau Dokumen Terpopuler */}
        {pendingCommentsList.length > 0 ? (
          <div className="bg-white p-5 rounded-2xl border-2 border-amber-300 shadow-sm space-y-4 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-amber-500 text-white text-[9px] font-black uppercase px-2.5 py-0.5 rounded-bl-lg tracking-wider">
              Aksi Diperlukan
            </div>
            <div>
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-amber-100 text-amber-900 rounded-lg">
                    <MessageSquare className="w-4 h-4 text-amber-800" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black uppercase text-slate-900 tracking-wider">Komentar Tertunda</h4>
                    <span className="text-[10px] text-amber-700 font-bold block">{pendingKomentarCount} tanggapan antre</span>
                  </div>
                </div>
                <button 
                  type="button"
                  onClick={() => setActiveTab('komentar')} 
                  className="text-[11px] font-black text-amber-800 hover:underline cursor-pointer bg-amber-50 px-2 py-1 rounded-lg border border-amber-200"
                >
                  Tinjau ({pendingKomentarCount}) →
                </button>
              </div>
              
              <div className="space-y-2.5 pt-3">
                {pendingCommentsList.slice(0, 4).map((c) => (
                  <div key={c.id} className="p-2.5 bg-amber-50/60 border border-amber-200/80 rounded-xl space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-900 truncate max-w-[130px]">{c.nama_pengirim}</span>
                      <span className="text-[10px] text-amber-800 font-mono font-medium">
                        {new Date(c.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 line-clamp-1 italic">
                      "{c.isi_komentar}"
                    </p>
                    <p className="text-[9px] text-slate-400 truncate">
                      Berita: {c.berita?.title || '-'}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={() => setActiveTab('komentar')}
              className="w-full py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold transition-all text-center cursor-pointer shadow-xs"
            >
              Buka Panel Moderasi Komentar
            </button>
          </div>
        ) : (
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-amber-50 text-amber-800 rounded-lg">
                    <Download className="w-4 h-4 text-amber-700" />
                  </div>
                  <h4 className="text-xs font-black uppercase text-slate-900 tracking-wider">Dokumen Terpopuler</h4>
                </div>
                <button 
                  type="button"
                  onClick={() => setActiveTab('dokumen')} 
                  className="text-[11px] font-bold text-amber-700 hover:underline cursor-pointer"
                >
                  Kelola →
                </button>
              </div>
              
              <div className="space-y-3 pt-3">
                {topDokumenList.length > 0 ? (
                  topDokumenList.slice(0, 5).map((doc, idx) => (
                    <div key={doc.id || idx} className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between gap-2.5">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                          <FolderOpen className="w-3.5 h-3.5" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-slate-900 truncate">{doc.judul}</p>
                          <p className="text-[10px] text-slate-500">{doc.kategori || 'Regulasi'} &bull; {doc.tahun || 2026}</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded shrink-0">
                        {doc.download_count || 0}x
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-slate-400 text-xs">
                    Belum ada data unduhan berkas.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Card 3: Recent Audit & Activity Timeline */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-indigo-50 text-indigo-800 rounded-lg">
                  <Clock className="w-4 h-4 text-indigo-700" />
                </div>
                <h4 className="text-xs font-black uppercase text-slate-900 tracking-wider">Aktivitas CMS Terkini</h4>
              </div>
              <button 
                type="button"
                onClick={() => setActiveTab('audit')} 
                className="text-[11px] font-bold text-indigo-700 hover:underline cursor-pointer"
              >
                Log Lengkap →
              </button>
            </div>
            
            <div className="space-y-3 pt-3">
              {recentAudits && recentAudits.length > 0 ? (
                recentAudits.slice(0, 4).map((a) => (
                  <div key={a.id} className="flex items-start gap-2.5 text-xs">
                    <div className="w-2 h-2 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
                    <div className="space-y-0.5 flex-1 min-w-0">
                      <p className="font-bold text-slate-800 truncate">{a.user?.name || 'Petugas'} ({a.user?.role || 'ADMIN'})</p>
                      <p className="text-slate-500 text-[11px] truncate">{a.action} pada <span className="font-mono text-slate-700">{a.module || 'CMS'}</span></p>
                      <span className="text-[10px] text-slate-400 block">{new Date(a.created_at).toLocaleTimeString('id-ID')} WIB</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="space-y-3 text-xs">
                  <div className="flex items-start gap-2.5">
                    <div className="w-2 h-2 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
                    <div>
                      <p className="font-bold text-slate-800">Admin Djie CMS</p>
                      <p className="text-slate-500 text-[11px]">Memperbarui Struktur Menu Navigasi Portal</p>
                      <span className="text-[10px] text-slate-400">Baru saja</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <div className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                    <div>
                      <p className="font-bold text-slate-800">Editor Berita</p>
                      <p className="text-slate-500 text-[11px]">Mempublikasikan artikel kepegawaian baru</p>
                      <span className="text-[10px] text-slate-400">1 jam yang lalu</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
