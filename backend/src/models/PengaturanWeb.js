const { DataTypes } = require('sequelize');

function initPengaturanWebModel(sequelize) {
  return sequelize.define('PengaturanWeb', {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true
    },
    key_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true
    },
    value: {
      type: DataTypes.TEXT('long'),
      allowNull: true
    },
    kategori_setting: {
      type: DataTypes.ENUM('UMUM', 'KONTAK', 'SOSIAL_MEDIA', 'SEO', 'SIKEPO_INTEGRASI', 'TAMPILAN', 'SISTEM'),
      defaultValue: 'UMUM'
    },
    deskripsi: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    tableName: 'pengaturan_web',
    timestamps: true,
    underscored: true
  });
}

module.exports = { initPengaturanWebModel };
