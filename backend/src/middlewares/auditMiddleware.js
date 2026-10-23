const { AuditLog } = require('../models');
const logger = require('../config/logger');

const auditLogMiddleware = (action, moduleName) => {
  return async (req, res, next) => {
    // Jalankan request handler terlebih dahulu
    const originalSend = res.send;

    res.send = function (data) {
      res.send = originalSend;
      res.send(data);

      // Catat audit log di background setelah response dikirim
      setImmediate(async () => {
        try {
          const user = req.user || null;
          const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || req.ip;
          const userAgent = req.headers['user-agent'] || 'Unknown';

          await AuditLog.create({
            user_id: user ? user.id : null,
            nik: user ? user.nik : (req.body && req.body.nik ? req.body.nik : null),
            role: user ? user.role : 'GUEST',
            action: action || `${req.method} ${req.originalUrl}`,
            module: moduleName || 'GENERAL',
            ip_address: typeof ip === 'string' ? ip.substring(0, 45) : '127.0.0.1',
            user_agent: userAgent.substring(0, 255),
            details: {
              path: req.originalUrl,
              method: req.method,
              statusCode: res.statusCode,
              params: req.params,
              query: req.query,
              body: req.method !== 'GET' ? sanitizeBody(req.body) : undefined
            }
          });
        } catch (err) {
          logger.error('Gagal mencatat audit log SPBE:', err);
        }
      });
    };

    next();
  };
};

// Sembunyikan field rahasia seperti password dari log
function sanitizeBody(body) {
  if (!body) return {};
  const sanitized = { ...body };
  if (sanitized.password) sanitized.password = '***REDACTED***';
  if (sanitized.confirm_password) sanitized.confirm_password = '***REDACTED***';
  return sanitized;
}

module.exports = { auditLogMiddleware };
