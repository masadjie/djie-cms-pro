const { DataTypes } = require('sequelize');

function initDokumenPublikModel(sequelize) {
  return sequelize.define('DokumenPublik', {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      primaryKey: true,
      autoIncrement: true
    },
    judul: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    slug: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true
    },
    nomor_surat: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    tahun: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 2026
    },
    kategori: {
      type: DataTypes.ENUM('PERATURAN_BUPATI', 'SURAT_EDARAN', 'PENGUMUMAN_CASN', 'FORMULIR_KEPEGAWAIAN', 'PANDUAN_SIKEPO', 'LAPORAN_KINERJA'),
      allowNull: false,
      defaultValue: 'SURAT_EDARAN'
    },
    deskripsi: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    file_url: {
      type: DataTypes.STRING(500),
      allowNull: false
    },
    file_size_kb: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    download_count: {
      type: DataTypes.INTEGER.UNSIGNED,
      defaultValue: 0
    },
    status: {
      type: DataTypes.ENUM('PUBLISHED', 'DRAFT', 'ARCHIVED'),
      defaultValue: 'PUBLISHED'
    }
  }, {
    tableName: 'dokumen_publik',
    timestamps: true,
    underscored: true,
    paranoid: true,
    indexes: [
      { fields: ['kategori'] },
      { fields: ['tahun'] },
      { fields: ['status'] }
    ]
  });
}

module.exports = { initDokumenPublikModel };
