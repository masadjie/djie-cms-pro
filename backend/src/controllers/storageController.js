const { minioClient, DEFAULT_BUCKET, ensureBucketExists } = require('../config/minio');
const { LampiranBerita, Berita } = require('../models');
const { Op } = require('sequelize');
const path = require('path');
const crypto = require('crypto');
const fs = require('fs');
const fsPromises = require('fs').promises;
const logger = require('../config/logger');

// Local fallback uploads directory
const LOCAL_UPLOADS_DIR = path.join(__dirname, '../../uploads/documents');

// Ensure local directory exists
if (!fs.existsSync(LOCAL_UPLOADS_DIR)) {
  fs.mkdirSync(LOCAL_UPLOADS_DIR, { recursive: true });
}

// Upload file to MinIO S3 (with automatic local disk fallback if drive full)
exports.uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Tidak ada file yang diunggah.'
      });
    }

    const { originalname, mimetype, size, buffer } = req.file;
    const { berita_id, nama_lampiran, kategori_dokumen } = req.body;

    // Sanitize and generate unique object key
    const ext = path.extname(originalname).toLowerCase().replace('.', '') || 'bin';
    const cleanBase = path.basename(originalname, path.extname(originalname))
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-');
    const randomSuffix = crypto.randomBytes(4).toString('hex');
    const fileName = `${Date.now()}-${cleanBase}-${randomSuffix}.${ext}`;
    const objectName = `documents/${fileName}`;

    let uploadedToMinio = false;
    try {
      await ensureBucketExists(DEFAULT_BUCKET);
      const metaData = {
        'Content-Type': mimetype,
        'Original-Name': originalname,
        'Uploaded-At': new Date().toISOString()
      };
      await minioClient.putObject(DEFAULT_BUCKET, objectName, buffer, size, metaData);
      uploadedToMinio = true;
      logger.info(`📤 File uploaded to MinIO: ${objectName} (${size} bytes)`);
    } catch (minioErr) {
      logger.warn(`⚠️ MinIO upload failed/full (${minioErr.message}). Falling back to local disk storage.`);
      // Fallback: write to local disk
      const localFilePath = path.join(LOCAL_UPLOADS_DIR, fileName);
      await fsPromises.writeFile(localFilePath, buffer);
      logger.info(`💾 File successfully saved to local disk fallback: ${localFilePath}`);
    }

    const fileUrl = `/api/v1/storage/download/${objectName}`;

    // Create database record
    const newLampiran = await LampiranBerita.create({
      berita_id: berita_id ? parseInt(berita_id, 10) : null,
      nama_lampiran: nama_lampiran || originalname,
      original_filename: originalname,
      file_path: objectName,
      file_url: fileUrl,
      file_type: mimetype,
      file_size_bytes: size,
      file_extension: ext,
      kategori_dokumen: kategori_dokumen || 'LAMPIRAN_RESMI',
      bucket_name: uploadedToMinio ? DEFAULT_BUCKET : 'local-storage',
      object_name: objectName
    });

    return res.status(201).json({
      success: true,
      message: 'File berhasil diunggah.',
      data: newLampiran
    });
  } catch (err) {
    logger.error('Gagal mengunggah file:', err);
    return res.status(500).json({
      success: false,
      message: `Gagal mengunggah file: ${err.message}`
    });
  }
};

// List all files in Media & Document Library
exports.getFilesList = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const offset = (page - 1) * limit;
    const { search, kategori, ext, berita_id } = req.query;

    const where = {};
    if (search) {
      where[Op.or] = [
        { nama_lampiran: { [Op.like]: `%${search}%` } },
        { original_filename: { [Op.like]: `%${search}%` } }
      ];
    }
    if (kategori && kategori !== 'ALL') {
      where.kategori_dokumen = kategori;
    }
    if (ext && ext !== 'ALL') {
      where.file_extension = ext.toLowerCase();
    }
    if (berita_id) {
      where.berita_id = parseInt(berita_id, 10);
    }

    const { count, rows } = await LampiranBerita.findAndCountAll({
      where,
      include: [
        {
          model: Berita,
          as: 'berita',
          attributes: ['id', 'title', 'slug']
        }
      ],
      order: [['created_at', 'DESC']],
      limit,
      offset
    });

    return res.status(200).json({
      success: true,
      total: count,
      page,
      limit,
      totalPages: Math.ceil(count / limit),
      data: rows
    });
  } catch (err) {
    logger.error('Gagal memuat daftar file:', err);
    return res.status(500).json({
      success: false,
      message: 'Gagal memuat daftar file storage.'
    });
  }
};

// Get Storage & File Statistics
exports.getStorageStats = async (req, res) => {
  try {
    const totalFiles = await LampiranBerita.count();
    const totalDownloads = await LampiranBerita.sum('downloads_count') || 0;
    const totalBytes = await LampiranBerita.sum('file_size_bytes') || 0;

    const pdfCount = await LampiranBerita.count({ where: { file_extension: 'pdf' } });
    const docCount = await LampiranBerita.count({ where: { file_extension: { [Op.in]: ['doc', 'docx'] } } });
    const xlsCount = await LampiranBerita.count({ where: { file_extension: { [Op.in]: ['xls', 'xlsx', 'csv'] } } });
    const imgCount = await LampiranBerita.count({ where: { file_extension: { [Op.in]: ['jpg', 'jpeg', 'png', 'webp', 'svg'] } } });

    return res.status(200).json({
      success: true,
      data: {
        totalFiles,
        totalDownloads,
        totalBytes,
        totalMegabytes: (totalBytes / (1024 * 1024)).toFixed(2),
        distribution: {
          pdf: pdfCount,
          documents: docCount,
          spreadsheets: xlsCount,
          images: imgCount,
          others: Math.max(0, totalFiles - (pdfCount + docCount + xlsCount + imgCount))
        },
        bucket: DEFAULT_BUCKET,
        storageEngine: 'MinIO S3 High-Performance Object Storage'
      }
    });
  } catch (err) {
    logger.error('Gagal mengambil statistik storage:', err);
    return res.status(500).json({
      success: false,
      message: 'Gagal mengambil statistik storage.'
    });
  }
};

// Download / Stream File from MinIO (with local disk fallback)
exports.downloadFile = async (req, res) => {
  try {
    const rawPath = req.params[0] || req.params.filename || req.query.file;
    if (!rawPath) {
      return res.status(400).json({ success: false, message: 'Nama file tidak valid.' });
    }

    const objectName = rawPath.startsWith('documents/') ? rawPath : `documents/${rawPath}`;
    const fileNameOnly = path.basename(objectName);

    // Find DB record
    const fileRecord = await LampiranBerita.findOne({
      where: {
        [Op.or]: [
          { object_name: objectName },
          { file_path: objectName },
          { id: isNaN(rawPath) ? 0 : parseInt(rawPath, 10) }
        ]
      }
    });

    if (fileRecord) {
      // Increment downloads counter asynchronously
      fileRecord.increment('downloads_count');
    }

    const targetBucket = fileRecord?.bucket_name || DEFAULT_BUCKET;
    const targetObject = fileRecord?.object_name || objectName;
    const downloadFilename = fileRecord?.original_filename || fileNameOnly;

    // Set headers with CDN-friendly caching
    const contentType = fileRecord?.file_type || 'application/octet-stream';
    const isImage = contentType.startsWith('image/');
    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `inline; filename="${encodeURIComponent(downloadFilename)}"`);
    res.setHeader('Cache-Control', isImage
      ? 'public, max-age=31536000, immutable'
      : 'public, max-age=3600, must-revalidate'
    );
    res.setHeader('X-Content-Type-Options', 'nosniff');

    // If marked as local-storage or local file exists, stream from local disk
    const localFilePath = path.join(LOCAL_UPLOADS_DIR, fileNameOnly);
    if (targetBucket === 'local-storage' || fs.existsSync(localFilePath)) {
      if (fs.existsSync(localFilePath)) {
        return fs.createReadStream(localFilePath).pipe(res);
      }
    }

    // Otherwise stream from MinIO
    try {
      const stream = await minioClient.getObject(targetBucket, targetObject);
      return stream.pipe(res);
    } catch (s3Err) {
      // If MinIO fails but local file exists as fallback
      if (fs.existsSync(localFilePath)) {
        return fs.createReadStream(localFilePath).pipe(res);
      }
      throw s3Err;
    }
  } catch (err) {
    logger.error('Gagal streaming file:', err);
    return res.status(404).json({
      success: false,
      message: 'File tidak ditemukan di sistem penyimpanan.'
    });
  }
};

// Delete File from MinIO & Database
exports.deleteFile = async (req, res) => {
  try {
    const { id } = req.params;
    const fileRecord = await LampiranBerita.findByPk(id);

    if (!fileRecord) {
      return res.status(404).json({
        success: false,
        message: 'File tidak ditemukan.'
      });
    }

    // Delete from MinIO or Local Disk
    try {
      await minioClient.removeObject(fileRecord.bucket_name || DEFAULT_BUCKET, fileRecord.object_name);
    } catch (s3Err) {
      logger.warn(`MinIO removeObject warning: ${s3Err.message}`);
    }

    // Also remove from local disk fallback if present
    const localFilePath = path.join(LOCAL_UPLOADS_DIR, path.basename(fileRecord.object_name));
    if (fs.existsSync(localFilePath)) {
      try { await fsPromises.unlink(localFilePath); } catch (e) {}
    }

    // Force delete DB record
    await fileRecord.destroy({ force: true });

    return res.status(200).json({
      success: true,
      message: 'File berhasil dihapus dari sistem dan database.'
    });
  } catch (err) {
    logger.error('Gagal menghapus file:', err);
    return res.status(500).json({
      success: false,
      message: 'Gagal menghapus file.'
    });
  }
};

// Bulk Delete Files from MinIO & Database
exports.bulkDeleteFiles = async (req, res) => {
  try {
    const { ids } = req.body;
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Daftar ID berkas tidak boleh kosong.'
      });
    }

    const files = await LampiranBerita.findAll({
      where: {
        id: { [Op.in]: ids }
      }
    });

    if (files.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Tidak ada berkas yang ditemukan untuk dihapus.'
      });
    }

    // Delete objects from MinIO & Local
    for (const fileRecord of files) {
      try {
        await minioClient.removeObject(fileRecord.bucket_name || DEFAULT_BUCKET, fileRecord.object_name);
      } catch (s3Err) {
        logger.warn(`MinIO removeObject warning for ${fileRecord.object_name}: ${s3Err.message}`);
      }
      const localFilePath = path.join(LOCAL_UPLOADS_DIR, path.basename(fileRecord.object_name));
      if (fs.existsSync(localFilePath)) {
        try { await fsPromises.unlink(localFilePath); } catch (e) {}
      }
    }

    // Delete DB records
    const deletedCount = await LampiranBerita.destroy({
      where: {
        id: { [Op.in]: ids }
      },
      force: true
    });

    return res.status(200).json({
      success: true,
      message: `${deletedCount} berkas berhasil dihapus dari MinIO dan database.`,
      deletedCount
    });
  } catch (err) {
    logger.error('Gagal menghapus massal berkas:', err);
    return res.status(500).json({
      success: false,
      message: 'Gagal menghapus massal berkas dari MinIO.'
    });
  }
};

// Bulk Link Attachments to Berita
exports.linkAttachmentsToBerita = async (req, res) => {
  try {
    const { berita_id, attachment_ids } = req.body;
    if (!berita_id || !Array.isArray(attachment_ids)) {
      return res.status(400).json({ success: false, message: 'Data pertautan tidak valid.' });
    }

    await LampiranBerita.update(
      { berita_id: parseInt(berita_id, 10) },
      { where: { id: { [Op.in]: attachment_ids } } }
    );

    return res.status(200).json({
      success: true,
      message: 'Lampiran berhasil ditautkan ke berita.'
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
