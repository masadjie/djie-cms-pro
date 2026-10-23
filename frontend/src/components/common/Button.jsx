import React from 'react';
import { Link } from 'react-router-dom';

const variantMap = {
  primary: 'bg-emerald-700 hover:bg-emerald-800 text-white shadow-sm',
  amber: 'bg-amber-400 hover:bg-amber-300 text-slate-950 font-black shadow-md',
  darkEmerald: 'bg-[#052e16] hover:bg-[#064e3b] text-white border border-emerald-700/50 shadow-md',
  outline: 'bg-transparent hover:bg-emerald-50 text-emerald-800 border border-emerald-300',
  outlineWhite: 'bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-sm',
  ghost: 'bg-transparent hover:bg-slate-100 text-slate-700'
};

const sizeMap = {
  sm: 'px-3.5 py-1.5 text-xs',
  md: 'px-5 py-2.5 text-xs',
  lg: 'px-7 py-3 text-sm font-bold'
};

export default function Button({
  children,
  to,
  href,
  onClick,
  type = 'button',
  variant = 'primary',
  size = 'md',
  rounded = 'xl',
  icon: Icon,
  iconRight: IconRight,
  disabled = false,
  loading = false,
  className = '',
  target,
  rel
}) {
  const roundedClass = rounded === 'full' ? 'rounded-full' : rounded === '2xl' ? 'rounded-2xl' : 'rounded-xl';
  const variantClass = variantMap[variant] || variantMap.primary;
  const sizeClass = sizeMap[size] || sizeMap.md;
  const baseClasses = `inline-flex items-center justify-center gap-2 font-bold transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${roundedClass} ${variantClass} ${sizeClass} ${className}`;

  if (to) {
    return (
      <Link to={to} className={baseClasses}>
        {Icon && <Icon className="w-4 h-4 shrink-0" />}
        <span>{children}</span>
        {IconRight && <IconRight className="w-4 h-4 shrink-0" />}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} target={target} rel={rel} className={baseClasses}>
        {Icon && <Icon className="w-4 h-4 shrink-0" />}
        <span>{children}</span>
        {IconRight && <IconRight className="w-4 h-4 shrink-0" />}
      </a>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={baseClasses}
    >
      {loading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
      ) : (
        Icon && <Icon className="w-4 h-4 shrink-0" />
      )}
      <span>{children}</span>
      {IconRight && <IconRight className="w-4 h-4 shrink-0" />}
    </button>
  );
}
