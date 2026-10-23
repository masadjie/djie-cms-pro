import React from 'react';
import { X } from 'lucide-react';

export default function ArticlePreviewModal({
  isOpen,
  onClose,
  formData,
  kategoriList
}) {
  if (!isOpen) return null;

  const kategoriName = kategoriList.find((k) => Number(k.id) === Number(formData.kategori_id))?.nama_kategori || 'Berita Kepegawaian';

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
        
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-xs z-10">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-lg">
              Pratinjau Halaman Berita
            </span>
            <span className="text-xs text-slate-400 font-mono">/berita/{formData.slug || 'judul'}</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-600 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body Article Preview */}
        <div className="p-6 sm:p-8 space-y-6">
          <div className="space-y-3">
            <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              {kategoriName}
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
              {formData.title || 'Judul Berita'}
            </h1>
            <div className="flex items-center gap-3 text-xs text-slate-400 font-medium">
              <span>Oleh: {formData.author_name}</span>
              <span>&bull;</span>
              <span>{new Date(formData.published_at || Date.now()).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
            </div>
          </div>

          {formData.cover_image && (
            <div className="rounded-2xl overflow-hidden border border-slate-200">
              <img
                src={formData.cover_image}
                alt="Preview Cover"
                className="w-full h-72 object-cover"
                onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=800&q=80'; }}
              />
              {formData.cover_caption && (
                <p className="text-xs text-slate-400 italic p-2 bg-slate-50 text-center">
                  Foto: {formData.cover_caption}
                </p>
              )}
            </div>
          )}

          {formData.excerpt && (
            <p className="text-sm font-semibold text-slate-700 italic border-l-4 border-emerald-600 pl-4 py-1 bg-slate-50 rounded-r-lg">
              {formData.excerpt}
            </p>
          )}

          <div 
            className="prose prose-slate max-w-none text-sm leading-relaxed text-slate-800 space-y-4"
            dangerouslySetInnerHTML={{ __html: formData.content }}
          />
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-700 bg-slate-200 hover:bg-slate-300 rounded-xl cursor-pointer"
          >
            Tutup Pratinjau
          </button>
        </div>

      </div>
    </div>
  );
}
