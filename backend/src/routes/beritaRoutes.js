const express = require('express');
const router = express.Router();
const {
  getBeritaList,
  getBeritaBySlug,
  getBeritaTrending,
  getKategoriBeritaList,
  getKategoriAdminList,
  createKategoriBerita,
  updateKategoriBerita,
  deleteKategoriBerita,
  getBeritaById,
  createBerita,
  updateBerita,
  deleteBerita,
  bulkActionBerita,
  trackShareBerita,
  getBeritaShareAnalytics
} = require('../controllers/beritaController');
const {
  getApprovedCommentsBySlug,
  submitComment,
  getAdminCommentsList,
  updateCommentStatus,
  deleteComment,
  bulkActionComments
} = require('../controllers/komentarController');
const { verifyToken, requireRole } = require('../middlewares/authMiddleware');
const { auditLogMiddleware } = require('../middlewares/auditMiddleware');

// Public News Routes (Cached in Redis)
router.get('/', getBeritaList);
router.get('/trending', getBeritaTrending);
router.get('/kategori', getKategoriBeritaList);
router.get('/kategori/admin', verifyToken, requireRole(['SUPER_ADMIN', 'ADMIN_OPD', 'EDITOR']), getKategoriAdminList);

// Category Admin CRUD
router.post('/kategori', verifyToken, requireRole(['SUPER_ADMIN', 'EDITOR']), auditLogMiddleware('CREATE_KATEGORI_BERITA', 'BERITA'), createKategoriBerita);
router.put('/kategori/:id', verifyToken, requireRole(['SUPER_ADMIN', 'EDITOR']), auditLogMiddleware('UPDATE_KATEGORI_BERITA', 'BERITA'), updateKategoriBerita);
router.delete('/kategori/:id', verifyToken, requireRole(['SUPER_ADMIN', 'EDITOR']), auditLogMiddleware('DELETE_KATEGORI_BERITA', 'BERITA'), deleteKategoriBerita);

// News Comments Admin Moderation
router.get('/admin/komentar', verifyToken, requireRole(['SUPER_ADMIN', 'ADMIN_OPD', 'EDITOR']), getAdminCommentsList);
router.patch('/admin/komentar/:id/status', verifyToken, requireRole(['SUPER_ADMIN', 'ADMIN_OPD', 'EDITOR']), auditLogMiddleware('MODERASI_KOMENTAR', 'BERITA'), updateCommentStatus);
router.delete('/admin/komentar/:id', verifyToken, requireRole(['SUPER_ADMIN', 'ADMIN_OPD', 'EDITOR']), auditLogMiddleware('DELETE_KOMENTAR', 'BERITA'), deleteComment);
router.post('/admin/komentar/bulk', verifyToken, requireRole(['SUPER_ADMIN', 'ADMIN_OPD', 'EDITOR']), auditLogMiddleware('BULK_MODERASI_KOMENTAR', 'BERITA'), bulkActionComments);

// Bulk Action for Berita
router.post('/bulk-action', verifyToken, requireRole(['SUPER_ADMIN', 'ADMIN_OPD', 'EDITOR']), auditLogMiddleware('BULK_ACTION_BERITA', 'BERITA'), bulkActionBerita);

router.get('/detail-by-id/:id', verifyToken, requireRole(['SUPER_ADMIN', 'ADMIN_OPD', 'EDITOR']), getBeritaById);
router.post('/:slug/share', trackShareBerita);
router.get('/:slug/share-analytics', getBeritaShareAnalytics);

// Public News Comments per Article
router.get('/:slug/komentar', getApprovedCommentsBySlug);
router.post('/:slug/komentar', submitComment);

router.get('/:slug', getBeritaBySlug);

// Admin Routes (Invalidates Redis Cache)
router.post('/', verifyToken, requireRole(['SUPER_ADMIN', 'ADMIN_OPD', 'EDITOR']), auditLogMiddleware('CREATE_BERITA', 'BERITA'), createBerita);
router.put('/:id', verifyToken, requireRole(['SUPER_ADMIN', 'ADMIN_OPD', 'EDITOR']), auditLogMiddleware('UPDATE_BERITA', 'BERITA'), updateBerita);
router.delete('/:id', verifyToken, requireRole(['SUPER_ADMIN', 'ADMIN_OPD', 'EDITOR']), auditLogMiddleware('DELETE_BERITA', 'BERITA'), deleteBerita);

module.exports = router;

