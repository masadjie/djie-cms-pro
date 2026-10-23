const { DataTypes } = require('sequelize');

function initGaleriMediaModel(sequelize) {
  return sequelize.define('GaleriMedia', {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      primaryKey: true,
      autoIncrement: true
    },
    judul: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    tipe: {
      type: DataTypes.ENUM('FOTO', 'VIDEO', 'INFOGRAFIS'),
      allowNull: false,
      defaultValue: 'FOTO'
    },
    media_url: {
      type: DataTypes.STRING(500),
      allowNull: false
    },
    thumbnail_url: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    album: {
      type: DataTypes.STRING(100),
      defaultValue: 'Kegiatan BKPSDM'
    },
    caption: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    views_count: {
      type: DataTypes.INTEGER.UNSIGNED,
      defaultValue: 0
    },
    status: {
      type: DataTypes.ENUM('PUBLISHED', 'DRAFT'),
      defaultValue: 'PUBLISHED'
    }
  }, {
    tableName: 'galeri_media',
    timestamps: true,
    underscored: true,
    paranoid: true,
    indexes: [
      { fields: ['tipe'] },
      { fields: ['album'] },
      { fields: ['status'] }
    ]
  });
}

module.exports = { initGaleriMediaModel };
