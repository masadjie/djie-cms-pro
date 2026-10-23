import React, { useState, useRef, useEffect } from 'react';
import { Palette, Check, Sparkles, X } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export default function ThemeSwitcher() {
  const { currentTheme, changeTheme, themes } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} className="fixed bottom-6 left-6 z-40">
      
      {/* Floating Toggle Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-12 h-12 rounded-full bg-slate-900 text-amber-400 hover:text-white shadow-2xl border border-slate-700/80 hover:scale-110 active:scale-95 transition-all flex items-center justify-center cursor-pointer group"
        title="Ganti Tema Warna Portal & SiKEPO"
      >
        <Palette className="w-5 h-5 group-hover:rotate-45 transition-transform" />
      </button>

      {/* Theme Selection Modal / Popup */}
      {isOpen && (
        <div className="absolute bottom-16 left-0 w-72 bg-white rounded-3xl p-5 shadow-2xl border border-slate-200/90 space-y-4 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <h4 className="text-xs font-black text-slate-900">Pilih Tema Portal</h4>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 text-slate-400 hover:text-slate-700 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2">
            {themes.map((t) => {
              const isSelected = currentTheme === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => {
                    changeTheme(t.id);
                  }}
                  className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-slate-900 text-white border-slate-900 shadow-md scale-[1.02]'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200/80'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex items-center -space-x-1.5 shrink-0">
                      <span
                        className="w-5 h-5 rounded-full border border-white shadow-xs"
                        style={{ backgroundColor: t.primaryColor }}
                      />
                      <span
                        className="w-5 h-5 rounded-full border border-white shadow-xs"
                        style={{ backgroundColor: t.accentColor }}
                      />
                    </div>
                    <span className="text-xs font-extrabold truncate">
                      {t.name}
                    </span>
                  </div>

                  {isSelected && (
                    <Check className="w-4 h-4 text-amber-400 shrink-0 ml-2" />
                  )}
                </button>
              );
            })}
          </div>

          <p className="text-[10px] text-slate-400 text-center pt-1 font-medium">
            Tema tersimpan otomatis di perangkat Anda.
          </p>
        </div>
      )}

    </div>
  );
}
