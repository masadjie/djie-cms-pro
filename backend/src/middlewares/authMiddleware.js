const jwt = require('jsonwebtoken');
const { User, OPD } = require('../models');

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Akses ditolak. Token otentikasi tidak ditemukan.'
      });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'super_secret_jwt_key_aceh_tamiang_spbe_2026');

    const user = await User.findByPk(decoded.id, {
      include: [{ model: OPD, as: 'opd' }]
    });

    if (!user || !user.is_active) {
      return res.status(401).json({
        success: false,
        message: 'Pengguna tidak valid atau akun dinonaktifkan.'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Token tidak valid atau telah kedaluwarsa.',
      error: error.message
    });
  }
};

const authorize = (...roles) => {
  const allowed = roles.flat();
  return (req, res, next) => {
    if (!req.user || !allowed.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Akses terlarang. Anda tidak memiliki hak akses untuk tindakan ini.'
      });
    }
    next();
  };
};

const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'super_secret_jwt_key_aceh_tamiang_spbe_2026');
      if (decoded && decoded.id) {
        const user = await User.findByPk(decoded.id, {
          include: [{ model: OPD, as: 'opd' }]
        });
        if (user && user.is_active) {
          req.user = user;
        }
      }
    }
  } catch (error) {
    // Ignore invalid/expired token for optional auth
  }
  next();
};

module.exports = {
  authenticate,
  authorize,
  optionalAuth,
  verifyToken: authenticate,
  requireRole: (roles) => authorize(roles)
};
