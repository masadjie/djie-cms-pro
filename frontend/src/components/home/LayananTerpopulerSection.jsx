import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  TrendingUp, 
  GraduationCap, 
  Award, 
  Users, 
  Building2, 
  ArrowRight, 
  Check, 
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Search,
  FileText,
  BadgeCheck,
  UserCheck,
  Layers,
  PhoneCall,
  Mail,
  ExternalLink,
  PieChart,
  SlidersHorizontal,
  BookmarkCheck
} from 'lucide-react';

export default function LayananTerpopulerSection() {
  const [activeTab, setActiveTab] = useState('ALL');

  // 6 Card Showcase mimicking Wiza layout adapted for BKPSDM Aceh Tamiang
  const featureCards = [
    {
      id: 'MUTASI',
      tag: 'Bidang Mutasi & Kepangkatan',
      title: 'Kenaikan Pangkat 6 Periode & Mutasi',
      desc: 'Pengusulan berkala Kenaikan Pangkat (KP) otomatis terintegrasi SIASN BKN dan rekomendasi mutasi antar-instansi.',
      slug: '/katalog?search=Mutasi',
      // Visual component mimicking Card 1 (Sales Navigator / Search filters & People pills)
      renderVisual: () => (
        <div className="relative w-full h-48 bg-gradient-to-b from-slate-50 to-indigo-50/40 rounded-2xl p-3.5 border border-slate-100 flex flex-col justify-between overflow-hidden shadow-inner">
          {/* Header pill */}
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white border border-slate-200 shadow-2xs self-start">
            <span className="w-2 h-2 rounded-full bg-emerald-600" />
            <span className="text-[10px] font-bold text-slate-700">SIASN BKN Terpadu</span>
          </div>

          {/* Filter Pill Row */}
          <div className="grid grid-cols-3 gap-1.5 my-1">
            <div className="bg-white/90 p-1.5 rounded-lg border border-slate-200/80 shadow-2xs">
              <span className="text-[9px] text-slate-400 block font-medium">Periode Usul</span>
              <span className="text-[10px] font-bold text-slate-800 truncate block">6x / Tahun</span>
            </div>
            <div className="bg-white/90 p-1.5 rounded-lg border border-slate-200/80 shadow-2xs">
              <span className="text-[9px] text-slate-400 block font-medium">Jenis Layanan</span>
              <span className="text-[10px] font-bold text-slate-800 truncate block">KP Reguler & Pilihan</span>
            </div>
            <div className="bg-white/90 p-1.5 rounded-lg border border-slate-200/80 shadow-2xs">
              <span className="text-[9px] text-slate-400 block font-medium">Status Berkas</span>
              <span className="text-[10px] font-bold text-emerald-600 truncate block">ACC BKN</span>
            </div>
          </div>

          {/* Avatar Cards */}
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-white p-2 rounded-xl border border-slate-200/90 shadow-xs flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center shrink-0">
                AR
              </div>
              <div className="overflow-hidden min-w-0">
                <p className="text-[11px] font-bold text-slate-800 truncate">Ahmad Rizky, S.STP</p>
                <p className="text-[9px] text-slate-400 truncate">Penata Tk.I (III/d)</p>
              </div>
            </div>
            <div className="flex-1 bg-white p-2 rounded-xl border border-slate-200/90 shadow-xs flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-teal-100 text-teal-800 font-bold text-xs flex items-center justify-center shrink-0">
                SN
              </div>
              <div className="overflow-hidden min-w-0">
                <p className="text-[11px] font-bold text-slate-800 truncate">Siti Nurhaliza, M.Si</p>
                <p className="text-[9px] text-slate-400 truncate">Pembina (IV/a)</p>
              </div>
            </div>
          </div>

          {/* Floating Action Badge */}
          <div className="bg-white/95 rounded-lg border border-emerald-200/80 py-1.5 px-3 flex items-center justify-between text-[10px] shadow-xs">
            <span className="font-bold text-slate-700 flex items-center gap-1.5">
              <TrendingUp className="w-3 h-3 text-emerald-600" />
              Sinkronisasi SK Kenaikan Pangkat
            </span>
            <span className="font-mono text-emerald-600 font-bold">100% Digital</span>
          </div>
        </div>
      )
    },
    {
      id: 'BANGKOM',
      tag: 'Bidang Pengembangan SDM',
      title: 'Izin Belajar & Uji Kompetensi ASN',
      desc: 'Peningkatan kualifikasi pendidikan aparatur dan asesmen kompetensi ASN berbasis meritokrasi terverifikasi.',
      slug: '/katalog?search=Belajar',
      // Visual component mimicking Card 2 (Elanor Pera + Verified checkmark badge floating)
      renderVisual: () => (
        <div className="relative w-full h-48 bg-gradient-to-b from-slate-50 to-blue-50/40 rounded-2xl p-3.5 border border-slate-100 flex flex-col items-center justify-center overflow-hidden shadow-inner">
          {/* Subtle grid pattern bg */}
          <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:8px_8px]" />

          {/* Verified badge top right */}
          <div className="absolute top-3 right-3 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[9px] font-bold">
            <Check className="w-2.5 h-2.5 stroke-[3]" /> Terverifikasi
          </div>

          {/* Center Profile Badge */}
          <div className="bg-white rounded-2xl p-3.5 border border-slate-200/90 shadow-md text-center max-w-[210px] w-full z-10 space-y-1.5">
            <div className="relative inline-block mx-auto">
              <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 text-white font-black text-sm flex items-center justify-center shadow-md">
                BK
              </div>
              <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800">Surat Izin Belajar (SIB)</p>
              <p className="text-[10px] text-slate-400 font-mono">ID: SIB-2026/TAM-089</p>
            </div>
            <div className="pt-1.5 border-t border-slate-100 flex items-center justify-center gap-1.5 text-[10px] text-emerald-700 font-semibold">
              <BadgeCheck className="w-3.5 h-3.5" />
              <span>SK Akreditasi BAN-PT</span>
            </div>
          </div>

          {/* Floating watermark behind */}
          <div className="mt-2 text-slate-300 font-bold text-[10px] uppercase tracking-widest flex items-center gap-1">
            <GraduationCap className="w-3.5 h-3.5" /> Bangkom ASN Digital
          </div>
        </div>
      )
    },
    {
      id: 'PLATFORM',
      tag: 'Ekosistem Terintegrasi',
      title: 'Koneksi Terpadu Multi-Sistem BKN',
      desc: 'Terhubung langsung dengan seluruh instrumen layanan kepegawaian nasional: SIASN, MyASN, SSCASN, dan SiKEPO.',
      slug: '/sikepo',
      // Visual component mimicking Card 3 (Stacked logo pill tabs: wiza, Recruiter, Sales Nav, LinkedIn)
      renderVisual: () => (
        <div className="relative w-full h-48 bg-gradient-to-b from-slate-50 to-indigo-50/50 rounded-2xl p-4 border border-slate-100 flex flex-col items-center justify-center gap-2 overflow-hidden shadow-inner">
          <div className="w-full max-w-[220px] space-y-1.5">
            {/* Pill 1 */}
            <div className="bg-white rounded-xl py-1.5 px-3 border border-slate-200/90 shadow-2xs flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-xs font-bold text-slate-800">SiKEPO Aceh Tamiang</span>
              </div>
              <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">OPD</span>
            </div>
            {/* Pill 2 */}
            <div className="bg-white rounded-xl py-1.5 px-3 border border-slate-200/90 shadow-2xs flex items-center justify-between ml-2">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                <span className="text-xs font-bold text-slate-800">SIASN BKN Pusat</span>
              </div>
              <span className="text-[9px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">Nasional</span>
            </div>
            {/* Pill 3 */}
            <div className="bg-white rounded-xl py-1.5 px-3 border border-slate-200/90 shadow-2xs flex items-center justify-between mr-2">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-indigo-500" />
                <span className="text-xs font-bold text-slate-800">MyASN ASN Personal</span>
              </div>
              <span className="text-[9px] font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">Mobile</span>
            </div>
            {/* Pill 4 */}
            <div className="bg-slate-900 text-white rounded-xl py-1.5 px-3 shadow-xs flex items-center justify-center gap-2">
              <Layers className="w-3 h-3 text-amber-400" />
              <span className="text-xs font-bold">Sinkronisasi Satu Data ASN</span>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'PERENCANAAN',
      tag: 'Bidang Perencanaan & Pembinaan',
      title: 'Peta Formasi ASN & e-Kinerja BKN',
      desc: 'Penetapan formasi CASN/PPPK, verifikasi SKP kinerja triwulanan, dan rekomendasi pembayaran TPP aparatur.',
      slug: '/katalog?search=Kinerja',
      // Visual component mimicking Card 4 (Phone Number, Company, Headcount, CSV download button)
      renderVisual: () => (
        <div className="relative w-full h-48 bg-gradient-to-b from-slate-50 to-amber-50/40 rounded-2xl p-3 border border-slate-100 flex flex-col justify-between overflow-hidden shadow-inner">
          <div className="grid grid-cols-2 gap-1.5">
            <div className="bg-white p-2 rounded-xl border border-slate-200/80 shadow-2xs">
              <span className="text-[9px] text-slate-400 block font-medium">Total ASN Pemkab</span>
              <span className="text-xs font-extrabold text-slate-800">4.892 Pegawai</span>
            </div>
            <div className="bg-white p-2 rounded-xl border border-slate-200/80 shadow-2xs">
              <span className="text-[9px] text-slate-400 block font-medium">Predikat SKP</span>
              <span className="text-xs font-extrabold text-emerald-600">Sangat Baik (98%)</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-1.5">
            <div className="bg-white p-2 rounded-xl border border-slate-200/80 shadow-2xs">
              <span className="text-[9px] text-slate-400 block font-medium">Formasi CASN</span>
              <span className="text-[11px] font-bold text-slate-800">PNS & PPPK 2026</span>
            </div>
            <div className="bg-white p-2 rounded-xl border border-slate-200/80 shadow-2xs">
              <span className="text-[9px] text-slate-400 block font-medium">Integrasi</span>
              <span className="text-[11px] font-bold text-slate-800">e-Kinerja BKN</span>
            </div>
          </div>

          {/* Download CSV pill like reference */}
          <div className="bg-white rounded-xl py-1.5 px-3 border border-slate-200/90 shadow-2xs flex items-center justify-between text-[10px]">
            <span className="font-bold text-slate-700 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-amber-500" />
              rekap_skp_tpp_2026.csv
            </span>
            <span className="text-[9px] font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">Tervalidasi</span>
          </div>
        </div>
      )
    },
    {
      id: 'SEKRETARIAT',
      tag: 'Sekretariat & E-Cuti Online',
      title: 'E-Cuti SiKEPO & Saldo Hari Kerja',
      desc: 'Pengajuan dan persetujuan cuti tahunan, sakit, atau melahirkan secara paperless dengan kuota hari otomatis.',
      slug: '/katalog?search=Cuti',
      // Visual component mimicking Card 5 (Circular progress charts + 64 Email credits left / 73 Phone credits left)
      renderVisual: () => (
        <div className="relative w-full h-48 bg-gradient-to-b from-slate-50 to-teal-50/40 rounded-2xl p-4 border border-slate-100 flex flex-col items-center justify-center overflow-hidden shadow-inner">
          <div className="bg-white rounded-2xl p-3.5 border border-slate-200/90 shadow-md w-full max-w-[210px] space-y-2.5">
            {/* Stat Row 1 */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full border-4 border-amber-400 border-t-amber-100 flex items-center justify-center shrink-0">
                <span className="text-[9px] font-black text-amber-600">12</span>
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-bold text-slate-800">12 Hari Sisa</p>
                <p className="text-[9px] text-slate-400">Hak Cuti Tahunan 2026</p>
              </div>
            </div>

            {/* Stat Row 2 */}
            <div className="flex items-center gap-3 pt-2 border-t border-slate-100">
              <div className="w-8 h-8 rounded-full border-4 border-emerald-500 border-r-emerald-100 flex items-center justify-center shrink-0">
                <span className="text-[9px] font-black text-emerald-700">100%</span>
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-bold text-slate-800">Paperless Approval</p>
                <p className="text-[9px] text-slate-400">Verifikasi Atasan Langsung</p>
              </div>
            </div>
          </div>
          <p className="text-[10px] text-slate-400 mt-2 font-medium">Persetujuan E-Cuti Terbit &lt; 24 Jam</p>
        </div>
      )
    },
    {
      id: 'HELPDESK',
      tag: 'Layanan Pengadaan, Informasi & PPID',
      title: 'Konsultasi & Kontak Helpdesk Terpadu',
      desc: 'Saluran resmi konsultasi CASN, SK Pensiun, Karpeg Virtual, dan helpdesk langsung dengan analis kepegawaian.',
      slug: '/katalog?search=Pensiun',
      // Visual component mimicking Card 6 (Profile circle with magnify lens effect + email / phone contact points)
      renderVisual: () => (
        <div className="relative w-full h-48 bg-gradient-to-b from-slate-50 to-indigo-50/40 rounded-2xl p-3.5 border border-slate-100 flex flex-col justify-between overflow-hidden shadow-inner">
          {/* Top user row */}
          <div className="flex items-center gap-2 bg-white p-2 rounded-xl border border-slate-200/80 shadow-2xs">
            <div className="w-7 h-7 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center shrink-0">
              BK
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-bold text-slate-800 truncate">Helpdesk ASN Aceh Tamiang</p>
              <p className="text-[9px] text-emerald-600 font-semibold">Online Hari Kerja (08.00 - 16.30 WIB)</p>
            </div>
          </div>

          {/* Contact points badge with copy icon button look */}
          <div className="space-y-1.5 my-1">
            <div className="bg-white p-1.5 px-2.5 rounded-lg border border-slate-200/80 shadow-2xs flex items-center justify-between text-[10px]">
              <div className="flex items-center gap-1.5 text-slate-700 truncate">
                <Mail className="w-3 h-3 text-indigo-500 shrink-0" />
                <span className="font-mono truncate">bkpsdm@acehtamiangkab.go.id</span>
              </div>
              <span className="text-[9px] font-bold text-slate-400 bg-slate-100 px-1 rounded">Resmi</span>
            </div>
            <div className="bg-white p-1.5 px-2.5 rounded-lg border border-slate-200/80 shadow-2xs flex items-center justify-between text-[10px]">
              <div className="flex items-center gap-1.5 text-slate-700 truncate">
                <PhoneCall className="w-3 h-3 text-emerald-500 shrink-0" />
                <span className="font-mono font-bold">081168814767</span>
              </div>
              <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1 rounded">Aktif</span>
            </div>
          </div>

          {/* Bottom badge */}
          <div className="text-center">
            <span className="text-[10px] text-slate-500 font-medium">Pelayanan Prima & Bebas Pungutan Liar</span>
          </div>
        </div>
      )
    }
  ];

  const filteredCards = activeTab === 'ALL' 
    ? featureCards 
    : featureCards.filter(c => c.id === activeTab);

  return (
    <section className="w-full px-4 sm:px-6 lg:px-12 py-16 sm:py-24 bg-white border-y border-slate-100">
      <div className="max-w-6xl mx-auto space-y-12 sm:space-y-16">
        
        {/* Top Header Section: Clean & Balanced */}
        <div className="text-center space-y-3.5 max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight leading-snug">
            Kemudahan Layanan Kepegawaian <br className="hidden sm:inline" />
            <span className="text-emerald-800">dengan Sistem Terpadu BKPSDM</span>
          </h2>

          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed max-w-2xl mx-auto font-normal">
            Semua layanan ini terintegrasi dalam platform <strong className="text-emerald-800 font-bold">SiKEPO</strong> — mulai dari Kenaikan Pangkat, Mutasi, Izin Belajar, e-Kinerja, E-Cuti, hingga konsultasi pensiun di Kabupaten Aceh Tamiang, dan seluruh fiturnya akan segera hadir secara bertahap.
          </p>
        </div>

        {/* 6-Card Grid (Exact 3 Columns x 2 Rows Layout from Image 1) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 items-stretch">
          {filteredCards.map((card) => (
            <div 
              key={card.id}
              className="bg-slate-50/70 hover:bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 hover:border-slate-300 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
            >
              <div className="space-y-5">
                {/* Visual Widget Header Box */}
                {card.renderVisual()}

                {/* Text Information Underneath (Title & Subtitle description exactly matching reference spacing) */}
                <div className="space-y-2 px-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded">
                      {card.tag}
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight leading-snug group-hover:text-emerald-800 transition-colors">
                    {card.title}
                  </h3>

                  <p className="text-xs text-slate-500 leading-relaxed">
                    {card.desc}
                  </p>
                </div>
              </div>

              {/* Action Link Footer */}
              <div className="pt-4 mt-5 border-t border-slate-200/60 flex items-center justify-between px-1">
                <span className="text-[11px] text-slate-400 font-medium">Standar Layanan Publik</span>
                <Link
                  to={card.slug}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-800 hover:text-emerald-700 transition-colors group-hover:translate-x-0.5 duration-200"
                >
                  <span>Akses Layanan</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
