import React from 'react';

/**
 * Modern Shimmer Skeleton Component for Berita Card
 * Renders an ultra-smooth shimmering placeholder during data loading.
 */
export const BeritaCardSkeleton = () => {
  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-xs flex flex-col sm:flex-row animate-pulse">
      {/* Thumbnail Skeleton */}
      <div className="sm:w-64 h-48 sm:h-auto shrink-0 bg-slate-200 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent animate-shimmer" />
      </div>

      {/* Content Skeleton */}
      <div className="p-6 flex flex-col justify-between space-y-4 flex-1">
        <div className="space-y-3">
          {/* Badge & Read Time Meta */}
          <div className="flex items-center gap-2.5">
            <div className="h-5 w-24 bg-slate-200 rounded-full" />
            <div className="h-4 w-4 rounded-full bg-slate-200" />
            <div className="h-4 w-20 bg-slate-200 rounded-md" />
          </div>

          {/* Title Lines */}
          <div className="space-y-2">
            <div className="h-5 w-11/12 bg-slate-200 rounded-lg" />
            <div className="h-5 w-3/4 bg-slate-200 rounded-lg" />
          </div>

          {/* Excerpt Paragraph */}
          <div className="space-y-1.5 pt-1">
            <div className="h-3.5 w-full bg-slate-100 rounded" />
            <div className="h-3.5 w-5/6 bg-slate-100 rounded" />
          </div>
        </div>

        {/* Footer Card Skeleton */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
          <div className="h-4 w-28 bg-slate-200 rounded-md" />
          <div className="h-4 w-32 bg-slate-200 rounded-md" />
        </div>
      </div>
    </div>
  );
};

export const TrendingNewsSkeleton = () => {
  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4 animate-pulse">
      <div className="h-5 w-36 bg-slate-200 rounded-lg mb-2" />
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-start gap-3 py-2 border-b border-slate-100 last:border-b-0">
          <div className="w-6 h-6 rounded-lg bg-slate-200 shrink-0" />
          <div className="space-y-1.5 flex-1">
            <div className="h-4 w-full bg-slate-200 rounded" />
            <div className="h-3 w-1/2 bg-slate-100 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
};

export const BeritaDetailSkeleton = () => {
  return (
    <div className="w-full min-h-screen bg-[#f8faf8] pb-24 pt-28 sm:pt-32">
      <div className="max-w-7xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-12 space-y-6 sm:space-y-8 animate-pulse">
        {/* Breadcrumb Skeleton */}
        <div className="flex items-center gap-2">
          <div className="h-4 w-16 bg-slate-200 rounded-md" />
          <div className="h-4 w-4 bg-slate-200 rounded-full" />
          <div className="h-4 w-20 bg-slate-200 rounded-md" />
          <div className="h-4 w-4 bg-slate-200 rounded-full" />
          <div className="h-4 w-32 bg-slate-200 rounded-md" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-start">
          {/* Main Article Skeleton (8 Cols) */}
          <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-xs space-y-6">
            {/* Badges */}
            <div className="flex items-center gap-3">
              <div className="h-6 w-28 bg-emerald-100 rounded-full" />
              <div className="h-5 w-24 bg-slate-200 rounded-md" />
              <div className="h-5 w-20 bg-slate-200 rounded-md" />
            </div>

            {/* Title */}
            <div className="space-y-3">
              <div className="h-8 w-full bg-slate-200 rounded-xl" />
              <div className="h-8 w-4/5 bg-slate-200 rounded-xl" />
            </div>

            {/* Author bar */}
            <div className="flex items-center gap-3 py-4 border-y border-slate-100">
              <div className="w-10 h-10 rounded-full bg-slate-200" />
              <div className="space-y-2 flex-1">
                <div className="h-4 w-48 bg-slate-200 rounded-md" />
                <div className="h-3 w-36 bg-slate-100 rounded-md" />
              </div>
            </div>

            {/* Cover Image Shimmer */}
            <div className="w-full h-64 sm:h-96 rounded-2xl bg-slate-200 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer" />
            </div>

            {/* Content Paragraphs */}
            <div className="space-y-3 pt-4">
              <div className="h-4 w-full bg-slate-200 rounded-md" />
              <div className="h-4 w-11/12 bg-slate-200 rounded-md" />
              <div className="h-4 w-full bg-slate-200 rounded-md" />
              <div className="h-4 w-3/4 bg-slate-200 rounded-md" />
            </div>
          </div>

          {/* Sidebar Skeleton (4 Cols) */}
          <div className="lg:col-span-4 space-y-6">
            <TrendingNewsSkeleton />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BeritaCardSkeleton;
