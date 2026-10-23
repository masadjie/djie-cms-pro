const { DataTypes, Model } = require('sequelize');

class TagBerita extends Model {}

const initTagBeritaModel = (sequelize) => {
  TagBerita.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      nama_tag: {
        type: DataTypes.STRING(80),
        allowNull: false,
        unique: true
      },
      slug: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true
      }
    },
    {
      sequelize,
      modelName: 'TagBerita',
      tableName: 'tag_berita',
      indexes: [
        { name: 'idx_tag_berita_slug', unique: true, fields: ['slug'] }
      ]
    }
  );

  return TagBerita;
};

module.exports = { TagBerita, initTagBeritaModel };
