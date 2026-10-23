const sequelize = require('../config/database');
const { initUserModel } = require('./User');
const { initOPDModel } = require('./OPD');
const { initKategoriLayananModel } = require('./KategoriLayanan');
const { initLayananModel } = require('./Layanan');
const { initSyaratLayananModel } = require('./SyaratLayanan');
const { initPermohonanModel } = require('./Permohonan');
const { initAuditLogModel } = require('./AuditLog');
const { initKategoriBeritaModel } = require('./KategoriBerita');
const { initBeritaModel } = require('./Berita');
const { initTagBeritaModel } = require('./TagBerita');
const { initAgendaModel } = require('./Agenda');
const { initDokumenPublikModel } = require('./DokumenPublik');
const { initGaleriMediaModel } = require('./GaleriMedia');
const { initBannerSliderModel } = require('./BannerSlider');
const { initPengaturanWebModel } = require('./PengaturanWeb');
const { initMenuNavigasiModel } = require('./MenuNavigasi');
const { initHalamanModel } = require('./Halaman');
const { initVisitorLogModel } = require('./VisitorLog');
const { initLampiranBeritaModel } = require('./LampiranBerita');
const { initKomentarBeritaModel } = require('./KomentarBerita');
const { initTestimoniModel } = require('./Testimoni');

// Initialize models
const User = initUserModel(sequelize);
const OPD = initOPDModel(sequelize);
const KategoriLayanan = initKategoriLayananModel(sequelize);
const Layanan = initLayananModel(sequelize);
const SyaratLayanan = initSyaratLayananModel(sequelize);
const Permohonan = initPermohonanModel(sequelize);
const AuditLog = initAuditLogModel(sequelize);
const KategoriBerita = initKategoriBeritaModel(sequelize);
const Berita = initBeritaModel(sequelize);
const TagBerita = initTagBeritaModel(sequelize);
const Agenda = initAgendaModel(sequelize);
const DokumenPublik = initDokumenPublikModel(sequelize);
const GaleriMedia = initGaleriMediaModel(sequelize);
const BannerSlider = initBannerSliderModel(sequelize);
const PengaturanWeb = initPengaturanWebModel(sequelize);
const MenuNavigasi = initMenuNavigasiModel(sequelize);
const Halaman = initHalamanModel(sequelize);
const VisitorLog = initVisitorLogModel(sequelize);
const LampiranBerita = initLampiranBeritaModel(sequelize);
const KomentarBerita = initKomentarBeritaModel(sequelize);
const Testimoni = initTestimoniModel(sequelize);

// Define Model Relationships

// 1. OPD & User
OPD.hasMany(User, { foreignKey: 'opd_id', as: 'pegawai' });
User.belongsTo(OPD, { foreignKey: 'opd_id', as: 'opd' });

// 2. OPD & Layanan
OPD.hasMany(Layanan, { foreignKey: 'opd_id', as: 'daftar_layanan' });
Layanan.belongsTo(OPD, { foreignKey: 'opd_id', as: 'opd' });

// 3. Kategori & Layanan
KategoriLayanan.hasMany(Layanan, { foreignKey: 'kategori_id', as: 'layanan_list' });
Layanan.belongsTo(KategoriLayanan, { foreignKey: 'kategori_id', as: 'kategori' });

// 4. Layanan & SyaratLayanan
Layanan.hasMany(SyaratLayanan, { foreignKey: 'layanan_id', as: 'syarat_dokumen' });
SyaratLayanan.belongsTo(Layanan, { foreignKey: 'layanan_id', as: 'layanan' });

// 5. Layanan & Permohonan
Layanan.hasMany(Permohonan, { foreignKey: 'layanan_id', as: 'permohonan_masuk' });
Permohonan.belongsTo(Layanan, { foreignKey: 'layanan_id', as: 'layanan' });

// 6. User & Permohonan
User.hasMany(Permohonan, { foreignKey: 'user_id', as: 'riwayat_permohonan' });
Permohonan.belongsTo(User, { foreignKey: 'user_id', as: 'pemohon' });

// 7. Verifikasi Permohonan oleh User Petugas
User.hasMany(Permohonan, { foreignKey: 'verified_by', as: 'verifikasi_dilakukan' });
Permohonan.belongsTo(User, { foreignKey: 'verified_by', as: 'petugas_verifikator' });

// 8. User & AuditLog
User.hasMany(AuditLog, { foreignKey: 'user_id', as: 'audit_logs' });
AuditLog.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// 9. KategoriBerita & Berita
KategoriBerita.hasMany(Berita, { foreignKey: 'kategori_id', as: 'daftar_berita' });
Berita.belongsTo(KategoriBerita, { foreignKey: 'kategori_id', as: 'kategori' });

// 10. User & Berita (Author)
User.hasMany(Berita, { foreignKey: 'author_id', as: 'berita_dibuat' });
Berita.belongsTo(User, { foreignKey: 'author_id', as: 'author' });

// 11. Halaman & MenuNavigasi
Halaman.hasMany(MenuNavigasi, { foreignKey: 'page_id', as: 'menu_items' });
MenuNavigasi.belongsTo(Halaman, { foreignKey: 'page_id', as: 'page' });

// 12. Berita & Lampiran (Attachments)
Berita.hasMany(LampiranBerita, { foreignKey: 'berita_id', as: 'lampiran' });
LampiranBerita.belongsTo(Berita, { foreignKey: 'berita_id', as: 'berita' });

// 13. Berita & Komentar (Comments)
Berita.hasMany(KomentarBerita, { foreignKey: 'berita_id', as: 'komentar' });
KomentarBerita.belongsTo(Berita, { foreignKey: 'berita_id', as: 'berita' });

// 14. User & Komentar (Moderator)
User.hasMany(KomentarBerita, { foreignKey: 'approved_by', as: 'komentar_dimoderasi' });
KomentarBerita.belongsTo(User, { foreignKey: 'approved_by', as: 'moderator' });

module.exports = {
  sequelize,
  User,
  OPD,
  KategoriLayanan,
  Layanan,
  SyaratLayanan,
  Permohonan,
  AuditLog,
  KategoriBerita,
  Berita,
  TagBerita,
  Agenda,
  DokumenPublik,
  GaleriMedia,
  BannerSlider,
  PengaturanWeb,
  MenuNavigasi,
  Halaman,
  VisitorLog,
  LampiranBerita,
  KomentarBerita,
  Testimoni
};
