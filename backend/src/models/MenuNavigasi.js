const { DataTypes } = require('sequelize');

function initMenuNavigasiModel(sequelize) {
  return sequelize.define('MenuNavigasi', {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true
    },
    label: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    url: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    tipe: {
      type: DataTypes.STRING(30),
      defaultValue: 'LINK'
    },
    icon: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    page_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true
    },
    parent_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true
    },
    urutan: {
      type: DataTypes.INTEGER,
      defaultValue: 1
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    target_blank: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    tableName: 'menu_navigasi',
    timestamps: true,
    underscored: true,
    indexes: [
      { fields: ['urutan'] },
      { fields: ['is_active'] },
      { fields: ['parent_id'] }
    ]
  });
}

module.exports = { initMenuNavigasiModel };
