const express = require('express');
const { OPD, KategoriLayanan, Layanan, Permohonan, User, AuditLog, Berita, Agenda, VisitorLog } = require('../models');
const { verifyToken, requireRole } = require('../middlewares/authMiddleware');
const { getOrSetCache } = require('../config/redis');
const { Op } = require('sequelize');
const router = express.Router();

// 1. Ambil List Master OPD (Public + Cached)
router.get('/opd', async (req, res) => {
  try {
    const data = await getOrSetCache('master:opd:list', async () => {
      return await OPD.findAll({
        where: { is_active: true },
        order: [['nama_opd', 'ASC']]
      });
    }, 1800);
    return res.status(200).json({ success: true, data });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// 2. Ambil List Master Kategori Layanan (Public + Cached)
router.get('/kategori', async (req, res) => {
  try {
    const data = await getOrSetCache('master:kategori:list', async () => {
      return await KategoriLayanan.findAll({
        where: { is_active: true },
        order: [['urutan', 'ASC']]
      });
    }, 1800);
    return res.status(200).json({ success: true, data });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// 3. Statistik Ringkasan Portal & Counter Pengunjung (Public Hero / Info Stats + Cached)
router.get('/stats', async (req, res) => {
  try {
    const { VisitorLog } = require('../models');
    const data = await getOrSetCache('master:portal:stats', async () => {
      const totalLayanan = await Layanan.count({ where: { status_layanan: 'AKTIF' } });
      const totalOPD = await OPD.count({ where: { is_active: true } });
      const totalBerita = await Berita.count({ where: { status: 'PUBLISHED' } });
      const totalPermohonan = await Permohonan.count();
      const permohonanSelesai = await Permohonan.count({ where: { status: 'SELESAI' } });

      // Visitor Stats Calculation
      let totalPengunjung = 0;
      let pengunjungHariIni = 0;
      let pengunjungBulanIni = 0;
      let pengunjungOnline = 0;

      if (VisitorLog) {
        const now = new Date();
        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0);
        const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);

        totalPengunjung = await VisitorLog.count();
        pengunjungHariIni = await VisitorLog.count({
          where: { created_at: { [Op.gte]: startOfToday } }
        });
        pengunjungBulanIni = await VisitorLog.count({
          where: { created_at: { [Op.gte]: startOfMonth } }
        });
        pengunjungOnline = await VisitorLog.count({
          distinct: true,
          col: 'ip_address',
          where: { created_at: { [Op.gte]: fiveMinutesAgo } }
        });
      }

      return {
        totalLayanan,
        totalOPD,
        totalBerita,
        totalPermohonan,
        permohonanSelesai,
        pengunjung: {
          total: totalPengunjung,
          hariIni: pengunjungHariIni,
          bulanIni: pengunjungBulanIni,
          online: Math.max(1, pengunjungOnline)
        }
      };
    }, 180);

    return res.status(200).json({ success: true, data });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// 4. Agenda Kegiatan BKPSDM (Public + Cached)
router.get('/agenda', async (req, res) => {
  try {
    const data = await getOrSetCache('master:agenda:list', async () => {
      let agendas = await Agenda.findAll({
        where: { is_active: true },
        order: [['start_time', 'ASC']],
        limit: 10
      });

      if (agendas.length === 0) {
        const { ensureDefaultData } = require('../utils/ensureSeedUsers');
        await ensureDefaultData();
        agendas = await Agenda.findAll({
          where: { is_active: true },
          order: [['start_time', 'ASC']],
          limit: 10
        });
      }

      return agendas;
    }, 60);
    return res.status(200).json({ success: true, data });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// 5. Audit Trail & Keamanan / WAF Log View (Khusus Super Admin)
router.get(
  '/audit-logs',
  verifyToken,
  requireRole(['SUPER_ADMIN']),
  async (req, res) => {
    try {
      const { page = 1, limit = 50, module: modFilter, excludeModule, action: actFilter, search } = req.query;
      const offset = (page - 1) * limit;

      const whereClause = {};

      if (modFilter && modFilter !== 'ALL') {
        whereClause.module = modFilter;
      } else if (excludeModule) {
        whereClause.module = { [Op.ne]: excludeModule };
      }

      if (actFilter) {
        whereClause.action = { [Op.like]: `%${actFilter}%` };
      }

      if (search) {
        whereClause[Op.or] = [
          { action: { [Op.like]: `%${search}%` } },
          { module: { [Op.like]: `%${search}%` } },
          { ip_address: { [Op.like]: `%${search}%` } },
          { user_agent: { [Op.like]: `%${search}%` } }
        ];
      }

      const { rows: logs, count: total } = await AuditLog.findAndCountAll({
        where: whereClause,
        include: [{ model: User, as: 'user', attributes: ['id', 'name', 'email', 'role'] }],
        order: [['created_at', 'DESC']],
        limit: parseInt(limit, 10),
        offset: parseInt(offset, 10)
      });

      // Quick security statistics
      const totalSecurityAlerts = await AuditLog.count({
        where: { module: 'SECURITY_ALERT' }
      });

      const recentThreats = await AuditLog.findAll({
        where: { module: 'SECURITY_ALERT' },
        order: [['created_at', 'DESC']],
        limit: 5
      });

      return res.status(200).json({
        success: true,
        data: logs,
        securitySummary: {
          totalSecurityAlerts,
          recentThreats
        },
        meta: { total, page: parseInt(page, 10), totalPages: Math.ceil(total / limit) }
      });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }
);

// 6. Docker & Container Security Log Inspector with Threat Alert Detection
const { exec } = require('child_process');
const http = require('http');

const fetchLogsFromDockerSocket = (containerName, lineCount) => {
  return new Promise((resolve, reject) => {
    const options = {
      socketPath: '/var/run/docker.sock',
      path: `/containers/${containerName}/logs?stdout=1&stderr=1&tail=${lineCount}&timestamps=1`,
      method: 'GET'
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.setEncoding('utf8');
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        // Docker multiplexed stream prepends 8 header bytes to each frame
        // Clean out any non-printable ASCII or control byte headers
        const cleaned = data.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');
        resolve(cleaned);
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    req.setTimeout(3500, () => {
      req.destroy(new Error('Docker socket request timeout'));
    });

    req.end();
  });
};

router.get(
  '/docker-logs',
  verifyToken,
  requireRole(['SUPER_ADMIN']),
  async (req, res) => {
    try {
      const { container = 'tamiang_frontend', lines = 50 } = req.query;
      const validContainers = ['tamiang_frontend', 'tamiang_backend', 'tamiang_mysql', 'tamiang_redis', 'tamiang_minio'];
      
      const targetContainer = validContainers.includes(container) ? container : 'tamiang_frontend';
      const lineCount = Math.min(Math.max(parseInt(lines, 10) || 50, 10), 200);

      let rawOutput = '';
      try {
        rawOutput = await fetchLogsFromDockerSocket(targetContainer, lineCount);
      } catch (sockErr) {
        // Fallback to exec('docker logs ...')
        rawOutput = await new Promise((resolve) => {
          exec(`docker logs ${targetContainer} --tail ${lineCount} 2>&1`, (error, stdout, stderr) => {
            resolve(stdout || stderr || '');
          });
        });
      }

      const rawLines = (rawOutput || '').split('\n').map(l => l.trim()).filter(Boolean);

      const suspiciousKeywords = [
        { pattern: /UNION(\s+ALL)?\s+SELECT/i, threat: 'SQL_INJECTION', level: 'HIGH' },
        { pattern: /<script|%3Cscript|javascript:/i, threat: 'XSS_INJECTION', level: 'HIGH' },
        { pattern: /\.\.[\/\\]|\.\.%2f/i, threat: 'PATH_TRAVERSAL', level: 'HIGH' },
        { pattern: /\b(etc\/passwd|wp-login|eval\(|base64_decode)/i, threat: 'EXPLOIT_SCANNER', level: 'CRITICAL' },
        { pattern: /" (?:403|404|400|500|502|504) \d+/i, threat: 'HTTP_ERROR', level: 'MEDIUM' },
        { pattern: /bot|crawler|scanner|nikto|sqlmap|nmap|curl/i, threat: 'BOT_PROBE', level: 'LOW' }
      ];

      let threatCount = 0;
      let criticalThreatCount = 0;

      const parsedLogs = rawLines.map((line, idx) => {
        let detectedThreat = null;
        for (const item of suspiciousKeywords) {
          if (item.pattern.test(line)) {
            detectedThreat = item;
            threatCount++;
            if (item.level === 'CRITICAL' || item.level === 'HIGH') {
              criticalThreatCount++;
            }
            break;
          }
        }

        // Extract IP if available (handles Nginx standard combined log format)
        const ipMatch = line.match(/^(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})/);
        const ip = ipMatch ? ipMatch[1] : null;

        // Extract HTTP method and status code if available
        const httpMatch = line.match(/"(GET|POST|PUT|DELETE|HEAD|OPTIONS|PATCH)\s+([^"]+)\s+HTTP\/[0-9.]+"\s+(\d{3})/i);

        return {
          id: `${idx}-${Date.now()}`,
          raw: line,
          ip,
          method: httpMatch ? httpMatch[1] : null,
          path: httpMatch ? httpMatch[2] : null,
          statusCode: httpMatch ? parseInt(httpMatch[3], 10) : null,
          threat: detectedThreat ? detectedThreat.threat : null,
          level: detectedThreat ? detectedThreat.level : 'NORMAL',
          isSuspicious: !!detectedThreat
        };
      }).reverse(); // Show latest logs on top

      return res.status(200).json({
        success: true,
        container: targetContainer,
        totalLines: parsedLogs.length,
        threatCount,
        criticalThreatCount,
        threatAlertLevel: criticalThreatCount > 0 ? 'CRITICAL' : (threatCount > 5 ? 'HIGH' : (threatCount > 0 ? 'WARNING' : 'SECURE')),
        data: parsedLogs
      });
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  }
);

module.exports = router;
