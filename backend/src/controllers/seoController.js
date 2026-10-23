const { Berita, Layanan } = require('../models');
const { getOrSetCache } = require('../config/redis');
const logger = require('../config/logger');

const CLIENT_URL = process.env.CLIENT_URL || 'https://bkpsdm.acehtamiangkab.go.id';

const safeIsoDate = (d) => {
  try {
    if (!d) return new Date().toISOString();
    return new Date(d).toISOString();
  } catch (e) {
    return new Date().toISOString();
  }
};

/**
 * Generate Dynamic Google XML Sitemap with News Extension
 */
const getSitemapXml = async (req, res) => {
  try {
    const sitemapContent = await getOrSetCache('seo:sitemap:xml:v2', async () => {
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
        xml += `    <loc>${CLIENT_URL}${route.path}</loc>\n`;
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
        xml += `    <loc>${CLIENT_URL}/berita/${article.slug}</loc>\n`;
        xml += `    <lastmod>${lastMod}</lastmod>\n`;
        xml += `    <changefreq>daily</changefreq>\n`;
        xml += `    <priority>0.8</priority>\n`;
        xml += `    <news:news>\n`;
        xml += `      <news:publication>\n`;
        xml += `        <news:name>BKPSDM Kabupaten Aceh Tamiang</news:name>\n`;
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
        xml += `    <loc>${CLIENT_URL}/layanan/${service.slug || service.id}</loc>\n`;
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
 * Generate RSS 2.0 Feed for Google News Syndication
 */
const getRssFeed = async (req, res) => {
  try {
    const rssContent = await getOrSetCache('seo:rss:xml:v2', async () => {
      const articles = await Berita.findAll({
        where: { status: 'PUBLISHED' },
        order: [['published_at', 'DESC']],
        limit: 30,
        attributes: ['slug', 'title', 'excerpt', 'cover_image', 'published_at', 'author_name']
      });

      let rss = `<?xml version="1.0" encoding="UTF-8"?>\n`;
      rss += `<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">\n`;
      rss += `  <channel>\n`;
      rss += `    <title>Berita BKPSDM Kab. Aceh Tamiang</title>\n`;
      rss += `    <link>${CLIENT_URL}/berita</link>\n`;
      rss += `    <description>Saluran Resmi Berita &amp; Informasi Kepegawaian BKPSDM Kabupaten Aceh Tamiang</description>\n`;
      rss += `    <language>id-ID</language>\n`;
      rss += `    <atom:link href="${CLIENT_URL}/api/seo/rss.xml" rel="self" type="application/rss+xml" />\n`;

      for (const article of articles) {
        const pubDate = new Date(article.published_at || Date.now()).toUTCString();
        rss += `    <item>\n`;
        rss += `      <title><![CDATA[${article.title}]]></title>\n`;
        rss += `      <link>${CLIENT_URL}/berita/${article.slug}</link>\n`;
        rss += `      <guid isPermaLink="true">${CLIENT_URL}/berita/${article.slug}</guid>\n`;
        rss += `      <pubDate>${pubDate}</pubDate>\n`;
        rss += `      <author><![CDATA[${article.author_name || 'BKPSDM Aceh Tamiang'}]]></author>\n`;
        rss += `      <description><![CDATA[${article.excerpt || ''}]]></description>\n`;
        if (article.cover_image) {
          rss += `      <enclosure url="${article.cover_image}" type="image/jpeg" />\n`;
        }
        rss += `    </item>\n`;
      }

      rss += `  </channel>\n`;
      rss += `</rss>`;
      return rss;
    }, 1800);

    res.header('Content-Type', 'application/rss+xml; charset=UTF-8');
    res.header('Cache-Control', 'public, max-age=1800');
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
 * WhatsApp, Facebook, Twitter, Telegram, LinkedIn inspect raw HTML to build link cards.
 */
const getBeritaSharePreview = async (req, res) => {
  try {
    const { slug } = req.params;
    if (!slug) {
      return res.redirect(`${CLIENT_URL}/berita`);
    }

    let article = await Berita.findOne({
      where: { slug, status: 'PUBLISHED' },
      attributes: ['title', 'slug', 'excerpt', 'cover_image', 'published_at', 'author_name', 'meta_title', 'meta_description', 'meta_keywords']
    });

    // If not found by exact slug, try prefix/partial match (useful if link got truncated in WhatsApp)
    if (!article) {
      const { Op } = require('sequelize');
      article = await Berita.findOne({
        where: { 
          slug: { [Op.like]: `${slug}%` },
          status: 'PUBLISHED'
        },
        attributes: ['title', 'slug', 'excerpt', 'cover_image', 'published_at', 'author_name', 'meta_title', 'meta_description', 'meta_keywords']
      });
    }

    if (!article) {
      // Fallback: return rich BKPSDM portal preview rather than 302 redirect so crawler still displays valid card
      const fallbackTitle = "Portal Resmi BKPSDM Kab. Aceh Tamiang";
      const fallbackDesc = "Pusat informasi kepegawaian, pengumuman seleksi CASN/PPPK, kenaikan pangkat SIASN, dan layanan aparatur sipil negara.";
      const fallbackImg = `${CLIENT_URL}/hero-tamiang.jpg`;
      const htmlFallback = `<!DOCTYPE html>
<html lang="id" prefix="og: https://ogp.me/ns#">
<head>
  <meta charset="UTF-8">
  <title>${fallbackTitle}</title>
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="BKPSDM Kabupaten Aceh Tamiang">
  <meta property="og:url" content="${CLIENT_URL}">
  <meta property="og:title" content="${fallbackTitle}">
  <meta property="og:description" content="${fallbackDesc}">
  <meta property="og:image" content="${fallbackImg}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:image" content="${fallbackImg}">
  <meta http-equiv="refresh" content="0;url=${CLIENT_URL}/berita">
</head>
<body></body>
</html>`;
      res.header('Content-Type', 'text/html; charset=UTF-8');
      return res.send(htmlFallback);
    }

    const title = article.meta_title || article.title;
    const fullTitle = title.includes('BKPSDM') ? title : `${title} | BKPSDM Kab. Aceh Tamiang`;
    const description = (article.meta_description || article.excerpt || 'Berita dan informasi resmi BKPSDM Kabupaten Aceh Tamiang.').replace(/"/g, '&quot;');
    const imageUrl = resolveFullImageUrl(article.cover_image);
    const articleUrl = `${CLIENT_URL}/berita/${article.slug}`;
    const publishedTime = safeIsoDate(article.published_at);
    const author = (article.author_name || 'BKPSDM Kabupaten Aceh Tamiang').replace(/"/g, '&quot;');

    // Return rich HTML with complete Open Graph & Twitter meta tags
    const html = `<!DOCTYPE html>
<html lang="id" prefix="og: https://ogp.me/ns#">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${fullTitle}</title>
  <meta name="description" content="${description}">
  <meta name="author" content="${author}">
  <link rel="canonical" href="${articleUrl}">

  <!-- Open Graph / WhatsApp / Facebook -->
  <meta property="og:type" content="article">
  <meta property="og:site_name" content="BKPSDM Kabupaten Aceh Tamiang">
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
  <meta property="article:author" content="${author}">

  <!-- Twitter / X -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:url" content="${articleUrl}">
  <meta name="twitter:title" content="${fullTitle}">
  <meta name="twitter:description" content="${description}">
  <meta name="twitter:image" content="${imageUrl}">
  <meta name="twitter:image:alt" content="${fullTitle}">

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
    return res.redirect(`${CLIENT_URL}/berita`);
  }
};

/**
 * Robots.txt dynamic responder with AI agentic directives
 */
const getRobotsTxt = (req, res) => {
  const robots = `User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/

Sitemap: ${CLIENT_URL}/sitemap.xml
`;
  res.header('Content-Type', 'text/plain; charset=UTF-8');
  res.header('Cache-Control', 'public, max-age=3600');
  res.send(robots);
};

module.exports = {
  getSitemapXml,
  getRssFeed,
  getRobotsTxt,
  getBeritaSharePreview
};
