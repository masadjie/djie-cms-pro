import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  Zap,
  Save,
  Eye,
  Send,
  Sliders,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export default function ArticleEditorHeader({
  isEditMode,
  title,
  onBoostSeo,
  onSaveDraft,
  onOpenPreview,
  onPublish,
  isPending,
  sidebarOpen,
  setSidebarOpen,
  saveSuccessToast,
  saveErrorToast,
  autoSaveStatus
}) {
  return (
    <>
      <header className="h-16 bg-white border-b border-slate-200/90 sticky top-0 z-40 px-4 sm:px-6 flex items-center justify-between shadow-2xs">
        {/* Left: Back Link & Document Title */}
        <div className="flex items-center gap-3 min-w-0">
          <Link
            to="/admin?tab=berita"
            className="p-2 hover:bg-slate-100 rounded-2xl text-slate-600 hover:text-slate-900 transition-colors flex items-center gap-1.5 text-xs font-bold shrink-0"
            title="Kembali ke Dashboard Berita"
          >
            <ArrowLeft className="w-4 h-4 text-emerald-800" />
            <span className="hidden sm:inline">Daftar Berita</span>
          </Link>

          <div className="h-5 w-px bg-slate-200 shrink-0" />

          <div className="flex items-center gap-2 min-w-0">
            <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-lg shrink-0">
              {isEditMode ? 'Edit Berita' : 'Tulis Berita Baru'}
            </span>
            <p className="text-xs font-bold text-slate-800 truncate max-w-xs sm:max-w-md hidden md:block">
              {title || 'Draft Berita Tanpa Judul'}
            </p>
            {autoSaveStatus && (
              <span className="hidden xl:inline-flex items-center gap-1 text-[10px] text-slate-400 font-medium ml-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                {autoSaveStatus}
              </span>
            )}
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Quick 1-Click SEO Boost Button */}
          <button
            type="button"
            onClick={onBoostSeo}
            className="h-8 sm:h-9 px-2.5 sm:px-3.5 bg-amber-400 hover:bg-amber-300 active:scale-95 text-slate-950 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs border border-amber-500/40"
            title="1-Klik Boost Kata Kunci, Judul Google, Meta Deskripsi & Tag SEO"
          >
            <Zap className="w-3.5 h-3.5 fill-slate-950" />
            <span className="hidden md:inline">Boost SEO</span>
          </button>

          <div className="h-5 w-px bg-slate-200 hidden sm:block mx-0.5" />

          {/* Save Draft */}
          <button
            type="button"
            onClick={onSaveDraft}
            disabled={isPending}
            className="h-8 sm:h-9 px-2.5 sm:px-3.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 hover:text-slate-900 border border-slate-200/90 rounded-xl transition-all cursor-pointer hidden md:flex items-center gap-1.5 shadow-2xs disabled:opacity-50"
            title="Simpan sebagai Konsep (Draft)"
          >
            <Save className="w-3.5 h-3.5 text-slate-500" />
            <span>Konsep</span>
          </button>

          {/* Preview Modal Trigger */}
          <button
            type="button"
            onClick={onOpenPreview}
            className="h-8 sm:h-9 px-2.5 sm:px-3.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 hover:text-slate-900 border border-slate-200/90 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
            title="Lihat Pratinjau Naskah"
          >
            <Eye className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden sm:inline">Pratinjau</span>
          </button>

          {/* Big Publish / Update Button */}
          <button
            type="button"
            onClick={onPublish}
            disabled={isPending}
            className="h-8 sm:h-9 px-3 sm:px-4 bg-emerald-800 hover:bg-emerald-700 active:scale-95 text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <Send className="w-3.5 h-3.5 text-amber-300" />
            <span className="hidden xs:inline">{isPending ? 'Menyimpan...' : (isEditMode ? 'Perbarui' : 'Terbitkan')}</span>
          </button>

          {/* Sidebar Toggle */}
          <button
            type="button"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl border transition-all cursor-pointer flex items-center justify-center shrink-0 ${
              sidebarOpen 
                ? 'bg-slate-900 text-white border-slate-900 shadow-2xs' 
                : 'bg-white hover:bg-slate-50 text-slate-600 border-slate-200/90 shadow-2xs'
            }`}
            title="Buka / Tutup Pengaturan Publikasi"
            aria-label="Toggle Pengaturan Publikasi"
          >
            <Sliders className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Toast Notifications */}
      {saveSuccessToast && (
        <div className="fixed top-20 right-6 z-50 bg-emerald-900 text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 text-xs font-bold animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{saveSuccessToast}</span>
        </div>
      )}
      {saveErrorToast && (
        <div className="fixed top-20 right-6 z-50 bg-red-900 text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 text-xs font-bold animate-pulse">
          <AlertCircle className="w-4 h-4 text-red-400" />
          <span>{saveErrorToast}</span>
        </div>
      )}
    </>
  );
}
