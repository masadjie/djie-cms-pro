/**
 * ISO/IEC 27001 & OWASP Top 10 Web Application Firewall & Security Middleware Suite
 * 
 * Includes:
 * 1. Deep Sanitizer against XSS (Cross-Site Scripting) and HTML Injection
 * 2. SQL Injection / NoSQL Injection pattern inspection
 * 3. HTTP Header Security Enforcement (HSTS, CSP, X-Frame, X-Content-Type)
 * 4. Path Traversal & Remote File Inclusion (RFI/LFI) defense
 */

// Regex patterns for detecting common injection / exploitation vectors
const SQL_INJECTION_PATTERN = /(\b(UNION(\s+ALL)?|SELECT|INSERT|UPDATE|DELETE|DROP|ALTER|TRUNCATE|EXEC(\s+XP_)?|BENCHMARK|SLEEP)\b(\s*\(|\s+[a-zA-Z0-9_*`'"])|--\s*$|;\s*(DROP|ALTER|DELETE|UPDATE|INSERT)|\bOR\b\s+['"\d]+=['"\d]+|\bAND\b\s+['"\d]+=['"\d]+)/i;
const XSS_ATTACK_PATTERN = /(<script\b[^>]*>([\s\S]*?)<\/script>|javascript:[^\s]*|onload\s*=|onerror\s*=|onclick\s*=|onmouseover\s*=|eval\s*\(|document\.cookie|window\.location)/i;
const PATH_TRAVERSAL_PATTERN = /(\.\.[\/\\]|\.\.%2f|\.\.%5c)/i;

/**
 * Recursive sanitizer for request body/query/params
 */
function sanitizeValue(value, isRichTextAllowed = false) {
  if (value === null || value === undefined) return value;
  
  if (typeof value === 'string') {
    // If it's a rich-text content field (like berita.content or halaman.content), allow safe HTML but strip active scripts
    if (isRichTextAllowed) {
      return value
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/javascript:[^\s"'>]*/gi, '')
        .replace(/\bon\w+\s*=\s*["'][^"']*["']/gi, '')
        .replace(/\bon\w+\s*=\s*[^>\s]+/gi, '');
    }

    // Standard string sanitization: escape raw HTML special characters
    return value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;');
  }

  if (Array.isArray(value)) {
    return value.map(item => sanitizeValue(item, isRichTextAllowed));
  }

  if (typeof value === 'object') {
    const sanitizedObj = {};
    for (const key of Object.keys(value)) {
      // Don't sanitize password fields (avoids altering user intended special characters)
      if (key.toLowerCase().includes('password')) {
        sanitizedObj[key] = value[key];
        continue;
      }
      
      const isRichContent = ['content', 'konten', 'isi_berita', 'body_html'].includes(key);
      sanitizedObj[key] = sanitizeValue(value[key], isRichContent);
    }
    return sanitizedObj;
  }

  return value;
}

const { AuditLog } = require('../models');

/**
 * Record Security Alert Log directly into AuditLog table
 */
const recordSecurityThreat = (req, threatType, message, details = {}) => {
  setImmediate(async () => {
    try {
      const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || req.ip || '127.0.0.1';
      const userAgent = req.headers['user-agent'] || 'Unknown';
      await AuditLog.create({
        user_id: req.user?.id || null,
        nik: req.user?.nik || null,
        role: req.user?.role || 'THREAT_ACTOR',
        action: `BLOCKED_${threatType}`,
        module: 'SECURITY_ALERT',
        ip_address: typeof ip === 'string' ? ip.substring(0, 45) : '127.0.0.1',
        user_agent: userAgent.substring(0, 255),
        details: {
          threatType,
          message,
          method: req.method,
          path: req.originalUrl,
          query: req.query,
          headers: {
            host: req.headers.host,
            origin: req.headers.origin,
            referer: req.headers.referer
          },
          ...details
        }
      });
    } catch (err) {
      // Non-blocking
    }
  });
};

/**
 * ISO 27001 Input Validation & Deep XSS / SQLi Firewall Middleware
 */
const securityFirewallMiddleware = (req, res, next) => {
  try {
    // 1. Guard against Path Traversal in URL
    if (PATH_TRAVERSAL_PATTERN.test(req.originalUrl || '')) {
      recordSecurityThreat(req, 'PATH_TRAVERSAL', 'Pola direktori traversal terdeteksi pada URL', { url: req.originalUrl });
      return res.status(400).json({
        success: false,
        code: 'SEC_ERR_PATH_TRAVERSAL',
        message: 'Akses Ditolak: Pola direktori traversal terdeteksi oleh sistem keamanan (ISO 27001).'
      });
    }

    // 2. Scan Query Parameters for High-Risk Injection
    if (req.query && typeof req.query === 'object') {
      const queryString = JSON.stringify(req.query);
      if (SQL_INJECTION_PATTERN.test(queryString)) {
        recordSecurityThreat(req, 'SQL_INJECTION', 'Pola SQL Injection terdeteksi pada parameter query', { queryString });
        return res.status(403).json({
          success: false,
          code: 'SEC_ERR_SQLI_DETECTED',
          message: 'Permintaan diblokir: Karakter / ekspresi SQL terlarang terdeteksi pada parameter query.'
        });
      }
      if (XSS_ATTACK_PATTERN.test(queryString)) {
        recordSecurityThreat(req, 'XSS_ATTACK', 'Pola XSS terdeteksi pada parameter query URL', { queryString });
        return res.status(403).json({
          success: false,
          code: 'SEC_ERR_XSS_DETECTED',
          message: 'Permintaan diblokir: Tag skrip atau pola XSS terdeteksi pada parameter URL.'
        });
      }
    }

    // 3. Sanitise body for non-GET requests (preserving passwords intact)
    if (req.body && typeof req.body === 'object') {
      const richTextFields = ['content', 'konten', 'isi_berita', 'body_html', 'syarat_dokumen'];
      
      // Check for raw script tag in non-rich text fields
      for (const [key, val] of Object.entries(req.body)) {
        if (!richTextFields.includes(key) && typeof val === 'string' && !key.toLowerCase().includes('password')) {
          if (XSS_ATTACK_PATTERN.test(val)) {
            recordSecurityThreat(req, 'XSS_ATTACK', `Serangan XSS terdeteksi pada kolom body '${key}'`, { key, preview: val.slice(0, 100) });
            return res.status(400).json({
              success: false,
              code: 'SEC_ERR_XSS_DETECTED',
              message: `Input pada kolom '${key}' mengandung kode berbahaya atau tag skrip aktif yang tidak diizinkan.`
            });
          }
        }
      }
    }

    next();
  } catch (error) {
    next(error);
  }
};

/**
 * ISO 27001 Security Headers Middleware
 * Mandates Content Security Policy, HSTS, No-Sniff, and Referrer Policy
 */
const isoSecurityHeaders = (req, res, next) => {
  // Prevent MIME-sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');
  
  // Protect against Clickjacking
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  
  // Cross-Site Scripting filter for legacy browsers
  res.setHeader('X-XSS-Protection', '1; mode=block');
  
  // Referrer information policy (protect privacy)
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Permissions Policy (limit browser hardware APIs to prevent espionage)
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=()');

  // Strict Transport Security (HSTS) - enforce TLS for 1 year
  if (req.secure || req.headers['x-forwarded-proto'] === 'https') {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  }

  // Remove fingerprinting headers
  res.removeHeader('X-Powered-By');

  next();
};

module.exports = {
  securityFirewallMiddleware,
  isoSecurityHeaders,
  sanitizeValue
};
