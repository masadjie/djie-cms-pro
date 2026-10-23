const { DataTypes, Model } = require('sequelize');

class KategoriBerita extends Model {}

const initKategoriBeritaModel = (sequelize) => {
  KategoriBerita.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      nama_kategori: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true
      },
      slug: {
        type: DataTypes.STRING(120),
        allowNull: false,
        unique: true
      },
      deskripsi: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      urutan: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
      }
    },
    {
      sequelize,
      modelName: 'KategoriBerita',
      tableName: 'kategori_berita',
      indexes: [
        { name: 'idx_kategori_berita_slug', unique: true, fields: ['slug'] },
        { name: 'idx_kategori_berita_active', fields: ['is_active', 'urutan'] }
      ]
    }
  );

  return KategoriBerita;
};

module.exports = { KategoriBerita, initKategoriBeritaModel };
