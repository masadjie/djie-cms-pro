import React, { useState, useEffect } from 'react';
import { ShieldCheck, Sparkles } from 'lucide-react';

export default function SplashScreen({ onFinish }) {
  const [progress, setProgress] = useState(0);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    // Smooth progress increment
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        // Accelerate near end
        const step = prev > 70 ? 15 : prev > 40 ? 10 : 8;
        return Math.min(100, prev + step);
      });
    }, 90);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (progress >= 100) {
      const timer = setTimeout(() => {
        setIsFadingOut(true);
        const finishTimer = setTimeout(() => {
          if (onFinish) onFinish();
        }, 600); // Wait for transition
        return () => clearTimeout(finishTimer);
      }, 350);
      return () => clearTimeout(timer);
    }
  }, [progress, onFinish]);

  return (
    <div 
      className={`fixed inset-0 z-99999 flex flex-col items-center justify-center bg-gradient-to-br from-[#022c22] via-[#064e3b] to-[#042f2e] text-white transition-opacity duration-700 ease-in-out select-none ${
        isFadingOut ? 'opacity-0 pointer-events-none scale-105' : 'opacity-100 scale-100'
      }`}
      style={{ transitionProperty: 'opacity, transform' }}
    >
      {/* Background Decorative Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />

      {/* Main Container */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-md w-full space-y-6">
        
        {/* Animated Logo & Ring */}
        <div className="relative flex items-center justify-center">
          {/* Pulsing outer aura */}
          <div className="absolute w-28 h-28 rounded-full bg-emerald-400/20 animate-ping opacity-75" />
          
          {/* Circular badge with gold border */}
          <div className="relative w-24 h-24 rounded-3xl bg-white/10 backdrop-blur-md p-3.5 border border-emerald-400/30 shadow-2xl shadow-emerald-950 flex items-center justify-center">
            <img 
              src="/logo-tamiang.png" 
              alt="Logo Aceh Tamiang" 
              className="w-full h-full object-contain filter drop-shadow-lg transform transition-transform duration-700 hover:scale-105"
            />
          </div>

          <div className="absolute -bottom-2 -right-2 bg-amber-400 text-emerald-950 p-1.5 rounded-xl shadow-lg border border-amber-300">
            <ShieldCheck className="w-4 h-4" />
          </div>
        </div>

        {/* Brand Typography */}
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-800/60 border border-emerald-600/40 text-amber-300 text-[10px] font-black tracking-widest uppercase">
            <Sparkles className="w-3 h-3 text-amber-300" />
            <span>PORTAL LAYANAN RESMI</span>
          </div>

          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight drop-shadow-md">
            BKPSDM KAB. ACEH TAMIANG
          </h1>
          <p className="text-xs text-emerald-200/90 font-medium">
            Badan Kepegawaian & Pengembangan Sumber Daya Manusia
          </p>
        </div>

        {/* Progress Bar & Status Text */}
        <div className="w-64 space-y-2.5 pt-2">
          {/* Progress Bar Container */}
          <div className="w-full h-2 bg-emerald-950/80 rounded-full overflow-hidden border border-emerald-700/50 p-0.5 shadow-inner">
            <div 
              className="h-full bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300 rounded-full transition-all duration-150 ease-out shadow-xs"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] font-mono text-emerald-300/80">
            <span>
              {progress < 40 ? 'Menghubungkan...' : progress < 80 ? 'Memuat Ekosistem ASN...' : 'Menyiapkan Portal...'}
            </span>
            <span className="font-bold text-amber-300">{progress}%</span>
          </div>
        </div>

        {/* Security & Engine Tag */}
        <div className="pt-4 flex items-center justify-center gap-2 text-[10px] text-emerald-400/60 font-semibold tracking-wide uppercase">
          <span>SSL 256-Bit</span>
          <span>&bull;</span>
          <span>SIASN Terintegrasi</span>
          <span>&bull;</span>
          <span>DJIE CMS PRO 2026</span>
        </div>

      </div>
    </div>
  );
}
