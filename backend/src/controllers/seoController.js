const { Berita, Layanan, PengaturanWeb } = require('../models');
const { getOrSetCache } = require('../config/redis');
const logger = require('../config/logger');

const getClientUrl = async () => {
  try {
    const setting = await PengaturanWeb.findOne({ where: { key_name: 'site_url' } });
    if (setting && setting.value) return setting.value.replace(/\/+$/, '');
  } catch (e) {}
  return (process.env.CLIENT_URL || 'https://bkpsdm.acehtamiangkab.go.id').replace(/\/+$/, '');
};

const getPublicationName = async () => {
  try {
    const setting = await PengaturanWeb.findOne({ where: { key_name: 'site_name' } });
    if (setting && setting.value) return setting.value;
    const instansi = await PengaturanWeb.findOne({ where: { key_name: 'instansi_name' } });
    if (instansi && instansi.value) return instansi.value;
  } catch (e) {}
  return 'BKPSDM Kabupaten Aceh Tamiang';
};

const safeIsoDate = (d) => {
  try {
    if (!d) return new Date().toISOString();
    return new Date(d).toISOString();
  } catch (e) {
    return new Date().toISOString();
  }
};

/**
 * Generate Dynamic Google XML News Sitemap (specifically for Google News)
 * According to Google News requirements: only articles published in the last 2 days (48 hours),
 * or latest 1000 published articles, with <news:news> tags.
 */
const getGoogleNewsSitemapXml = async (req, res) => {
  try {
    const clientUrl = await getClientUrl();
    const pubName = await getPublicationName();

    const newsSitemap = await getOrSetCache('seo:sitemap:news:v3', async () => {
      // News published within the last 48h or latest 100 articles
      const articles = await Berita.findAll({
        where: { status: 'PUBLISHED' },
        order: [['published_at', 'DESC']],
        limit: 100,
        attributes: ['slug', 'title', 'published_at', 'updated_at', 'author_name']
      });

      let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
      xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n`;
      xml += `        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">\n`;

      for (const article of articles) {
        const pubDate = safeIsoDate(article.published_at);
        xml += `  <url>\n`;
        xml += `    <loc>${clientUrl}/berita/${article.slug}</loc>\n`;
        xml += `    <news:news>\n`;
        xml += `      <news:publication>\n`;
        xml += `        <news:name><![CDATA[${pubName}]]></news:name>\n`;
        xml += `        <news:language>id</news:language>\n`;
        xml += `      </news:publication>\n`;
        xml += `      <news:publication_date>${pubDate}</news:publication_date>\n`;
        xml += `      <news:title><![CDATA[${article.title}]]></news:title>\n`;
        xml += `    </news:news>\n`;
        xml += `  </url>\n`;
      }

      xml += `</urlset>`;
      return xml;
    }, 600); // 10 minutes cache for fresh news indexing

    res.header('Content-Type', 'application/xml; charset=UTF-8');
    res.header('Cache-Control', 'public, max-age=600');
    return res.send(newsSitemap);
  } catch (error) {
    logger.error(`Error getGoogleNewsSitemapXml: ${error.message}`);
    return res.status(500).send('Error generating Google News sitemap');
  }
};

/**
 * Generate Dynamic Google XML Sitemap (Standard + News Extension)
 */
const getSitemapXml = async (req, res) => {
  try {
    const clientUrl = await getClientUrl();
    const pubName = await getPublicationName();

    const sitemapContent = await getOrSetCache('seo:sitemap:xml:v3', async () => {
      const articles = await Berita.findAll({
        where: { status: 'PUBLISHED' },
        order: [['published_at', 'DESC']],
        limit: 1000,
        attributes: ['slug', 'title', 'published_at', 'updated_at']
      });

      const services = await Layanan.findAll({
        where: { status_layanan: 'AKTIF' },
        attributes: ['id', 'slug', 'updated_at']
      });

      const now = new Date().toISOString();

      let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
      xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">\n`;

      // Static routes
      const staticRoutes = [
        { path: '', priority: '1.0', changefreq: 'daily' },
        { path: '/katalog', priority: '0.9', changefreq: 'daily' },
        { path: '/berita', priority: '0.9', changefreq: 'hourly' },
        { path: '/tracking', priority: '0.7', changefreq: 'weekly' },
        { path: '/login', priority: '0.4', changefreq: 'monthly' },
        { path: '/register', priority: '0.4', changefreq: 'monthly' }
      ];

      for (const route of staticRoutes) {
        xml += `  <url>\n`;
        xml += `    <loc>${clientUrl}${route.path}</loc>\n`;
        xml += `    <lastmod>${now}</lastmod>\n`;
        xml += `    <changefreq>${route.changefreq}</changefreq>\n`;
        xml += `    <priority>${route.priority}</priority>\n`;
        xml += `  </url>\n`;
      }

      // News articles
      for (const article of articles) {
        const lastMod = safeIsoDate(article.updated_at || article.published_at);
        const pubDate = safeIsoDate(article.published_at);
        xml += `  <url>\n`;
        xml += `    <loc>${clientUrl}/berita/${article.slug}</loc>\n`;
        xml += `    <lastmod>${lastMod}</lastmod>\n`;
        xml += `    <changefreq>daily</changefreq>\n`;
        xml += `    <priority>0.8</priority>\n`;
        xml += `    <news:news>\n`;
        xml += `      <news:publication>\n`;
        xml += `        <news:name><![CDATA[${pubName}]]></news:name>\n`;
        xml += `        <news:language>id</news:language>\n`;
        xml += `      </news:publication>\n`;
        xml += `      <news:publication_date>${pubDate}</news:publication_date>\n`;
        xml += `      <news:title><![CDATA[${article.title}]]></news:title>\n`;
        xml += `    </news:news>\n`;
        xml += `  </url>\n`;
      }

      // Services
      for (const service of services) {
        const lastMod = safeIsoDate(service.updated_at);
        xml += `  <url>\n`;
        xml += `    <loc>${clientUrl}/layanan/${service.slug || service.id}</loc>\n`;
        xml += `    <lastmod>${lastMod}</lastmod>\n`;
        xml += `    <changefreq>weekly</changefreq>\n`;
        xml += `    <priority>0.7</priority>\n`;
        xml += `  </url>\n`;
      }

      xml += `</urlset>`;
      return xml;
    }, 1800);

    res.header('Content-Type', 'application/xml; charset=UTF-8');
    res.header('Cache-Control', 'public, max-age=1800');
    return res.send(sitemapContent);
  } catch (error) {
    logger.error(`Error getSitemapXml: ${error.message}`);
    return res.status(500).send('Error generating sitemap');
  }
};

/**
 * Generate High-Standard RSS 2.0 Feed for Google News Publisher Center Syndication
 */
const getRssFeed = async (req, res) => {
  try {
    const clientUrl = await getClientUrl();
    const pubName = await getPublicationName();

    const rssContent = await getOrSetCache('seo:rss:xml:v3', async () => {
      const articles = await Berita.findAll({
        where: { status: 'PUBLISHED' },
        order: [['published_at', 'DESC']],
        limit: 50,
        attributes: ['slug', 'title', 'excerpt', 'content', 'cover_image', 'published_at', 'author_name']
      });

      let rss = `<?xml version="1.0" encoding="UTF-8"?>\n`;
      rss += `<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:media="http://search.yahoo.com/mrss/">\n`;
      rss += `  <channel>\n`;
      rss += `    <title><![CDATA[${pubName}]]></title>\n`;
      rss += `    <link>${clientUrl}/berita</link>\n`;
      rss += `    <description><![CDATA[Saluran Berita &amp; Informasi Resmi ${pubName}]]></description>\n`;
      rss += `    <language>id-ID</language>\n`;
      rss += `    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>\n`;
      rss += `    <atom:link href="${clientUrl}/rss.xml" rel="self" type="application/rss+xml" />\n`;

      for (const article of articles) {
        const pubDate = new Date(article.published_at || Date.now()).toUTCString();
        const articleLink = `${clientUrl}/berita/${article.slug}`;
        const author = article.author_name || pubName;
        const resolvedCover = article.cover_image
          ? (article.cover_image.startsWith('http') ? article.cover_image : `${clientUrl}${article.cover_image.startsWith('/') ? '' : '/'}${article.cover_image}`)
          : null;

        rss += `    <item>\n`;
        rss += `      <title><![CDATA[${article.title}]]></title>\n`;
        rss += `      <link>${articleLink}</link>\n`;
        rss += `      <guid isPermaLink="true">${articleLink}</guid>\n`;
        rss += `      <pubDate>${pubDate}</pubDate>\n`;
        rss += `      <dc:creator><![CDATA[${author}]]></dc:creator>\n`;
        rss += `      <description><![CDATA[${article.excerpt || ''}]]></description>\n`;
        if (article.content) {
          rss += `      <content:encoded><![CDATA[${article.content}]]></content:encoded>\n`;
        }
        if (resolvedCover) {
          rss += `      <enclosure url="${resolvedCover}" type="image/jpeg" />\n`;
          rss += `      <media:content url="${resolvedCover}" medium="image" />\n`;
        }
        rss += `    </item>\n`;
      }

      rss += `  </channel>\n`;
      rss += `</rss>`;
      return rss;
    }, 600);

    res.header('Content-Type', 'application/rss+xml; charset=UTF-8');
    res.header('Cache-Control', 'public, max-age=600');
    return res.send(rssContent);
  } catch (error) {
    logger.error(`Error getRssFeed: ${error.message}`);
    return res.status(500).send('Error generating RSS feed');
  }
};

/**
 * Helper to ensure image URLs are fully qualified absolute URLs
 */
const resolveFullImageUrl = (imgUrl) => {
  if (!imgUrl) {
    return `${CLIENT_URL}/hero-tamiang.jpg`;
  }
  if (imgUrl.startsWith('http://') || imgUrl.startsWith('https://')) {
    return imgUrl;
  }
  const cleanPath = imgUrl.startsWith('/') ? imgUrl : `/${imgUrl}`;
  return `${CLIENT_URL}${cleanPath}`;
};

/**
 * Social Media Share Preview HTML Generator for Crawlers & Scrapers
 * WhatsApp, Facebook, Twitter, Telegram, LinkedIn, and Googlebot-News inspect raw HTML to build link cards.
 */
const getBeritaSharePreview = async (req, res) => {
  try {
    const clientUrl = await getClientUrl();
    const pubName = await getPublicationName();
    const { slug } = req.params;
    if (!slug) {
      return res.redirect(`${clientUrl}/berita`);
    }

    let article = await Berita.findOne({
      where: { slug, status: 'PUBLISHED' },
      attributes: ['title', 'slug', 'excerpt', 'cover_image', 'published_at', 'updated_at', 'author_name', 'meta_title', 'meta_description', 'meta_keywords']
    });

    // If not found by exact slug, try prefix/partial match (useful if link got truncated in WhatsApp)
    if (!article) {
      const { Op } = require('sequelize');
      article = await Berita.findOne({
        where: { 
          slug: { [Op.like]: `${slug}%` },
          status: 'PUBLISHED'
        },
        attributes: ['title', 'slug', 'excerpt', 'cover_image', 'published_at', 'updated_at', 'author_name', 'meta_title', 'meta_description', 'meta_keywords']
      });
    }

    if (!article) {
      const fallbackTitle = `Portal Resmi ${pubName}`;
      const fallbackDesc = `Pusat informasi kepegawaian, pengumuman seleksi, dan layanan publik aparatur sipil negara.`;
      const fallbackImg = `${clientUrl}/hero-tamiang.jpg`;
      const htmlFallback = `<!DOCTYPE html>
<html lang="id" prefix="og: https://ogp.me/ns#">
<head>
  <meta charset="UTF-8">
  <title>${fallbackTitle}</title>
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="${pubName}">
  <meta property="og:url" content="${clientUrl}">
  <meta property="og:title" content="${fallbackTitle}">
  <meta property="og:description" content="${fallbackDesc}">
  <meta property="og:image" content="${fallbackImg}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:image" content="${fallbackImg}">
  <meta http-equiv="refresh" content="0;url=${clientUrl}/berita">
</head>
<body></body>
</html>`;
      res.header('Content-Type', 'text/html; charset=UTF-8');
      return res.send(htmlFallback);
    }

    const title = article.meta_title || article.title;
    const fullTitle = title.includes(pubName) ? title : `${title} | ${pubName}`;
    const description = (article.meta_description || article.excerpt || `Berita dan informasi resmi ${pubName}.`).replace(/"/g, '&quot;');
    const imageUrl = article.cover_image
      ? (article.cover_image.startsWith('http') ? article.cover_image : `${clientUrl}${article.cover_image.startsWith('/') ? '' : '/'}${article.cover_image}`)
      : `${clientUrl}/hero-tamiang.jpg`;
    const articleUrl = `${clientUrl}/berita/${article.slug}`;
    const publishedTime = safeIsoDate(article.published_at);
    const modifiedTime = safeIsoDate(article.updated_at || article.published_at);
    const author = (article.author_name || pubName).replace(/"/g, '&quot;');

    // Schema.org NewsArticle JSON-LD for Google News crawler
    const schemaJsonLd = {
      '@context': 'https://schema.org',
      '@type': 'NewsArticle',
      headline: article.title,
      description: article.meta_description || article.excerpt,
      image: [imageUrl],
      datePublished: publishedTime,
      dateModified: modifiedTime,
      author: {
        '@type': 'Organization',
        name: author,
        url: clientUrl
      },
      publisher: {
        '@type': 'GovernmentOrganization',
        name: pubName,
        logo: {
          '@type': 'ImageObject',
          url: `${clientUrl}/logo-tamiang.png`
        }
      },
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': articleUrl
      }
    };

    // Return rich HTML with complete Open Graph, Twitter & Google News structured data
    const html = `<!DOCTYPE html>
<html lang="id" prefix="og: https://ogp.me/ns#">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${fullTitle}</title>
  <meta name="description" content="${description}">
  <meta name="author" content="${author}">
  <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">
  <link rel="canonical" href="${articleUrl}">

  <!-- Open Graph / WhatsApp / Facebook -->
  <meta property="og:type" content="article">
  <meta property="og:site_name" content="${pubName}">
  <meta property="og:url" content="${articleUrl}">
  <meta property="og:title" content="${fullTitle}">
  <meta property="og:description" content="${description}">
  <meta property="og:image" content="${imageUrl}">
  <meta property="og:image:secure_url" content="${imageUrl}">
  <meta property="og:image:type" content="image/jpeg">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="${fullTitle}">
  <meta property="og:locale" content="id_ID">
  <meta property="article:published_time" content="${publishedTime}">
  <meta property="article:modified_time" content="${modifiedTime}">
  <meta property="article:author" content="${author}">

  <!-- Twitter / X -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:url" content="${articleUrl}">
  <meta name="twitter:title" content="${fullTitle}">
  <meta name="twitter:description" content="${description}">
  <meta name="twitter:image" content="${imageUrl}">
  <meta name="twitter:image:alt" content="${fullTitle}">

  <!-- Google News & Search JSON-LD -->
  <script type="application/ld+json">
    ${JSON.stringify(schemaJsonLd)}
  </script>

  <!-- Redirect human visitors seamlessly to the SPA route -->
  <meta http-equiv="refresh" content="0;url=${articleUrl}">
  <script>
    window.location.replace("${articleUrl}");
  </script>
</head>
<body style="font-family: system-ui, -apple-system, sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; background-color: #f8fafc;">
  <div style="text-align: center; padding: 24px;">
    <h2 style="color: #065f46;">${fullTitle}</h2>
    <p style="color: #64748b;">Mengarahkan ke halaman artikel...</p>
    <a href="${articleUrl}" style="color: #047857; text-decoration: underline; font-weight: 600;">Klik di sini jika tidak diarahkan otomatis</a>
  </div>
</body>
</html>`;

    res.header('Content-Type', 'text/html; charset=UTF-8');
    res.header('Cache-Control', 'public, max-age=300');
    return res.send(html);
  } catch (error) {
    logger.error(`Error getBeritaSharePreview: ${error.message}`);
    const clientUrl = await getClientUrl();
    return res.redirect(`${clientUrl}/berita`);
  }
};

/**
 * Robots.txt dynamic responder with Google News & Search Directives
 */
const getRobotsTxt = async (req, res) => {
  const clientUrl = await getClientUrl();
  const robots = `User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/

User-agent: Googlebot
Allow: /

User-agent: Googlebot-News
Allow: /

Sitemap: ${clientUrl}/sitemap.xml
Sitemap: ${clientUrl}/sitemap-news.xml
`;
  res.header('Content-Type', 'text/plain; charset=UTF-8');
  res.header('Cache-Control', 'public, max-age=3600');
  res.send(robots);
};

module.exports = {
  getSitemapXml,
  getGoogleNewsSitemapXml,
  getRssFeed,
  getRobotsTxt,
  getBeritaSharePreview
};
