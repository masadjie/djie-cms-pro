import React from 'react';
import { Check, Copy } from 'lucide-react';

export default function ArticleTitleCard({
  titleTextareaRef,
  title,
  onTitleChange,
  slug,
  onSlugChange,
  isAutoSlug,
  setIsAutoSlug,
  editingSlug,
  setEditingSlug,
  useShortPermalink,
  setUseShortPermalink,
  copiedSlug,
  onCopyPermalink
}) {
  return (
    <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 border border-slate-200/90 shadow-sm space-y-4">
      {/* Auto-expanding Title Textarea */}
      <div>
        <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1 block">
          Judul Artikel Berita / Pengumuman
        </label>
        <textarea
          ref={titleTextareaRef}
          rows={2}
          placeholder="Tambahkan judul berita atau pengumuman ASN di sini..."
          value={title}
          onChange={onTitleChange}
          className="w-full text-xl xs:text-2xl sm:text-3xl font-black text-slate-900 placeholder:text-slate-300 focus:outline-none border-none p-0 tracking-tight leading-snug resize-none overflow-hidden"
        />
      </div>

      {/* Permalink (Slug) Preview & Edit Bar */}
      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 pt-3 border-t border-slate-100">
        <span className="font-semibold text-slate-400">Permalink:</span>
        
        {/* Toggle Format: Standar (/berita/) vs Ringkas (Langsung /) */}
        <div className="inline-flex items-center rounded-lg bg-slate-100 p-0.5 border border-slate-200">
          <button
            type="button"
            onClick={() => setUseShortPermalink(false)}
            className={`px-2 py-0.5 text-[10px] font-bold rounded-md transition-all cursor-pointer ${
              !useShortPermalink ? 'bg-white text-emerald-800 shadow-2xs font-black' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            /berita/slug
          </button>
          <button
            type="button"
            onClick={() => setUseShortPermalink(true)}
            className={`px-2 py-0.5 text-[10px] font-bold rounded-md transition-all cursor-pointer ${
              useShortPermalink ? 'bg-white text-emerald-800 shadow-2xs font-black' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            /slug
          </button>
        </div>

        <div className="flex items-center gap-1 font-mono text-[10px] xs:text-[11px] bg-slate-50 border border-slate-200/80 px-2 py-1 rounded-xl text-slate-700 max-w-full overflow-x-auto">
          <span className="text-slate-400 truncate hidden xs:inline">
            {typeof window !== 'undefined' ? window.location.origin : 'https://bkpsdm.acehtamiangkab.go.id'}
            {useShortPermalink ? '/' : '/berita/'}
          </span>
          <span className="text-slate-400 xs:hidden">
            {useShortPermalink ? '/' : '/berita/'}
          </span>

          {editingSlug ? (
            <input
              type="text"
              value={slug}
              onChange={(e) => onSlugChange(e.target.value)}
              className="bg-white border border-emerald-400 px-1 py-0.5 rounded text-emerald-800 font-bold focus:outline-none min-w-[120px]"
              autoFocus
            />
          ) : (
            <span className="font-bold text-emerald-800 truncate">{slug || 'judul-berita'}</span>
          )}
        </div>

        <div className="flex items-center gap-1">
          {editingSlug ? (
            <button
              type="button"
              onClick={() => { setEditingSlug(false); setIsAutoSlug(false); }}
              className="p-1 hover:bg-emerald-50 text-emerald-700 rounded-lg text-xs font-bold cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setEditingSlug(true)}
              className="px-2 py-0.5 hover:bg-slate-100 text-slate-600 rounded-lg text-[10px] font-bold cursor-pointer"
            >
              Edit
            </button>
          )}

          <button
            type="button"
            onClick={onCopyPermalink}
            className="p-1 hover:bg-slate-100 text-slate-500 rounded-lg text-xs cursor-pointer"
            title="Salin Tautan Lengkap"
          >
            {copiedSlug ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>
    </div>
  );
}
