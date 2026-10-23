const express = require('express');
const router = express.Router();
const { 
  getDashboardAnalytics, 
  getAdminNotifications,
  getCustomRangeAnalytics,
  getDokumenList, 
  createDokumen, 
  deleteDokumen,
  bulkDeleteDokumen,
  getGaleriList,
  createGaleri,
  updateGaleri,
  deleteGaleri,
  getBannerList,
  createBanner,
  updateBanner,
  deleteBanner,
  getPengaturanWeb,
  updatePengaturanWeb,
  getMenuList,
  createMenu,
  updateMenu,
  deleteMenu,
  bulkSaveMenus,
  resetDefaultMenus,
  getPageList,
  getPageBySlug,
  createPage,
  updatePage,
  deletePage,
  trackVisitorHit,
  getAgendaList,
  createAgenda,
  updateAgenda,
  deleteAgenda,
  bulkDeleteAgenda,
  purgeCache,
  clearVisitorTraffic,
  exportBackup,
  getInstallStatus,
  runInitialInstall,
  getTestimoniList,
  createTestimoni,
  updateTestimoni,
  deleteTestimoni
} = require('../controllers/cmsController');
const { verifyToken, requireRole } = require('../middlewares/authMiddleware');
const { auditLogMiddleware } = require('../middlewares/auditMiddleware');

// Analytics Dashboard & Real-time Traffic Tracking
router.get('/analytics', getDashboardAnalytics);
router.get('/analytics/custom-range', verifyToken, getCustomRangeAnalytics);
router.get('/notifications', verifyToken, getAdminNotifications);
router.post('/track-visit', trackVisitorHit);

// Pages (Halaman Statis CMS)
router.get('/pages', getPageList);
router.get('/pages/:slug', getPageBySlug);
router.post('/pages', verifyToken, requireRole(['SUPER_ADMIN', 'EDITOR']), auditLogMiddleware('CREATE_PAGE', 'CMS'), createPage);
router.put('/pages/:id', verifyToken, requireRole(['SUPER_ADMIN', 'EDITOR']), auditLogMiddleware('UPDATE_PAGE', 'CMS'), updatePage);
router.delete('/pages/:id', verifyToken, requireRole(['SUPER_ADMIN', 'EDITOR']), auditLogMiddleware('DELETE_PAGE', 'CMS'), deletePage);

// Menu Navigasi Dinamis
router.get('/menu', getMenuList);
router.post('/menu', verifyToken, requireRole(['SUPER_ADMIN', 'EDITOR']), auditLogMiddleware('CREATE_MENU', 'CMS'), createMenu);
router.put('/menu-bulk', verifyToken, requireRole(['SUPER_ADMIN', 'EDITOR']), auditLogMiddleware('BULK_SAVE_MENU', 'CMS'), bulkSaveMenus);
router.post('/menu-reset', verifyToken, requireRole(['SUPER_ADMIN', 'EDITOR']), auditLogMiddleware('RESET_MENU', 'CMS'), resetDefaultMenus);
router.put('/menu/:id', verifyToken, requireRole(['SUPER_ADMIN', 'EDITOR']), auditLogMiddleware('UPDATE_MENU', 'CMS'), updateMenu);
router.delete('/menu/:id', verifyToken, requireRole(['SUPER_ADMIN', 'EDITOR']), auditLogMiddleware('DELETE_MENU', 'CMS'), deleteMenu);

// Dokumen Publik
router.get('/dokumen', getDokumenList);
router.post('/dokumen', verifyToken, requireRole(['SUPER_ADMIN', 'EDITOR', 'ADMIN_OPD']), auditLogMiddleware('CREATE_DOKUMEN', 'CMS'), createDokumen);
router.post('/dokumen/bulk-delete', verifyToken, requireRole(['SUPER_ADMIN', 'EDITOR', 'ADMIN_OPD']), auditLogMiddleware('BULK_DELETE_DOKUMEN', 'CMS'), bulkDeleteDokumen);
router.delete('/dokumen/:id', verifyToken, requireRole(['SUPER_ADMIN', 'EDITOR', 'ADMIN_OPD']), auditLogMiddleware('DELETE_DOKUMEN', 'CMS'), deleteDokumen);

// Galeri Media
router.get('/galeri', getGaleriList);
router.post('/galeri', verifyToken, requireRole(['SUPER_ADMIN', 'EDITOR', 'ADMIN_OPD']), auditLogMiddleware('CREATE_GALERI', 'CMS'), createGaleri);
router.put('/galeri/:id', verifyToken, requireRole(['SUPER_ADMIN', 'EDITOR', 'ADMIN_OPD']), auditLogMiddleware('UPDATE_GALERI', 'CMS'), updateGaleri);
router.delete('/galeri/:id', verifyToken, requireRole(['SUPER_ADMIN', 'EDITOR', 'ADMIN_OPD']), auditLogMiddleware('DELETE_GALERI', 'CMS'), deleteGaleri);

// Banner Slider
router.get('/banner', getBannerList);
router.post('/banner', verifyToken, requireRole(['SUPER_ADMIN', 'EDITOR']), auditLogMiddleware('CREATE_BANNER', 'CMS'), createBanner);
router.put('/banner/:id', verifyToken, requireRole(['SUPER_ADMIN', 'EDITOR']), auditLogMiddleware('UPDATE_BANNER', 'CMS'), updateBanner);
router.delete('/banner/:id', verifyToken, requireRole(['SUPER_ADMIN', 'EDITOR']), auditLogMiddleware('DELETE_BANNER', 'CMS'), deleteBanner);

// Agenda Kegiatan
router.get('/agenda', getAgendaList);
router.post('/agenda', verifyToken, requireRole(['SUPER_ADMIN', 'EDITOR', 'ADMIN_OPD']), auditLogMiddleware('CREATE_AGENDA', 'CMS'), createAgenda);
router.post('/agenda/bulk-delete', verifyToken, requireRole(['SUPER_ADMIN', 'EDITOR', 'ADMIN_OPD']), auditLogMiddleware('BULK_DELETE_AGENDA', 'CMS'), bulkDeleteAgenda);
router.put('/agenda/:id', verifyToken, requireRole(['SUPER_ADMIN', 'EDITOR', 'ADMIN_OPD']), auditLogMiddleware('UPDATE_AGENDA', 'CMS'), updateAgenda);
router.delete('/agenda/:id', verifyToken, requireRole(['SUPER_ADMIN', 'EDITOR', 'ADMIN_OPD']), auditLogMiddleware('DELETE_AGENDA', 'CMS'), deleteAgenda);

// Testimoni & Rating Aparatur
router.get('/testimoni', getTestimoniList);
router.post('/testimoni', verifyToken, requireRole(['SUPER_ADMIN', 'EDITOR']), auditLogMiddleware('CREATE_TESTIMONI', 'CMS'), createTestimoni);
router.put('/testimoni/:id', verifyToken, requireRole(['SUPER_ADMIN', 'EDITOR']), auditLogMiddleware('UPDATE_TESTIMONI', 'CMS'), updateTestimoni);
router.delete('/testimoni/:id', verifyToken, requireRole(['SUPER_ADMIN', 'EDITOR']), auditLogMiddleware('DELETE_TESTIMONI', 'CMS'), deleteTestimoni);

// Pengaturan Web (Restricted to SUPER_ADMIN)
router.get('/pengaturan', getPengaturanWeb);
router.post('/pengaturan', verifyToken, requireRole(['SUPER_ADMIN']), auditLogMiddleware('UPDATE_PENGATURAN', 'CMS'), updatePengaturanWeb);
router.get('/settings', getPengaturanWeb);
router.post('/settings', verifyToken, requireRole(['SUPER_ADMIN']), auditLogMiddleware('UPDATE_PENGATURAN', 'CMS'), updatePengaturanWeb);

// System Health & Maintenance (Restricted to SUPER_ADMIN)
router.post('/cache-purge', verifyToken, requireRole(['SUPER_ADMIN']), auditLogMiddleware('PURGE_CACHE', 'SYSTEM'), purgeCache);
router.post('/clear-traffic', verifyToken, requireRole(['SUPER_ADMIN']), auditLogMiddleware('CLEAR_TRAFFIC', 'SYSTEM'), clearVisitorTraffic);
router.get('/export-backup', verifyToken, requireRole(['SUPER_ADMIN']), auditLogMiddleware('EXPORT_BACKUP', 'SYSTEM'), exportBackup);

// CMS Installation Wizard
router.get('/install/status', getInstallStatus);
router.post('/install/setup', runInitialInstall);

module.exports = router;
