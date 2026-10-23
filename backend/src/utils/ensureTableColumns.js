const logger = require('../config/logger');

async function ensureTableColumns(sequelize) {
  try {
    // 1. Check & add columns to menu_navigasi
    const [menuColumns] = await sequelize.query("SHOW COLUMNS FROM `menu_navigasi`");
    const existingColNames = menuColumns.map(c => c.Field);

    // Modify tipe to VARCHAR(30) to avoid MySQL ENUM truncation
    await sequelize.query("ALTER TABLE `menu_navigasi` MODIFY COLUMN `tipe` VARCHAR(30) DEFAULT 'LINK'");
    logger.info("✅ Ensured `menu_navigasi.tipe` is VARCHAR(30)");

    if (!existingColNames.includes('icon')) {
      await sequelize.query("ALTER TABLE `menu_navigasi` ADD COLUMN `icon` VARCHAR(50) NULL AFTER `tipe`");
      logger.info("✅ Added `icon` column to `menu_navigasi`");
    }
    if (!existingColNames.includes('page_id')) {
      await sequelize.query("ALTER TABLE `menu_navigasi` ADD COLUMN `page_id` INT UNSIGNED NULL AFTER `icon`");
      logger.info("✅ Added `page_id` column to `menu_navigasi`");
    }
    if (!existingColNames.includes('target_blank')) {
      await sequelize.query("ALTER TABLE `menu_navigasi` ADD COLUMN `target_blank` TINYINT(1) DEFAULT 0 AFTER `is_active`");
      logger.info("✅ Added `target_blank` column to `menu_navigasi`");
    }
    if (!existingColNames.includes('deleted_at')) {
      await sequelize.query("ALTER TABLE `menu_navigasi` ADD COLUMN `deleted_at` DATETIME NULL AFTER `updated_at`");
      logger.info("✅ Added `deleted_at` column to `menu_navigasi`");
    }

    // 2. Check & add ISO 27001 account security columns to users
    try {
      const [userColumns] = await sequelize.query("SHOW COLUMNS FROM `users`");
      const existingUserCols = userColumns.map(c => c.Field);
      if (!existingUserCols.includes('failed_login_attempts')) {
        await sequelize.query("ALTER TABLE `users` ADD COLUMN `failed_login_attempts` INT DEFAULT 0 AFTER `is_active`");
        logger.info("✅ Added `failed_login_attempts` column to `users`");
      }
      if (!existingUserCols.includes('locked_until')) {
        await sequelize.query("ALTER TABLE `users` ADD COLUMN `locked_until` DATETIME NULL AFTER `failed_login_attempts`");
        logger.info("✅ Added `locked_until` column to `users`");
      }
    } catch (userColErr) {
      logger.warn('User columns sync notice:', userColErr.message);
    }

    // 3. Check & add missing columns to berita table
    try {
      const [beritaColumns] = await sequelize.query("SHOW COLUMNS FROM `berita`");
      const existingBeritaCols = beritaColumns.map(c => c.Field);

      if (!existingBeritaCols.includes('kategori_ids')) {
        await sequelize.query("ALTER TABLE `berita` ADD COLUMN `kategori_ids` JSON DEFAULT NULL AFTER `kategori_id`");
        logger.info("✅ Added `kategori_ids` column to `berita`");
      }
      if (!existingBeritaCols.includes('cover_caption')) {
        await sequelize.query("ALTER TABLE `berita` ADD COLUMN `cover_caption` VARCHAR(255) DEFAULT NULL AFTER `cover_image`");
        logger.info("✅ Added `cover_caption` column to `berita`");
      }
      if (!existingBeritaCols.includes('canonical_url')) {
        await sequelize.query("ALTER TABLE `berita` ADD COLUMN `canonical_url` VARCHAR(500) DEFAULT NULL AFTER `meta_keywords`");
        logger.info("✅ Added `canonical_url` column to `berita`");
      }
      if (!existingBeritaCols.includes('read_time_minutes')) {
        await sequelize.query("ALTER TABLE `berita` ADD COLUMN `read_time_minutes` INT DEFAULT 3 AFTER `canonical_url`");
        logger.info("✅ Added `read_time_minutes` column to `berita`");
      }
      if (!existingBeritaCols.includes('is_utama')) {
        await sequelize.query("ALTER TABLE `berita` ADD COLUMN `is_utama` TINYINT(1) DEFAULT 0 AFTER `is_pinned`");
        logger.info("✅ Added `is_utama` column to `berita`");
      }
      if (!existingBeritaCols.includes('is_featured')) {
        await sequelize.query("ALTER TABLE `berita` ADD COLUMN `is_featured` TINYINT(1) DEFAULT 0 AFTER `is_pinned`");
        logger.info("✅ Added `is_featured` column to `berita`");
      }
    } catch (beritaColErr) {
      logger.warn('Berita columns sync notice:', beritaColErr.message);
    }


    try {
      const cleanDuplicateIndexes = async (tableName) => {
        const [indexes] = await sequelize.query(`SHOW INDEX FROM \`${tableName}\``);
        const dupes = indexes.filter(idx => /_\d+$/.test(idx.Key_name));
        const droppedSet = new Set();
        for (const idx of dupes) {
          if (!droppedSet.has(idx.Key_name)) {
            try {
              await sequelize.query(`ALTER TABLE \`${tableName}\` DROP INDEX \`${idx.Key_name}\``);
              droppedSet.add(idx.Key_name);
            } catch (dropErr) {
              // ignore if already dropped
            }
          }
        }
        if (droppedSet.size > 0) {
          logger.info(`🧹 Cleaned ${droppedSet.size} redundant sync indexes on table ${tableName}`);
        }
      };

      await cleanDuplicateIndexes('layanan');
      await cleanDuplicateIndexes('permohonan');
      await cleanDuplicateIndexes('berita');
      await cleanDuplicateIndexes('opds');
      await cleanDuplicateIndexes('users');
      await cleanDuplicateIndexes('tag_berita');
      await cleanDuplicateIndexes('pengaturan_web');

      const ensureIndexSafe = async (tableName, indexName, createSql) => {
        const [rows] = await sequelize.query(`SHOW INDEX FROM \`${tableName}\` WHERE Key_name = '${indexName}'`);
        if (rows.length === 0) {
          await sequelize.query(createSql);
          logger.info(`✅ Created high-performance index: ${tableName}.${indexName}`);
        }
      };

      // Layanan: search by status, kategori, opd, and sorting
      await ensureIndexSafe('layanan', 'idx_layanan_status_kategori', 'CREATE INDEX idx_layanan_status_kategori ON layanan (status_layanan, kategori_id)');
      await ensureIndexSafe('layanan', 'idx_layanan_populer', 'CREATE INDEX idx_layanan_populer ON layanan (is_populer, total_dilihat)');

      // Permohonan: filter by user, status, and tracking dates
      await ensureIndexSafe('permohonan', 'idx_permohonan_user_status', 'CREATE INDEX idx_permohonan_user_status ON permohonan (user_id, status_permohonan)');
      await ensureIndexSafe('permohonan', 'idx_permohonan_created_at', 'CREATE INDEX idx_permohonan_created_at ON permohonan (created_at DESC)');
    } catch (indexErr) {
      logger.warn('Index optimization notice:', indexErr.message);
    }
  } catch (err) {
    logger.warn('Column sync notice (can be safely ignored if table will be created by sync):', err.message);
  }
}

module.exports = { ensureTableColumns };
