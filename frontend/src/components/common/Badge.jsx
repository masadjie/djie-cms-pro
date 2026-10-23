import React from 'react';

const variantMap = {
  emerald: 'bg-emerald-100 text-emerald-900 border-emerald-200',
  emeraldDark: 'bg-emerald-950/80 text-emerald-100 border-emerald-800',
  amber: 'bg-amber-400 text-slate-950 border-amber-300 font-black',
  gold: 'bg-amber-100 text-amber-900 border-amber-300',
  blue: 'bg-blue-100 text-blue-900 border-blue-200',
  red: 'bg-red-100 text-red-900 border-red-200',
  slate: 'bg-slate-100 text-slate-700 border-slate-200',
  outline: 'bg-transparent text-emerald-100 border-emerald-400/40'
};

const sizeMap = {
  xs: 'px-2 py-0.5 text-[10px]',
  sm: 'px-2.5 py-0.5 text-[11px]',
  md: 'px-3.5 py-1 text-xs',
  lg: 'px-4 py-1.5 text-sm'
};

export default function Badge({
  children,
  variant = 'emerald',
  size = 'sm',
  rounded = 'full',
  icon: Icon,
  className = ''
}) {
  const roundedClass = rounded === 'full' ? 'rounded-full' : 'rounded-lg';
  const variantClass = variantMap[variant] || variantMap.emerald;
  const sizeClass = sizeMap[size] || sizeMap.sm;

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-bold border transition-all ${roundedClass} ${variantClass} ${sizeClass} ${className}`}
    >
      {Icon && <Icon className="w-3 h-3 shrink-0" />}
      <span>{children}</span>
    </span>
  );
}
