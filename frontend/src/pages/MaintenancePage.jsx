import React from 'react';
import { Link } from 'react-router-dom';
import { Hammer, Clock, ShieldAlert, LogIn, ArrowRight } from 'lucide-react';

export default function MaintenancePage({ settings }) {
  const title = settings?.maintenance_title || 'Sistem Sedang Dalam Pemeliharaan Berkala';
  const message = settings?.maintenance_message || 'Portal layanan publik ini sedang dalam proses pembaruan dan optimalisasi berkala oleh Tim Teknis. Seluruh layanan publik akan segera kembali online.';
  const until = settings?.maintenance_until;
  const siteTitle = settings?.site_title || 'Pemerintah Kabupaten Aceh Tamiang';
  const instansiName = settings?.instansi_nama || 'Kabupaten Aceh Tamiang';
  const contactWa = settings?.kontak_wa || '081168814767';
  const contactEmail = settings?.kontak_email || 'bkpsdm@acehtamiangkab.go.id';

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white flex flex-col justify-between selection:bg-amber-400 selection:text-slate-950 relative overflow-hidden">
      
      {/* Background Subtle Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Top Navbar Minimal */}
      <header className="relative z-10 w-full max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src="/logo-djie-cms-pro-square.png"
            alt="Logo"
            className="w-10 h-10 object-contain drop-shadow"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
          <div>
            <span className="text-xs font-black uppercase tracking-wider text-amber-400 block">
              Portal Resmi
            </span>
            <span className="text-sm font-bold text-slate-200">
              {siteTitle}
            </span>
          </div>
        </div>

        <Link
          to="/login"
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 hover:text-white text-xs font-semibold border border-slate-700/70 transition-all shadow-xs"
        >
          <LogIn className="w-3.5 h-3.5 text-amber-400" />
          <span>Login Admin</span>
        </Link>
      </header>

      {/* Central Content Card */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-12">
        <div className="max-w-xl w-full text-center space-y-6 bg-slate-900/60 backdrop-blur-md p-8 sm:p-12 rounded-3xl border border-slate-800/80 shadow-2xl">
          
          {/* Maintenance Badge & Icon */}
          <div className="inline-flex p-4 rounded-3xl bg-amber-400/10 border border-amber-400/20 text-amber-400 shadow-lg shadow-amber-400/5">
            <Hammer className="w-10 h-10 animate-bounce" />
          </div>

          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-amber-400/15 text-amber-300 border border-amber-400/30">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Mode Pemeliharaan Teknis Aktif</span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-snug">
              {title}
            </h1>
            
            <p className="text-sm text-slate-400 leading-relaxed max-w-lg mx-auto">
              {message}
            </p>
          </div>

          {/* Estimated Completion Countdown / Datetime */}
          {until && (
            <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-slate-800/80 border border-slate-700/80 text-xs font-semibold text-slate-300 shadow-inner">
              <Clock className="w-4 h-4 text-amber-400 shrink-0" />
              <span>
                Estimasi Selesai: <strong className="text-white">{new Date(until).toLocaleString('id-ID', { dateStyle: 'full', timeStyle: 'short' })} WIB</strong>
              </span>
            </div>
          )}

          {/* Emergency Helpdesk Contact */}
          <div className="pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-center gap-3 text-xs text-slate-400">
            <span>Perlu bantuan darurat? Hubungi Tim:</span>
            <div className="flex items-center gap-2">
              {contactWa && (
                <a
                  href={`https://wa.me/${contactWa.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 font-bold border border-emerald-500/30 transition-colors"
                >
                  WhatsApp Helpdesk
                </a>
              )}
              {contactEmail && (
                <a
                  href={`mailto:${contactEmail}`}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium border border-slate-700 transition-colors"
                >
                  Email
                </a>
              )}
            </div>
          </div>

        </div>
      </main>

      {/* Footer Minimal */}
      <footer className="relative z-10 w-full max-w-6xl mx-auto px-6 py-6 text-center text-xs text-slate-500">
        <p>&copy; {new Date().getFullYear()} {instansiName}. Seluruh Hak Cipta Dilindungi.</p>
      </footer>

    </div>
  );
}
