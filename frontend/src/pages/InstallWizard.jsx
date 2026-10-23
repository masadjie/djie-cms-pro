import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Building2, Globe, ShieldCheck, Database, CheckCircle2, 
  ArrowRight, ArrowLeft, Sparkles, Server, Mail, Phone, 
  MapPin, User, Lock, AlertCircle, RefreshCw, KeyRound, 
  Laptop2, Check, ExternalLink, HardDriveDownload, Newspaper,
  LayoutGrid, BookOpen, Layers
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
    site_name: 'Djie CMS Pro — Digital Portal',
    site_tagline: 'Modern Content Management System & Publishing Engine',
    site_description: 'Platform manajemen konten berkecepatan tinggi untuk portal berita, media digital, profil perusahaan, dan publikasi profesional.',
    instansi_name: 'Media Digital / Perusahaan',
    email_kontak: 'editorial@example.com',
    telepon_kontak: '(021) 555-0199',
    alamat_kantor: 'Gedung Pusat Informasi & Redaksi Lt. 5',

    // Step 2 Extension: Selected Theme
    selected_theme: 'editorial',
    home_layout_mode: 'EDITORIAL',

    // Step 3: Master Super Admin
    admin_name: 'Super Administrator',
    admin_email: 'admin@example.com',
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
        admin_password: formData.admin_password || undefined,
        selected_theme: formData.selected_theme,
        home_layout_mode: formData.home_layout_mode,
        install_dummy_data: formData.install_dummy_data
      };

      const res = await api.post('/cms/install/setup', payload);
      const resData = res?.data || res;
      if (resData && (resData.success || resData.installed)) {
        setSuccessResult(resData);
        setCurrentStep(5); // completion step
      } else {
        setErrorMsg(resData?.message || 'Instalasi gagal dijalankan.');
      }
    } catch (err) {
      console.error('Installation error:', err);
      setErrorMsg(err.response?.data?.message || 'Terjadi kesalahan sistem saat memproses instalasi.');
    } finally {
      setSubmitting(false);
    }
  };

  const steps = [
    { num: 1, title: 'Prasyarat & Database', desc: 'Validasi koneksi DB & server' },
    { num: 2, title: 'Identitas & Pilihan Tema', desc: 'Nama portal, kontak & gaya UI' },
    { num: 3, title: 'Kredensial Admin', desc: 'Akun Super Administrator' },
    { num: 4, title: 'Tinjauan & Eksekusi', desc: 'Konfirmasi akhir 1-klik' },
  ];

  return (
    <div className="min-h-screen bg-[#fcfcff] text-slate-800 flex flex-col justify-between p-4 md:p-8 font-sans selection:bg-violet-600 selection:text-white">
      {/* Subtle Editorial Background Accent */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-violet-100/60 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -left-32 w-80 h-80 bg-indigo-50/70 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 right-1/4 w-96 h-96 bg-purple-50/60 rounded-full blur-3xl" />
      </div>

      {/* Header Bar */}
      <header className="relative z-10 max-w-4xl mx-auto w-full flex items-center justify-between pb-6 border-b border-slate-200">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-violet-600 via-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-violet-500/20 font-black text-xl">
            D
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-lg text-slate-900 tracking-tight">Djie CMS Pro</h1>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-violet-100 text-violet-700 border border-violet-200">
                Setup Wizard
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">Instalasi & Konfigurasi Ekosistem Web Editorial</p>
          </div>
        </div>

        <Link 
          to="/" 
          className="text-xs font-semibold text-slate-600 hover:text-violet-700 flex items-center gap-1.5 transition-colors bg-white hover:bg-slate-50 px-3.5 py-2 rounded-xl border border-slate-200 shadow-xs"
        >
          <span>Buka Beranda</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </header>

      {/* Main Container */}
      <main className="relative z-10 max-w-4xl mx-auto w-full my-6 flex-1 flex flex-col justify-center">
        {/* Step Progress Pills */}
        {currentStep <= 4 && (
          <div className="mb-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
              {steps.map((s) => {
                const isActive = currentStep === s.num;
                const isPassed = currentStep > s.num;
                return (
                  <div 
                    key={s.num}
                    className={`relative p-3 rounded-2xl border transition-all duration-200 ${
                      isActive 
                        ? 'bg-white border-violet-500 text-slate-900 shadow-sm ring-2 ring-violet-500/10' 
                        : isPassed 
                        ? 'bg-violet-50/70 border-violet-200 text-violet-900' 
                        : 'bg-white/60 border-slate-200 text-slate-400'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold transition-colors ${
                        isActive 
                          ? 'bg-violet-600 text-white shadow-xs' 
                          : isPassed 
                          ? 'bg-violet-200 text-violet-800' 
                          : 'bg-slate-100 text-slate-400'
                      }`}>
                        {isPassed ? <Check className="w-4 h-4 stroke-[3]" /> : s.num}
                      </div>
                      <div className="overflow-hidden">
                        <p className={`text-xs font-bold truncate leading-tight ${isActive ? 'text-violet-950' : ''}`}>
                          {s.title}
                        </p>
                        <p className="text-[10px] text-slate-500 truncate mt-0.5">{s.desc}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Wizard White Card */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 md:p-10 shadow-sm relative overflow-hidden">
          {/* Permanent Security Lock View if CMS is already installed */}
          {installStatus?.is_installed && currentStep !== 5 ? (
            <div className="py-6 text-center space-y-6 max-w-xl mx-auto">
              <div className="w-16 h-16 mx-auto rounded-3xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 shadow-sm">
                <Lock className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Sistem Telah Terpasang & Diamankan</span>
                </div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Halaman Instalasi Telah Dikunci</h2>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  CMS Portal telah berhasil diinisialisasi sebelumnya. Demi keamanan sistem, akses instalasi ulang dibatasi secara otomatis untuk mencegah penimpaan data website secara tidak disengaja.
                </p>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-left space-y-2.5 text-xs">
                <div className="flex justify-between items-center text-slate-700">
                  <span className="text-slate-500">Nama Situs:</span>
                  <span className="font-semibold text-slate-900">{installStatus?.config?.site_name}</span>
                </div>
                <div className="flex justify-between items-center text-slate-700">
                  <span className="text-slate-500">Instansi:</span>
                  <span className="font-semibold text-slate-900">{installStatus?.config?.instansi_name}</span>
                </div>
                {installStatus?.config?.installed_at && (
                  <div className="flex justify-between items-center text-slate-700">
                    <span className="text-slate-500">Waktu Inisialisasi:</span>
                    <span className="font-mono text-violet-700 font-medium">
                      {new Date(installStatus.config.installed_at).toLocaleString('id-ID')}
                    </span>
                  </div>
                )}
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  to="/admin/login"
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-violet-600 hover:bg-violet-700 shadow-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <KeyRound className="w-4 h-4" />
                  <span>Masuk ke Panel Administrator</span>
                </Link>
                <Link
                  to="/"
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 shadow-xs flex items-center justify-center gap-2 transition-colors"
                >
                  <Globe className="w-4 h-4" />
                  <span>Buka Beranda Portal</span>
                </Link>
              </div>
            </div>
          ) : (
            <>
              {errorMsg && (
                <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 flex items-start gap-3 text-sm">
                  <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-600 mt-0.5" />
                  <div>
                    <p className="font-bold">Perhatian</p>
                    <p className="text-xs mt-0.5 text-rose-700">{errorMsg}</p>
                  </div>
                </div>
              )}

              {/* STEP 1: Prasyarat & Status DB */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-50 border border-violet-200 text-violet-700 text-xs font-semibold mb-2">
                      <Database className="w-3.5 h-3.5" />
                      Koneksi Basis Data Terdeteksi
                    </div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">Kesiapan Lingkungan & Sistem</h2>
                    <p className="text-sm text-slate-600 mt-1">
                      Koneksi basis data MySQL telah terhubung secara otomatis via environment runtime. Sistem siap diinisialisasi tanpa perlu input host DB manual.
                    </p>
                  </div>

                  {loadingStatus ? (
                    <div className="py-12 flex flex-col items-center justify-center gap-3 text-slate-500">
                      <RefreshCw className="w-8 h-8 animate-spin text-violet-600" />
                      <p className="text-xs font-medium">Memeriksa kesiapan engine dan tabel basis data...</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <div className="p-2 rounded-xl bg-violet-100 text-violet-700">
                              <Server className="w-4 h-4" />
                            </div>
                            <div>
                              <p className="text-sm font-bold text-slate-900">Database Engine</p>
                              <p className="text-xs text-slate-500">MySQL Connection Pool</p>
                            </div>
                          </div>
                          <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Terhubung
                          </span>
                        </div>
                        <div className="pt-2 border-t border-slate-200/60 text-xs text-slate-500 flex justify-between">
                          <span>Status Skema:</span>
                          <span className="text-slate-800 font-mono font-medium">Siap Sinkronisasi</span>
                        </div>
                      </div>

                      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <div className="p-2 rounded-xl bg-indigo-100 text-indigo-700">
                              <Laptop2 className="w-4 h-4" />
                            </div>
                            <div>
                              <p className="text-sm font-bold text-slate-900">Backend Server</p>
                              <p className="text-xs text-slate-500">Node.js Express REST API</p>
                            </div>
                          </div>
                          <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Aktif (v1 API)
                          </span>
                        </div>
                        <div className="pt-2 border-t border-slate-200/60 text-xs text-slate-500 flex justify-between">
                          <span>Status CMS:</span>
                          <span className={installStatus?.is_installed ? "text-emerald-700 font-semibold" : "text-amber-700 font-semibold"}>
                            {installStatus?.is_installed ? "Terpasang (Re-init Tersedia)" : "Belum Diinisialisasi"}
                          </span>
                        </div>
                      </div>

                      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <div className="p-2 rounded-xl bg-purple-100 text-purple-700">
                              <ShieldCheck className="w-4 h-4" />
                            </div>
                            <div>
                              <p className="text-sm font-bold text-slate-900">Modul RBAC & Auth</p>
                              <p className="text-xs text-slate-500">JWT Token & Role Enforcer</p>
                            </div>
                          </div>
                          <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Siap
                          </span>
                        </div>
                      </div>

                      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <div className="p-2 rounded-xl bg-amber-100 text-amber-700">
                              <HardDriveDownload className="w-4 h-4" />
                            </div>
                            <div>
                              <p className="text-sm font-bold text-slate-900">Storage & Media</p>
                              <p className="text-xs text-slate-500">Upload Directory & CDN</p>
                            </div>
                          </div>
                          <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Siap
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {installStatus?.is_installed && (
                    <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs space-y-3">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-lg bg-amber-100 text-amber-800">
                          <Lock className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-bold text-sm text-amber-900">CMS Sudah Terinstall & Terkunci (Locked)</p>
                          <p className="text-[11px] text-amber-700">Proteksi Keamanan: Re-instalasi otomatis dibatasi.</p>
                        </div>
                      </div>
                      
                      <p className="text-slate-600 leading-relaxed">
                        Website ini sudah pernah diinisialisasi. Untuk mencegah reset data yang tidak disengaja, sistem mengunci wizard. Anda dapat langsung mengelola konten melalui Dashboard Admin.
                      </p>

                      <div className="p-3.5 rounded-xl bg-white border border-amber-200 text-slate-700 space-y-2">
                        <p className="font-semibold text-slate-900 flex items-center gap-1.5 text-[11px]">
                          <KeyRound className="w-3.5 h-3.5 text-amber-600" /> Ingin Melakukan Instalasi Ulang Penuh?
                        </p>
                        <p className="text-[11px] text-slate-600 leading-relaxed">
                          Jalankan query SQL berikut di database untuk membuka proteksi:
                        </p>
                        <pre className="p-2.5 rounded-lg bg-slate-900 font-mono text-[11px] text-emerald-400 overflow-x-auto select-all">
                          UPDATE `pengaturan_web` SET `value` = 'false' WHERE `key_name` = 'cms_is_installed';
                        </pre>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* STEP 2: Identitas & Pilihan Tema */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-50 border border-violet-200 text-violet-700 text-xs font-semibold mb-2">
                      <Building2 className="w-3.5 h-3.5" />
                      Langkah 2: Profil & Tema Visual
                    </div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">Identitas Portal & Pemilihan Tema</h2>
                    <p className="text-sm text-slate-600 mt-1">
                      Tentukan informasi identitas website dan pilih gaya tampilan yang ingin langsung diterapkan saat peluncuran.
                    </p>
                  </div>

                  {/* THEME SELECTION CARD (HIGHLIGHTED) */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider">
                      Pilih Gaya Tampilan (Theme Layout) <span className="text-violet-600 font-normal lowercase">(dapat diubah nanti di admin)</span>
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Editorial News Theme */}
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, selected_theme: 'editorial', home_layout_mode: 'EDITORIAL' }))}
                        className={`p-5 rounded-2xl border-2 text-left transition-all cursor-pointer relative ${
                          formData.selected_theme === 'editorial'
                            ? 'border-violet-600 bg-violet-50/50 shadow-md ring-2 ring-violet-500/20'
                            : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2.5">
                            <div className="w-10 h-10 rounded-xl bg-violet-600 text-white flex items-center justify-center shadow-xs">
                              <Newspaper className="w-5 h-5" />
                            </div>
                            <div>
                              <p className="text-sm font-black text-slate-900">Revision Editorial</p>
                              <p className="text-[11px] font-bold text-violet-700">Portal Berita & Majalah Digital</p>
                            </div>
                          </div>
                          {formData.selected_theme === 'editorial' && (
                            <span className="w-6 h-6 rounded-full bg-violet-600 text-white flex items-center justify-center text-xs shadow-xs">
                              <Check className="w-4 h-4 stroke-[3]" />
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          Layout 2-kolom editorial modern, trending topics pills, sidebar redaksi bergradasi ungu lembut, dan box newsletter interaktif. Sangat cocok untuk publikasi berita intensif.
                        </p>
                        <div className="mt-3.5 pt-3 border-t border-slate-200/80 flex items-center gap-2 text-[10px] font-bold text-violet-800">
                          <span className="px-2 py-0.5 rounded-md bg-white border border-slate-200">2-Column Layout</span>
                          <span className="px-2 py-0.5 rounded-md bg-white border border-slate-200">Trending Bar</span>
                          <span className="px-2 py-0.5 rounded-md bg-white border border-slate-200">Soft Violet Accent</span>
                        </div>
                      </button>

                      {/* Portal Layanan Theme */}
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, selected_theme: 'emerald', home_layout_mode: 'PORTAL' }))}
                        className={`p-5 rounded-2xl border-2 text-left transition-all cursor-pointer relative ${
                          formData.selected_theme === 'emerald'
                            ? 'border-emerald-600 bg-emerald-50/40 shadow-md ring-2 ring-emerald-500/20'
                            : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2.5">
                            <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center shadow-xs">
                              <LayoutGrid className="w-5 h-5" />
                            </div>
                            <div>
                              <p className="text-sm font-black text-slate-900">Portal Layanan Publik</p>
                              <p className="text-[11px] font-bold text-emerald-800">Instansi Pemerintah & BUMN</p>
                            </div>
                          </div>
                          {formData.selected_theme === 'emerald' && (
                            <span className="w-6 h-6 rounded-full bg-emerald-700 text-white flex items-center justify-center text-xs shadow-xs">
                              <Check className="w-4 h-4 stroke-[3]" />
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          Layout korporat dan pemerintahan dengan hero search bar pencarian cepat, kartu grid layanan publik terpadu, dan widget status jam operasional.
                        </p>
                        <div className="mt-3.5 pt-3 border-t border-slate-200/80 flex items-center gap-2 text-[10px] font-bold text-emerald-800">
                          <span className="px-2 py-0.5 rounded-md bg-white border border-slate-200">Service Grid</span>
                          <span className="px-2 py-0.5 rounded-md bg-white border border-slate-200">Hero Search</span>
                          <span className="px-2 py-0.5 rounded-md bg-white border border-slate-200">Emerald / Teal</span>
                        </div>
                      </button>
                    </div>
                  </div>

                  <div className="pt-2 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">
                          Nama Website / Portal <span className="text-rose-500">*</span>
                        </label>
                        <div className="relative">
                          <Globe className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                          <input 
                            type="text"
                            name="site_name"
                            value={formData.site_name}
                            onChange={handleChange}
                            placeholder="Contoh: Djie CMS Pro Editorial"
                            className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-500/20 shadow-xs"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">
                          Nama Instansi / Media Publisher <span className="text-rose-500">*</span>
                        </label>
                        <div className="relative">
                          <Building2 className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                          <input 
                            type="text"
                            name="instansi_name"
                            value={formData.instansi_name}
                            onChange={handleChange}
                            placeholder="Contoh: Media Redaksi Nusantara"
                            className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-500/20 shadow-xs"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Slogan / Tagline Website
                      </label>
                      <input 
                        type="text"
                        name="site_tagline"
                        value={formData.site_tagline}
                        onChange={handleChange}
                        placeholder="Contoh: Berita Terkini & Analisis Mendalam Terpercaya"
                        className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-500/20 shadow-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Deskripsi Ringkas Portal (SEO & Metadata)
                      </label>
                      <textarea 
                        name="site_description"
                        rows={2}
                        value={formData.site_description}
                        onChange={handleChange}
                        placeholder="Deskripsi singkat untuk meta tag Google & pengantar landing page..."
                        className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-500/20 shadow-xs"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">
                          Email Kontak Resmi
                        </label>
                        <div className="relative">
                          <Mail className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                          <input 
                            type="email"
                            name="email_kontak"
                            value={formData.email_kontak}
                            onChange={handleChange}
                            placeholder="redaksi@example.com"
                            className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-500/20 shadow-xs"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">
                          Nomor Telepon / Redaksi
                        </label>
                        <div className="relative">
                          <Phone className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                          <input 
                            type="text"
                            name="telepon_kontak"
                            value={formData.telepon_kontak}
                            onChange={handleChange}
                            placeholder="(021) 555-0199"
                            className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-500/20 shadow-xs"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Alamat Lengkap Kantor / Redaksi
                      </label>
                      <div className="relative">
                        <MapPin className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                        <input 
                          type="text"
                          name="alamat_kantor"
                          value={formData.alamat_kantor}
                          onChange={handleChange}
                          placeholder="Gedung Cyber Media Lt. 3, Jakarta"
                          className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-500/20 shadow-xs"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: Akun Administrator & Data Demo */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-50 border border-violet-200 text-violet-700 text-xs font-semibold mb-2">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Langkah 3: Akun Super Admin & Data Awal
                    </div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">Kredensial Super Administrator</h2>
                    <p className="text-sm text-slate-600 mt-1">
                      Akun ini memegang hak akses tertinggi untuk mengelola seluruh konten, artikel berita, media, dan konfigurasi portal.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">
                          Nama Lengkap Admin <span className="text-rose-500">*</span>
                        </label>
                        <div className="relative">
                          <User className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                          <input 
                            type="text"
                            name="admin_name"
                            value={formData.admin_name}
                            onChange={handleChange}
                            placeholder="Super Administrator"
                            className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-500/20 shadow-xs"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">
                          Email Login Admin <span className="text-rose-500">*</span>
                        </label>
                        <div className="relative">
                          <Mail className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                          <input 
                            type="email"
                            name="admin_email"
                            value={formData.admin_email}
                            onChange={handleChange}
                            placeholder="admin@example.com"
                            className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-500/20 shadow-xs"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">
                          Kata Sandi Baru {installStatus?.is_installed && <span className="text-slate-500 font-normal">(Kosongkan bila tetap)</span>}
                        </label>
                        <div className="relative">
                          <Lock className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                          <input 
                            type="password"
                            name="admin_password"
                            value={formData.admin_password}
                            onChange={handleChange}
                            placeholder="Minimal 6 karakter"
                            className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-500/20 shadow-xs"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">
                          Ulangi Kata Sandi
                        </label>
                        <div className="relative">
                          <KeyRound className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                          <input 
                            type="password"
                            name="admin_password_confirm"
                            value={formData.admin_password_confirm}
                            onChange={handleChange}
                            placeholder="Ketik ulang kata sandi"
                            className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-500/20 shadow-xs"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-start gap-2.5">
                      <ShieldCheck className="w-4 h-4 text-violet-600 flex-shrink-0 mt-0.5" />
                      <span>
                        Bila kata sandi dikosongkan pada inisialisasi awal, sistem akan menyetel kata sandi default (<code className="text-violet-700 font-mono font-semibold">admin123</code>) yang dapat langsung diubah di profil admin.
                      </span>
                    </div>

                    {/* DUMMY MIGRATION DATA CARD (LOREM IPSUM) */}
                    <div className="pt-2">
                      <label className="flex items-start gap-3.5 p-4 rounded-2xl bg-violet-50/60 border border-violet-200 hover:border-violet-300 cursor-pointer transition-all shadow-xs">
                        <input
                          type="checkbox"
                          name="install_dummy_data"
                          checked={formData.install_dummy_data}
                          onChange={(e) => setFormData(prev => ({ ...prev, install_dummy_data: e.target.checked }))}
                          className="w-4 h-4 mt-0.5 rounded text-violet-600 focus:ring-violet-500 bg-white border-slate-300"
                        />
                        <div className="space-y-1">
                          <p className="text-xs font-bold text-violet-950 flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-violet-600" />
                            <span>Pasang Data Contoh Berita Standar (Lorem Ipsum Migration)</span>
                          </p>
                          <p className="text-[11px] text-slate-600 leading-relaxed">
                            Sistem akan otomatis mengisikan artikel berita contoh Lorem Ipsum, kategori topik, dan banner redaksi agar tema langsung tampil penuh dan siap dievaluasi. Data dapat diedit atau dihapus kapan saja melalui panel admin.
                          </p>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 4: Konfirmasi Akhir */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-50 border border-violet-200 text-violet-700 text-xs font-semibold mb-2">
                      <Sparkles className="w-3.5 h-3.5" />
                      Langkah 4: Konfirmasi Konfigurasi
                    </div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">Tinjauan Akhir & Inisialisasi</h2>
                    <p className="text-sm text-slate-600 mt-1">
                      Periksa ringkasan konfigurasi sebelum sistem mengeksekusi migrasi tabel dan mengunci setup portal.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-4 divide-y divide-slate-200/80 text-xs">
                      <div className="pb-3 flex justify-between items-center">
                        <span className="text-slate-500 font-medium">Nama Portal / Web:</span>
                        <span className="text-slate-900 font-bold">{formData.site_name}</span>
                      </div>
                      <div className="py-3 flex justify-between items-center">
                        <span className="text-slate-500 font-medium">Instansi / Penerbit:</span>
                        <span className="text-slate-900 font-semibold">{formData.instansi_name}</span>
                      </div>
                      <div className="py-3 flex justify-between items-center">
                        <span className="text-slate-500 font-medium">Gaya Tema Terpilih:</span>
                        <span className="font-bold text-violet-700">
                          {formData.selected_theme === 'editorial' ? '📰 Revision Editorial Magazine' : '🏛️ Portal Layanan & Berita Terpadu'}
                        </span>
                      </div>
                      <div className="py-3 flex justify-between items-center">
                        <span className="text-slate-500 font-medium">Email Kontak:</span>
                        <span className="text-slate-800 font-mono">{formData.email_kontak || '-'}</span>
                      </div>
                      <div className="py-3 flex justify-between items-center">
                        <span className="text-slate-500 font-medium">Super Admin Login:</span>
                        <span className="text-violet-700 font-mono font-bold">{formData.admin_email}</span>
                      </div>
                      <div className="py-3 flex justify-between items-center">
                        <span className="text-slate-500 font-medium">Kata Sandi:</span>
                        <span className="text-slate-700">{formData.admin_password ? '•••••••• (Diperbarui)' : 'admin123 (Standar)'}</span>
                      </div>
                      <div className="pt-3 flex justify-between items-center">
                        <span className="text-slate-500 font-medium">Data Dummy (Lorem Ipsum):</span>
                        <span className={`font-bold ${formData.install_dummy_data ? 'text-emerald-700' : 'text-slate-500'}`}>
                          {formData.install_dummy_data ? 'Ya (Dipasang Lengkap)' : 'Tidak (Mulai Bersih)'}
                        </span>
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-violet-50 border border-violet-200 text-violet-900 text-xs space-y-1.5">
                      <p className="font-bold flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-violet-700" /> Eksekusi Otomasi Inisialisasi:
                      </p>
                      <ul className="list-disc list-inside space-y-1 text-slate-700 pl-1 pt-0.5">
                        <li>Menyimpan konfigurasi parameter situs dan tema aktif ke basis data</li>
                        <li>Membuat akun kredensial Super Admin dengan hak akses RBAC penuh</li>
                        <li>Mengaktifkan proteksi <code className="text-violet-800 font-semibold font-mono">cms_is_installed: true</code></li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 5: Sukses & Selesai */}
              {currentStep === 5 && (
                <div className="text-center py-6 space-y-6">
                  <div className="w-16 h-16 rounded-3xl bg-violet-600 text-white flex items-center justify-center mx-auto shadow-md shadow-violet-500/30">
                    <Check className="w-9 h-9 stroke-[3]" />
                  </div>

                  <div>
                    <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Instalasi CMS Berhasil!</h2>
                    <p className="text-sm text-slate-600 max-w-md mx-auto mt-2">
                      Portal {formData.site_name} telah berhasil diinisialisasi dan siap digunakan sepenuhnya.
                    </p>
                  </div>

                  <div className="max-w-md mx-auto p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left text-xs space-y-2.5">
                    <p className="font-bold text-slate-900">Kredensial Login Administrator:</p>
                    <div className="flex justify-between items-center text-slate-700">
                      <span>URL Admin Panel:</span>
                      <span className="font-mono text-violet-700 font-semibold">/admin/login</span>
                    </div>
                    <div className="flex justify-between items-center text-slate-700">
                      <span>Email Admin:</span>
                      <span className="font-mono text-violet-700 font-semibold">{formData.admin_email}</span>
                    </div>
                    <div className="flex justify-between items-center text-slate-700">
                      <span>Kata Sandi:</span>
                      <span className="font-mono text-slate-600">
                        {formData.admin_password ? '(Kata sandi yang Anda tentukan)' : 'admin123'}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                    <Link
                      to="/admin/login"
                      className="w-full sm:w-auto px-6 py-3 rounded-xl bg-violet-600 text-white font-bold text-sm shadow-sm hover:bg-violet-700 flex items-center justify-center gap-2 transition-all cursor-pointer"
                    >
                      <Lock className="w-4 h-4" />
                      <span>Masuk ke Panel Admin</span>
                    </Link>

                    <Link
                      to="/"
                      className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-semibold text-sm border border-slate-200 shadow-xs flex items-center justify-center gap-2 transition-all"
                    >
                      <Globe className="w-4 h-4" />
                      <span>Kunjungi Beranda Web</span>
                    </Link>
                  </div>
                </div>
              )}

              {/* Action Buttons for Step 1-4 */}
              {currentStep <= 4 && (
                <div className="mt-8 pt-6 border-t border-slate-200 flex items-center justify-between">
                  <div>
                    {currentStep > 1 && (
                      <button
                        type="button"
                        onClick={handlePrev}
                        disabled={submitting}
                        className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 shadow-xs flex items-center gap-1.5 transition-colors disabled:opacity-50 cursor-pointer"
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
                        className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-violet-600 hover:bg-violet-700 shadow-sm flex items-center gap-2 transition-all cursor-pointer"
                      >
                        <Lock className="w-4 h-4" />
                        <span>CMS Terkunci — Ke Panel Admin</span>
                      </Link>
                    ) : currentStep < 4 ? (
                      <button
                        type="button"
                        onClick={handleNext}
                        disabled={loadingStatus}
                        className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-violet-600 hover:bg-violet-700 shadow-sm flex items-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
                      >
                        <span>Langkah Selanjutnya</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={handleRunSetup}
                        disabled={submitting}
                        className="px-7 py-2.5 rounded-xl text-xs font-bold text-white bg-violet-600 hover:bg-violet-700 shadow-md shadow-violet-500/20 flex items-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
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
      <footer className="relative z-10 max-w-4xl mx-auto w-full pt-4 text-center text-xs text-slate-500 border-t border-slate-200 flex flex-col md:flex-row items-center justify-between gap-2">
        <p>© 2026 Djie CMS Pro. Open Source Publishing Engine.</p>
        <div className="flex items-center gap-4 text-slate-500 text-[11px] font-medium">
          <span>Revision Editorial Theme</span>
          <span>•</span>
          <span>Security Hardened</span>
          <span>•</span>
          <span>React 18 SPA</span>
        </div>
      </footer>
    </div>
  );
}
