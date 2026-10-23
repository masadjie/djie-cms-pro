const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
const { User, OPD } = require('../models');

const generateToken = (user) => {
  // ISO 27001 Security Best Practice:
  // Admin / OPD session expires in 2 hours for security compliance.
  // Citizen (WARGA) session can stay longer (24 hours).
  const isAdminOrOpd = ['SUPER_ADMIN', 'EDITOR', 'VERIFIKATOR', 'ADMIN_OPD'].includes(user.role);
  const expiresIn = process.env.JWT_EXPIRES_IN || (isAdminOrOpd ? '2h' : '24h');

  return jwt.sign(
    {
      id: user.id,
      nik: user.nik,
      email: user.email,
      role: user.role,
      opd_id: user.opd_id
    },
    process.env.JWT_SECRET || 'super_secret_jwt_key_aceh_tamiang_spbe_2026',
    { expiresIn }
  );
};

const registerWarga = async (req, res) => {
  try {
    const { nik, name, email, phone, password } = req.body;

    // Cek apakah NIK atau Email sudah terdaftar
    const existing = await User.findOne({
      where: {
        [Op.or]: [{ nik }, { email }]
      }
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: existing.nik === nik ? 'NIK sudah terdaftar dalam sistem.' : 'Email sudah digunakan.'
      });
    }

    const user = await User.create({
      nik,
      name,
      email,
      phone,
      password,
      role: 'WARGA'
    });

    const token = generateToken(user);

    return res.status(201).json({
      success: true,
      message: 'Registrasi akun warga berhasil.',
      data: {
        token,
        user: {
          id: user.id,
          nik: user.nik,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role
        }
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Gagal melakukan registrasi.',
      error: error.message
    });
  }
};

const login = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    const user = await User.findOne({
      where: {
        [Op.or]: [{ email: identifier }, { nik: identifier }]
      },
      include: [{ model: OPD, as: 'opd' }]
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'NIK / Email atau Password salah.'
      });
    }

    // ISO 27001: Check account lock status
    if (user.locked_until && new Date() < new Date(user.locked_until)) {
      const remainingMinutes = Math.ceil((new Date(user.locked_until).getTime() - Date.now()) / (60 * 1000));
      return res.status(423).json({
        success: false,
        code: 'ACCOUNT_LOCKED',
        message: `Akun terkunci sementara demi keamanan karena 5x percobaan gagal (ISO 27001). Coba lagi dalam ${remainingMinutes} menit.`
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      // Increment failed attempts
      const attempts = (user.failed_login_attempts || 0) + 1;
      const updates = { failed_login_attempts: attempts };

      if (attempts >= 5) {
        // Lock for 15 minutes after 5 failed attempts
        updates.locked_until = new Date(Date.now() + 15 * 60 * 1000);
        updates.failed_login_attempts = 0;
      }
      await user.update(updates);

      return res.status(401).json({
        success: false,
        message: attempts >= 5
          ? 'Akun telah dikunci selama 15 menit karena 5 kali percobaan sandi salah (ISO 27001).'
          : `NIK / Email atau Password salah. (Sisa percobaan aman: ${5 - attempts})`
      });
    }

    if (!user.is_active) {
      return res.status(403).json({
        success: false,
        message: 'Akun Anda dinonaktifkan oleh Administrator.'
      });
    }

    // Success: Reset failed attempts & clear lock
    user.failed_login_attempts = 0;
    user.locked_until = null;
    user.last_login_at = new Date();
    await user.save();

    const token = generateToken(user);

    return res.status(200).json({
      success: true,
      message: 'Login berhasil.',
      data: {
        token,
        user: {
          id: user.id,
          nik: user.nik,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          opd: user.opd || null
        }
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat login.',
      error: error.message
    });
  }
};

const getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] },
      include: [{ model: OPD, as: 'opd' }]
    });

    return res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Gagal mengambil data profil.',
      error: error.message
    });
  }
};

const changePassword = async (req, res) => {
  try {
    const { current_password, new_password } = req.body;

    if (!current_password || !new_password) {
      return res.status(400).json({
        success: false,
        message: 'Kata sandi lama dan kata sandi baru wajib diisi.'
      });
    }

    if (new_password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Kata sandi baru minimal harus 6 karakter.'
      });
    }

    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Pengguna tidak ditemukan.'
      });
    }

    const isMatch = await user.comparePassword(current_password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Kata sandi lama yang Anda masukkan salah.'
      });
    }

    user.password = new_password;
    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Kata sandi berhasil diperbarui.'
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Gagal mengubah kata sandi.',
      error: error.message
    });
  }
};

module.exports = {
  registerWarga,
  login,
  getProfile,
  changePassword
};
