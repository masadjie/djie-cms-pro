import React, { useState, useEffect } from 'react';
import { 
  Accessibility, 
  Volume2, 
  VolumeX, 
  Play, 
  Pause, 
  Square, 
  Eye, 
  Sun, 
  Moon, 
  Type, 
  Sparkles, 
  RotateCcw, 
  Check, 
  X, 
  Link as LinkIcon, 
  Clock, 
  HelpCircle,
  Move
} from 'lucide-react';

export default function AccessibilityModal({ isOpen, onClose }) {
  // Speech synthesis state (Tuna Netra / Pembaca Layar)
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [speechRate, setSpeechRate] = useState(1.0);
  const [speechText, setSpeechText] = useState('');

  // Visual disability states
  const [fontSizeScale, setFontSizeScale] = useState('100'); // '100' | '115' | '130' | '150'
  const [isHighContrast, setIsHighContrast] = useState(false);
  const [isGrayscale, setIsGrayscale] = useState(false);
  const [isInvert, setIsInvert] = useState(false);
  const [isReadableFont, setIsReadableFont] = useState(false);
  const [isHighlightLinks, setIsHighlightLinks] = useState(false);
  const [isReduceMotion, setIsReduceMotion] = useState(false);

  // Apply visual modes to DOM
  useEffect(() => {
    const root = document.documentElement;

    // Font size scaling
    if (fontSizeScale === '100') root.style.fontSize = '100%';
    else if (fontSizeScale === '115') root.style.fontSize = '115%';
    else if (fontSizeScale === '130') root.style.fontSize = '130%';
    else if (fontSizeScale === '150') root.style.fontSize = '150%';

    // Toggle classes
    root.classList.toggle('high-contrast-mode', isHighContrast);
    root.classList.toggle('grayscale-mode', isGrayscale);
    root.classList.toggle('invert-mode', isInvert);
    root.classList.toggle('readable-font-mode', isReadableFont);
    root.classList.toggle('highlight-links-mode', isHighlightLinks);
    root.classList.toggle('reduce-motion-mode', isReduceMotion);
  }, [fontSizeScale, isHighContrast, isGrayscale, isInvert, isReadableFont, isHighlightLinks, isReduceMotion]);

  // Speech synthesis functions
  const handleSpeakPage = () => {
    if (!('speechSynthesis' in window)) {
      alert('Browser Anda belum mendukung fitur Text-to-Speech.');
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setIsPaused(false);
      return;
    }

    // Get selected text or main page text
    const selectedText = window.getSelection()?.toString()?.trim();
    let textToRead = selectedText;

    if (!textToRead) {
      const mainEl = document.querySelector('main') || document.body;
      textToRead = mainEl.innerText.slice(0, 3000); // Read first 3000 chars
    }

    if (!textToRead) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.lang = 'id-ID';
    utterance.rate = speechRate;

    // Try finding Indonesian voice
    const voices = window.speechSynthesis.getVoices();
    const idVoice = voices.find(v => v.lang.includes('id') || v.lang.includes('ID') || v.name.includes('Indonesian'));
    if (idVoice) utterance.voice = idVoice;

    utterance.onstart = () => {
      setIsSpeaking(true);
      setIsPaused(false);
      setSpeechText(textToRead.slice(0, 120) + '...');
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      setIsPaused(false);
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
      setIsPaused(false);
    };

    window.speechSynthesis.speak(utterance);
  };

  const handlePauseResume = () => {
    if (!isSpeaking) return;
    if (isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
    } else {
      window.speechSynthesis.pause();
      setIsPaused(true);
    }
  };

  const handleStopSpeech = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
    setIsPaused(false);
  };

  const handleResetAll = () => {
    handleStopSpeech();
    setFontSizeScale('100');
    setIsHighContrast(false);
    setIsGrayscale(false);
    setIsInvert(false);
    setIsReadableFont(false);
    setIsHighlightLinks(false);
    setIsReduceMotion(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-700 text-amber-300 flex items-center justify-center shadow-md">
              <Accessibility className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900 leading-tight">
                Pusat Aksesibilitas & Ramah Disabilitas
              </h3>
              <p className="text-xs text-slate-500">
                Fitur bantuan khusus tuna netra, low vision, disleksia & aksesibilitas WCAG 2.1
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 1. Fitur Utama: Pembaca Suara / Screen Reader (Tuna Netra) */}
        <div className="p-4 bg-gradient-to-br from-emerald-950 to-emerald-900 text-white rounded-2xl space-y-3 shadow-md border border-emerald-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-amber-400 animate-pulse" />
              <span className="text-xs font-black uppercase tracking-wider text-amber-300">
                Pembaca Suara / Screen Reader (Tuna Netra)
              </span>
            </div>
            <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded font-mono">Bahasa Indonesia</span>
          </div>
          
          <p className="text-xs text-emerald-100 leading-relaxed">
            Klik tombol di bawah untuk mendengarkan seluruh konten teks halaman portal, atau sorot (blok) teks tertentu yang ingin Anda dengarkan.
          </p>

          <div className="flex flex-wrap items-center gap-2 pt-1">
            <button
              onClick={handleSpeakPage}
              className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all shadow-md cursor-pointer ${
                isSpeaking 
                  ? 'bg-red-600 hover:bg-red-700 text-white' 
                  : 'bg-amber-400 hover:bg-amber-300 text-slate-950'
              }`}
            >
              {isSpeaking ? <Square className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isSpeaking ? 'Hentikan Suara' : 'Mulai Bacakan Halaman'}</span>
            </button>

            {isSpeaking && (
              <button
                onClick={handlePauseResume}
                className="px-3 py-2 bg-white/15 hover:bg-white/25 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
                <span>{isPaused ? 'Lanjutkan' : 'Jeda'}</span>
              </button>
            )}

            <div className="flex items-center gap-1 bg-black/30 rounded-xl px-2.5 py-1.5 ml-auto text-xs">
              <span className="text-[10px] text-emerald-200">Kecepatan:</span>
              <button
                onClick={() => setSpeechRate(0.8)}
                className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${speechRate === 0.8 ? 'bg-amber-400 text-slate-950' : 'text-white'}`}
              >
                0.8x
              </button>
              <button
                onClick={() => setSpeechRate(1.0)}
                className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${speechRate === 1.0 ? 'bg-amber-400 text-slate-950' : 'text-white'}`}
              >
                1.0x
              </button>
              <button
                onClick={() => setSpeechRate(1.2)}
                className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${speechRate === 1.2 ? 'bg-amber-400 text-slate-950' : 'text-white'}`}
              >
                1.2x
              </button>
            </div>
          </div>

          {isSpeaking && speechText && (
            <div className="p-2.5 bg-black/40 rounded-xl text-[11px] font-mono text-amber-200 truncate border border-white/10">
              Sedang membaca: &ldquo;{speechText}&rdquo;
            </div>
          )}
        </div>

        {/* 2. Ukuran Teks (Font Size Scaler) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Type className="w-4 h-4 text-emerald-700" />
              <span>Ukuran Teks / Pembesar Huruf</span>
            </span>
            <span className="text-xs font-mono font-bold text-emerald-700">{fontSizeScale}%</span>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {[
              { label: 'Normal (100%)', val: '100' },
              { label: 'Besar (115%)', val: '115' },
              { label: 'X-Besar (130%)', val: '130' },
              { label: 'Maksimal (150%)', val: '150' }
            ].map((f) => (
              <button
                key={f.val}
                onClick={() => setFontSizeScale(f.val)}
                className={`py-2 px-1 text-center rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                  fontSizeScale === f.val
                    ? 'border-emerald-700 bg-emerald-50 text-emerald-900 shadow-xs'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* 3. Pengaturan Visual & Kontras (Low Vision) */}
        <div className="space-y-2">
          <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
            <Eye className="w-4 h-4 text-emerald-700" />
            <span>Mode Penglihatan & Kontras Warna</span>
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            
            {/* High Contrast */}
            <button
              onClick={() => setIsHighContrast(!isHighContrast)}
              className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                isHighContrast
                  ? 'border-yellow-500 bg-black text-yellow-300 shadow-md font-bold'
                  : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <Sun className="w-4 h-4" />
                {isHighContrast && <Check className="w-3.5 h-3.5" />}
              </div>
              <span className="text-xs mt-2 font-bold">Kontras Tinggi (Kuning-Hitam)</span>
            </button>

            {/* Grayscale */}
            <button
              onClick={() => setIsGrayscale(!isGrayscale)}
              className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                isGrayscale
                  ? 'border-slate-700 bg-slate-800 text-white shadow-md font-bold'
                  : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <Moon className="w-4 h-4" />
                {isGrayscale && <Check className="w-3.5 h-3.5" />}
              </div>
              <span className="text-xs mt-2 font-bold">Monokrom (Hitam Putih)</span>
            </button>

            {/* Invert */}
            <button
              onClick={() => setIsInvert(!isInvert)}
              className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                isInvert
                  ? 'border-purple-600 bg-purple-50 text-purple-900 shadow-md font-bold'
                  : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <Sparkles className="w-4 h-4" />
                {isInvert && <Check className="w-3.5 h-3.5" />}
              </div>
              <span className="text-xs mt-2 font-bold">Pembalik Warna (Invert)</span>
            </button>

            {/* Readable Font */}
            <button
              onClick={() => setIsReadableFont(!isReadableFont)}
              className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                isReadableFont
                  ? 'border-emerald-700 bg-emerald-50 text-emerald-900 shadow-md font-bold'
                  : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <Type className="w-4 h-4" />
                {isReadableFont && <Check className="w-3.5 h-3.5" />}
              </div>
              <span className="text-xs mt-2 font-bold">Font Ramah Disleksia</span>
            </button>

            {/* Highlight Links */}
            <button
              onClick={() => setIsHighlightLinks(!isHighlightLinks)}
              className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                isHighlightLinks
                  ? 'border-amber-500 bg-amber-50 text-amber-900 shadow-md font-bold'
                  : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <LinkIcon className="w-4 h-4" />
                {isHighlightLinks && <Check className="w-3.5 h-3.5" />}
              </div>
              <span className="text-xs mt-2 font-bold">Sorot Semua Tautan</span>
            </button>

            {/* Reduce Motion */}
            <button
              onClick={() => setIsReduceMotion(!isReduceMotion)}
              className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                isReduceMotion
                  ? 'border-blue-600 bg-blue-50 text-blue-900 shadow-md font-bold'
                  : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <Move className="w-4 h-4" />
                {isReduceMotion && <Check className="w-3.5 h-3.5" />}
              </div>
              <span className="text-xs mt-2 font-bold">Hentikan Animasi</span>
            </button>

          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <button
            onClick={handleResetAll}
            className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:text-red-700 hover:bg-red-50 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Standar</span>
          </button>

          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-emerald-800 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md transition-all cursor-pointer"
          >
            Selesai
          </button>
        </div>

      </div>
    </div>
  );
}
