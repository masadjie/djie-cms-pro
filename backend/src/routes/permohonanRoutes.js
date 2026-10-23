const express = require('express');
const router = express.Router();
const permohonanController = require('../controllers/permohonanController');
const { authenticate, authorize } = require('../middlewares/authMiddleware');
const { validateRequest } = require('../middlewares/validateMiddleware');
const { createPermohonanSchema, updateStatusPermohonanSchema } = require('../schemas/validationSchemas');
const { auditLogMiddleware } = require('../middlewares/auditMiddleware');

// Public tracking by Nomor Tiket
router.get('/track/:nomorTiket', permohonanController.trackTiket);

// Warga: Buat permohonan & lihat riwayat sendiri
router.post(
  '/',
  authenticate,
  validateRequest(createPermohonanSchema),
  auditLogMiddleware('SUBMIT_PERMOHONAN', 'PERMOHONAN'),
  permohonanController.submitPermohonan
);

router.get('/my-submissions', authenticate, permohonanController.getMyPermohonan);

// Petugas / Admin: Update status permohonan
router.patch(
  '/:id/status',
  authenticate,
  authorize('ADMIN_OPD', 'SUPER_ADMIN'),
  validateRequest(updateStatusPermohonanSchema),
  auditLogMiddleware('UPDATE_STATUS_PERMOHONAN', 'PERMOHONAN'),
  permohonanController.updateStatusPermohonan
);

module.exports = router;
