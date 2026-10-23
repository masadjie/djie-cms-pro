const { DataTypes } = require('sequelize');

function initTestimoniModel(sequelize) {
  return sequelize.define('Testimoni', {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      primaryKey: true,
      autoIncrement: true
    },
    nama: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    jabatan: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    instansi: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    avatar_url: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 5
    },
    pesan: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    urutan: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    tableName: 'testimoni',
    timestamps: true,
    paranoid: true,
    underscored: true
  });
}

module.exports = { initTestimoniModel };
