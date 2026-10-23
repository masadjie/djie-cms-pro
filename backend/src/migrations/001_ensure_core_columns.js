/**
 * Migration 001: Pastikan tabel & kolom penting berita, menu, testimoni aman di production
 */
module.exports = {
  up: async (sequelize) => {
    // 1. Kolom tambahan tabel berita
    const [beritaCols] = await sequelize.query("SHOW COLUMNS FROM `berita`");
    const beritaFields = beritaCols.map(c => c.Field);

    if (!beritaFields.includes('kategori_ids')) {
      await sequelize.query("ALTER TABLE `berita` ADD COLUMN `kategori_ids` JSON DEFAULT NULL AFTER `kategori_id`");
    }
    if (!beritaFields.includes('cover_caption')) {
      await sequelize.query("ALTER TABLE `berita` ADD COLUMN `cover_caption` VARCHAR(255) DEFAULT NULL AFTER `cover_image`");
    }
    if (!beritaFields.includes('canonical_url')) {
      await sequelize.query("ALTER TABLE `berita` ADD COLUMN `canonical_url` VARCHAR(500) DEFAULT NULL AFTER `meta_keywords`");
    }
    if (!beritaFields.includes('read_time_minutes')) {
      await sequelize.query("ALTER TABLE `berita` ADD COLUMN `read_time_minutes` INT DEFAULT 3 AFTER `canonical_url`");
    }
    if (!beritaFields.includes('is_utama')) {
      await sequelize.query("ALTER TABLE `berita` ADD COLUMN `is_utama` TINYINT(1) DEFAULT 0 AFTER `is_pinned`");
    }
    if (!beritaFields.includes('is_featured')) {
      await sequelize.query("ALTER TABLE `berita` ADD COLUMN `is_featured` TINYINT(1) DEFAULT 0 AFTER `is_pinned`");
    }

    // 2. Pastikan tabel testimoni ada
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS \`testimoni\` (
        \`id\` BIGINT AUTO_INCREMENT PRIMARY KEY,
        \`nama\` VARCHAR(150) NOT NULL,
        \`jabatan\` VARCHAR(150) DEFAULT NULL,
        \`instansi\` VARCHAR(150) DEFAULT NULL,
        \`avatar_url\` VARCHAR(500) DEFAULT NULL,
        \`rating\` INT DEFAULT 5,
        \`pesan\` TEXT NOT NULL,
        \`urutan\` INT DEFAULT 0,
        \`is_active\` TINYINT(1) DEFAULT 1,
        \`created_at\` DATETIME NOT NULL,
        \`updated_at\` DATETIME NOT NULL,
        \`deleted_at\` DATETIME DEFAULT NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // 3. Pastikan kolom menu_navigasi
    try {
      const [menuCols] = await sequelize.query("SHOW COLUMNS FROM `menu_navigasi`");
      const menuFields = menuCols.map(c => c.Field);
      if (!menuFields.includes('icon')) {
        await sequelize.query("ALTER TABLE `menu_navigasi` ADD COLUMN `icon` VARCHAR(50) NULL AFTER `tipe`");
      }
      if (!menuFields.includes('page_id')) {
        await sequelize.query("ALTER TABLE `menu_navigasi` ADD COLUMN `page_id` INT UNSIGNED NULL AFTER `icon`");
      }
      if (!menuFields.includes('target_blank')) {
        await sequelize.query("ALTER TABLE `menu_navigasi` ADD COLUMN `target_blank` TINYINT(1) DEFAULT 0 AFTER `is_active`");
      }
      if (!menuFields.includes('deleted_at')) {
        await sequelize.query("ALTER TABLE `menu_navigasi` ADD COLUMN `deleted_at` DATETIME NULL AFTER `updated_at`");
      }
    } catch (e) {
      // Abaikan jika menu_navigasi belum dibuat
    }
  }
};
