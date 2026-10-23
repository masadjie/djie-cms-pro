import React from 'react';
import { Paperclip, FileText, Download, Trash2 } from 'lucide-react';

export default function ArticleAttachmentManager({
  selectedAttachments,
  setSelectedAttachments,
  setMediaModalOpen
}) {
  return (
    <div className="bg-white rounded-xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <Paperclip className="w-4 h-4 text-slate-600" />
            <h3 className="text-sm font-bold text-slate-900">
              Lampiran & Dokumen Pendukung
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Surat Edaran, Formulir, atau petunjuk teknis terkait artikel yang dapat diunduh publik.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setMediaModalOpen(true)}
          className="w-full sm:w-auto px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer shrink-0"
        >
          <Paperclip className="w-3.5 h-3.5" />
          <span>Pilih dari Media Library ({selectedAttachments.length})</span>
        </button>
      </div>

      {/* List of Attached Files */}
      {selectedAttachments.length === 0 ? (
        <div className="p-6 text-center bg-slate-50/70 rounded-lg border border-dashed border-slate-200 text-xs text-slate-400">
          <Paperclip className="w-5 h-5 mx-auto mb-1.5 text-slate-300" />
          <span>Belum ada dokumen yang dilampirkan. Klik tombol di atas untuk menyematkan berkas.</span>
        </div>
      ) : (
        <div className="space-y-2">
          {selectedAttachments.map((att) => (
            <div 
              key={att.id}
              className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between gap-3 text-xs"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="p-2 bg-white rounded-md border border-slate-200 shrink-0">
                  <FileText className="w-4 h-4 text-emerald-700" />
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-slate-900 truncate">
                    {att.nama_lampiran}
                  </p>
                  <p className="text-[10px] text-slate-400 truncate font-mono">
                    {att.original_filename} &bull; {(att.file_size_bytes / 1024).toFixed(0)} KB &bull; {att.kategori_dokumen}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <a
                  href={att.file_url}
                  target="_blank"
                  rel="noreferrer"
                  className="p-1.5 hover:bg-white text-emerald-700 rounded-lg transition-colors"
                  title="Unduh / Buka Dokumen"
                >
                  <Download className="w-4 h-4" />
                </a>
                <button
                  type="button"
                  onClick={() => setSelectedAttachments(selectedAttachments.filter(a => a.id !== att.id))}
                  className="p-1.5 hover:bg-red-100 text-red-500 rounded-lg transition-colors cursor-pointer"
                  title="Lepas Lampiran"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
