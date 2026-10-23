import React from 'react';
import {
  ImageIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Trash2
} from 'lucide-react';

export default function ImageResizerToolbar({
  selectedImg,
  setImageSize,
  onDelete
}) {
  if (!selectedImg) return null;

  return (
    <div className="image-resizer-toolbar sticky top-2 z-20 mx-auto bg-slate-900/95 text-white backdrop-blur-md px-3.5 py-1.5 rounded-2xl shadow-2xl border border-slate-700/80 flex items-center gap-2 text-xs animate-in fade-in slide-in-from-top-1 duration-150">
      <span className="text-[11px] font-bold text-amber-300 flex items-center gap-1 shrink-0">
        <ImageIcon className="w-3.5 h-3.5" />
        <span>Ukuran Gambar:</span>
      </span>

      <div className="flex items-center gap-1 bg-slate-800 p-0.5 rounded-lg border border-slate-700">
        <button
          type="button"
          onClick={() => setImageSize('100%', 'center')}
          className="px-2 py-0.5 hover:bg-emerald-700 rounded text-[11px] font-bold text-white transition-colors cursor-pointer"
          title="Penuh (Lebar 100%)"
        >
          100% Penuh
        </button>
        <button
          type="button"
          onClick={() => setImageSize('75%', 'center')}
          className="px-2 py-0.5 hover:bg-emerald-700 rounded text-[11px] font-bold text-white transition-colors cursor-pointer"
          title="Besar (Lebar 75%)"
        >
          75%
        </button>
        <button
          type="button"
          onClick={() => setImageSize('50%', 'center')}
          className="px-2 py-0.5 hover:bg-emerald-700 rounded text-[11px] font-bold text-white transition-colors cursor-pointer"
          title="Sedang (Lebar 50%)"
        >
          50%
        </button>
        <button
          type="button"
          onClick={() => setImageSize('25%', 'center')}
          className="px-2 py-0.5 hover:bg-emerald-700 rounded text-[11px] font-bold text-white transition-colors cursor-pointer"
          title="Kecil (Lebar 25%)"
        >
          25%
        </button>
      </div>

      <div className="h-4 w-px bg-slate-700 mx-0.5" />

      <div className="flex items-center gap-0.5 bg-slate-800 p-0.5 rounded-lg border border-slate-700">
        <button
          type="button"
          onClick={() => setImageSize(selectedImg.style.width || '100%', 'left')}
          className="p-1 hover:bg-emerald-700 rounded text-slate-300 hover:text-white transition-colors cursor-pointer"
          title="Rata Kiri"
        >
          <AlignLeft className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={() => setImageSize(selectedImg.style.width || '100%', 'center')}
          className="p-1 hover:bg-emerald-700 rounded text-slate-300 hover:text-white transition-colors cursor-pointer"
          title="Rata Tengah"
        >
          <AlignCenter className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={() => setImageSize(selectedImg.style.width || '100%', 'right')}
          className="p-1 hover:bg-emerald-700 rounded text-slate-300 hover:text-white transition-colors cursor-pointer"
          title="Rata Kanan"
        >
          <AlignRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <button
        type="button"
        onClick={onDelete}
        className="px-2 py-1 bg-red-600/80 hover:bg-red-600 text-white rounded-lg text-[10px] font-bold transition-colors ml-1 flex items-center gap-1 cursor-pointer"
        title="Hapus Gambar Ini"
      >
        <Trash2 className="w-3 h-3" />
        <span>Hapus</span>
      </button>
    </div>
  );
}
