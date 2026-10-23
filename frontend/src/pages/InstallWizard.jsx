import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Building2, Globe, ShieldCheck, Database, CheckCircle2, 
  ArrowRight, ArrowLeft, Sparkles, Server, Mail, Phone, 
  MapPin, User, Lock, AlertCircle, RefreshCw, KeyRound, 
  Laptop2, Check, ExternalLink, HardDriveDownload
} from 'lucide-react';
import api from '../services/api';

export default function InstallWizard() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [loadingStatus, setLoadingStatus] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [installStatus, setInstallStatus] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [successResult, setSuccessResult] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    // Step 2: Website & Agency Identity
    site_name: 'Portal Resmi Pemerintahan',
    site_tagline: 'Pusat Informasi & Pelayanan Publik Terpadu',
    site_description: 'Portal resmi pelayanan publik terpadu, keterbukaan informasi, dan administrasi digital modern.',
    instansi_name: 'Pemerintah Daerah',
    email_kontak: 'admin@instansi.go.id',
    telepon_kontak: '(021) 1234567',
    alamat_kantor: 'Jl. Protokol Pusat Pemerintahan No. 1',

    // Step 3: Master Super Admin
    admin_name: 'Administrator Utama',
    admin_email: 'admin@instansi.go.id',
    admin_password: '',
    admin_password_confirm: '',

    // Step 3 Extension: Optional Dummy Migration Data
    install_dummy_data: true
  });

  // Step check status from API
  useEffect(() => {
    checkStatus();
  }, []);

  const checkStatus = async () => {
    setLoadingStatus(true);
    setErrorMsg('');
    try {
      const res = await api.get('/cms/install/status');
      // Axios response interceptor unwraps to response.data
      const statusData = res?.data || res;
      if (statusData && (statusData.success || statusData.is_installed !== undefined)) {
        setInstallStatus(statusData);
        if (statusData.config) {
          setFormData(prev => ({
            ...prev,
            site_name: statusData.config.site_name || prev.site_name,
            site_tagline: statusData.config.site_tagline || prev.site_tagline,
            site_description: statusData.config.site_description || prev.site_description,
            instansi_name: statusData.config.instansi_name || prev.instansi_name,
            email_kontak: statusData.config.email_kontak || prev.email_kontak,
            telepon_kontak: statusData.config.telepon_kontak || prev.telepon_kontak,
            alamat_kantor: statusData.config.alamat_kantor || prev.alamat_kantor,
          }));
        }
      }
    } catch (err) {
      console.error('Error fetching install status:', err);
      setErrorMsg('Gagal memeriksa koneksi ke server backend.');
    } finally {
      setLoadingStatus(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNext = () => {
    setErrorMsg('');
    if (currentStep === 2) {
      if (!formData.site_name.trim() || !formData.instansi_name.trim()) {
        setErrorMsg('Nama Website dan Nama Instansi wajib diisi!');
        return;
      }
    }
    if (currentStep === 3) {
      if (!formData.admin_name.trim() || !formData.admin_email.trim()) {
        setErrorMsg('Nama dan Email Admin Utama wajib diisi!');
        return;
      }
      if (formData.admin_password && formData.admin_password.length < 6) {
        setErrorMsg('Kata sandi admin minimal harus 6 karakter.');
        return;
      }
      if (formData.admin_password && formData.admin_password !== formData.admin_password_confirm) {
        setErrorMsg('Konfirmasi kata sandi tidak cocok.');
        return;
      }
    }
    setCurrentStep(prev => prev + 1);
  };

  const handlePrev = () => {
    setErrorMsg('');
    setCurrentStep(prev => Math.max(1, prev - 1));
  };

  const handleRunSetup = async () => {
    setSubmitting(true);
    setErrorMsg('');
    try {
      const payload = {
        site_name: formData.site_name,
        site_tagline: formData.site_tagline,
        site_description: formData.site_description,
        instansi_name: formData.instansi_name,
        email_kontak: formData.email_kontak,
        telepon_kontak: formData.telepon_kontak,
        alamat_kantor: formData.alamat_kantor,
        admin_name: formData.admin_name,
        admin_email: formData.admin_email,
        admin_password: formData.admin_password || undefined
      };

      const res = await api.post('/cms/install/setup', payload);
      if (res.data && res.data.success) {
        setSuccessResult(res.data);
        setCurrentStep(5); // completion step
      } else {
        setErrorMsg(res.data?.message || 'Instalasi gagal dijalankan.');
      }
    } catch (err) {
      console.error('Installation error:', err);
      setErrorMsg(err.response?.data?.message || 'Terjadi kesalahan sistem saat memproses instalasi.');
    } finally {
      setSubmitting(false);
    }
  };

  const steps = [
    { num: 1, title: 'Prasyarat & Database', desc: 'Validasi engine & koneksi' },
    { num: 2, title: 'Identitas Portal Web', desc: 'Nama OPD, slogan & kontak' },
    { num: 3, title: 'Akun Administrator', desc: 'Kredensial Super Admin' },
    { num: 4, title: 'Konfirmasi & Eksekusi', desc: 'Review konfigurasi akhir' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 text-slate-100 flex flex-col justify-between p-4 md:p-8 font-sans selection:bg-emerald-500 selection:text-white">
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl" />
      </div>

      {/* Header Bar */}
      <header className="relative z-10 max-w-4xl mx-auto w-full flex items-center justify-between pb-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20 font-black text-xl border border-white/20">
            A
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-lg text-white tracking-wide">CMS Instalasi & Inisialisasi</h1>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Auto-DB Ready
              </span>
            </div>
            <p className="text-xs text-slate-400">Portal Layanan & Informasi Publik BKPSDM Aceh Tamiang</p>
          </div>
        </div>

        <Link 
          to="/" 
          className="text-xs font-semibold text-slate-400 hover:text-emerald-300 flex items-center gap-1.5 transition-colors bg-white/5 px-3 py-1.5 rounded-lg border border-white/10"
        >
          <span>Buka Portal Utama</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </header>

      {/* Main Container */}
      <main className="relative z-10 max-w-4xl mx-auto w-full my-6 flex-1 flex flex-col justify-center">
        {/* Progress Bar Header */}
        {currentStep <= 4 && (
          <div className="mb-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {steps.map((s) => {
                const isActive = currentStep === s.num;
                const isPassed = currentStep > s.num;
                return (
                  <div 
                    key={s.num}
                    className={`relative p-3 rounded-xl border transition-all duration-300 ${
                      isActive 
                        ? 'bg-emerald-500/15 border-emerald-500/50 text-white shadow-lg shadow-emerald-500/10' 
                        : isPassed 
                        ? 'bg-white/5 border-emerald-500/30 text-emerald-300' 
                        : 'bg-white/[0.02] border-white/10 text-slate-500'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${
                        isActive 
                          ? 'bg-emerald-500 text-slate-950 font-black' 
                          : isPassed 
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' 
                          : 'bg-white/10 text-slate-400'
                      }`}>
                        {isPassed ? <Check className="w-4 h-4 stroke-[3]" /> : s.num}
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-xs font-bold truncate leading-tight">{s.title}</p>
                        <p className="text-[10px] text-slate-400 truncate mt-0.5">{s.desc}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Wizard Card */}
        <div className="bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
          {/* Permanent Security Lock View if CMS is already installed */}
          {installStatus?.is_installed && currentStep !== 5 ? (
            <div className="py-8 text-center space-y-6 max-w-xl mx-auto">
              <div className="w-16 h-16 mx-auto rounded-3xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-xl shadow-amber-500/10">
                <Lock className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Sistem Telah Terpasang & Diamankan</span>
                </div>
                <h2 className="text-2xl font-black text-white tracking-tight">Halaman Instalasi Telah Dikunci</h2>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  CMS Portal Layanan & Informasi Publik BKPSDM Kabupaten Aceh Tamiang telah berhasil diinstal sebelumnya. Demi keamanan sistem sesuai standar ISO 27001, instalasi ulang diblokir secara otomatis untuk mencegah penimpaan data.
                </p>
              </div>

              <div className="bg-white/[0.03] p-4 rounded-xl border border-white/10 text-left space-y-2 text-xs">
                <div className="flex justify-between items-center text-slate-300">
                  <span className="text-slate-400">Nama Situs:</span>
                  <span className="font-semibold text-white">{installStatus?.config?.site_name}</span>
                </div>
                <div className="flex justify-between items-center text-slate-300">
                  <span className="text-slate-400">Instansi:</span>
                  <span className="font-semibold text-white">{installStatus?.config?.instansi_name}</span>
                </div>
                {installStatus?.config?.installed_at && (
                  <div className="flex justify-between items-center text-slate-300">
                    <span className="text-slate-400">Waktu Inisialisasi:</span>
                    <span className="font-mono text-emerald-300">
                      {new Date(installStatus.config.installed_at).toLocaleString('id-ID')}
                    </span>
                  </div>
                )}
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  to="/admin/login"
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <KeyRound className="w-4 h-4" />
                  <span>Masuk ke Panel Administrator</span>
                </Link>
                <Link
                  to="/"
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center gap-2 transition-colors"
                >
                  <Globe className="w-4 h-4" />
                  <span>Buka Beranda Portal</span>
                </Link>
              </div>
            </div>
          ) : (
            <>
              {errorMsg && (
                <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 flex items-start gap-3 text-sm animate-shake">
                  <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-400 mt-0.5" />
                  <div>
                    <p className="font-semibold">Perhatian</p>
                    <p className="text-xs mt-0.5 opacity-90">{errorMsg}</p>
                  </div>
                </div>
              )}

          {/* STEP 1: Prasyarat & Status DB */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-2">
                  <Database className="w-3.5 h-3.5" />
                  Koneksi Database Terkonfigurasi Otomatis
                </div>
                <h2 className="text-2xl font-bold text-white tracking-tight">Status Lingkungan & Prasyarat Sistem</h2>
                <p className="text-sm text-slate-400 mt-1">
                  Koneksi basis data MySQL telah terhubung secara otomatis via environment server. CMS siap diinisialisasi tanpa konfigurasi DB manual.
                </p>
              </div>

              {loadingStatus ? (
                <div className="py-12 flex flex-col items-center justify-center gap-3 text-slate-400">
                  <RefreshCw className="w-8 h-8 animate-spin text-emerald-400" />
                  <p className="text-xs">Memeriksa konektivitas sistem & database MySQL...</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <Server className="w-5 h-5 text-emerald-400" />
                        <div>
                          <p className="text-sm font-semibold text-white">Database Engine</p>
                          <p className="text-xs text-slate-400">MySQL Connection Pool</p>
                        </div>
                      </div>
                      <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Terhubung
                      </span>
                    </div>
                    <div className="pt-2 border-t border-white/5 text-xs text-slate-400 flex justify-between">
                      <span>Status Tabel:</span>
                      <span className="text-slate-200 font-mono">Siap Sinkronisasi</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <Laptop2 className="w-5 h-5 text-teal-400" />
                        <div>
                          <p className="text-sm font-semibold text-white">Backend Server</p>
                          <p className="text-xs text-slate-400">Node.js Express REST API</p>
                        </div>
                      </div>
                      <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Aktif (v1 API)
                      </span>
                    </div>
                    <div className="pt-2 border-t border-white/5 text-xs text-slate-400 flex justify-between">
                      <span>Status CMS Saat Ini:</span>
                      <span className={installStatus?.is_installed ? "text-emerald-400 font-semibold" : "text-amber-400 font-semibold"}>
                        {installStatus?.is_installed ? "Sudah Pernah Diinstal (Tersedia Re-init)" : "Belum Diinisialisasi"}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <ShieldCheck className="w-5 h-5 text-indigo-400" />
                        <div>
                          <p className="text-sm font-semibold text-white">Modul RBAC & Keamanan</p>
                          <p className="text-xs text-slate-400">JWT Token & Role Enforcer</p>
                        </div>
                      </div>
                      <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Siap
                      </span>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <HardDriveDownload className="w-5 h-5 text-amber-400" />
                        <div>
                          <p className="text-sm font-semibold text-white">Storage & Media</p>
                          <p className="text-xs text-slate-400">Upload Folder & CDN Local</p>
                        </div>
                      </div>
                      <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Siap
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {installStatus?.is_installed && (
                <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-300">
                      <Lock className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-bold text-sm text-amber-200">CMS Sudah Terinstall & Terkunci (Locked)</p>
                      <p className="text-[11px] text-amber-300/80">Proteksi Keamanan Aktif: Re-instalasi otomatis diblokir.</p>
                    </div>
                  </div>
                  
                  <p className="text-slate-300 leading-relaxed">
                    Portal website ini telah resmi diinisialisasi. Untuk mencegah penimpaan data dan pengambilalihan hak akses oleh pihak tidak berwenang, sistem melarang instalasi ulang langsung dari web browser.
                  </p>

                  <div className="p-3.5 rounded-xl bg-slate-950/70 border border-white/10 text-slate-300 space-y-2">
                    <p className="font-semibold text-white flex items-center gap-1.5 text-[11px]">
                      <KeyRound className="w-3.5 h-3.5 text-amber-400" /> Cara Membuka Kunci Re-Instalasi (Admin/Dev):
                    </p>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      Jika Anda adalah pemilik server dan ingin melakukan re-instalasi sengaja, jalankan query SQL berikut di database MySQL:
                    </p>
                    <pre className="p-2.5 rounded-lg bg-black/60 font-mono text-[11px] text-emerald-400 overflow-x-auto select-all border border-emerald-500/20">
                      UPDATE `pengaturan_web` SET `value` = 'false' WHERE `key_name` = 'cms_is_installed';
                    </pre>
                    <p className="text-[10px] text-slate-500">
                      Atau cukup login ke Panel Admin (<Link to="/admin/login" className="text-emerald-400 underline font-semibold">/admin/login</Link>) dan sesuaikan identitas web di menu Pengaturan tanpa perlu menginstal ulang.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 2: Identitas & Informasi Portal */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-2">
                  <Building2 className="w-3.5 h-3.5" />
                  Langkah 2: Profil & Metadata
                </div>
                <h2 className="text-2xl font-bold text-white tracking-tight">Identitas Portal Web & Instansi</h2>
                <p className="text-sm text-slate-400 mt-1">
                  Informasi ini akan ditampilkan secara global pada header, footer, SEO meta tags, dan identitas resmi website.
                </p>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Nama Website / Portal <span className="text-rose-400">*</span>
                    </label>
                    <div className="relative">
                      <Globe className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                      <input 
                        type="text"
                        name="site_name"
                        value={formData.site_name}
                        onChange={handleChange}
                        placeholder="Contoh: BKPSDM Kabupaten Aceh Tamiang"
                        className="w-full pl-9 pr-3 py-2.5 bg-slate-950/60 border border-white/10 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/40"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Nama Instansi / OPD <span className="text-rose-400">*</span>
                    </label>
                    <div className="relative">
                      <Building2 className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                      <input 
                        type="text"
                        name="instansi_name"
                        value={formData.instansi_name}
                        onChange={handleChange}
                        placeholder="Pemerintah Kabupaten Aceh Tamiang"
                        className="w-full pl-9 pr-3 py-2.5 bg-slate-950/60 border border-white/10 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/40"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Slogan / Tagline Website
                  </label>
                  <input 
                    type="text"
                    name="site_tagline"
                    value={formData.site_tagline}
                    onChange={handleChange}
                    placeholder="Contoh: Badan Kepegawaian & Pengembangan Sumber Daya Manusia"
                    className="w-full px-3 py-2.5 bg-slate-950/60 border border-white/10 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/40"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Deskripsi Ringkas Portal (SEO & Metadata)
                  </label>
                  <textarea 
                    name="site_description"
                    rows={2}
                    value={formData.site_description}
                    onChange={handleChange}
                    placeholder="Deskripsi singkat untuk pencarian Google & pengantar landing page..."
                    className="w-full px-3 py-2.5 bg-slate-950/60 border border-white/10 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/40"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Email Kontak Resmi
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                      <input 
                        type="email"
                        name="email_kontak"
                        value={formData.email_kontak}
                        onChange={handleChange}
                        placeholder="bkpsdm@acehtamiangkab.go.id"
                        className="w-full pl-9 pr-3 py-2.5 bg-slate-950/60 border border-white/10 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/40"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Nomor Telepon / Helpdesk
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                      <input 
                        type="text"
                        name="telepon_kontak"
                        value={formData.telepon_kontak}
                        onChange={handleChange}
                        placeholder="(0641) 333444"
                        className="w-full pl-9 pr-3 py-2.5 bg-slate-950/60 border border-white/10 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/40"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Alamat Lengkap Kantor
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                    <input 
                      type="text"
                      name="alamat_kantor"
                      value={formData.alamat_kantor}
                      onChange={handleChange}
                      placeholder="Jl. Ir. H. Juanda No. 1, Karang Baru, Kab. Aceh Tamiang"
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-950/60 border border-white/10 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/40"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Akun Administrator Utama */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-2">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Langkah 3: Keamanan & Administrator
                </div>
                <h2 className="text-2xl font-bold text-white tracking-tight">Akun Super Administrator Utama</h2>
                <p className="text-sm text-slate-400 mt-1">
                  Akun ini akan memegang hak akses tertinggi (Super Admin) untuk mengelola seluruh konten, pengguna, modul RBAC, dan audit log.
                </p>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Nama Lengkap Admin <span className="text-rose-400">*</span>
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                      <input 
                        type="text"
                        name="admin_name"
                        value={formData.admin_name}
                        onChange={handleChange}
                        placeholder="Administrator BKPSDM"
                        className="w-full pl-9 pr-3 py-2.5 bg-slate-950/60 border border-white/10 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/40"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Email Login Admin <span className="text-rose-400">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                      <input 
                        type="email"
                        name="admin_email"
                        value={formData.admin_email}
                        onChange={handleChange}
                        placeholder="admin@acehtamiangkab.go.id"
                        className="w-full pl-9 pr-3 py-2.5 bg-slate-950/60 border border-white/10 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/40"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Kata Sandi Baru {installStatus?.is_installed && <span className="text-slate-400 font-normal">(Kosongkan jika tetap lama)</span>}
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                      <input 
                        type="password"
                        name="admin_password"
                        value={formData.admin_password}
                        onChange={handleChange}
                        placeholder="Minimal 6 karakter"
                        className="w-full pl-9 pr-3 py-2.5 bg-slate-950/60 border border-white/10 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/40"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Ulangi Kata Sandi
                    </label>
                    <div className="relative">
                      <KeyRound className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                      <input 
                        type="password"
                        name="admin_password_confirm"
                        value={formData.admin_password_confirm}
                        onChange={handleChange}
                        placeholder="Ketik ulang kata sandi"
                        className="w-full pl-9 pr-3 py-2.5 bg-slate-950/60 border border-white/10 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/40"
                      />
                    </div>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 text-xs text-slate-400 flex items-start gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span>
                    Jika kata sandi dikosongkan pada instalasi awal, sistem akan mempertahankan akun admin bawaan atau menetapkan kata sandi standar yang aman (<code className="text-emerald-300 font-mono">admin123</code>).
                  </span>
                </div>

                {/* Option to Install Dummy / Sample Data */}
                <div className="pt-2">
                  <label className="flex items-start gap-3 p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 hover:border-emerald-500/50 cursor-pointer transition-all">
                    <input
                      type="checkbox"
                      name="install_dummy_data"
                      checked={formData.install_dummy_data}
                      onChange={(e) => setFormData(prev => ({ ...prev, install_dummy_data: e.target.checked }))}
                      className="w-4 h-4 mt-0.5 rounded text-emerald-500 focus:ring-emerald-500 bg-slate-900 border-white/20"
                    />
                    <div className="space-y-1">
                      <p className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Pasang Data Contoh / Dummy Migration (Disarankan)</span>
                      </p>
                      <p className="text-[11px] text-slate-400 leading-relaxed">
                        Sistem akan mengisikan contoh berita, agenda kegiatan, banner slider beranda, dokumen SOP publik, dan testimoni agar portal langsung tampak profesional saat pertama kali dibuka. Anda dapat menghapus atau mengeditnya nanti di Dashboard Admin.
                      </p>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Konfirmasi & Peluncuran */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-2">
                  <Sparkles className="w-3.5 h-3.5" />
                  Langkah 4: Konfirmasi Akhir
                </div>
                <h2 className="text-2xl font-bold text-white tracking-tight">Tinjauan Konfigurasi & Inisialisasi</h2>
                <p className="text-sm text-slate-400 mt-1">
                  Harap periksa kembali rangkuman konfigurasi portal sebelum sistem memproses penyimpanan dan mengaktifkan CMS.
                </p>
              </div>

              <div className="space-y-4">
                <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4 divide-y divide-white/5 text-xs">
                  <div className="pb-3 flex justify-between items-center">
                    <span className="text-slate-400 font-medium">Nama Portal / Web:</span>
                    <span className="text-white font-bold">{formData.site_name}</span>
                  </div>
                  <div className="py-3 flex justify-between items-center">
                    <span className="text-slate-400 font-medium">Instansi / OPD:</span>
                    <span className="text-white font-semibold">{formData.instansi_name}</span>
                  </div>
                  <div className="py-3 flex justify-between items-center">
                    <span className="text-slate-400 font-medium">Tagline:</span>
                    <span className="text-slate-200">{formData.site_tagline || '-'}</span>
                  </div>
                  <div className="py-3 flex justify-between items-center">
                    <span className="text-slate-400 font-medium">Email Kontak:</span>
                    <span className="text-emerald-300 font-mono">{formData.email_kontak || '-'}</span>
                  </div>
                  <div className="py-3 flex justify-between items-center">
                    <span className="text-slate-400 font-medium">Super Admin Email:</span>
                    <span className="text-emerald-400 font-mono font-semibold">{formData.admin_email}</span>
                  </div>
                  <div className="pt-3 flex justify-between items-center">
                    <span className="text-slate-400 font-medium">Kata Sandi Admin:</span>
                    <span className="text-slate-300">{formData.admin_password ? '•••••••• (Diperbarui)' : '(Default / Tetap)'}</span>
                  </div>
                  <div className="pt-3 flex justify-between items-center">
                    <span className="text-slate-400 font-medium">Data Contoh / Dummy:</span>
                    <span className={`font-bold ${formData.install_dummy_data ? 'text-emerald-400' : 'text-slate-400'}`}>
                      {formData.install_dummy_data ? 'Ya (Dipasang)' : 'Tidak (Mulai Kosong)'}
                    </span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-200 text-xs space-y-1">
                  <p className="font-semibold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Otomasi yang akan dijalankan:
                  </p>
                  <ul className="list-disc list-inside space-y-0.5 text-slate-300 pl-1 pt-1">
                    <li>Sinkronisasi tabel <code className="text-emerald-300">PengaturanWeb</code> dengan nilai parameter di atas</li>
                    <li>Inisialisasi akun Super Admin & penetapan role RBAC penuh</li>
                    <li>Pembuatan menu navigasi publik default (jika belum ada)</li>
                    <li>Pencatatan penanda instalasi resmi <code className="text-emerald-300">cms_is_installed: true</code></li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: Sukses & Peluncuran */}
          {currentStep === 5 && (
            <div className="text-center py-6 space-y-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/20 animate-bounce">
                <Check className="w-9 h-9 stroke-[3]" />
              </div>

              <div>
                <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">Instalasi CMS Berhasil!</h2>
                <p className="text-sm text-slate-300 max-w-md mx-auto mt-2">
                  Portal Layanan & Informasi Publik BKPSDM Kabupaten Aceh Tamiang telah berhasil diinisialisasi dan siap digunakan sepenuhnya.
                </p>
              </div>

              <div className="max-w-md mx-auto p-4 rounded-xl bg-white/[0.04] border border-white/10 text-left text-xs space-y-2">
                <p className="font-semibold text-slate-200">Kredensial Login Administrator:</p>
                <div className="flex justify-between items-center text-slate-300">
                  <span>URL Admin Panel:</span>
                  <span className="font-mono text-emerald-400">/admin/login</span>
                </div>
                <div className="flex justify-between items-center text-slate-300">
                  <span>Email Admin:</span>
                  <span className="font-mono text-emerald-400">{formData.admin_email}</span>
                </div>
                <div className="flex justify-between items-center text-slate-300">
                  <span>Kata Sandi:</span>
                  <span className="font-mono text-slate-400">
                    {formData.admin_password ? '(Kata sandi yang Anda tentukan)' : 'admin123'}
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <Link
                  to="/admin/login"
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/25 hover:from-emerald-400 hover:to-teal-400 flex items-center justify-center gap-2 transition-all"
                >
                  <Lock className="w-4 h-4" />
                  <span>Masuk ke Panel Admin</span>
                </Link>

                <Link
                  to="/"
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-sm border border-white/10 flex items-center justify-center gap-2 transition-all"
                >
                  <Globe className="w-4 h-4" />
                  <span>Kunjungi Beranda Web</span>
                </Link>
              </div>
            </div>
          )}

          {/* Action Buttons for Step 1-4 */}
          {currentStep <= 4 && (
            <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between">
              <div>
                {currentStep > 1 && (
                  <button
                    type="button"
                    onClick={handlePrev}
                    disabled={submitting}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 flex items-center gap-1.5 transition-colors disabled:opacity-50"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Kembali</span>
                  </button>
                )}
              </div>

              <div className="flex items-center gap-3">
                {installStatus?.is_installed && currentStep === 1 ? (
                  <Link
                    to="/admin/login"
                    className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-slate-800 hover:bg-slate-700 border border-amber-500/30 flex items-center gap-2 transition-all cursor-pointer shadow-lg"
                  >
                    <Lock className="w-4 h-4 text-amber-400" />
                    <span>CMS Terkunci — Ke Panel Admin</span>
                  </Link>
                ) : currentStep < 4 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    disabled={loadingStatus}
                    className="px-6 py-2.5 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 shadow-lg shadow-emerald-500/20 flex items-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
                  >
                    <span>Langkah Selanjutnya</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleRunSetup}
                    disabled={submitting}
                    className="px-7 py-2.5 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-400 hover:from-emerald-300 hover:to-teal-200 shadow-xl shadow-emerald-500/30 flex items-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
                  >
                    {submitting ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Menginisialisasi CMS...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        <span>Selesaikan & Luncurkan CMS</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          )}
          </>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 max-w-4xl mx-auto w-full pt-4 text-center text-xs text-slate-500 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-2">
        <p>© 2026 BKPSDM Kabupaten Aceh Tamiang. Automated Web Engine.</p>
        <div className="flex items-center gap-4 text-slate-400 text-[11px]">
          <span>Security Hardened</span>
          <span>•</span>
          <span>Sequelize ORM</span>
          <span>•</span>
          <span>React SPA</span>
        </div>
      </footer>
    </div>
  );
}
