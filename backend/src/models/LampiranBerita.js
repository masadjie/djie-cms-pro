const { DataTypes, Model } = require('sequelize');

class LampiranBerita extends Model {}

const initLampiranBeritaModel = (sequelize) => {
  LampiranBerita.init(
    {
      id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true
      },
      berita_id: {
        type: DataTypes.BIGINT,
        allowNull: true
      },
      nama_lampiran: {
        type: DataTypes.STRING(255),
        allowNull: false
      },
      original_filename: {
        type: DataTypes.STRING(255),
        allowNull: false
      },
      file_path: {
        type: DataTypes.STRING(500),
        allowNull: false
      },
      file_url: {
        type: DataTypes.STRING(500),
        allowNull: false
      },
      file_type: {
        type: DataTypes.STRING(100),
        defaultValue: 'application/pdf'
      },
      file_size_bytes: {
        type: DataTypes.BIGINT,
        defaultValue: 0
      },
      file_extension: {
        type: DataTypes.STRING(20),
        defaultValue: 'pdf'
      },
      kategori_dokumen: {
        type: DataTypes.STRING(50),
        defaultValue: 'LAMPIRAN_RESMI' // 'SURAT_EDARAN' | 'JUKNIS' | 'SK' | 'FORMULIR' | 'LAMPIRAN_RESMI'
      },
      downloads_count: {
        type: DataTypes.INTEGER.UNSIGNED,
        defaultValue: 0
      },
      bucket_name: {
        type: DataTypes.STRING(100),
        defaultValue: 'djie-cms-attachments'
      },
      object_name: {
        type: DataTypes.STRING(255),
        allowNull: true
      }
    },
    {
      sequelize,
      modelName: 'LampiranBerita',
      tableName: 'lampiran_berita',
      paranoid: true,
      timestamps: true,
      underscored: true,
      indexes: [
        { name: 'idx_lampiran_berita_id', fields: ['berita_id'] },
        { name: 'idx_lampiran_kategori', fields: ['kategori_dokumen'] },
        { name: 'idx_lampiran_ext', fields: ['file_extension'] }
      ]
    }
  );

  return LampiranBerita;
};

module.exports = { LampiranBerita, initLampiranBeritaModel };
