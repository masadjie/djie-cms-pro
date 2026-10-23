const express = require('express');
const router = express.Router();
const rbacController = require('../controllers/rbacController');
const { verifyToken, requireRole } = require('../middlewares/authMiddleware');

const { auditLogMiddleware } = require('../middlewares/auditMiddleware');

// All RBAC management endpoints are protected and restricted to SUPER_ADMIN
router.use(verifyToken);
router.use(requireRole(['SUPER_ADMIN']));

// Summary stats & role metadata
router.get('/stats', rbacController.getRbacStats);
router.get('/roles', rbacController.getRolesMatrix);

// User CRUD
router.get('/users', rbacController.getUsersList);
router.get('/users/:id', rbacController.getUserDetail);
router.post('/users', auditLogMiddleware('CREATE_USER', 'RBAC'), rbacController.createUser);
router.put('/users/:id', auditLogMiddleware('UPDATE_USER', 'RBAC'), rbacController.updateUser);
router.delete('/users/:id', auditLogMiddleware('DELETE_USER', 'RBAC'), rbacController.deleteUser);

// User quick actions
router.post('/users/:id/toggle-status', auditLogMiddleware('TOGGLE_USER_STATUS', 'RBAC'), rbacController.toggleUserStatus);
router.post('/users/:id/reset-password', auditLogMiddleware('RESET_USER_PASSWORD', 'RBAC'), rbacController.resetUserPassword);

module.exports = router;
