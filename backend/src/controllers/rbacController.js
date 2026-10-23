const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');
const { User, OPD, AuditLog } = require('../models');
const logger = require('../config/logger');

// Role Definitions & Permissions Matrix
const ROLES_METADATA = [
  {
    role: 'SUPER_ADMIN',
    name: 'Super Administrator',
    description: 'Akses penuh tanpa batas ke seluruh konfigurasi sistem, database, manajemen user/RBAC, audit trail, dan CMS.',
    badgeColor: 'bg-rose-50 text-rose-700 border-rose-200',
    icon: 'ShieldAlert',
    permissions: [
      { module: 'User & RBAC', access: 'Full Control (CRUD User, Role, Password)' },
      { module: 'CMS & Halaman', access: 'Full Control' },
      { module: 'Berita & Kategori', access: 'Full Control' },
      { module: 'File & MinIO S3', access: 'Full Control' },
      { module: 'Katalog Layanan', access: 'Full Control' },
      { module: 'Audit Trail', access: 'Lihat Semua Log' },
      { module: 'Sistem & Backup', access: 'Maintenance & Redis/DB Reset' }
    ]
  },
  {
    role: 'EDITOR',
    name: 'Redaktur & Editor Konten',
    description: 'Mengelola publikasi berita, kategori, halaman statis, banner slider, galeri media, dan manajemen lampiran berkas.',
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    icon: 'Edit3',
    permissions: [
      { module: 'User & RBAC', access: 'Tidak Ada Akses' },
      { module: 'CMS & Halaman', access: 'Create, Edit, Publish' },
      { module: 'Berita & Kategori', access: 'Full Control' },
      { module: 'File & MinIO S3', access: 'Upload, Kelola Berkas' },
      { module: 'Katalog Layanan', access: 'Hanya Lihat' },
      { module: 'Audit Trail', access: 'Tidak Ada Akses' },
      { module: 'Sistem & Backup', access: 'Tidak Ada Akses' }
    ]
  },
  {
    role: 'ADMIN_OPD',
    name: 'Administrator Unit / OPD',
    description: 'Mengelola katalog layanan unit kerja, persyaratan dokumen, dan memproses pengajuan berkas ASN/warga.',
    badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
    icon: 'Building2',
    permissions: [
      { module: 'User & RBAC', access: 'Tidak Ada Akses' },
      { module: 'CMS & Halaman', access: 'Tidak Ada Akses' },
      { module: 'Berita & Kategori', access: 'Tidak Ada Akses' },
      { module: 'File & MinIO S3', access: 'Upload Berkas Layanan' },
      { module: 'Katalog Layanan', access: 'Kelola Layanan Unit Sendiri' },
      { module: 'Audit Trail', access: 'Tidak Ada Akses' },
      { module: 'Sistem & Backup', access: 'Tidak Ada Akses' }
    ]
  },
  {
    role: 'VERIFIKATOR',
    name: 'Petugas Verifikator Berkas',
    description: 'Memeriksa keabsahan syarat administrasi permohonan kepegawaian, memberikan status persetujuan atau revisi.',
    badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
    icon: 'CheckCircle2',
    permissions: [
      { module: 'User & RBAC', access: 'Tidak Ada Akses' },
      { module: 'CMS & Halaman', access: 'Tidak Ada Akses' },
      { module: 'Berita & Kategori', access: 'Tidak Ada Akses' },
      { module: 'File & MinIO S3', access: 'Hanya Unduh Berkas Pemohon' },
      { module: 'Katalog Layanan', access: 'Verifikasi Permohonan Masuk' },
      { module: 'Audit Trail', access: 'Tidak Ada Akses' },
      { module: 'Sistem & Backup', access: 'Tidak Ada Akses' }
    ]
  },
  {
    role: 'WARGA',
    name: 'Pengguna Publik / ASN',
    description: 'Pemohon layanan publik dan kepegawaian, mengajukan berkas secara online, dan memantau progres permohonan.',
    badgeColor: 'bg-slate-50 text-slate-700 border-slate-200',
    icon: 'User',
    permissions: [
      { module: 'Portal Publik', access: 'Akses Penuh Portal & Berita' },
      { module: 'Pengajuan Layanan', access: 'Kirim Permohonan & Upload Syarat' },
      { module: 'Tracking Status', access: 'Lihat Status Berkas Sendiri' }
    ]
  }
];

/**
 * 1. Get List of Users with Filter & Pagination
 */
const getUsersList = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', role = '', is_active = '', opd_id = '' } = req.query;
    const offset = (parseInt(page, 10) - 1) * parseInt(limit, 10);

    const whereClause = {};

    if (search) {
      whereClause[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } },
        { nik: { [Op.like]: `%${search}%` } },
        { phone: { [Op.like]: `%${search}%` } }
      ];
    }

    if (role) {
      whereClause.role = role;
    }

    if (is_active !== '') {
      whereClause.is_active = is_active === 'true' || is_active === '1' || is_active === true;
    }

    if (opd_id) {
      whereClause.opd_id = opd_id;
    }

    const { count: total, rows: users } = await User.findAndCountAll({
      where: whereClause,
      attributes: { exclude: ['password'] },
      include: [
        { model: OPD, as: 'opd', attributes: ['id', 'nama_opd', 'kode_opd'] }
      ],
      order: [['created_at', 'DESC']],
      limit: parseInt(limit, 10),
      offset: parseInt(offset, 10)
    });

    return res.status(200).json({
      success: true,
      data: users,
      meta: {
        total,
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        totalPages: Math.ceil(total / parseInt(limit, 10))
      }
    });
  } catch (error) {
    logger.error(`Error getUsersList: ${error.message}`);
    return res.status(500).json({ success: false, message: 'Gagal memuat daftar pengguna' });
  }
};

/**
 * 2. Get User Detail by ID
 */
const getUserDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id, {
      attributes: { exclude: ['password'] },
      include: [
        { model: OPD, as: 'opd', attributes: ['id', 'nama_opd', 'kode_opd'] }
      ]
    });

    if (!user) {
      return res.status(404).json({ success: false, message: 'Pengguna tidak ditemukan' });
    }

    // Ambil audit log user
    const recentLogs = await AuditLog.findAll({
      where: { user_id: id },
      limit: 10,
      order: [['created_at', 'DESC']]
    });

    return res.status(200).json({
      success: true,
      data: {
        ...user.toJSON(),
        recent_activity: recentLogs
      }
    });
  } catch (error) {
    logger.error(`Error getUserDetail: ${error.message}`);
    return res.status(500).json({ success: false, message: 'Gagal memuat detail pengguna' });
  }
};

/**
 * 3. Create New User
 */
const createUser = async (req, res) => {
  try {
    const { name, email, nik, phone, password, role, opd_id, is_active } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ success: false, message: 'Nama, email, password, dan role wajib diisi.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password minimal 6 karakter.' });
    }

    // Check duplicate email
    const existingEmail = await User.findOne({ where: { email } });
    if (existingEmail) {
      return res.status(400).json({ success: false, message: 'Email sudah digunakan oleh pengguna lain.' });
    }

    // Check duplicate NIK if provided
    if (nik) {
      const existingNik = await User.findOne({ where: { nik } });
      if (existingNik) {
        return res.status(400).json({ success: false, message: 'NIK sudah terdaftar dalam sistem.' });
      }
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      name,
      email,
      nik: nik || null,
      phone: phone || null,
      password: hashedPassword,
      role,
      opd_id: opd_id || null,
      is_active: is_active !== undefined ? !!is_active : true
    });

    // Audit log
    await AuditLog.create({
      user_id: req.user?.id || null,
      action: 'CREATE_USER',
      module: 'RBAC_MANAGEMENT',
      description: `Menambahkan pengguna baru '${name}' dengan hak akses '${role}'.`,
      ip_address: req.ip || '127.0.0.1'
    });

    const userClean = await User.findByPk(newUser.id, {
      attributes: { exclude: ['password'] },
      include: [{ model: OPD, as: 'opd' }]
    });

    return res.status(201).json({
      success: true,
      message: 'Pengguna baru berhasil ditambahkan.',
      data: userClean
    });
  } catch (error) {
    logger.error(`Error createUser: ${error.message}`);
    return res.status(500).json({ success: false, message: error.message || 'Gagal menambahkan pengguna' });
  }
};

/**
 * 4. Update Existing User
 */
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, nik, phone, password, role, opd_id, is_active } = req.body;

    const targetUser = await User.findByPk(id);
    if (!targetUser) {
      return res.status(404).json({ success: false, message: 'Pengguna tidak ditemukan' });
    }

    // Proteksi: jangan sampai Super Admin menonaktifkan dirinya sendiri
    if (req.user?.id === id && is_active === false) {
      return res.status(400).json({ success: false, message: 'Anda tidak dapat menonaktifkan akun Anda sendiri.' });
    }

    // Proteksi: jangan sampai Super Admin mengubah role dirinya sendiri menjadi non-admin
    if (req.user?.id === id && role && role !== 'SUPER_ADMIN') {
      return res.status(400).json({ success: false, message: 'Anda tidak dapat menurunkan hak akses akun Anda sendiri.' });
    }

    // Check duplicate email
    if (email && email !== targetUser.email) {
      const existingEmail = await User.findOne({ where: { email, id: { [Op.ne]: id } } });
      if (existingEmail) {
        return res.status(400).json({ success: false, message: 'Email sudah digunakan oleh pengguna lain.' });
      }
    }

    // Check duplicate NIK
    if (nik && nik !== targetUser.nik) {
      const existingNik = await User.findOne({ where: { nik, id: { [Op.ne]: id } } });
      if (existingNik) {
        return res.status(400).json({ success: false, message: 'NIK sudah terdaftar dalam sistem.' });
      }
    }

    // Prepare update data
    const updateData = {
      name: name !== undefined ? name : targetUser.name,
      email: email !== undefined ? email : targetUser.email,
      nik: nik !== undefined ? (nik || null) : targetUser.nik,
      phone: phone !== undefined ? (phone || null) : targetUser.phone,
      role: role !== undefined ? role : targetUser.role,
      opd_id: opd_id !== undefined ? (opd_id || null) : targetUser.opd_id,
      is_active: is_active !== undefined ? !!is_active : targetUser.is_active
    };

    if (password && password.trim() !== '') {
      if (password.length < 6) {
        return res.status(400).json({ success: false, message: 'Password minimal 6 karakter.' });
      }
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(password, salt);
    }

    await targetUser.update(updateData);

    // Audit log
    await AuditLog.create({
      user_id: req.user?.id || null,
      action: 'UPDATE_USER',
      module: 'RBAC_MANAGEMENT',
      description: `Memperbarui data pengguna '${targetUser.name}' (${targetUser.email}).`,
      ip_address: req.ip || '127.0.0.1'
    });

    const userClean = await User.findByPk(targetUser.id, {
      attributes: { exclude: ['password'] },
      include: [{ model: OPD, as: 'opd' }]
    });

    return res.status(200).json({
      success: true,
      message: 'Data pengguna berhasil diperbarui.',
      data: userClean
    });
  } catch (error) {
    logger.error(`Error updateUser: ${error.message}`);
    return res.status(500).json({ success: false, message: error.message || 'Gagal memperbarui pengguna' });
  }
};

/**
 * 5. Delete User
 */
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (req.user?.id === id) {
      return res.status(400).json({ success: false, message: 'Anda tidak dapat menghapus akun Anda yang sedang aktif.' });
    }

    const targetUser = await User.findByPk(id);
    if (!targetUser) {
      return res.status(404).json({ success: false, message: 'Pengguna tidak ditemukan' });
    }

    // Cek jika user adalah satu-satunya SUPER_ADMIN
    if (targetUser.role === 'SUPER_ADMIN') {
      const superAdminCount = await User.count({ where: { role: 'SUPER_ADMIN' } });
      if (superAdminCount <= 1) {
        return res.status(400).json({
          success: false,
          message: 'Tidak dapat menghapus Super Admin terakhir pada sistem.'
        });
      }
    }

    const userName = targetUser.name;
    const userEmail = targetUser.email;

    await targetUser.destroy();

    // Audit log
    await AuditLog.create({
      user_id: req.user?.id || null,
      action: 'DELETE_USER',
      module: 'RBAC_MANAGEMENT',
      description: `Menghapus akun pengguna '${userName}' (${userEmail}).`,
      ip_address: req.ip || '127.0.0.1'
    });

    return res.status(200).json({
      success: true,
      message: `Pengguna '${userName}' berhasil dihapus.`
    });
  } catch (error) {
    logger.error(`Error deleteUser: ${error.message}`);
    return res.status(500).json({ success: false, message: 'Gagal menghapus pengguna' });
  }
};

/**
 * 6. Quick Toggle Status (Aktif / Non-aktif)
 */
const toggleUserStatus = async (req, res) => {
  try {
    const { id } = req.params;

    if (req.user?.id === id) {
      return res.status(400).json({ success: false, message: 'Anda tidak dapat menonaktifkan akun sendiri.' });
    }

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'Pengguna tidak ditemukan' });
    }

    user.is_active = !user.is_active;
    await user.save();

    return res.status(200).json({
      success: true,
      message: `Status akun '${user.name}' berhasil diubah menjadi ${user.is_active ? 'Aktif' : 'Non-aktif'}.`,
      data: { is_active: user.is_active }
    });
  } catch (error) {
    logger.error(`Error toggleUserStatus: ${error.message}`);
    return res.status(500).json({ success: false, message: 'Gagal mengubah status pengguna' });
  }
};

/**
 * 7. Reset User Password
 */
const resetUserPassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { new_password } = req.body;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'Pengguna tidak ditemukan' });
    }

    const passwordToSet = new_password || 'Tamiang2026!';
    if (passwordToSet.length < 6) {
      return res.status(400).json({ success: false, message: 'Password minimal 6 karakter.' });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(passwordToSet, salt);
    await user.save();

    await AuditLog.create({
      user_id: req.user?.id || null,
      action: 'RESET_PASSWORD_USER',
      module: 'RBAC_MANAGEMENT',
      description: `Mereset password untuk akun pengguna '${user.name}' (${user.email}).`,
      ip_address: req.ip || '127.0.0.1'
    });

    return res.status(200).json({
      success: true,
      message: `Password pengguna '${user.name}' berhasil direset.`,
      temp_password: new_password ? undefined : passwordToSet
    });
  } catch (error) {
    logger.error(`Error resetUserPassword: ${error.message}`);
    return res.status(500).json({ success: false, message: 'Gagal mereset password pengguna' });
  }
};

/**
 * 8. Get Role Matrix & Permissions Metadata
 */
const getRolesMatrix = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      data: ROLES_METADATA
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Gagal memuat matriks role' });
  }
};

/**
 * 9. Get RBAC Summary Statistics
 */
const getRbacStats = async (req, res) => {
  try {
    const totalUsers = await User.count();
    const activeUsers = await User.count({ where: { is_active: true } });
    const inactiveUsers = await User.count({ where: { is_active: false } });

    const superAdmins = await User.count({ where: { role: 'SUPER_ADMIN' } });
    const editors = await User.count({ where: { role: 'EDITOR' } });
    const adminOpd = await User.count({ where: { role: 'ADMIN_OPD' } });
    const verifikators = await User.count({ where: { role: 'VERIFIKATOR' } });
    const warga = await User.count({ where: { role: 'WARGA' } });

    return res.status(200).json({
      success: true,
      data: {
        totalUsers,
        activeUsers,
        inactiveUsers,
        byRole: {
          SUPER_ADMIN: superAdmins,
          EDITOR: editors,
          ADMIN_OPD: adminOpd,
          VERIFIKATOR: verifikators,
          WARGA: warga
        }
      }
    });
  } catch (error) {
    logger.error(`Error getRbacStats: ${error.message}`);
    return res.status(500).json({ success: false, message: 'Gagal memuat statistik RBAC' });
  }
};

module.exports = {
  getUsersList,
  getUserDetail,
  createUser,
  updateUser,
  deleteUser,
  toggleUserStatus,
  resetUserPassword,
  getRolesMatrix,
  getRbacStats
};
