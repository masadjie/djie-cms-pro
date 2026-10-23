const express = require('express');
const router = express.Router();
const layananController = require('../controllers/layananController');
const { authenticate, authorize } = require('../middlewares/authMiddleware');
const { validateRequest } = require('../middlewares/validateMiddleware');
const { createLayananSchema } = require('../schemas/validationSchemas');
const { auditLogMiddleware } = require('../middlewares/auditMiddleware');

// Public catalog routes
router.get('/', layananController.getAllLayanan);
router.get('/:slugOrId', layananController.getLayananDetail);

// Protected routes (Admin OPD / Super Admin)
router.post(
  '/',
  authenticate,
  authorize('ADMIN_OPD', 'SUPER_ADMIN'),
  validateRequest(createLayananSchema),
  auditLogMiddleware('CREATE_LAYANAN', 'LAYANAN'),
  layananController.createLayanan
);

router.put(
  '/:id',
  authenticate,
  authorize('ADMIN_OPD', 'SUPER_ADMIN'),
  auditLogMiddleware('UPDATE_LAYANAN', 'LAYANAN'),
  layananController.updateLayanan
);

module.exports = router;
