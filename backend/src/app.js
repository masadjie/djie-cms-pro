const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');

dotenv.config();

const logger = require('./config/logger');
const authRoutes = require('./routes/authRoutes');
const layananRoutes = require('./routes/layananRoutes');
const permohonanRoutes = require('./routes/permohonanRoutes');
const masterRoutes = require('./routes/masterRoutes');
const beritaRoutes = require('./routes/beritaRoutes');
const seoRoutes = require('./routes/seoRoutes');
const cmsRoutes = require('./routes/cmsRoutes');
const storageRoutes = require('./routes/storageRoutes');
const rbacRoutes = require('./routes/rbacRoutes');
const { securityFirewallMiddleware, isoSecurityHeaders } = require('./middlewares/securityMiddleware');

const app = express();

// Trust reverse proxy (Nginx / Docker Gateway) to accurately read client IP
app.set('trust proxy', 1);

// ISO 27001 Security Headers
app.use(isoSecurityHeaders);

// Security Headers & Policy
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// CORS Setup
const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:5173,http://localhost:5188,http://localhost:3000,*').split(',');
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
        callback(null, true);
      } else {
        callback(new Error('Akses diblokir oleh CORS Policy'));
      }
    },
    credentials: true
  })
);

// Body Parser (supports up to 100MB for batch uploads & rich text)
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ extended: true, limit: '100mb' }));

// ISO 27001 Web Application Firewall & Deep Injection Filter
app.use(securityFirewallMiddleware);

// HTTP Access Logging
const morganFormat = process.env.NODE_ENV === 'production' ? 'combined' : 'dev';
app.use(
  morgan(morganFormat, {
    stream: {
      write: (message) => logger.info(message.trim())
    }
  })
);

// High-Capacity Enterprise Rate Limiter (Default 50,000 requests per 15 min window)
// Allows heavy traffic while protecting server from rogue volumetric floods
const maxRequests = parseInt(process.env.RATE_LIMIT_MAX, 10) || 50000;
const windowMs = parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 15 * 60 * 1000;

const limiter = rateLimit({
  windowMs: windowMs,
  max: maxRequests,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Terlalu banyak permintaan dari IP ini. Silakan coba beberapa saat lagi.'
  },
  // Skip rate limiting for static health checks and track-visit pings
  skip: (req) => {
    return req.path === '/health' || req.path === '/api/v1/cms/track-visit';
  }
});

// Endpoint to immediately reset rate limit memory if needed
app.post('/api/reset-rate-limit', (req, res) => {
  if (limiter.resetKey) {
    const ip = req.ip || req.connection?.remoteAddress;
    limiter.resetKey(ip);
  }
  return res.status(200).json({
    success: true,
    message: 'Rate limit IP berhasil direset!'
  });
});

app.use('/api/', limiter);


// Health Check API with DJIE CMS PRO engine watermark
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'UP',
    timestamp: new Date(),
    service: 'Portal Layanan BKPSDM Kab. Aceh Tamiang API',
    engine: 'Powered By DJIE CMS PRO 2026',
    database: 'MySQL 8.0 (Sequelize)',
    cache: 'Redis 7 Alpine'
  });
});

// SEO root shortcuts
app.use('/sitemap.xml', (req, res, next) => {
  req.url = '/sitemap.xml';
  seoRoutes(req, res, next);
});
app.use('/rss.xml', (req, res, next) => {
  req.url = '/rss.xml';
  seoRoutes(req, res, next);
});

// Main API Endpoints
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/layanan', layananRoutes);
app.use('/api/v1/permohonan', permohonanRoutes);
app.use('/api/v1/master', masterRoutes);
app.use('/api/v1/berita', beritaRoutes);
app.use('/api/v1/seo', seoRoutes);
app.use('/api/v1/cms', cmsRoutes);
app.use('/api/v1/storage', storageRoutes);
app.use('/api/v1/rbac', rbacRoutes);

// 404 Not Found Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Endpoint ${req.originalUrl} tidak ditemukan pada server ini.`
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  logger.error('Unhandled Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Terjadi kesalahan internal pada server.',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

module.exports = app;
