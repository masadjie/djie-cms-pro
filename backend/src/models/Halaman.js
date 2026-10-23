const { DataTypes } = require('sequelize');

function initHalamanModel(sequelize) {
  return sequelize.define('Halaman', {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    slug: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true
    },
    excerpt: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    content: {
      type: DataTypes.TEXT('long'),
      allowNull: false
    },
    cover_image: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    template: {
      type: DataTypes.ENUM('DEFAULT', 'FULL_WIDTH', 'SIDEBAR'),
      defaultValue: 'DEFAULT'
    },
    status: {
      type: DataTypes.ENUM('PUBLISHED', 'DRAFT'),
      defaultValue: 'PUBLISHED'
    },
    views_count: {
      type: DataTypes.INTEGER.UNSIGNED,
      defaultValue: 0
    }
  }, {
    tableName: 'halaman',
    timestamps: true,
    underscored: true,
    paranoid: true,
    indexes: [
      { fields: ['status'] },
      { fields: ['views_count'] }
    ]
  });
}

module.exports = { initHalamanModel };
