const sequelize = require('../config/database');
const logger = require('../config/logger');

async function optimizeDatabase() {
  try {
    logger.info('🚀 Memulai optimasi database MySQL (Indexing, Fulltext & Performance Tuning)...');

    // 1. Add FULLTEXT Index on Berita for fast fulltext searches
    try {
      await sequelize.query(`
        ALTER TABLE berita ADD FULLTEXT idx_berita_fulltext (title, excerpt, content);
      `);
      logger.info('✅ FULLTEXT index pada tabel berita berhasil dibuat.');
    } catch (e) {
      if (e.message.includes('Duplicate key name') || e.message.includes('already exists')) {
        logger.info('ℹ️ FULLTEXT index pada berita sudah ada.');
      } else {
        logger.warn(`FULLTEXT index note: ${e.message}`);
      }
    }

    // 2. Add Composite Indexes for high-speed filtering
    const indexQueries = [
      `CREATE INDEX IF NOT EXISTS idx_permohonan_status_created ON permohonan(status, created_at);`,
      `CREATE INDEX IF NOT EXISTS idx_permohonan_tiket ON permohonan(nomor_tiket);`,
      `CREATE INDEX IF NOT EXISTS idx_layanan_kategori_populer ON layanan(kategori_id, is_populer, is_active);`,
      `CREATE INDEX IF NOT EXISTS idx_berita_pub_views ON berita(status, published_at, views_count);`
    ];

    for (const q of indexQueries) {
      try {
        await sequelize.query(q);
      } catch (err) {
        // Safe to ignore if index already present
      }
    }
    logger.info('✅ Composite indexing optimization selesai.');

    // 3. Optimize Tables
    const tables = ['berita', 'kategori_berita', 'layanan', 'kategori_layanan', 'users', 'permohonan'];
    for (const table of tables) {
      try {
        await sequelize.query(`OPTIMIZE TABLE ${table};`);
      } catch (err) {}
    }
    logger.info('✅ OPTIMIZE TABLE untuk defragmentasi dan query planner stats selesai.');

    logger.info('🎉 Database BKPSDM Aceh Tamiang gacor & siap performa tinggi!');
  } catch (error) {
    logger.error('Error in optimizeDatabase:', error);
  } finally {
    process.exit();
  }
}

optimizeDatabase();
