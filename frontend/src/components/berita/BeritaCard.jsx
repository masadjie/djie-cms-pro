import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import Badge from '../common/Badge';

export default function BeritaCard({ berita }) {
  const formattedDate = new Date(berita.published_at || berita.created_at).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  return (
    <article className="bg-white rounded-3xl border border-emerald-100 overflow-hidden shadow-xs hover:shadow-md transition-all group flex flex-col sm:flex-row">
      <div className="sm:w-64 h-48 sm:h-auto shrink-0 relative overflow-hidden bg-slate-900">
        <img
          src={berita.cover_image || '/hero-tamiang.jpg'}
          alt={berita.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        {berita.is_pinned && (
          <span className="absolute top-3 left-3">
            <Badge variant="amber" size="xs">
              Semat
            </Badge>
          </span>
        )}
      </div>

      <div className="p-6 flex flex-col justify-between space-y-3 flex-1">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs">
            <Badge variant="emerald" size="xs">
              {berita.kategori?.nama_kategori || 'Kepegawaian'}
            </Badge>
            <span className="text-slate-400">•</span>
            <span className="text-slate-400 text-[11px] flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {berita.read_time_minutes || 3} mnt baca
            </span>
          </div>

          <h2 className="text-base sm:text-lg font-black text-slate-900 group-hover:text-emerald-700 transition-colors leading-snug">
            <Link to={`/berita/${berita.slug}`}>
              {berita.title}
            </Link>
          </h2>

          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
            {berita.excerpt}
          </p>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-emerald-700" />
            <span>{formattedDate}</span>
          </div>

          <Link
            to={`/berita/${berita.slug}`}
            className="inline-flex items-center gap-1 text-emerald-800 hover:text-amber-500 font-bold text-xs group-hover:translate-x-0.5 transition-all"
          >
            <span>Baca Selengkapnya</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </article>
  );
}
