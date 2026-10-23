const { DataTypes, Model } = require('sequelize');

class KategoriLayanan extends Model {}

const initKategoriLayananModel = (sequelize) => {
  KategoriLayanan.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
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
      ikon: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: 'Nama ikon Lucide (misal: FileText, Heart, Building, GraduationCap)'
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
      modelName: 'KategoriLayanan',
      tableName: 'kategori_layanan'
    }
  );

  return KategoriLayanan;
};

module.exports = { KategoriLayanan, initKategoriLayananModel };
