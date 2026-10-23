import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Eye, 
  EyeOff, 
  AlertCircle, 
  ArrowRight,
  Check
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
      const data = await login(identifier, password);
      
      // Handle Remember Me logic
      if (rememberMe) {
        try {
          const credsToStore = {
            identifier,
            password: btoa(password),
            savedAt: new Date().toISOString()
          };
          localStorage.setItem('tamiang_remembered_auth', JSON.stringify(credsToStore));
        } catch (e) {
          // ignore storage error
        }
      } else {
        localStorage.removeItem('tamiang_remembered_auth');
      }

      if (data.user.role !== 'WARGA') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (err) {
      setErrorMsg(
        typeof err === 'string' 
          ? err 
          : err.message || 'Login gagal. Periksa kembali Email/NIK/NIP dan Password Anda.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#dce3ec] flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans">
      <SEOHead 
        title="Masuk Layanan Terpadu & SiKEPO - BKPSDM Kab. Aceh Tamiang"
        description="Portal otentikasi login tunggal terpadu untuk ASN, Pengelola CMS, dan Administrator BKPSDM Pemerintah Kabupaten Aceh Tamiang."
      />

      {/* Main 2-Column Floating Card */}
      <div className="bg-white rounded-[36px] shadow-[0_25px_70px_rgba(15,23,42,0.1)] border border-white max-w-5xl w-full min-h-[620px] grid grid-cols-1 md:grid-cols-2 p-3 sm:p-4 gap-4 overflow-hidden">
        
        {/* Left Column: Visual Brand Panel with Living Animated Floating Spheres */}
        <div className="relative rounded-[28px] bg-gradient-to-br from-[#f8fafc] via-[#edf7f2] to-[#d8ece1] p-8 sm:p-10 flex flex-col justify-between overflow-hidden border border-white/80 shadow-inner">
          
          {/* Animated Floating Blurred Spheres */}
          <div className="absolute -top-10 -right-10 w-72 h-72 rounded-full bg-gradient-to-br from-emerald-400/40 to-teal-300/30 blur-2xl animate-sphere-1 pointer-events-none" />
          <div className="absolute top-1/4 -right-12 w-64 h-64 rounded-full bg-gradient-to-tr from-emerald-500/30 via-teal-400/40 to-white/50 blur-xl animate-sphere-2 pointer-events-none" />
          <div className="absolute bottom-1/3 -left-12 w-56 h-56 rounded-full bg-gradient-to-br from-amber-300/35 to-emerald-300/30 blur-2xl animate-sphere-3 pointer-events-none" />
          <div className="absolute -bottom-16 -right-10 w-80 h-80 rounded-full bg-gradient-to-tl from-emerald-400/35 via-teal-200/40 to-amber-200/30 blur-3xl animate-sphere-4 pointer-events-none" />
          
          {/* Top Brand Logo */}
          <div className="relative z-10 flex items-center gap-3">
            <img
              src="/logo-tamiang.png"
              alt="Logo Aceh Tamiang"
              className="w-9 h-9 object-contain drop-shadow-sm"
            />
            <span className="font-extrabold text-slate-900 text-sm tracking-tight">
              BKPSDM Aceh Tamiang
            </span>
          </div>

          {/* Bottom Statement & Social Proof */}
          <div className="relative z-10 space-y-6 pt-24">
            <div className="space-y-3">
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-snug">
                Kelola Layanan Kepegawaian ASN Secara Terpadu & Digital
              </h2>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Portal CMS & Sistem Informasi Manajemen Kepegawaian Pemerintah Kabupaten Aceh Tamiang. Terenkripsi, cepat, dan terhubung langsung dengan SIASN BKN.
              </p>
            </div>

            {/* Social Proof Glass Card */}
            <div className="bg-white/80 backdrop-blur-md border border-white/90 rounded-2xl p-3.5 flex items-center gap-3.5 shadow-sm">
              <div className="flex -space-x-2 shrink-0">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&h=80&q=80"
                  alt="Avatar"
                  className="w-8 h-8 rounded-full border-2 border-white object-cover shadow-xs"
                />
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&h=80&q=80"
                  alt="Avatar"
                  className="w-8 h-8 rounded-full border-2 border-white object-cover shadow-xs"
                />
                <img
                  src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=80&h=80&q=80"
                  alt="Avatar"
                  className="w-8 h-8 rounded-full border-2 border-white object-cover shadow-xs"
                />
              </div>
              <div>
                <p className="text-xs font-black text-slate-900">4.890+ ASN Terlayani</p>
                <p className="text-[11px] text-slate-500 font-medium">Sistem Manajemen Kepegawaian Terpadu</p>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Unified RBAC Clean Form */}
        <div className="flex flex-col justify-between p-6 sm:p-8 lg:p-10">
          
          <div className="space-y-6 max-w-sm mx-auto w-full my-auto">
            
            {/* Header Form */}
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center mx-auto shadow-sm border border-emerald-100/60">
                <img
                  src="/logo-tamiang.png"
                  alt="Logo"
                  className="w-7 h-7 object-contain"
                />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  Selamat Datang di Portal CMS
                </h1>
                <p className="text-xs text-slate-500 font-medium mt-1">
                  Masuk ke Panel Administrator BKPSDM
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
                <label className="text-xs font-bold text-slate-700">Email Administrator / NIP</label>
                <input
                  type="text"
                  required
                  autoComplete="username"
                  placeholder="admin@acehtamiangkab.go.id atau NIP"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 text-slate-900 placeholder-slate-400 text-xs font-medium transition-all shadow-xs"
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
                    className="w-full pl-4 pr-11 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 text-slate-900 placeholder-slate-400 text-xs font-medium transition-all shadow-xs"
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
                    <div className="w-4 h-4 border-2 border-slate-300 peer-checked:border-emerald-600 peer-checked:bg-emerald-600 rounded-md transition-all flex items-center justify-center group-hover:border-slate-400">
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
                className="w-full py-3.5 px-6 bg-slate-950 hover:bg-slate-900 text-white font-black text-xs rounded-xl shadow-lg hover:shadow-slate-950/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-3 cursor-pointer"
              >
                <span>{loading ? 'Mengautentikasi...' : 'Masuk ke Dashboard CMS'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

          </div>

          {/* Footer Note */}
          <div className="pt-4 text-center space-y-2">
            <p className="text-[11px] text-slate-400">
              Portal resmi dilindungi enkripsi SSL 256-bit dan TTE BSrE tersertifikasi. Dikembangkan menggunakan <span className="font-semibold text-slate-600">DJIE CMS PRO 2026</span>.
            </p>
            <Link
              to="/"
              className="text-xs font-bold text-emerald-800 hover:text-emerald-950 transition-colors inline-block"
            >
              ← Kembali ke Portal Publik Aceh Tamiang
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
}
