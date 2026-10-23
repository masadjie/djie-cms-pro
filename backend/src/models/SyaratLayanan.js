const { DataTypes, Model } = require('sequelize');

class SyaratLayanan extends Model {}

const initSyaratLayananModel = (sequelize) => {
  SyaratLayanan.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      layanan_id: {
        type: DataTypes.UUID,
        allowNull: false
      },
      nama_syarat: {
        type: DataTypes.STRING(255),
        allowNull: false
      },
      deskripsi: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      tipe_file: {
        type: DataTypes.STRING(100),
        defaultValue: 'pdf,jpg,png',
        comment: 'Ekstensi file yang diizinkan diupload'
      },
      max_size_mb: {
        type: DataTypes.INTEGER,
        defaultValue: 2
      },
      is_mandatory: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
      },
      urutan: {
        type: DataTypes.INTEGER,
        defaultValue: 1
      }
    },
    {
      sequelize,
      modelName: 'SyaratLayanan',
      tableName: 'syarat_layanan'
    }
  );

  return SyaratLayanan;
};

module.exports = { SyaratLayanan, initSyaratLayananModel };
