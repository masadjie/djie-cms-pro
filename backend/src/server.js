const app = require('./app');
const { sequelize } = require('./models');
const logger = require('./config/logger');
const { seedCoreStructure } = require('./utils/ensureSeedUsers');
const { ensureTableColumns } = require('./utils/ensureTableColumns');
const { runMigrations } = require('./utils/migrator');
const { seedDefaultStorageFiles } = require('./utils/seedStorageFiles');

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    // Verifikasi koneksi DB dan sinkronisasi struktur model
    await sequelize.authenticate();
    logger.info('✅ Koneksi ke database MySQL berhasil tersambung.');

    // 1. Sinkronisasi model ke tabel terlebih dahulu (CREATE TABLE IF NOT EXISTS)
    await sequelize.sync();
    logger.info('✅ Sinkronisasi model database selesai.');

    // 2. Eksekusi database migrations berurutan (pasti aman dari kehilangan data)
    await runMigrations(sequelize);

    // 3. Pastikan kolom baru dan indeks performa tersedia
    await ensureTableColumns(sequelize);

    // Cek apakah sistem sudah pernah diinstal lewat Installation Wizard
    const { PengaturanWeb } = require('./models');
    const installedSetting = await PengaturanWeb.findOne({ where: { key_name: 'cms_is_installed' } });
    const isInstalled = installedSetting?.value === 'true' || installedSetting?.value === '1';

    if (isInstalled) {
      // Hanya verifikasi seed jika CMS memang sudah terinstall
      await seedCoreStructure();
      await seedDefaultStorageFiles();
    } else {
      logger.info('ℹ️  Djie CMS Pro siap diinstal. Buka browser dan ikuti panduan Setup Wizard di http://localhost:5173/install');
    }

    app.listen(PORT, () => {
      logger.info(`🚀 Server Djie CMS Pro API Backend berjalan pada port ${PORT}`);
      logger.info(`🌐 Lingkungan: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    logger.error('❌ Gagal menjalankan server:', error);
    process.exit(1);
  }
}

startServer();
