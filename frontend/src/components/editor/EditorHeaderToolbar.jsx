import React from 'react';
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Highlighter,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Minus,
  Quote,
  Table as TableIcon,
  Sparkles,
  AlertTriangle,
  HelpCircle,
  Link2,
  Image as ImageIcon,
  RefreshCw,
  Paperclip,
  Youtube,
  FileText,
  Undo,
  Redo,
  Edit3,
  FileCode,
  Eye,
  Maximize2,
  Minimize2
} from 'lucide-react';

export default function EditorHeaderToolbar({
  mode,
  setMode,
  execCmd,
  insertCustomBlock,
  handleInsertLink,
  editorImageInputRef,
  handleUploadImageFile,
  editorImageUploading,
  setEditorMediaModalOpen,
  handleInsertImage,
  handleInsertYouTube,
  handleInsertPdf,
  wordCount,
  charCount,
  readingTime,
  isFullscreen,
  setIsFullscreen
}) {
  return (
    <div className="bg-slate-50/95 backdrop-blur-xs border-b border-slate-200 px-2 sm:px-3 py-2 sticky top-0 z-30 flex flex-col gap-2">
      
      {/* ── BARIS 1: Mode View, Heading, Font Styles & Media/Stats ── */}
      <div className="flex flex-wrap items-center justify-between gap-1.5 sm:gap-2">
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          {/* Mode Switcher Tabs */}
          <div className="flex items-center bg-white p-0.5 rounded-xl border border-slate-200 shadow-2xs">
            <button
              type="button"
              onClick={() => setMode('visual')}
              className={`px-2.5 sm:px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                mode === 'visual'
                  ? 'bg-emerald-800 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Visual</span>
            </button>

            <button
              type="button"
              onClick={() => setMode('code')}
              className={`px-2.5 sm:px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                mode === 'code'
                  ? 'bg-emerald-800 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <FileCode className="w-3.5 h-3.5" />
              <span>HTML</span>
            </button>

            <button
              type="button"
              onClick={() => setMode('preview')}
              className={`px-2.5 sm:px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                mode === 'preview'
                  ? 'bg-emerald-800 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Pratinjau</span>
            </button>
          </div>

          <div className="h-4 w-px bg-slate-300 hidden sm:block" />

          {/* Heading Formatting */}
          <div className="flex items-center gap-0.5 bg-slate-100 p-0.5 rounded-lg border border-slate-200">
            <button
              type="button"
              onClick={() => execCmd('formatBlock', '<p>')}
              className="px-2 py-0.5 hover:bg-white rounded-md text-[11px] font-bold text-slate-700 transition-all cursor-pointer"
              title="Paragraf Normal"
            >
              Normal
            </button>
            <button
              type="button"
              onClick={() => execCmd('formatBlock', '<h1>')}
              className="px-1.5 py-0.5 hover:bg-white rounded-md text-[11px] font-black text-slate-900 transition-all cursor-pointer"
              title="H1"
            >
              H1
            </button>
            <button
              type="button"
              onClick={() => execCmd('formatBlock', '<h2>')}
              className="px-1.5 py-0.5 hover:bg-white rounded-md text-[11px] font-bold text-emerald-800 transition-all cursor-pointer"
              title="H2"
            >
              H2
            </button>
            <button
              type="button"
              onClick={() => execCmd('formatBlock', '<h3>')}
              className="px-1.5 py-0.5 hover:bg-white rounded-md text-[11px] font-semibold text-emerald-700 transition-all cursor-pointer"
              title="H3"
            >
              H3
            </button>
            <button
              type="button"
              onClick={() => execCmd('formatBlock', '<h4>')}
              className="px-1.5 py-0.5 hover:bg-white rounded-md text-[11px] font-medium text-slate-600 transition-all cursor-pointer"
              title="H4"
            >
              H4
            </button>
          </div>

          <div className="h-4 w-px bg-slate-300 hidden sm:block" />

          {/* Text Basic Styles */}
          <div className="flex items-center gap-0.5 bg-white p-0.5 rounded-lg border border-slate-200 shadow-2xs">
            <button
              type="button"
              onClick={() => execCmd('bold')}
              className="p-1 hover:bg-slate-100 rounded text-slate-700 transition-all cursor-pointer"
              title="Tebal (Ctrl+B)"
            >
              <Bold className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => execCmd('italic')}
              className="p-1 hover:bg-slate-100 rounded text-slate-700 transition-all cursor-pointer"
              title="Miring (Ctrl+I)"
            >
              <Italic className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => execCmd('underline')}
              className="p-1 hover:bg-slate-100 rounded text-slate-700 transition-all cursor-pointer"
              title="Garis Bawah (Ctrl+U)"
            >
              <Underline className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => execCmd('strikeThrough')}
              className="p-1 hover:bg-slate-100 rounded text-slate-700 transition-all cursor-pointer"
              title="Coret"
            >
              <Strikethrough className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Color Palettes & Custom Color Picker */}
          <div className="flex items-center gap-1.5 bg-white p-1 rounded-lg border border-slate-200 shadow-2xs">
            <button
              type="button"
              onClick={() => execCmd('foreColor', '#064e3b')}
              className="w-4 h-4 rounded-full bg-emerald-900 border border-slate-300 shadow-2xs hover:scale-110 transition-transform cursor-pointer"
              title="Warna Hijau Gelap"
            />
            <button
              type="button"
              onClick={() => execCmd('foreColor', '#b45309')}
              className="w-4 h-4 rounded-full bg-amber-700 border border-slate-300 shadow-2xs hover:scale-110 transition-transform cursor-pointer"
              title="Warna Kuning Emas"
            />
            <button
              type="button"
              onClick={() => execCmd('foreColor', '#1e293b')}
              className="w-4 h-4 rounded-full bg-slate-800 border border-slate-300 shadow-2xs hover:scale-110 transition-transform cursor-pointer"
              title="Warna Teks Gelap"
            />

            {/* Custom Color Picker Input */}
            <label 
              className="relative flex items-center justify-center w-5 h-5 rounded-md hover:bg-slate-100 transition-colors cursor-pointer" 
              title="Pilih Warna Kustom Bebas (Color Picker)"
            >
              <span className="w-3.5 h-3.5 rounded-full border border-slate-300 shadow-xs" style={{ background: 'conic-gradient(red, yellow, lime, aqua, blue, magenta, red)' }} />
              <input 
                type="color" 
                defaultValue="#064e3b"
                onChange={(e) => execCmd('foreColor', e.target.value)}
                className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
              />
            </label>

            <div className="h-3 w-px bg-slate-200 mx-0.5" />

            <button
              type="button"
              onClick={() => execCmd('hiliteColor', '#fef08a')}
              className="p-0.5 hover:bg-slate-100 rounded text-amber-600 transition-all cursor-pointer"
              title="Stabilo Kuning"
            >
              <Highlighter className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right Stats & Fullscreen */}
        <div className="flex items-center gap-2 text-slate-400 shrink-0 ml-auto">
          <div className="hidden lg:flex items-center gap-1.5 text-[11px] font-mono font-bold">
            <span className="text-slate-600">{wordCount} Kata</span>
            <span>&bull;</span>
            <span className="text-slate-600">{charCount} Karakter</span>
            <span>&bull;</span>
            <span className="text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">~{readingTime}m</span>
          </div>

          <button
            type="button"
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1 hover:bg-white rounded-lg text-slate-600 hover:text-slate-900 transition-colors cursor-pointer border border-slate-200"
            title={isFullscreen ? 'Keluar Layar Penuh' : 'Layar Penuh'}
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* ── BARIS 2: Alignment, Lists, Custom Callout Blocks, Media Insert & Undo/Redo ── */}
      <div className="flex flex-wrap items-center justify-between gap-1.5 sm:gap-2 pt-1 border-t border-slate-200/80">
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          
          {/* Alignment */}
          <div className="flex items-center gap-0.5 bg-white p-0.5 rounded-lg border border-slate-200 shadow-2xs">
            <button
              type="button"
              onClick={() => execCmd('justifyLeft')}
              className="p-1 hover:bg-slate-100 rounded text-slate-700 transition-all cursor-pointer"
              title="Rata Kiri"
            >
              <AlignLeft className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => execCmd('justifyCenter')}
              className="p-1 hover:bg-slate-100 rounded text-slate-700 transition-all cursor-pointer"
              title="Rata Tengah"
            >
              <AlignCenter className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => execCmd('justifyRight')}
              className="p-1 hover:bg-slate-100 rounded text-slate-700 transition-all cursor-pointer"
              title="Rata Kanan"
            >
              <AlignRight className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => execCmd('justifyFull')}
              className="p-1 hover:bg-slate-100 rounded text-slate-700 transition-all cursor-pointer"
              title="Rata Kiri Kanan"
            >
              <AlignJustify className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Lists */}
          <div className="flex items-center gap-0.5 bg-white p-0.5 rounded-lg border border-slate-200 shadow-2xs">
            <button
              type="button"
              onClick={() => execCmd('insertUnorderedList')}
              className="p-1 hover:bg-slate-100 rounded text-slate-700 transition-all cursor-pointer"
              title="Bullet List"
            >
              <List className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => execCmd('insertOrderedList')}
              className="p-1 hover:bg-slate-100 rounded text-slate-700 transition-all cursor-pointer"
              title="Numbered List"
            >
              <ListOrdered className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="h-4 w-px bg-slate-300 hidden sm:block" />

          {/* Custom Blocks (Callout, Quote, Tables) */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => insertCustomBlock('lead_paragraph')}
              className="px-2 py-1 bg-slate-100 hover:bg-slate-200 rounded-lg text-[11px] font-bold text-slate-800 transition-all cursor-pointer"
              title="Lead Intro"
            >
              Lead
            </button>
            <button
              type="button"
              onClick={() => insertCustomBlock('quote')}
              className="p-1 bg-amber-50 hover:bg-amber-100 border border-amber-200/60 rounded-lg text-amber-800 transition-all cursor-pointer flex items-center gap-1"
              title="Kutipan Resmi"
            >
              <Quote className="w-3.5 h-3.5 text-amber-700" />
              <span className="text-[11px] font-bold hidden md:inline">Kutipan</span>
            </button>
            <button
              type="button"
              onClick={() => insertCustomBlock('callout_info')}
              className="p-1 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/60 rounded-lg text-emerald-800 transition-all cursor-pointer flex items-center gap-1"
              title="Info Box"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
              <span className="text-[11px] font-bold hidden md:inline">Info</span>
            </button>
            <button
              type="button"
              onClick={() => insertCustomBlock('callout_warning')}
              className="p-1 bg-amber-50 hover:bg-amber-100 border border-amber-200/60 rounded-lg text-amber-800 transition-all cursor-pointer flex items-center gap-1"
              title="Perhatian"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />
              <span className="text-[11px] font-bold hidden md:inline">Perhatian</span>
            </button>
            <button
              type="button"
              onClick={() => insertCustomBlock('callout_danger')}
              className="p-1 bg-red-50 hover:bg-red-100 border border-red-200/60 rounded-lg text-red-800 transition-all cursor-pointer flex items-center gap-1"
              title="Larangan"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
              <span className="text-[11px] font-bold hidden md:inline">Larangan</span>
            </button>
            <button
              type="button"
              onClick={() => insertCustomBlock('callout_tip')}
              className="p-1 bg-blue-50 hover:bg-blue-100 border border-blue-200/60 rounded-lg text-blue-800 transition-all cursor-pointer flex items-center gap-1"
              title="Tips"
            >
              <HelpCircle className="w-3.5 h-3.5 text-blue-600" />
              <span className="text-[11px] font-bold hidden md:inline">Tips</span>
            </button>
            <button
              type="button"
              onClick={() => insertCustomBlock('table')}
              className="p-1 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-lg text-slate-800 transition-all cursor-pointer flex items-center gap-1"
              title="Tabel"
            >
              <TableIcon className="w-3.5 h-3.5 text-slate-700" />
              <span className="text-[11px] font-bold hidden md:inline">Tabel</span>
            </button>
            <button
              type="button"
              onClick={() => execCmd('insertHorizontalRule')}
              className="p-1 hover:bg-white rounded text-slate-600 cursor-pointer"
              title="Garis Pemisah"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={handleInsertLink}
              className="p-1 hover:bg-white rounded text-slate-600 cursor-pointer"
              title="Sisipkan Tautan"
            >
              <Link2 className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="h-4 w-px bg-slate-300 hidden sm:block" />

          {/* Media Attachments */}
          <div className="flex items-center gap-1">
            <input
              type="file"
              ref={editorImageInputRef}
              onChange={handleUploadImageFile}
              className="hidden"
              accept=".jpg,.jpeg,.png,.webp,.gif"
            />
            <button
              type="button"
              onClick={() => editorImageInputRef.current?.click()}
              disabled={editorImageUploading}
              className="px-2 py-1 bg-emerald-800 hover:bg-emerald-700 text-white rounded-lg text-[11px] font-bold transition-all flex items-center gap-1 shadow-2xs cursor-pointer"
              title="Unggah Foto"
            >
              {editorImageUploading ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-300" />
              ) : (
                <ImageIcon className="w-3.5 h-3.5 text-amber-300" />
              )}
              <span>Upload</span>
            </button>

            <button
              type="button"
              onClick={() => setEditorMediaModalOpen(true)}
              className="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-900 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer"
              title="Pustaka Media MinIO"
            >
              <Paperclip className="w-3.5 h-3.5 text-emerald-700" />
              <span>Media</span>
            </button>

            <button
              type="button"
              onClick={handleInsertImage}
              className="p-1 hover:bg-white rounded text-slate-600 cursor-pointer"
              title="Sisipkan URL Foto"
            >
              <Link2 className="w-3.5 h-3.5 text-slate-400" />
            </button>

            <button
              type="button"
              onClick={handleInsertYouTube}
              className="px-2 py-1 bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer"
              title="YouTube"
            >
              <Youtube className="w-3.5 h-3.5 text-red-600" />
              <span className="hidden sm:inline">YouTube</span>
            </button>

            <button
              type="button"
              onClick={handleInsertPdf}
              className="px-2 py-1 bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer"
              title="PDF"
            >
              <FileText className="w-3.5 h-3.5 text-blue-600" />
              <span className="hidden sm:inline">PDF</span>
            </button>
          </div>
        </div>

        {/* Undo / Redo */}
        <div className="flex items-center gap-0.5 ml-auto">
          <button
            type="button"
            onClick={() => execCmd('undo')}
            className="p-1 hover:bg-white rounded-lg text-slate-500 cursor-pointer"
            title="Undo"
          >
            <Undo className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => execCmd('redo')}
            className="p-1 hover:bg-white rounded-lg text-slate-500 cursor-pointer"
            title="Redo"
          >
            <Redo className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

    </div>
  );
}
