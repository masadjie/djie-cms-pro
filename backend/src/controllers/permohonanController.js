const { Op } = require('sequelize');
const { Permohonan, Layanan, OPD, User } = require('../models');

// Helper generator nomor tiket unik (format: TMG-YYYYMMDD-XXXX)
const generateTiket = () => {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `TMG-${dateStr}-${randomSuffix}`;
};

// 1. Buat Permohonan Layanan Baru (Warga)
const submitPermohonan = async (req, res) => {
  try {
    const { layanan_id, nik_pemohon, nama_pemohon, telepon_pemohon, alamat_pemohon, catatan_pemohon, data_berkas } = req.body;

    const layanan = await Layanan.findByPk(layanan_id);
    if (!layanan || layanan.status_layanan !== 'AKTIF') {
      return res.status(400).json({
        success: false,
        message: 'Layanan tidak tersedia atau sedang nonaktif.'
      });
    }

    const nomorTiket = generateTiket();

    const permohonan = await Permohonan.create({
      nomor_tiket: nomorTiket,
      user_id: req.user.id,
      layanan_id,
      nik_pemohon,
      nama_pemohon,
      telepon_pemohon,
      alamat_pemohon,
      catatan_pemohon,
      data_berkas: data_berkas || {},
      status: 'DIAJUKAN'
    });

    // Increment statistik diajukan
    layanan.increment('total_diajukan');

    return res.status(201).json({
      success: true,
      message: 'Permohonan layanan berhasil dikirim. Simpan nomor tiket untuk melacak status.',
      data: permohonan
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Gagal mengajukan permohonan layanan.',
      error: error.message
    });
  }
};

// 2. Tracking Permohonan Berdasarkan Nomor Tiket (Public Tracking)
const trackTiket = async (req, res) => {
  try {
    const { nomorTiket } = req.params;

    const permohonan = await Permohonan.findOne({
      where: { nomor_tiket: nomorTiket },
      include: [
        {
          model: Layanan,
          as: 'layanan',
          include: [{ model: OPD, as: 'opd', attributes: ['id', 'nama_opd', 'singkatan', 'telepon', 'email_resmi'] }]
        }
      ]
    });

    if (!permohonan) {
      return res.status(404).json({
        success: false,
        message: `Tiket dengan nomor ${nomorTiket} tidak ditemukan.`
      });
    }

    return res.status(200).json({
      success: true,
      data: permohonan
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Gagal melacak nomor tiket.',
      error: error.message
    });
  }
};

// 3. Riwayat Permohonan Milik User Warga yang Sedang Login
const getMyPermohonan = async (req, res) => {
  try {
    const list = await Permohonan.findAll({
      where: { user_id: req.user.id },
      include: [
        {
          model: Layanan,
          as: 'layanan',
          include: [{ model: OPD, as: 'opd', attributes: ['id', 'nama_opd', 'singkatan'] }]
        }
      ],
      order: [['created_at', 'DESC']]
    });

    return res.status(200).json({
      success: true,
      data: list
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Gagal memuat riwayat permohonan Anda.',
      error: error.message
    });
  }
};

// 4. Update Status Permohonan (Petugas OPD / Super Admin)
const updateStatusPermohonan = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, catatan_petugas, file_output_url } = req.body;

    const permohonan = await Permohonan.findByPk(id, {
      include: [{ model: Layanan, as: 'layanan' }]
    });

    if (!permohonan) {
      return res.status(404).json({ success: false, message: 'Data permohonan tidak ditemukan.' });
    }

    // Proteksi role OPD
    if (req.user.role === 'ADMIN_OPD' && req.user.opd_id !== permohonan.layanan.opd_id) {
      return res.status(403).json({
        success: false,
        message: 'Akses ditolak. Berkas ini milik OPD lain.'
      });
    }

    permohonan.status = status;
    if (catatan_petugas !== undefined) permohonan.catatan_petugas = catatan_petugas;
    if (file_output_url !== undefined) permohonan.file_output_url = file_output_url;
    permohonan.verified_by = req.user.id;
    permohonan.verified_at = new Date();

    if (status === 'SELESAI') {
      permohonan.completed_at = new Date();
    }

    await permohonan.save();

    return res.status(200).json({
      success: true,
      message: `Status permohonan berhasil diperbarui menjadi '${status}'.`,
      data: permohonan
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Gagal memperbarui status permohonan.',
      error: error.message
    });
  }
};

module.exports = {
  submitPermohonan,
  trackTiket,
  getMyPermohonan,
  updateStatusPermohonan
};
