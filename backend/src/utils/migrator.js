const fs = require('fs');
const path = require('path');
const logger = require('../config/logger');

/**
 * Lightweight, zero-dependency Database Migrator for Production Safety
 * - Tabel pencatat riwayat migrasi: `schema_migrations`
 * - Eksekusi berurutan berdasarkan nama file (misal: 001_..., 002_...)
 * - Setiap file migration hanya dieksekusi 1x seumur hidup
 * - TIDAK PERNAH menghapus data (DROP/TRUNCATE), hanya ADD COLUMN / CREATE TABLE / INDEX
 */
async function runMigrations(sequelize) {
  try {
    // 1. Buat tabel schema_migrations jika belum ada
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS \`schema_migrations\` (
        \`id\` INT AUTO_INCREMENT PRIMARY KEY,
        \`name\` VARCHAR(255) NOT NULL UNIQUE,
        \`executed_at\` DATETIME DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // 2. Ambil daftar migrasi yang sudah pernah jalan
    const [rows] = await sequelize.query(`SELECT \`name\` FROM \`schema_migrations\``);
    const executedMigrations = new Set(rows.map(r => r.name));

    // 3. Baca folder migrations
    const migrationsDir = path.join(__dirname, '../migrations');
    if (!fs.existsSync(migrationsDir)) {
      return;
    }

    const files = fs.readdirSync(migrationsDir)
      .filter(f => f.endsWith('.js'))
      .sort(); // Eksekusi berurutan 001, 002, dst.

    for (const file of files) {
      if (!executedMigrations.has(file)) {
        logger.info(`🚀 Menjalankan Database Migration: ${file}...`);
        const migrationPath = path.join(migrationsDir, file);
        const migration = require(migrationPath);

        if (typeof migration.up === 'function') {
          await migration.up(sequelize);
        }

        // Catat ke riwayat
        await sequelize.query(
          `INSERT INTO \`schema_migrations\` (\`name\`, \`executed_at\`) VALUES (?, NOW())`,
          { replacements: [file] }
        );
        logger.info(`✅ Migration ${file} berhasil diselesaikan.`);
      }
    }
  } catch (err) {
    logger.error(`❌ Gagal menjalankan migrasi database: ${err.message}`);
    throw err;
  }
}

module.exports = { runMigrations };
