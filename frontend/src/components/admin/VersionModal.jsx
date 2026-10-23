import React from 'react';
import { 
  Sparkles, 
  CheckCircle2, 
  Calendar, 
  ArrowUpRight, 
  X, 
  ShieldCheck, 
  Layers, 
  Tag, 
  Zap,
  Info
} from 'lucide-react';
import { CMS_APP_VERSION } from '../../config/versionConfig';

export default function VersionModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-2xl w-full overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 p-6 text-white flex items-start justify-between relative overflow-hidden">
          <div className="relative z-10 space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-emerald-400" />
                {CMS_APP_VERSION.status}
              </span>
              <span className="text-[11px] font-bold text-slate-300">
                Dirilis: {CMS_APP_VERSION.buildDate}
              </span>
            </div>

            <div>
              <div className="flex items-center gap-3">
                <img 
                  src="/logo-djie-cms-pro-square.png" 
                  alt="DJIE CMS PRO" 
                  className="w-10 h-10 rounded-xl object-contain shadow-md"
                />
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
                    <span>{CMS_APP_VERSION.fullVersion}</span>
                  </h2>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Pusat Informasi Pembaruan Sistem, Peningkatan Keamanan & Log Rilis Fitur
                  </p>
                </div>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="relative z-10 p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
        </div>

        {/* Modal Body: Changelog Timeline */}
        <div className="p-6 overflow-y-auto space-y-6 divide-y divide-slate-100 flex-1">
          {CMS_APP_VERSION.changelog.map((release, idx) => (
            <div key={release.version} className={`space-y-3 ${idx > 0 ? 'pt-6' : ''}`}>
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <span className={`px-2.5 py-1 rounded-xl text-xs font-black ${
                    idx === 0 
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                      : 'bg-slate-100 text-slate-700 border border-slate-200'
                  }`}>
                    {release.version}
                  </span>
                  <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    {release.date}
                  </span>
                </div>
                <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                  idx === 0 ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-500'
                }`}>
                  {release.badge}
                </span>
              </div>

              {/* Highlights List */}
              <ul className="space-y-2">
                {release.highlights.map((item, hIdx) => {
                  const parts = item.split(': ');
                  const title = parts.length > 1 ? parts[0] : null;
                  const desc = parts.length > 1 ? parts[1] : item;

                  return (
                    <li key={hIdx} className="flex items-start gap-2.5 text-xs text-slate-700 leading-relaxed">
                      <CheckCircle2 className={`w-4 h-4 shrink-0 mt-0.5 ${idx === 0 ? 'text-emerald-600' : 'text-slate-400'}`} />
                      <div>
                        {title && (
                          <span className="font-black text-slate-900 mr-1.5">
                            {title}:
                          </span>
                        )}
                        <span>{desc}</span>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Sistem berjalan pada versi paling mutakhir dan aman.</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-all shadow-xs cursor-pointer"
          >
            Mengerti & Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
