import React from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, Sparkles } from 'lucide-react';

export default function TrendingNewsWidget({ trendingNews, title = 'Berita Terpopuler' }) {
  return (
    <div className="bg-white rounded-3xl p-6 border border-emerald-100 shadow-sm space-y-4">
      <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
        <TrendingUp className="w-4 h-4 text-amber-500" />
        <h3 className="font-black text-slate-900 text-sm uppercase tracking-wider">
          {title}
        </h3>
      </div>

      <div className="space-y-3.5">
        {trendingNews?.map((item, idx) => (
          <Link
            key={item.id}
            to={`/berita/${item.slug}`}
            className="flex items-start gap-3 group"
          >
            <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-900 font-black text-xs flex items-center justify-center shrink-0 group-hover:bg-amber-400 group-hover:text-slate-950 transition-colors">
              {idx + 1}
            </span>
            <div className="space-y-0.5 flex-1">
              <h4 className="font-bold text-xs text-slate-800 group-hover:text-emerald-700 transition-colors leading-snug line-clamp-2">
                {item.title}
              </h4>
              <div className="flex items-center gap-2 text-[10px] text-slate-400">
                <span>{new Date(item.published_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}</span>
                <span>•</span>
                <span>{item.views_count} views</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
