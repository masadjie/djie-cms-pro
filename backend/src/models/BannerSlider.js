const { DataTypes } = require('sequelize');

function initBannerSliderModel(sequelize) {
  return sequelize.define('BannerSlider', {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      primaryKey: true,
      autoIncrement: true
    },
    judul: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    subjudul: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    gambar_url: {
      type: DataTypes.STRING(500),
      allowNull: false
    },
    target_url: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    tipe: {
      type: DataTypes.ENUM('HERO_SLIDER', 'POPUP_ALERT', 'SIKEPO_BANNER', 'PROMO_BANNER', 'SIDEBAR_BANNER'),
      allowNull: false,
      defaultValue: 'HERO_SLIDER'
    },
    urutan: {
      type: DataTypes.INTEGER,
      defaultValue: 1
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    tableName: 'banner_slider',
    timestamps: true,
    underscored: true,
    indexes: [
      { fields: ['tipe'] },
      { fields: ['is_active'] },
      { fields: ['urutan'] }
    ]
  });
}

module.exports = { initBannerSliderModel };
