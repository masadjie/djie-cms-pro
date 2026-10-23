import React from 'react';
import { Helmet } from 'react-helmet-async';

export default function SEOHead({
  title = 'Portal Resmi BKPSDM Kab. Aceh Tamiang | Layanan Kepegawaian & SDM Aparatur',
  description = 'Portal resmi pelayanan kepegawaian dan pengembangan SDM aparatur BKPSDM Kabupaten Aceh Tamiang. Akses pengumuman seleksi CASN, kenaikan pangkat, izin belajar, e-kinerja, dan SOP kepegawaian.',
  keywords = 'BKPSDM Aceh Tamiang, Badan Kepegawaian Aceh Tamiang, CASN Aceh Tamiang, Kenaikan Pangkat BKN, MyASN, SIASN, Mutasi Pegawai, Layanan ASN',
  canonicalUrl = 'https://bkpsdm.acehtamiangkab.go.id',
  ogImage = 'https://bkpsdm.acehtamiangkab.go.id/hero-tamiang.jpg',
  ogType = 'website',
  publishedTime,
  modifiedTime,
  author = 'BKPSDM Kabupaten Aceh Tamiang',
  schemaJsonLd
}) {
  const fullTitle = title.includes('BKPSDM') ? title : `${title} | BKPSDM Kab. Aceh Tamiang`;

  // Default Organization JSON-LD Schema
  const defaultOrgSchema = {
    '@context': 'https://schema.org',
    '@type': 'GovernmentOrganization',
    name: 'Badan Kepegawaian dan Pengembangan Sumber Daya Manusia Kabupaten Aceh Tamiang',
    alternateName: 'BKPSDM Kab. Aceh Tamiang',
    url: 'https://bkpsdm.acehtamiangkab.go.id',
    logo: 'https://bkpsdm.acehtamiangkab.go.id/logo-tamiang.png',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Jl. Ir. H. Juanda No. 1, Komplek Perkantoran Pemkab Aceh Tamiang',
      addressLocality: 'Karang Baru',
      addressRegion: 'Aceh',
      postalCode: '24476',
      addressCountry: 'ID'
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+62-641-333444',
      contactType: 'Customer Service & Helpdesk ASN',
      areaServed: 'ID',
      availableLanguage: 'Indonesian'
    }
  };

  const finalSchema = schemaJsonLd || defaultOrgSchema;

  const rawOgImage = ogImage || 'https://bkpsdm.acehtamiangkab.go.id/hero-tamiang.jpg';
  const resolvedOgImage = rawOgImage.startsWith('http://') || rawOgImage.startsWith('https://')
    ? rawOgImage
    : `https://bkpsdm.acehtamiangkab.go.id${rawOgImage.startsWith('/') ? '' : '/'}${rawOgImage}`;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph / Facebook / WhatsApp */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={resolvedOgImage} />
      <meta property="og:image:secure_url" content={resolvedOgImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={fullTitle} />
      <meta property="og:site_name" content="BKPSDM Kabupaten Aceh Tamiang" />
      <meta property="og:locale" content="id_ID" />
      {publishedTime && <meta property="article:published_time" content={publishedTime} />}
      {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
      {author && <meta property="article:author" content={author} />}

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={canonicalUrl} />
      <meta property="twitter:title" content={fullTitle} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={resolvedOgImage} />
      <meta property="twitter:image:alt" content={fullTitle} />

      {/* Schema.org Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(finalSchema)}
      </script>
    </Helmet>
  );
}
