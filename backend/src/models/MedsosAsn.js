const { DataTypes } = require('sequelize');

function initMedsosAsnModel(sequelize) {
  return sequelize.define('MedsosAsn', {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      autoIncrement: true,
      primaryKey: true
    },
    judul: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    platform: {
      type: DataTypes.ENUM('INSTAGRAM', 'TIKTOK', 'YOUTUBE', 'FACEBOOK', 'TWITTER', 'OTHER'),
      allowNull: false,
      defaultValue: 'INSTAGRAM'
    },
    url: {
      type: DataTypes.STRING(500),
      allowNull: false
    },
    cover_image: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    badge_text: {
      type: DataTypes.STRING(80),
      allowNull: true
    },
    urutan: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    views_count: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0
    }
  }, {
    tableName: 'medsos_asn',
    timestamps: true,
    paranoid: true,
    underscored: true
  });
}

module.exports = { initMedsosAsnModel };
