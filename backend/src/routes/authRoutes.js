const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { validateRequest } = require('../middlewares/validateMiddleware');
const { registerWargaSchema, loginSchema } = require('../schemas/validationSchemas');
const { authenticate } = require('../middlewares/authMiddleware');
const { auditLogMiddleware } = require('../middlewares/auditMiddleware');

router.post(
  '/register',
  validateRequest(registerWargaSchema),
  auditLogMiddleware('REGISTER_WARGA', 'AUTH'),
  authController.registerWarga
);

router.post(
  '/login',
  validateRequest(loginSchema),
  auditLogMiddleware('LOGIN', 'AUTH'),
  authController.login
);

router.get('/me', authenticate, authController.getProfile);
router.post(
  '/change-password', 
  authenticate, 
  auditLogMiddleware('CHANGE_PASSWORD', 'AUTH'),
  authController.changePassword
);

module.exports = router;
