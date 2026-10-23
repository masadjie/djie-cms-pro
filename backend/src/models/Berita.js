const { DataTypes, Model } = require('sequelize');

class Berita extends Model {}

const initBeritaModel = (sequelize) => {
  Berita.init(
    {
      id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true
      },
      title: {
        type: DataTypes.STRING(255),
        allowNull: false
      },
      slug: {
        type: DataTypes.STRING(280),
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
      cover_caption: {
        type: DataTypes.STRING(255),
        allowNull: true
      },
      kategori_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      kategori_ids: {
        type: DataTypes.JSON,
        allowNull: true
      },
      author_id: {
        type: DataTypes.UUID,
        allowNull: true
      },
      author_name: {
        type: DataTypes.STRING(120),
        defaultValue: 'Humas BKPSDM Aceh Tamiang'
      },
      status: {
        type: DataTypes.ENUM('DRAFT', 'PUBLISHED', 'ARCHIVED'),
        defaultValue: 'PUBLISHED'
      },
      published_at: {
        type: DataTypes.DATE,
        allowNull: true
      },
      views_count: {
        type: DataTypes.INTEGER.UNSIGNED,
        defaultValue: 0
      },
      is_featured: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      is_pinned: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      // SEO Specific Fields
      meta_title: {
        type: DataTypes.STRING(160),
        allowNull: true
      },
      meta_description: {
        type: DataTypes.STRING(320),
        allowNull: true
      },
      meta_keywords: {
        type: DataTypes.STRING(255),
        allowNull: true
      },
      canonical_url: {
        type: DataTypes.STRING(500),
        allowNull: true
      },
      read_time_minutes: {
        type: DataTypes.INTEGER,
        defaultValue: 3
      }
    },
    {
      sequelize,
      modelName: 'Berita',
      tableName: 'berita',
      indexes: [
        { name: 'idx_berita_slug', unique: true, fields: ['slug'] },
        { name: 'idx_berita_status_pub', fields: ['status', 'published_at'] },
        { name: 'idx_berita_kat_status_pub', fields: ['kategori_id', 'status', 'published_at'] },
        { name: 'idx_berita_featured_status', fields: ['is_featured', 'status', 'published_at'] },
        { name: 'idx_berita_pinned_status', fields: ['is_pinned', 'status', 'published_at'] },
        { name: 'idx_berita_views', fields: ['views_count'] }
      ]
    }
  );

  return Berita;
};

module.exports = { Berita, initBeritaModel };
