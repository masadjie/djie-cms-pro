/**
 * Google Rank #1 Optimized SEO Algorithm Helper
 */

export function boostSeoFields(formData) {
  const title = (formData.title || '').trim();
  const rawContent = (formData.content || '').trim();
  const textOnly = rawContent.replace(/<[^>]*>?/gm, ' ').replace(/\s+/g, ' ').trim();

  // 1. Determine High-Intent Focus Keyword (Clean 2-4 words)
  let keyword = (formData.focus_keyword || '').trim();
  if (!keyword && title) {
    const stopWords = ['dan', 'yang', 'untuk', 'pada', 'dari', 'dalam', 'dengan', 'ke', 'di', 'ini', 'itu', 'resmi', 'kabupaten', 'seputar', 'tentang', 'oleh'];
    const words = title
      .replace(/[^\w\s]/gi, '')
      .split(/\s+/)
      .filter((w) => w.length > 2 && !stopWords.includes(w.toLowerCase()));
    
    keyword = words.slice(0, 3).join(' ') || 'ASN Aceh Tamiang';
  }
  if (!keyword) keyword = 'BKPSDM Aceh Tamiang';

  // Capitalize keyword nicely
  const capKeyword = keyword
    .split(/\s+/)
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

  // 2. Generate Google SERP Title (Ideal: 50 - 60 chars, contains Keyword at front)
  let baseTitle = title || capKeyword;
  if (!baseTitle.toLowerCase().includes(keyword.toLowerCase())) {
    baseTitle = `${capKeyword}: ${baseTitle}`;
  }

  const brandSuffix = ' | BKPSDM Aceh Tamiang';
  let optimizedMetaTitle = baseTitle;
  if (optimizedMetaTitle.length + brandSuffix.length <= 60) {
    optimizedMetaTitle = `${optimizedMetaTitle}${brandSuffix}`;
  } else if (optimizedMetaTitle.length > 60) {
    optimizedMetaTitle = optimizedMetaTitle.slice(0, 57).trim() + '...';
  }

  // 3. Generate High-CTR Meta Description (Target: 140 - 155 chars, contains Focus Keyword)
  let snippetLead = (formData.excerpt || textOnly).replace(/<[^>]*>?/gm, ' ').trim();
  if (snippetLead.length > 90) {
    snippetLead = snippetLead.slice(0, 90).trim();
  }

  let optimizedMetaDesc = `Informasi resmi seputar ${capKeyword}. ${snippetLead ? `${snippetLead}... ` : ''}Pelajari persyaratan, alur, dan jadwal lengkap di BKPSDM.`;
  if (optimizedMetaDesc.length > 155) {
    optimizedMetaDesc = optimizedMetaDesc.slice(0, 150).trim() + '...';
  } else if (optimizedMetaDesc.length < 130) {
    optimizedMetaDesc = `Informasi resmi ${capKeyword}: Akses panduan, jadwal, serta berkas persyaratan kepegawaian ASN terlengkap melalui Portal Resmi BKPSDM Aceh Tamiang.`;
  }

  // 4. Generate Clean SEO Slug containing focus keyword
  const keywordSlug = capKeyword.toLowerCase().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-');
  const titleSlug = (title || capKeyword).toLowerCase().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').slice(0, 45);
  const cleanSlug = titleSlug.includes(keywordSlug) ? titleSlug : `${keywordSlug}-${titleSlug}`.slice(0, 60).replace(/-+$/, '');

  // 5. High-Impact Tags & Keywords
  const tagList = [
    capKeyword,
    'BKPSDM Aceh Tamiang',
    'Kepegawaian ASN',
    'Pemerintah Aceh Tamiang',
    'Layanan Publik'
  ];
  const existingTags = formData.tags ? formData.tags.split(',').map(t => t.trim()) : [];
  const optimizedTags = Array.from(new Set([...tagList, ...existingTags])).filter(Boolean).slice(0, 6).join(', ');

  // 6. Generate Excerpt
  const optimizedExcerpt = formData.excerpt || (textOnly ? `${textOnly.slice(0, 160).trim()}...` : optimizedMetaDesc);

  return {
    focus_keyword: capKeyword,
    meta_title: optimizedMetaTitle,
    meta_description: optimizedMetaDesc,
    slug: cleanSlug,
    tags: optimizedTags,
    meta_keywords: optimizedTags,
    excerpt: optimizedExcerpt
  };
}
