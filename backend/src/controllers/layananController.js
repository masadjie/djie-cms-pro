const { Op } = require('sequelize');
const { Layanan, OPD, KategoriLayanan, SyaratLayanan } = require('../models');
const { getOrSetCache, deletePattern } = require('../config/redis');

// 1. Ambil Semua Layanan (Public Filter & Search + Redis Cache)
const getAllLayanan = async (req, res) => {
  try {
    const { search, opd_id, kategori_id, tipe, status, limit = 20, page = 1 } = req.query;
    const offset = (page - 1) * limit;

    const cacheKey = `layanan:list:p${page}:l${limit}:s${search || ''}:o${opd_id || ''}:k${kategori_id || ''}:t${tipe || ''}:st${status || ''}`;

    const result = await getOrSetCache(cacheKey, async () => {
      const whereClause = {};

      if (search) {
        whereClause[Op.or] = [
          { nama_layanan: { [Op.like]: `%${search}%` } },
          { deskripsi: { [Op.like]: `%${search}%` } },
          { kode_layanan: { [Op.like]: `%${search}%` } }
        ];
      }

      if (opd_id) whereClause.opd_id = opd_id;
      if (kategori_id) whereClause.kategori_id = kategori_id;
      if (tipe) whereClause.tipe_layanan = tipe;
      if (status) {
        whereClause.status_layanan = status;
      } else {
        whereClause.status_layanan = 'AKTIF';
      }

      const { rows: data, count: total } = await Layanan.findAndCountAll({
        where: whereClause,
        include: [
          { model: OPD, as: 'opd', attributes: ['id', 'kode_opd', 'nama_opd', 'singkatan', 'logo_url'] },
          { model: KategoriLayanan, as: 'kategori', attributes: ['id', 'nama_kategori', 'slug', 'ikon'] }
        ],
        order: [['is_populer', 'DESC'], ['total_dilihat', 'DESC'], ['created_at', 'DESC']],
        limit: parseInt(limit, 10),
        offset: parseInt(offset, 10)
      });

      return {
        data,
        meta: {
          total,
          page: parseInt(page, 10),
          totalPages: Math.ceil(total / limit)
        }
      };
    }, 300);

    return res.status(200).json({
      success: true,
      ...result
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Gagal memuat katalog layanan.',
      error: error.message
    });
  }
};

// 2. Ambil Detail Layanan beserta Syarat Berkas
const getLayananDetail = async (req, res) => {
  try {
    const { slugOrId } = req.params;

    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slugOrId);
    const where = isUUID ? { id: slugOrId } : { slug: slugOrId };

    const cacheKey = `layanan:detail:${slugOrId}`;
    const layanan = await getOrSetCache(cacheKey, async () => {
      return await Layanan.findOne({
        where,
        include: [
          { model: OPD, as: 'opd' },
          { model: KategoriLayanan, as: 'kategori' },
          { model: SyaratLayanan, as: 'syarat_dokumen', order: [['urutan', 'ASC']] }
        ]
      });
    }, 600);

    if (!layanan) {
      return res.status(404).json({
        success: false,
        message: 'Layanan tidak ditemukan.'
      });
    }

    // Increment counter total dilihat
    Layanan.increment('total_dilihat', { where: { id: layanan.id } }).catch(() => {});

    return res.status(200).json({
      success: true,
      data: layanan
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Gagal mengambil detail layanan.',
      error: error.message
    });
  }
};

// 3. Tambah Layanan Baru (Admin / Admin OPD)
const createLayanan = async (req, res) => {
  try {
    const payload = req.body;
    const slug = `${payload.nama_layanan.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now().toString().slice(-4)}`;
    
    if (req.user.role === 'ADMIN_OPD' && req.user.opd_id !== payload.opd_id) {
      return res.status(403).json({
        success: false,
        message: 'Anda hanya diizinkan membuat layanan untuk OPD Anda sendiri.'
      });
    }

    const created = await Layanan.create({
      ...payload,
      slug
    });

    if (payload.syarat_dokumen && payload.syarat_dokumen.length > 0) {
      const syaratData = payload.syarat_dokumen.map((s, index) => ({
        ...s,
        layanan_id: created.id,
        urutan: s.urutan || index + 1
      }));
      await SyaratLayanan.bulkCreate(syaratData);
    }

    await deletePattern('layanan:*');
    await deletePattern('seo:*');

    const result = await Layanan.findByPk(created.id, {
      include: [
        { model: OPD, as: 'opd' },
        { model: KategoriLayanan, as: 'kategori' },
        { model: SyaratLayanan, as: 'syarat_dokumen' }
      ]
    });

    return res.status(201).json({
      success: true,
      message: 'Layanan publik berhasil ditambahkan ke katalog.',
      data: result
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Gagal membuat layanan baru.',
      error: error.message
    });
  }
};

// 4. Update Data Layanan
const updateLayanan = async (req, res) => {
  try {
    const { id } = req.params;
    const layanan = await Layanan.findByPk(id);

    if (!layanan) {
      return res.status(404).json({ success: false, message: 'Layanan tidak ditemukan.' });
    }

    if (req.user.role === 'ADMIN_OPD' && req.user.opd_id !== layanan.opd_id) {
      return res.status(403).json({ success: false, message: 'Akses ditolak ke OPD lain.' });
    }

    await layanan.update(req.body);
    await deletePattern('layanan:*');
    await deletePattern('seo:*');

    return res.status(200).json({
      success: true,
      message: 'Data layanan berhasil diperbarui.',
      data: layanan
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Gagal memperbarui layanan.',
      error: error.message
    });
  }
};

module.exports = {
  getAllLayanan,
  getLayananDetail,
  createLayanan,
  updateLayanan
};
