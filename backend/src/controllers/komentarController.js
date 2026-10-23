const { KomentarBerita, Berita, User } = require('../models');
const { Op } = require('sequelize');

/**
 * Public: Get approved comments for a specific news article
 * GET /api/berita/:slug/komentar
 */
exports.getApprovedCommentsBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const berita = await Berita.findOne({
      where: { slug },
      attributes: ['id', 'title', 'slug']
    });

    if (!berita) {
      return res.status(404).json({
        success: false,
        message: 'Artikel berita tidak ditemukan'
      });
    }

    const comments = await KomentarBerita.findAll({
      where: {
        berita_id: berita.id,
        status: 'APPROVED',
        is_approved: true
      },
      attributes: [
        'id',
        'nama_pengirim',
        'instansi_pengirim',
        'isi_komentar',
        'created_at'
      ],
      order: [['created_at', 'DESC']]
    });

    return res.status(200).json({
      success: true,
      data: comments,
      total: comments.length
    });
  } catch (err) {
    console.error('Error fetching approved comments:', err);
    return res.status(500).json({
      success: false,
      message: 'Gagal mengambil komentar berita'
    });
  }
};

/**
 * Public: Submit a new comment (Status defaults to PENDING moderation)
 * POST /api/berita/:slug/komentar
 */
exports.submitComment = async (req, res) => {
  try {
    const { slug } = req.params;
    const { 
      nama_pengirim, 
      email_pengirim, 
      instansi_pengirim, 
      isi_komentar,
      website_hp, // Honeypot trap field (hidden from real users, only bots fill it)
      form_rendered_at // Timestamp when form was loaded (bots submit instantly in < 2s)
    } = req.body;

    // 1. ANTISPAM LAYER 1: Honeypot trap (jika field jebakan diisi, tolak diam-diam)
    if (website_hp && String(website_hp).trim().length > 0) {
      return res.status(200).json({
        success: true,
        message: 'Komentar Anda telah diterima.'
      });
    }

    // 2. ANTISPAM LAYER 2: Bot Speed Check (manusia normal butuh > 3 detik untuk mengetik komentar)
    if (form_rendered_at) {
      const elapsedMs = Date.now() - parseInt(form_rendered_at, 10);
      if (!isNaN(elapsedMs) && elapsedMs < 2500) {
        return res.status(429).json({
          success: false,
          message: 'Pengiriman terdeteksi terlalu cepat. Harap tuliskan tanggapan Anda secara wajar.'
        });
      }
    }

    if (!nama_pengirim || !email_pengirim || !isi_komentar) {
      return res.status(400).json({
        success: false,
        message: 'Nama, Email, dan Isi Komentar wajib diisi'
      });
    }

    const trimmedNama = String(nama_pengirim).trim();
    const trimmedEmail = String(email_pengirim).trim().toLowerCase();
    const trimmedIsi = String(isi_komentar).trim();

    // 3. ANTISPAM LAYER 3: Link & URL Spam Check (Komentar dengan lebih dari 2 link ditolak)
    const linkMatches = trimmedIsi.match(/https?:\/\/[^\s]+/gi) || [];
    if (linkMatches.length > 2) {
      return res.status(400).json({
        success: false,
        message: 'Komentar tidak boleh mengandung banyak tautan/link eksternal demi keamanan.'
      });
    }

    // 4. ANTISPAM LAYER 4: Deteksi Kata Kunci Judi / Obat / Phishing
    const spamKeywords = [
      'slot gacor', 'judi online', 'sbobet', 'poker online', 'viagra', 
      'togel', 'casino online', 'pragmatic play', 'deposit pulsa', 'situs gacor'
    ];
    const isSpamText = spamKeywords.some(kw => trimmedIsi.toLowerCase().includes(kw));
    if (isSpamText) {
      return res.status(400).json({
        success: false,
        message: 'Komentar Anda terdeteksi mengandung konten promosi atau tidak pantas.'
      });
    }

    if (trimmedNama.length < 2 || trimmedNama.length > 100) {
      return res.status(400).json({
        success: false,
        message: 'Nama pengirim harus antara 2 hingga 100 karakter'
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      return res.status(400).json({
        success: false,
        message: 'Format email tidak valid'
      });
    }

    if (trimmedIsi.length < 5 || trimmedIsi.length > 1500) {
      return res.status(400).json({
        success: false,
        message: 'Isi komentar harus antara 5 hingga 1500 karakter'
      });
    }

    const berita = await Berita.findOne({
      where: { slug },
      attributes: ['id', 'title', 'slug']
    });

    if (!berita) {
      return res.status(404).json({
        success: false,
        message: 'Artikel berita tidak ditemukan'
      });
    }

    // 5. ANTISPAM LAYER 5: Rate Limiting & Cooldown (Maks 1 komentar per 30 detik, maks 3 per 5 menit per IP)
    const clientIp = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket.remoteAddress || null;
    const thirtySecondsAgo = new Date(Date.now() - 30 * 1000);
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);

    const veryRecentCount = await KomentarBerita.count({
      where: {
        ip_address: clientIp,
        created_at: { [Op.gte]: thirtySecondsAgo }
      }
    });

    if (veryRecentCount >= 1) {
      return res.status(429).json({
        success: false,
        message: 'Harap tunggu jeda 30 detik sebelum mengirim komentar berikutnya.'
      });
    }

    const burstCount = await KomentarBerita.count({
      where: {
        ip_address: clientIp,
        created_at: { [Op.gte]: fiveMinutesAgo }
      }
    });

    if (burstCount >= 3) {
      return res.status(429).json({
        success: false,
        message: 'Batas pengiriman komentar tercapai (maksimal 3 per 5 menit). Harap coba lagi nanti.'
      });
    }

    // 6. ANTISPAM LAYER 6: Duplicate Message Detection (Cegah spam teks yang persis sama)
    const duplicateComment = await KomentarBerita.findOne({
      where: {
        berita_id: berita.id,
        isi_komentar: trimmedIsi,
        created_at: { [Op.gte]: new Date(Date.now() - 3600 * 1000) } // dalam 1 jam terakhir
      }
    });

    if (duplicateComment) {
      return res.status(400).json({
        success: false,
        message: 'Komentar dengan isi yang sama sudah pernah dikirimkan pada artikel ini.'
      });
    }

    const newComment = await KomentarBerita.create({
      berita_id: berita.id,
      nama_pengirim: trimmedNama,
      email_pengirim: trimmedEmail,
      instansi_pengirim: instansi_pengirim ? String(instansi_pengirim).trim() : null,
      isi_komentar: trimmedIsi,
      status: 'PENDING',
      is_approved: false,
      ip_address: clientIp,
      user_agent: req.headers['user-agent'] || null
    });

    return res.status(201).json({
      success: true,
      message: 'Komentar Anda berhasil dikirim dan akan tayang setelah disetujui oleh moderator BKPSDM.',
      data: {
        id: newComment.id,
        status: newComment.status
      }
    });
  } catch (err) {
    console.error('Error submitting comment:', err);
    return res.status(500).json({
      success: false,
      message: 'Gagal mengirim komentar'
    });
  }
};

/**
 * Admin: Get all comments (with filter by status, search, pagination)
 * GET /api/berita/admin/komentar
 */
exports.getAdminCommentsList = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      status, 
      search, 
      berita_id 
    } = req.query;

    const offset = (parseInt(page) - 1) * parseInt(limit);
    const where = {};

    if (status && ['PENDING', 'APPROVED', 'REJECTED'].includes(status)) {
      where.status = status;
    }

    if (berita_id) {
      where.berita_id = berita_id;
    }

    if (search) {
      where[Op.or] = [
        { nama_pengirim: { [Op.like]: `%${search}%` } },
        { email_pengirim: { [Op.like]: `%${search}%` } },
        { isi_komentar: { [Op.like]: `%${search}%` } },
        { instansi_pengirim: { [Op.like]: `%${search}%` } }
      ];
    }

    const { count, rows } = await KomentarBerita.findAndCountAll({
      where,
      include: [
        {
          model: Berita,
          as: 'berita',
          attributes: ['id', 'title', 'slug', 'cover_image']
        },
        {
          model: User,
          as: 'moderator',
          attributes: ['id', 'name', 'email']
        }
      ],
      order: [
        ['created_at', 'DESC']
      ],
      limit: parseInt(limit),
      offset
    });

    // Counts for tab badges
    const pendingCount = await KomentarBerita.count({ where: { status: 'PENDING' } });
    const approvedCount = await KomentarBerita.count({ where: { status: 'APPROVED' } });
    const rejectedCount = await KomentarBerita.count({ where: { status: 'REJECTED' } });

    return res.status(200).json({
      success: true,
      data: rows,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / parseInt(limit))
      },
      counts: {
        pending: pendingCount,
        approved: approvedCount,
        rejected: rejectedCount,
        all: count
      }
    });
  } catch (err) {
    console.error('Error fetching admin comments:', err);
    return res.status(500).json({
      success: false,
      message: 'Gagal memuat daftar komentar'
    });
  }
};

/**
 * Admin: Approve or Reject a comment
 * PATCH /api/berita/admin/komentar/:id/status
 */
exports.updateCommentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, catatan_moderasi } = req.body;

    if (!['APPROVED', 'REJECTED', 'PENDING'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Status harus bernilai APPROVED, REJECTED, atau PENDING'
      });
    }

    const comment = await KomentarBerita.findByPk(id, {
      include: [{ model: Berita, as: 'berita', attributes: ['id', 'title'] }]
    });

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Komentar tidak ditemukan'
      });
    }

    comment.status = status;
    comment.is_approved = status === 'APPROVED';
    comment.approved_by = status !== 'PENDING' ? req.user.id : null;
    comment.approved_at = status !== 'PENDING' ? new Date() : null;
    if (catatan_moderasi !== undefined) {
      comment.catatan_moderasi = catatan_moderasi;
    }

    await comment.save();

    return res.status(200).json({
      success: true,
      message: status === 'APPROVED' ? 'Komentar berhasil disetujui (Approved)' : status === 'REJECTED' ? 'Komentar ditolak (Rejected)' : 'Status komentar dikembalikan ke Pending',
      data: comment
    });
  } catch (err) {
    console.error('Error updating comment status:', err);
    return res.status(500).json({
      success: false,
      message: 'Gagal memperbarui status komentar'
    });
  }
};

/**
 * Admin: Delete a comment
 * DELETE /api/berita/admin/komentar/:id
 */
exports.deleteComment = async (req, res) => {
  try {
    const { id } = req.params;

    const comment = await KomentarBerita.findByPk(id);
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Komentar tidak ditemukan'
      });
    }

    await comment.destroy();

    return res.status(200).json({
      success: true,
      message: 'Komentar berhasil dihapus permanen'
    });
  } catch (err) {
    console.error('Error deleting comment:', err);
    return res.status(500).json({
      success: false,
      message: 'Gagal menghapus komentar'
    });
  }
};

/**
 * Admin: Bulk approve/reject/delete comments
 * POST /api/berita/admin/komentar/bulk
 */
exports.bulkActionComments = async (req, res) => {
  try {
    const { ids, action } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Daftar ID komentar wajib disertakan'
      });
    }

    if (!['APPROVE', 'REJECT', 'DELETE'].includes(action)) {
      return res.status(400).json({
        success: false,
        message: 'Aksi massal tidak valid'
      });
    }

    if (action === 'DELETE') {
      await KomentarBerita.destroy({
        where: { id: { [Op.in]: ids } }
      });
      return res.status(200).json({
        success: true,
        message: `${ids.length} komentar berhasil dihapus`
      });
    }

    const newStatus = action === 'APPROVE' ? 'APPROVED' : 'REJECTED';
    await KomentarBerita.update(
      {
        status: newStatus,
        is_approved: action === 'APPROVE',
        approved_by: req.user.id,
        approved_at: new Date()
      },
      {
        where: { id: { [Op.in]: ids } }
      }
    );

    return res.status(200).json({
      success: true,
      message: `${ids.length} komentar berhasil ${action === 'APPROVE' ? 'disetujui' : 'ditolak'}`
    });
  } catch (err) {
    console.error('Error bulk comments action:', err);
    return res.status(500).json({
      success: false,
      message: 'Gagal memproses aksi massal komentar'
    });
  }
};
