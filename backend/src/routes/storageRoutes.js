const express = require('express');
const router = express.Router();
const multer = require('multer');
const storageController = require('../controllers/storageController');

// Allowed file types — Dokumen resmi kedinasan, arsip, dan media
const ALLOWED_MIMES = [
  // Dokumen & PDF
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'text/plain',
  'text/csv',
  // Arsip
  'application/zip',
  'application/x-zip-compressed',
  'application/x-rar-compressed',
  'application/octet-stream', // beberapa browser mengirim zip/docx/xlsx sebagai octet-stream
  // Gambar
  'image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'
];
const ALLOWED_EXTS = /\.(pdf|docx?|xlsx?|pptx?|csv|txt|zip|rar|jpe?g|png|webp|gif|svg)$/i;

// Multer in-memory storage for direct MinIO streaming
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 100 * 1024 * 1024 // 100MB max file size
  },
  fileFilter: (req, file, cb) => {
    const extOk = ALLOWED_EXTS.test(file.originalname);
    const mimeOk = ALLOWED_MIMES.includes(file.mimetype) || extOk;
    if (extOk && mimeOk) {
      cb(null, true);
    } else {
      cb(new Error('Tipe berkas tidak didukung. Format yang diizinkan: PDF, Word (DOC/DOCX), Excel (XLS/XLSX), PPT/PPTX, CSV, ZIP/RAR, dan Gambar.'), false);
    }
  }
});

const { verifyToken, requireRole } = require('../middlewares/authMiddleware');
const { auditLogMiddleware } = require('../middlewares/auditMiddleware');

// Storage Endpoints — with multer error handling
router.post(
  '/upload',
  verifyToken,
  requireRole(['SUPER_ADMIN', 'EDITOR', 'ADMIN_OPD', 'VERIFIKATOR']),
  (req, res, next) => {
    upload.single('file')(req, res, (err) => {
      if (err) {
        return res.status(400).json({
          success: false,
          message: err.message || 'Gagal mengunggah file.'
        });
      }
      storageController.uploadFile(req, res, next);
    });
  }
);
router.get('/files', storageController.getFilesList);
router.get('/stats', storageController.getStorageStats);
router.post(
  '/link-berita',
  verifyToken,
  requireRole(['SUPER_ADMIN', 'EDITOR']),
  auditLogMiddleware('LINK_LAMPIRAN', 'STORAGE'),
  storageController.linkAttachmentsToBerita
);
router.post(
  '/files/bulk-delete',
  verifyToken,
  requireRole(['SUPER_ADMIN', 'EDITOR', 'ADMIN_OPD']),
  auditLogMiddleware('BULK_DELETE_FILES', 'STORAGE'),
  storageController.bulkDeleteFiles
);
router.delete(
  '/files/:id',
  verifyToken,
  requireRole(['SUPER_ADMIN', 'EDITOR', 'ADMIN_OPD']),
  auditLogMiddleware('DELETE_FILE', 'STORAGE'),
  storageController.deleteFile
);

// Stream / Download Endpoint (supports regex / wildcard for object paths like documents/...)
router.get('/download/*', storageController.downloadFile);
router.get('/download', storageController.downloadFile);

module.exports = router;
