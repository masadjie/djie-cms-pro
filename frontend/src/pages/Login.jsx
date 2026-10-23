import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { 
  Eye, 
  EyeOff, 
  AlertCircle, 
  ArrowRight,
  Check,
  ShieldCheck,
  Globe,
  Building2,
  Lock
} from 'lucide-react';
import SEOHead from '../components/common/SEOHead';

export default function Login() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  // Query live settings from CMS database for dynamic site & agency branding
  const { data: settingsData } = useQuery({
    queryKey: ['cmsWebSettingsLogin'],
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

  // Detect specific agency context or fallback to global open-source DJIE CMS PRO
  const siteName = settings.site_name || 'Djie CMS Pro';
  const instansiName = settings.instansi_name || 'Portal Manajemen Konten & Publikasi';
  const siteTagline = settings.site_tagline || 'Platform Manajemen Konten Terintegrasi & Publikasi Digital Modern';
  const siteDesc = settings.site_description || 'Kelola publikasi berita, artikel redaksi, katalog dokumen, dan layanan secara terpadu, aman, dan berkecepatan tinggi.';

  // Check URL query parameters for session expiration notice
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('expired') === '1') {
      setErrorMsg('Sesi login Anda telah berakhir demi keamanan. Silakan masuk kembali.');
    }
  }, []);

  // Load saved credentials on mount if remembered
  useEffect(() => {
    try {
      const savedCreds = localStorage.getItem('tamiang_remembered_auth');
      if (savedCreds) {
        const parsed = JSON.parse(savedCreds);
        if (parsed.identifier) setIdentifier(parsed.identifier);
        if (parsed.password) setPassword(atob(parsed.password));
        setRememberMe(true);
      }
    } catch (e) {
      // ignore parse errors
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      const result = await login(identifier.trim(), password);

      // Handle 'Remember Me'
      if (rememberMe) {
        localStorage.setItem(
          'tamiang_remembered_auth',
          JSON.stringify({
            identifier: identifier.trim(),
            password: btoa(password)
          })
        );
      } else {
        localStorage.removeItem('tamiang_remembered_auth');
      }

      // Role-based smart redirect
      const role = result?.user?.role;
      if (role === 'WARGA') {
        navigate('/', { replace: true });
      } else {
        navigate('/admin', { replace: true });
      }
    } catch (err) {
      console.error('Login error:', err);
      setErrorMsg(
        err.response?.data?.message
          ? err.response.data.message
          : err.message || 'Login gagal. Periksa kembali Email/NIK/NIP dan Password Anda.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f1f5f9] flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans">
      <SEOHead 
        title={`Masuk Administrator | ${siteName}`}
        description={`Portal otentikasi login administrator & pengelola CMS ${siteName}.`}
      />

      {/* Main 2-Column Floating Card */}
      <div className="bg-white rounded-[32px] sm:rounded-[36px] shadow-[0_20px_60px_rgba(15,23,42,0.08)] border border-slate-200/80 max-w-5xl w-full min-h-[600px] grid grid-cols-1 md:grid-cols-2 p-3 sm:p-4 gap-4 overflow-hidden">
        
        {/* Left Column: Visual Brand Panel (Clean Royal Blue Aesthetic) */}
        <div className="relative rounded-[24px] sm:rounded-[28px] bg-gradient-to-br from-blue-50/70 via-sky-50/60 to-indigo-50/70 p-8 sm:p-10 flex flex-col justify-between overflow-hidden border border-blue-100/60 shadow-inner">
          
          {/* Animated Soft Blue Spheres */}
          <div className="absolute -top-10 -right-10 w-72 h-72 rounded-full bg-blue-300/30 blur-2xl pointer-events-none" />
          <div className="absolute top-1/4 -right-12 w-64 h-64 rounded-full bg-sky-400/20 blur-xl pointer-events-none" />
          <div className="absolute bottom-1/3 -left-12 w-56 h-56 rounded-full bg-indigo-300/25 blur-2xl pointer-events-none" />
          <div className="absolute -bottom-16 -right-10 w-80 h-80 rounded-full bg-blue-400/20 blur-3xl pointer-events-none" />
          
          {/* Top Brand Logo */}
          <div className="relative z-10 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 shadow-xs flex items-center justify-center p-1 overflow-hidden shrink-0">
              <img
                src="/logo-djie-cms-pro-square.png"
                alt="Logo CMS"
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.parentElement.innerHTML = '<span class="text-white font-black text-lg bg-blue-600 w-full h-full rounded-lg flex items-center justify-center">D</span>';
                }}
              />
            </div>
            <div className="overflow-hidden">
              <span className="font-extrabold text-slate-900 text-sm tracking-tight block truncate">
                {siteName}
              </span>
              <span className="text-[11px] font-bold text-blue-700 block truncate">
                {instansiName}
              </span>
            </div>
          </div>

          {/* Bottom Statement & Feature Badge */}
          <div className="relative z-10 space-y-6 pt-16 sm:pt-24">
            <div className="space-y-3">
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-snug">
                {siteTagline}
              </h2>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                {siteDesc}
              </p>
            </div>

            {/* Security Proof Glass Card */}
            <div className="bg-white/80 backdrop-blur-md border border-white/90 rounded-2xl p-3.5 flex items-center gap-3.5 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200/80 text-blue-700 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5 text-blue-600" />
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-black text-slate-900 truncate">Sistem Diamankan & Terverifikasi</p>
                <p className="text-[11px] text-slate-500 font-medium truncate">Enkripsi Berstandar Industri & Proteksi RBAC</p>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Unified RBAC Clean Form */}
        <div className="flex flex-col justify-between p-6 sm:p-8 lg:p-10">
          
          <div className="space-y-6 max-w-sm mx-auto w-full my-auto">
            
            {/* Header Form */}
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-white text-blue-700 flex items-center justify-center mx-auto shadow-xs border border-slate-200 p-1.5">
                <img
                  src="/logo-djie-cms-pro-square.png"
                  alt="Logo"
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.parentElement.innerHTML = '<span class="text-white font-black text-base bg-blue-600 w-full h-full rounded-xl flex items-center justify-center">D</span>';
                  }}
                />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  Selamat Datang di Panel CMS
                </h1>
                <p className="text-xs text-slate-500 font-medium mt-1">
                  Masuk ke Panel Administrator {siteName}
                </p>
              </div>
            </div>

            {/* Error Alert */}
            {errorMsg && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 flex items-center gap-2.5 text-red-700 text-xs font-medium">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-4" autoComplete="off">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Email Administrator / Akun Pengguna</label>
                <input
                  type="text"
                  required
                  autoComplete="username"
                  placeholder="admin@example.com atau NIP / NIK"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-900 placeholder-slate-400 text-xs font-medium transition-all shadow-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Kata Sandi (Password)</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    autoComplete="current-password"
                    placeholder="Masukkan kata sandi..."
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-4 pr-11 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-900 placeholder-slate-400 text-xs font-medium transition-all shadow-xs"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember Account / Simpan Password Checkbox */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none group">
                  <div className="relative flex items-center justify-center">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-4 h-4 border-2 border-slate-300 peer-checked:border-blue-600 peer-checked:bg-blue-600 rounded-md transition-all flex items-center justify-center group-hover:border-slate-400">
                      {rememberMe && <Check className="w-3 h-3 text-white stroke-[3]" />}
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-slate-600 group-hover:text-slate-900 transition-colors">
                    Ingat akun & kata sandi
                  </span>
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-6 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-black text-xs rounded-xl shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-3 cursor-pointer"
              >
                <span>{loading ? 'Mengautentikasi...' : 'Masuk ke Dashboard CMS'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

          </div>

          {/* Footer Note */}
          <div className="pt-4 text-center space-y-2">
            <p className="text-[11px] text-slate-400">
              Dilindungi enkripsi SSL 256-bit berstandar industri. Dikembangkan menggunakan <span className="font-semibold text-slate-600">Djie CMS Pro</span>.
            </p>
            <Link
              to="/"
              className="text-xs font-bold text-blue-700 hover:text-blue-900 transition-colors inline-block"
            >
              ← Kembali ke Beranda Utama
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
}
