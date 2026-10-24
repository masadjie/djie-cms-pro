const express = require('express');
const router = express.Router();
const {
  getSitemapXml,
  getGoogleNewsSitemapXml,
  getRssFeed,
  getRobotsTxt,
  getBeritaSharePreview
} = require('../controllers/seoController');

router.get('/sitemap.xml', getSitemapXml);
router.get('/sitemap-news.xml', getGoogleNewsSitemapXml);
router.get('/rss.xml', getRssFeed);
router.get('/robots.txt', getRobotsTxt);
router.get('/share/berita/:slug', getBeritaSharePreview);

module.exports = router;
