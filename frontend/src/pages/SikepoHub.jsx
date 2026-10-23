import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  ExternalLink, 
  Search, 
  Award, 
  Clock, 
  Calendar, 
  FileText, 
  UserCheck, 
  Users, 
  Laptop, 
  CheckCircle2, 
  ArrowRight, 
  HelpCircle, 
  ChevronRight, 
  Sparkles,
  Smartphone,
  DownloadCloud,
  FileCheck,
  Building2,
  Lock,
  Compass,
  AlertCircle
} from 'lucide-react';
import SEOHead from '../components/common/SEOHead';
import FloatingActionBars from '../components/common/FloatingActionBars';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';

export default function SikepoHub() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [trackingNip, setTrackingNip] = useState('');
  const [trackingResult, setTrackingResult] = useState(null);
  const [isSearchingTracking, setIsSearchingTracking] = useState(false);

  const modules = [
    {
      id: 'kp',
      category: 'karier',
      title: 'Kenaikan Pangkat (KP 6 Periode)',
      desc: 'Pengusulan kenaikan pangkat reguler, pilihan, dan fungsional terintegrasi SIASN BKN (Feb, Apr, Jun, Ags, Okt, Des).',
      icon: Award,
      badge: 'Terintegrasi SIASN',
      color: 'from-emerald-500 to-teal-700',
      tag: 'Otomatisasi Berkas',
      link: 'https://sikepo.acehtamiangkab.go.id/layanan/kp'
    },
    {
      id: 'kgb',
      category: 'karier',
      title: 'Kenaikan Gaji Berkala (KGB Online)',
      desc: 'Notifikasi otomatis dan penerbitan SK KGB secara digital per 2 tahun masa kerja tanpa perlu pengajuan manual berbelit.',
      icon: Clock,
      badge: 'Auto-Trigger',
      color: 'from-amber-500 to-yellow-600',
      tag: 'Paperless',
      link: 'https://sikepo.acehtamiangkab.go.id/layanan/kgb'
    },
    {
      id: 'presensi',
      category: 'kinerja',
      title: 'Presensi Mobile GPS & Biometrik',
      desc: 'Perekaman kehadiran ASN & Non-ASN berbasis geotagging radius kantor dan verifikasi wajah anti-fake GPS.',
      icon: Smartphone,
      badge: 'Mobile App',
      color: 'from-blue-600 to-indigo-700',
      tag: 'Real-time GPS',
      link: 'https://sikepo.acehtamiangkab.go.id/presensi'
    },
    {
      id: 'ekinerja',
      category: 'kinerja',
      title: 'E-Kinerja & SKP Terpadu',
      desc: 'Penyusunan Sasaran Kinerja Pegawai (SKP) periodik & tahunan sesuai PermenPAN-RB No. 6/2022 terhubung E-Kinerja BKN.',
      icon: FileCheck,
      badge: 'BKN Sync',
      color: 'from-emerald-600 to-green-700',
      tag: 'Sinkron BKN',
      link: 'https://sikepo.acehtamiangkab.go.id/ekinerja'
    },
    {
      id: 'cuti',
      category: 'kinerja',
      title: 'Manajemen Cuti ASN Online',
      desc: 'Pengajuan cuti tahunan, cuti sakit, cuti bersalin, hingga CLTN dengan workflow persetujuan atasan langsung secara digital.',
      icon: Calendar,
      badge: 'Approval Hierarki',
      color: 'from-purple-600 to-indigo-800',
      tag: 'Cepat & Transparan',
      link: 'https://sikepo.acehtamiangkab.go.id/layanan/cuti'
    },
    {
      id: 'mutasi',
      category: 'karier',
      title: 'Mutasi & Rotasi Jabatan',
      desc: 'Layanan pindah instansi (antar OPD, antar kabupaten/kota, provinsi, maupun instansi pusat) dengan pelacakan berkas.',
      icon: Users,
      badge: 'Multi-Verifikasi',
      color: 'from-teal-600 to-emerald-800',
      tag: 'Transparan',
      link: 'https://sikepo.acehtamiangkab.go.id/layanan/mutasi'
    },
    {
      id: 'pensiun',
      category: 'pensiun',
      title: 'Layanan Pensiun BUP & Janda/Duda',
      desc: 'Pemberkasan pensiun 1 tahun sebelum BUP dengan integrasi langsung ke SIASN BKN dan klaim otomatis PT Taspen.',
      icon: UserCheck,
      badge: 'Taspen & BKN',
      color: 'from-orange-500 to-amber-700',
      tag: 'One-Stop Service',
      link: 'https://sikepo.acehtamiangkab.go.id/layanan/pensiun'
    },
    {
      id: 'efile',
      category: 'arsip',
      title: 'E-DMS & Arsip Dokumen Digital',
      desc: 'Penyimpanan terenkripsi seluruh berkas SK, Ijazah, Transkrip, Sertifikat, dan PAK ASN dengan TTE BSrE tersertifikasi.',
      icon: Lock,
      badge: 'TTE BSrE',
      color: 'from-slate-700 to-slate-900',
      tag: 'Arsip Abadi',
      link: 'https://sikepo.acehtamiangkab.go.id/edms'
    },
    {
      id: 'ukom',
      category: 'karier',
      title: 'Uji Kompetensi & Asesmen Talenta',
      desc: 'Pendaftaran uji kompetensi kenaikan jenjang jabatan fungsional dan pemetaan talenta (Nine-Box Grid).',
      icon: Sparkles,
      badge: 'Manajemen Talenta',
      color: 'from-sky-600 to-blue-800',
      tag: 'Merit Sistem',
      link: 'https://sikepo.acehtamiangkab.go.id/asesmen'
    }
  ];

  const filteredModules = modules.filter((m) => {
    const matchCat = activeCategory === 'all' || m.category === activeCategory;
    const matchSearch = m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        m.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        m.tag.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  const handleTrackSubmit = (e) => {
    e.preventDefault();
    if (!trackingNip.trim()) return;
    setIsSearchingTracking(true);
    setTimeout(() => {
      setIsSearchingTracking(false);
      setTrackingResult({
        nip: trackingNip,
        nama: 'Ahmad Fauzi, S.STP., M.AP.',
        layanan: 'Usulan Kenaikan Pangkat Reguler (Gol. IV/a)',
        opd: 'Badan Kepegawaian & Pengembangan SDM',
        status: 'VERIFIKASI_BKN',
        step: 3,
        updatedAt: '06 Oktober 2026, 14:30 WIB',
        history: [
          { step: 'Pengusulan oleh Operator OPD', date: '28 September 2026', done: true },
          { step: 'Verifikasi Berkas BKPSDM Aceh Tamiang', date: '02 Oktober 2026', done: true },
          { step: 'Pengiriman & Validasi SIASN BKN Kanreg XIII', date: '06 Oktober 2026', done: true, current: true },
          { step: 'Penerbitan Persetujuan Teknis (Pertek) BKN', date: 'Estimasi 12 Okt 2026', done: false },
          { step: 'Penandatanganan SK Digital (TTE Bupati)', date: 'Estimasi 16 Okt 2026', done: false }
        ]
      });
    }, 600);
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      <SEOHead 
        title="SiKEPO (Sistem Kepegawaian Online) - BKPSDM Kab. Aceh Tamiang"
        description="Pusat layanan kepegawaian digital SiKEPO Pemerintah Kabupaten Aceh Tamiang. Akses layanan kenaikan pangkat, KGB, e-Kinerja, presensi, cuti, dan pensiun terintegrasi SIASN BKN."
        keywords="SiKEPO Aceh Tamiang, Sistem Kepegawaian Online Aceh Tamiang, BKPSDM Aceh Tamiang, SIASN BKN, E-Kinerja Aceh Tamiang, Presensi ASN Aceh Tamiang"
        canonicalUrl="https://layanan.acehtamiangkab.go.id/sikepo"
      />

      {/* Hero SiKEPO */}
      <section className="relative pt-32 pb-20 bg-gradient-to-br from-[#021f0f] via-[#052e16] to-[#064e3b] text-white overflow-hidden">
        {/* Background Islamic Geometric Pattern Glow */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#facc15_1px,transparent_1px)] [background-size:24px_24px]"></div>
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-amber-400/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-emerald-400/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            
            {/* Left Col */}
            <div className="lg:w-7/12 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-400/20 border border-amber-300/40 text-amber-300 text-xs font-bold uppercase tracking-wider mb-5">
                <ShieldCheck className="w-4 h-4" />
                <span>Portal Resmi Manajemen ASN Digital</span>
              </div>

              {/* Official Logo Banner */}
              <div className="mb-4 flex items-center justify-center lg:justify-start">
                <div className="p-3 bg-white/95 rounded-2xl shadow-lg border border-amber-300/30 inline-block backdrop-blur-sm">
                  <img 
                    src="/logo-sikepo.webp" 
                    alt="Logo Resmi SiKEPO Aceh Tamiang" 
                    className="h-10 sm:h-12 w-auto object-contain"
                  />
                </div>
              </div>

              <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight mb-4">
                SiKEPO <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400">Aceh Tamiang</span>
              </h1>
              <p className="text-emerald-100/90 text-base sm:text-lg font-medium leading-relaxed mb-8 max-w-2xl">
                <span className="font-bold text-white">Sistem Kepegawaian Online</span> — Ekosistem digital terpadu BKPSDM Kabupaten Aceh Tamiang yang mengintegrasikan layanan karier, kinerja, presensi GPS, dan administrasi ASN berbasis paperless & terhubung langsung dengan SIASN BKN.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4">
                <a
                  href="https://sikepo.acehtamiangkab.go.id"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-sm rounded-xl shadow-lg hover:shadow-amber-400/30 transition-all hover:scale-105"
                >
                  <Laptop className="w-4 h-4" />
                  <span>Buka Portal SiKEPO (SSO)</span>
                  <ExternalLink className="w-4 h-4 opacity-70" />
                </a>
                <a
                  href="#tracking"
                  className="inline-flex items-center gap-2 px-6 py-3.5 bg-emerald-900/80 hover:bg-emerald-800 text-emerald-100 font-bold text-sm rounded-xl border border-emerald-700/60 shadow-md transition-all hover:scale-105"
                >
                  <Search className="w-4 h-4 text-amber-400" />
                  <span>Lacak Usulan Berkas</span>
                </a>
              </div>

              {/* Trust Badges */}
              <div className="mt-10 pt-6 border-t border-emerald-800/80 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-emerald-200/80 font-medium">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-amber-400" />
                  <span>Terintegrasi SIASN BKN</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-amber-400" />
                  <span>TTE Bersertifikasi BSrE</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-amber-400" />
                  <span>SLA Maksimal 3 Hari Kerja</span>
                </div>
              </div>
            </div>

            {/* Right Col: Quick Status Box */}
            <div className="lg:w-5/12 w-full">
              <div className="bg-emerald-950/70 backdrop-blur-xl border border-emerald-700/50 rounded-3xl p-6 sm:p-8 shadow-2xl relative">
                <div className="flex items-center justify-between border-b border-emerald-800/80 pb-4 mb-6">
                  <div>
                    <h2 className="text-white font-bold text-base">Status Sistem & Layanan</h2>
                    <p className="text-emerald-300 text-xs">BKPSDM Kab. Aceh Tamiang</p>
                  </div>
                  <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-bold">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                    Semua Server Online
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-emerald-900/40 border border-emerald-800/60 rounded-2xl p-4">
                    <p className="text-xs text-emerald-300 font-medium mb-1">Total ASN Terlayani</p>
                    <p className="text-2xl font-black text-amber-300">4.892+</p>
                    <span className="text-[10px] text-emerald-400">PNS & PPPK Tamiang</span>
                  </div>
                  <div className="bg-emerald-900/40 border border-emerald-800/60 rounded-2xl p-4">
                    <p className="text-xs text-emerald-300 font-medium mb-1">SK Terbit (TTE)</p>
                    <p className="text-2xl font-black text-white">12.450+</p>
                    <span className="text-[10px] text-amber-300">Tersertifikasi BSrE</span>
                  </div>
                  <div className="bg-emerald-900/40 border border-emerald-800/60 rounded-2xl p-4">
                    <p className="text-xs text-emerald-300 font-medium mb-1">KGB Otomatis Terbit</p>
                    <p className="text-2xl font-black text-white">1.840</p>
                    <span className="text-[10px] text-emerald-400">Tahun 2026</span>
                  </div>
                  <div className="bg-emerald-900/40 border border-emerald-800/60 rounded-2xl p-4">
                    <p className="text-xs text-emerald-300 font-medium mb-1">Tingkat Kepuasan</p>
                    <p className="text-2xl font-black text-amber-300">98.4%</p>
                    <span className="text-[10px] text-emerald-400">Indeks Pelayanan</span>
                  </div>
                </div>

                <a
                  href="https://sikepo.acehtamiangkab.go.id/login"
                  target="_blank"
                  rel="noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs rounded-xl shadow transition-all"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Login ASN Menggunakan NIP & Password</span>
                </a>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Main Modules Directory */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title & Filter */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold text-emerald-800 uppercase tracking-widest mb-2">
              <Compass className="w-4 h-4 text-amber-500" />
              <span>Katalog Modul Layanan SiKEPO</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Pilih Modul Kepegawaian Sesuai Kebutuhan Anda
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Seluruh usulan diproses secara terintegrasi dengan validasi data real-time.
            </p>
          </div>

          {/* Search Box */}
          <div className="w-full md:w-72 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari modul layanan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent shadow-sm"
            />
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap items-center gap-2 mb-8 pb-4 border-b border-slate-200">
          {[
            { key: 'all', label: 'Semua Modul' },
            { key: 'karier', label: 'Karier & Kepangkatan' },
            { key: 'kinerja', label: 'Kinerja & Presensi' },
            { key: 'pensiun', label: 'Pensiun & Kesejahteraan' },
            { key: 'arsip', label: 'Dokumen Digital (E-DMS)' }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveCategory(tab.key)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeCategory === tab.key
                  ? 'bg-emerald-900 text-white shadow-md'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Module Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredModules.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm hover:shadow-xl hover:border-emerald-500/40 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <Badge variant="amber" size="sm">
                      {item.badge}
                    </Badge>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-800 transition-colors mb-2">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed mb-6">
                    {item.desc}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md">
                    {item.tag}
                  </span>
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-900 hover:text-amber-600 transition-colors"
                  >
                    <span>Buka Layanan</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>

      </section>

      {/* Tracking Section */}
      <section id="tracking" className="py-16 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#facc15_1px,transparent_1px)] [background-size:20px_20px]"></div>
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="text-center mb-8">
            <Badge variant="amber" size="sm" className="mb-3">
              Pelacakan Real-Time
            </Badge>
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight">
              Lacak Status Usulan Kepegawaian
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-2">
              Masukkan Nomor Induk Pegawai (NIP) 18 digit untuk memantau progres berkas Anda.
            </p>
          </div>

          <form onSubmit={handleTrackSubmit} className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto mb-8">
            <div className="relative flex-1">
              <UserCheck className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Contoh: 198507152010011005"
                value={trackingNip}
                onChange={(e) => setTrackingNip(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 text-sm bg-slate-800 border border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 text-white placeholder-slate-500 font-mono"
              />
            </div>
            <button
              type="submit"
              disabled={isSearchingTracking}
              className="px-6 py-3.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2 shrink-0 disabled:opacity-50"
            >
              <Search className="w-4 h-4" />
              <span>{isSearchingTracking ? 'Memeriksa...' : 'Lacak Sekarang'}</span>
            </button>
          </form>

          {/* Tracking Result View */}
          {trackingResult && (
            <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-6 sm:p-8 shadow-2xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-700 gap-4 mb-6">
                <div>
                  <span className="text-[11px] font-bold text-amber-400 uppercase tracking-widest">
                    Informasi Pegawai
                  </span>
                  <h3 className="text-lg font-black text-white mt-0.5">{trackingResult.nama}</h3>
                  <p className="text-xs text-slate-400 font-mono">NIP: {trackingResult.nip} • {trackingResult.opd}</p>
                </div>
                <div className="text-left sm:text-right">
                  <span className="inline-block px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-bold">
                    {trackingResult.status}
                  </span>
                  <p className="text-[10px] text-slate-400 mt-1">Update: {trackingResult.updatedAt}</p>
                </div>
              </div>

              {/* Stepper */}
              <div className="space-y-4">
                <p className="text-xs font-bold text-slate-300 mb-2">Tahapan Proses:</p>
                {trackingResult.history.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-4">
                    <div className="pt-0.5">
                      {step.done ? (
                        <div className="w-6 h-6 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center text-xs font-black shadow-md">
                          ✓
                        </div>
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-slate-700 border border-slate-600 text-slate-400 flex items-center justify-center text-xs">
                          {idx + 1}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 pb-2">
                      <p className={`text-xs font-bold ${step.current ? 'text-amber-300' : step.done ? 'text-white' : 'text-slate-500'}`}>
                        {step.step}
                      </p>
                      <p className="text-[11px] text-slate-400">{step.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Workflow Steps */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <Badge variant="emerald" size="sm" className="mb-2">
            Mekanisme & Alur Kerja
          </Badge>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Bagaimana Layanan SiKEPO Bekerja?
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-2">
            Proses terstandarisasi bebas pungli, transparan, dan dapat dipantau dari perangkat mana saja.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            {
              step: '01',
              title: 'Login Akun ASN',
              desc: 'Masuk menggunakan NIP resmi di portal SiKEPO atau Aplikasi Presensi Mobile Aceh Tamiang.'
            },
            {
              step: '02',
              title: 'Pilih & Unggah Syarat',
              desc: 'Pilih modul layanan kepegawaian lalu unggah dokumen pendukung secara digital (PDF/Foto).'
            },
            {
              step: '03',
              title: 'Verifikasi & Validasi',
              desc: 'BKPSDM memverifikasi berkas dan mensinkronisasikan usulan ke SIASN BKN Kanreg XIII.'
            },
            {
              step: '04',
              title: 'Penerbitan SK (TTE)',
              desc: 'SK Digital dengan tanda tangan elektronik resmi Bupati/Sekda terbit dan dapat diunduh langsung.'
            }
          ].map((item, idx) => (
            <div key={idx} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm relative overflow-hidden">
              <span className="text-4xl font-black text-emerald-900/10 absolute top-4 right-4">
                {item.step}
              </span>
              <div className="w-8 h-8 rounded-lg bg-emerald-900 text-amber-300 font-black text-xs flex items-center justify-center mb-4">
                {item.step}
              </div>
              <h4 className="text-base font-bold text-slate-900 mb-2">{item.title}</h4>
              <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Floating Action Bars */}
      <FloatingActionBars />
    </div>
  );
}
