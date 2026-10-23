import React from 'react';
import { Search } from 'lucide-react';

export default function SearchInput({
  value,
  onChange,
  onSubmit,
  placeholder = 'Cari...',
  buttonText = 'Cari',
  variant = 'dark', // 'dark' | 'light'
  className = ''
}) {
  const isDark = variant === 'dark';

  return (
    <form onSubmit={onSubmit} className={`w-full ${className}`}>
      <div
        className={`relative flex items-center rounded-full p-1.5 sm:p-2 shadow-xl transition-all ${
          isDark
            ? 'bg-[#031d0e]/90 backdrop-blur-xl border border-amber-400/40 focus-within:border-amber-400 focus-within:ring-4 focus-within:ring-amber-400/20'
            : 'bg-slate-50 border border-slate-200 focus-within:border-emerald-600 focus-within:ring-2 focus-within:ring-emerald-600/20'
        }`}
      >
        <Search
          className={`w-4 h-4 sm:w-5 sm:h-5 ml-2.5 sm:ml-3 shrink-0 ${
            isDark ? 'text-emerald-400' : 'text-slate-400'
          }`}
        />
        <input
          type="text"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full px-2 sm:px-3 py-1.5 sm:py-2 text-[11px] xs:text-xs sm:text-sm bg-transparent focus:outline-none font-medium min-w-0 ${
            isDark ? 'text-white placeholder-emerald-300/60' : 'text-slate-800 placeholder-slate-400'
          }`}
        />
        {buttonText && (
          <button
            type="submit"
            className={`px-3.5 sm:px-6 py-1.5 sm:py-2.5 rounded-full text-[11px] sm:text-xs font-black transition-all shrink-0 shadow-md cursor-pointer ${
              isDark
                ? 'bg-amber-400 hover:bg-amber-300 text-slate-950'
                : 'bg-emerald-700 hover:bg-emerald-800 text-white'
            }`}
          >
            {buttonText}
          </button>
        )}
      </div>
    </form>
  );
}
