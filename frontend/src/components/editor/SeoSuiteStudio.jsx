import React, { useState, useMemo } from 'react';
import {
  Globe,
  Search,
  Monitor,
  Smartphone,
  Share2,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Sparkles,
  ExternalLink,
  Zap,
  Check,
  RotateCcw
} from 'lucide-react';

import { boostSeoFields } from '../../utils/seoBoostHelper';

export { boostSeoFields };

export default function SeoSuiteStudio({
  formData,
  setFormData,
  contentStats,
  onBoostNotification
}) {
  const [seoTab, setSeoTab] = useState('general'); // 'general' | 'social' | 'audit'
  const [serpView, setSerpView] = useState('desktop'); // 'desktop' | 'mobile'
  const [isBoosting, setIsBoosting] = useState(false);
  const [boostSuccess, setBoostSuccess] = useState(false);

  // SEO Score Calculation (Yoast / RankMath Style: 0 - 100)
  const seoAnalysis = useMemo(() => {
    const kw = (formData.focus_keyword || '').toLowerCase().trim();
    const title = (formData.meta_title || formData.title || '').toLowerCase();
    const desc = (formData.meta_description || formData.excerpt || '').toLowerCase();
    const slug = (formData.slug || '').toLowerCase();
    const content = (formData.content || '').toLowerCase();
    const textOnly = content.replace(/<[^>]*>?/gm, ' ');

    const checks = [];

    // 1. Focus Keyword in Title
    const kwInTitle = kw && title.includes(kw);
    checks.push({
      id: 'kw_title',
      label: 'Kata kunci fokus muncul dalam Judul SEO',
      passed: kwInTitle,
      score: 15,
      hint: kw ? 'Tambahkan kata kunci fokus ke dalam judul artikel.' : 'Tentukan kata kunci fokus terlebih dahulu.'
    });

    // 2. Focus Keyword in Meta Description
    const kwInDesc = kw && desc.includes(kw);
    checks.push({
      id: 'kw_desc',
      label: 'Kata kunci fokus muncul dalam Meta Deskripsi',
      passed: kwInDesc,
      score: 15,
      hint: 'Sertakan kata kunci fokus di dalam deskripsi cuplikan Google.'
    });

    // 3. Focus Keyword in URL Slug
    // Normalize both slug and focus keyword (remove punctuation & check whole or word-by-word)
    const normalizedSlug = slug.replace(/[^\w-]/g, '').toLowerCase();
    const kwWords = kw.replace(/[^\w\s]/g, '').toLowerCase().split(/\s+/).filter(Boolean);
    const kwInSlug = kw && (
      normalizedSlug.includes(kw.replace(/[^\w]/g, '-').replace(/-+/g, '-')) ||
      (kwWords.length > 0 && kwWords.every(w => normalizedSlug.includes(w)))
    );
    checks.push({
      id: 'kw_slug',
      label: 'Kata kunci fokus terdapat pada URL Slug permalink',
      passed: !!kwInSlug,
      score: 10,
      hint: 'Buat slug yang mengandung kata kunci utama.'
    });

    // 4. Focus Keyword in Content First 100 words
    const first100Words = textOnly.split(/\s+/).slice(0, 100).join(' ');
    const kwInFirstPara = kw && first100Words.includes(kw);
    checks.push({
      id: 'kw_first_para',
      label: 'Kata kunci fokus muncul di paragraf awal artikel',
      passed: kwInFirstPara,
      score: 10,
      hint: 'Sebutkan kata kunci fokus pada 100 kata pertama artikel.'
    });

    // 5. Title Length (40 - 65 chars ideal)
    const titleLen = (formData.meta_title || formData.title || '').length;
    const isTitleGood = titleLen >= 40 && titleLen <= 65;
    checks.push({
      id: 'title_len',
      label: `Panjang Judul SEO optimal (${titleLen}/60 karakter)`,
      passed: isTitleGood,
      score: 15,
      hint: titleLen < 40 ? 'Judul terlalu pendek, minimal 40 karakter.' : (titleLen > 65 ? 'Judul terlalu panjang (>65 karakter).' : '')
    });

    // 6. Meta Description Length (120 - 160 chars ideal)
    const descLen = (formData.meta_description || formData.excerpt || '').length;
    const isDescGood = descLen >= 120 && descLen <= 165;
    checks.push({
      id: 'desc_len',
      label: `Panjang Meta Deskripsi memadai (${descLen}/160 karakter)`,
      passed: isDescGood,
      score: 15,
      hint: descLen < 120 ? 'Meta deskripsi terlalu ringkas, minimal 120 karakter.' : (descLen > 165 ? 'Deskripsi terlalu panjang (>165 karakter).' : '')
    });

    // 7. Content Length (>250 words recommended for public news)
    const words = contentStats?.words || 0;
    const isWordGood = words >= 200;
    checks.push({
      id: 'word_count',
      label: `Panjang isi artikel memadai (${words} kata)`,
      passed: isWordGood,
      score: 10,
      hint: words < 200 ? 'Disarankan minimal 200 kata untuk artikel pengumuman resmi.' : ''
    });

    // 8. Featured Image Included
    const hasImage = !!formData.cover_image;
    checks.push({
      id: 'has_image',
      label: 'Gambar sampul utama (Featured Image) tersedia',
      passed: hasImage,
      score: 10,
      hint: 'Tambahkan gambar sampul untuk meningkatkan CTR dan OpenGraph share.'
    });

    const totalScore = checks.reduce((sum, item) => sum + (item.passed ? item.score : 0), 0);
    let grade = 'Perlu Dioptimalkan';
    let color = '#ef4444'; // red

    if (totalScore >= 80) {
      grade = 'Sangat Baik (SEO Hijau)';
      color = '#059669'; // emerald
    } else if (totalScore >= 50) {
      grade = 'Cukup Baik (Perlu Peningkatan)';
      color = '#f59e0b'; // amber
    }

    return { score: totalScore, checks, grade, color };
  }, [formData, contentStats]);

  // Handle 1-Click SEO Boost
  const handleBoostSeo = () => {
    if (!formData.title && !formData.content) {
      alert('Tuliskan judul atau isi artikel terlebih dahulu agar SEO dapat dioptimalkan otomatis.');
      return;
    }

    setIsBoosting(true);
    setTimeout(() => {
      const boosted = boostSeoFields(formData);
      setFormData((prev) => ({
        ...prev,
        ...boosted
      }));
      setIsBoosting(false);
      setBoostSuccess(true);
      if (onBoostNotification) {
        onBoostNotification('SEO berhasil di-boost secara instan ke skor optimal!');
      }
      setTimeout(() => setBoostSuccess(false), 3000);
    }, 400);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 sm:p-6 space-y-6">
      
      {/* 1-CLICK SEO OPTIMIZER BAR (Clean & Professional) */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-emerald-100 text-emerald-800 rounded-lg shrink-0 mt-0.5">
            <Zap className="w-4 h-4 text-emerald-700" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                Optimasi SEO Otomatis
              </h4>
              <span className="text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full">
                1-Klik
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Otomatis mengisi kata kunci fokus, menyesuaikan panjang judul SERP (50-60 karakter), dan menyusun meta deskripsi standar.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleBoostSeo}
          disabled={isBoosting}
          className={`px-4 py-2 rounded-lg font-semibold text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5 shrink-0 border ${
            boostSuccess
              ? 'bg-emerald-600 border-emerald-600 text-white'
              : 'bg-white hover:bg-slate-100 border-slate-300 text-slate-700 shadow-2xs'
          }`}
        >
          {boostSuccess ? (
            <>
              <Check className="w-3.5 h-3.5" />
              <span>SEO Disesuaikan</span>
            </>
          ) : isBoosting ? (
            <>
              <Sparkles className="w-3.5 h-3.5 animate-spin text-slate-500" />
              <span>Memproses...</span>
            </>
          ) : (
            <>
              <Zap className="w-3.5 h-3.5 text-emerald-600" />
              <span>Optimasi Sekarang</span>
            </>
          )}
        </button>
      </div>

      {/* Header with SEO Tab Selector & Score Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-slate-100 text-slate-700 rounded-lg border border-slate-200">
            <Globe className="w-4 h-4 text-slate-700" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-900">
                Pengaturan SEO & Pratinjau Google SERP
              </h3>
              <span 
                className="text-[11px] font-mono font-bold px-2 py-0.5 rounded text-white transition-colors duration-300"
                style={{ backgroundColor: seoAnalysis.color }}
              >
                Skor: {seoAnalysis.score}/100
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Pratinjau tampilan artikel pada hasil pencarian Google dan kartu media sosial.
            </p>
          </div>
        </div>

        {/* SEO Sub-Tabs */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs font-semibold border border-slate-200 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setSeoTab('general')}
            className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${
              seoTab === 'general' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Cuplikan Google
          </button>
          <button
            type="button"
            onClick={() => setSeoTab('social')}
            className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${
              seoTab === 'social' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Media Sosial (OG)
          </button>
          <button
            type="button"
            onClick={() => setSeoTab('audit')}
            className={`px-3 py-1.5 rounded-md transition-all cursor-pointer flex items-center gap-1.5 ${
              seoTab === 'audit' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>Audit Rekomendasi</span>
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: seoAnalysis.color }} />
          </button>
        </div>
      </div>

      {/* TAB 1: GENERAL SEO & GOOGLE SERP PREVIEW */}
      {seoTab === 'general' && (
        <div className="space-y-6">
          
          {/* 1. Focus Keyword Input with Auto-Boost Helper */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <span>Kata Kunci Utama (Focus Keyword)</span>
                <span className="text-[11px] font-normal text-slate-400">&bull; Contoh: Kenaikan Pangkat ASN 2026</span>
              </label>
              <button
                type="button"
                onClick={handleBoostSeo}
                className="text-xs text-slate-600 hover:text-slate-900 font-medium flex items-center gap-1 cursor-pointer"
              >
                <span>Generate otomatis</span>
              </button>
            </div>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Masukkan kata kunci yang ditargetkan..."
                value={formData.focus_keyword || ''}
                onChange={(e) => setFormData({ ...formData, focus_keyword: e.target.value })}
                className="w-full pl-9 pr-4 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:ring-1 focus:ring-slate-900 focus:border-slate-900 focus:outline-none text-slate-800"
              />
            </div>
          </div>

          {/* 2. Live Google SERP Mockup Preview */}
          <div className="space-y-2.5 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700">
                Pratinjau Hasil Pencarian Google
              </span>
              <div className="flex items-center gap-1 bg-white p-0.5 rounded-lg border border-slate-200 text-xs">
                <button
                  type="button"
                  onClick={() => setSerpView('desktop')}
                  className={`px-2 py-0.5 rounded flex items-center gap-1 cursor-pointer transition-colors ${
                    serpView === 'desktop' ? 'bg-slate-900 text-white font-medium' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Monitor className="w-3 h-3" />
                  <span className="text-[11px]">Desktop</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSerpView('mobile')}
                  className={`px-2 py-0.5 rounded flex items-center gap-1 cursor-pointer transition-colors ${
                    serpView === 'mobile' ? 'bg-slate-900 text-white font-medium' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Smartphone className="w-3 h-3" />
                  <span className="text-[11px]">Mobile</span>
                </button>
              </div>
            </div>

            {/* The Simulated Google SERP Snippet */}
            <div className={`bg-white p-4 rounded-lg border border-slate-200 shadow-2xs space-y-1 transition-all ${
              serpView === 'mobile' ? 'max-w-sm mx-auto' : 'w-full'
            }`}>
              {/* Site Branding & Favicon */}
              <div className="flex items-center gap-2 text-xs">
                <div className="w-5 h-5 rounded-full bg-slate-800 text-white flex items-center justify-center text-[9px] font-bold shrink-0">
                  BK
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-slate-800 text-[11px] leading-tight">BKPSDM Kabupaten Aceh Tamiang</p>
                  <p className="text-[10px] text-slate-400 truncate font-mono">
                    https://bkpsdm.acehtamiangkab.go.id &rsaquo; berita &rsaquo; {formData.slug || 'judul-berita'}
                  </p>
                </div>
              </div>

              {/* Meta Title */}
              <h4 className="text-base font-normal text-[#1a0dab] hover:underline cursor-pointer leading-snug line-clamp-2">
                {formData.meta_title || formData.title || 'Judul Berita Resmi BKPSDM Aceh Tamiang'}
              </h4>

              {/* Meta Description */}
              <p className="text-xs text-[#4d5156] leading-relaxed line-clamp-2">
                {formData.meta_description || formData.excerpt || 'Baca artikel dan pengumuman resmi kepegawaian terkini dari Badan Kepegawaian & Pengembangan Sumber Daya Manusia Kabupaten Aceh Tamiang...'}
              </p>
            </div>
          </div>

          {/* 3. SEO Title & Progress Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <label className="font-bold text-slate-800">Judul SEO (Meta Title)</label>
              <span className="font-mono text-[11px] font-semibold" style={{
                color: (formData.meta_title || formData.title || '').length >= 40 && (formData.meta_title || formData.title || '').length <= 65 ? '#059669' : '#d97706'
              }}>
                {(formData.meta_title || formData.title || '').length}/60 Karakter (Ideal: 40-60)
              </span>
            </div>
            <input
              type="text"
              placeholder="Judul yang tampil pada halaman pencarian Google..."
              value={formData.meta_title || ''}
              onChange={(e) => setFormData({ ...formData, meta_title: e.target.value })}
              className="w-full p-3 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none text-slate-800"
            />
            {/* Progress bar */}
            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div 
                className="h-full transition-all duration-300"
                style={{ 
                  width: `${Math.min(100, (((formData.meta_title || formData.title || '').length) / 60) * 100)}%`,
                  backgroundColor: (formData.meta_title || formData.title || '').length >= 40 && (formData.meta_title || formData.title || '').length <= 65 ? '#059669' : '#f59e0b'
                }}
              />
            </div>
          </div>

          {/* 4. Meta Description & Progress Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <label className="font-bold text-slate-800">Meta Deskripsi (Snippet Summary)</label>
              <span className="font-mono text-[11px] font-semibold" style={{
                color: (formData.meta_description || formData.excerpt || '').length >= 120 && (formData.meta_description || formData.excerpt || '').length <= 165 ? '#059669' : '#d97706'
              }}>
                {(formData.meta_description || formData.excerpt || '').length}/160 Karakter (Ideal: 120-160)
              </span>
            </div>
            <textarea
              rows={3}
              placeholder="Deskripsi ringkas yang menarik klik pembaca pada hasil pencarian Google..."
              value={formData.meta_description || ''}
              onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })}
              className="w-full p-3 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none leading-relaxed text-slate-800"
            />
            {/* Progress bar */}
            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div 
                className="h-full transition-all duration-300"
                style={{ 
                  width: `${Math.min(100, (((formData.meta_description || formData.excerpt || '').length) / 160) * 100)}%`,
                  backgroundColor: (formData.meta_description || formData.excerpt || '').length >= 120 && (formData.meta_description || formData.excerpt || '').length <= 165 ? '#059669' : '#f59e0b'
                }}
              />
            </div>
          </div>

          {/* 5. Canonical URL */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-800">Canonical URL (Opsional)</label>
            <input
              type="text"
              placeholder="Kosongkan jika menggunakan URL bawaan artikel ini..."
              value={formData.canonical_url || ''}
              onChange={(e) => setFormData({ ...formData, canonical_url: e.target.value })}
              className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none font-mono text-slate-700"
            />
          </div>

        </div>
      )}

      {/* TAB 2: SOCIAL SHARING CARDS (OG / TWITTER) */}
      {seoTab === 'social' && (
        <div className="space-y-6">
          <p className="text-xs text-slate-500">
            Pratinjau tampilan kartu artikel saat dibagikan ke WhatsApp, Facebook, LinkedIn, dan Twitter/X.
          </p>

          {/* Facebook / WhatsApp OpenGraph Card */}
          <div className="max-w-md mx-auto bg-white rounded-2xl border border-slate-200 shadow-md overflow-hidden space-y-0">
            <div className="h-44 bg-slate-100 overflow-hidden relative">
              <img 
                src={formData.cover_image || 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=800&q=80'} 
                alt="Social Preview" 
                className="w-full h-full object-cover"
                loading="lazy"
                decoding="async"
                onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=800&q=80'; }}
              />
              <span className="absolute top-2 left-2 bg-black/60 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded">
                WhatsApp & Facebook Share Card
              </span>
            </div>

            <div className="p-4 bg-slate-50 space-y-1">
              <p className="text-[10px] uppercase font-mono text-slate-400">bkpsdm.acehtamiangkab.go.id</p>
              <h5 className="text-xs font-black text-slate-900 line-clamp-2 leading-snug">
                {formData.meta_title || formData.title || 'Judul Berita Resmi BKPSDM Aceh Tamiang'}
              </h5>
              <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                {formData.meta_description || formData.excerpt || 'Baca selengkapnya di Portal Resmi BKPSDM Aceh Tamiang.'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: AUDIT SEO & CHECKLIST */}
      {seoTab === 'audit' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl border flex items-center justify-between" style={{
            backgroundColor: seoAnalysis.score >= 80 ? '#ecfdf5' : (seoAnalysis.score >= 50 ? '#fffbeb' : '#fef2f2'),
            borderColor: seoAnalysis.score >= 80 ? '#a7f3d0' : (seoAnalysis.score >= 50 ? '#fde68a' : '#fecaca')
          }}>
            <div>
              <p className="text-xs font-black uppercase tracking-wider" style={{ color: seoAnalysis.color }}>
                {seoAnalysis.grade}
              </p>
              <p className="text-xs text-slate-600 mt-0.5">
                Skor SEO dihitung berdasarkan analisis judul, kata kunci fokus, meta cuplikan, dan kelengkapan konten.
              </p>
            </div>
            <span className="text-2xl font-mono font-black" style={{ color: seoAnalysis.color }}>
              {seoAnalysis.score}/100
            </span>
          </div>

          {/* Checklist Items */}
          <div className="space-y-2">
            {seoAnalysis.checks.map((chk) => (
              <div 
                key={chk.id}
                className={`p-3 rounded-2xl border text-xs flex items-center justify-between gap-3 ${
                  chk.passed ? 'bg-emerald-50/50 border-emerald-200/80' : 'bg-red-50/50 border-red-200/80'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  {chk.passed ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                  )}
                  <div>
                    <p className={`font-bold ${chk.passed ? 'text-emerald-950' : 'text-red-950'}`}>
                      {chk.label}
                    </p>
                    {!chk.passed && chk.hint && (
                      <p className="text-[11px] text-red-700 mt-0.5">{chk.hint}</p>
                    )}
                  </div>
                </div>
                <span className={`font-mono text-[10px] font-bold px-2 py-0.5 rounded shrink-0 ${
                  chk.passed ? 'bg-emerald-200 text-emerald-900' : 'bg-red-200 text-red-900'
                }`}>
                  +{chk.score} Poin
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
