const { DataTypes } = require('sequelize');

function initKomentarBeritaModel(sequelize) {
  const KomentarBerita = sequelize.define(
    'KomentarBerita',
    {
      id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true
      },
      berita_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
          model: 'berita',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      nama_pengirim: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
          notEmpty: true,
          len: [2, 100]
        }
      },
      email_pengirim: {
        type: DataTypes.STRING(150),
        allowNull: false,
        validate: {
          isEmail: true
        }
      },
      instansi_pengirim: {
        type: DataTypes.STRING(150),
        allowNull: true,
        defaultValue: null
      },
      isi_komentar: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notEmpty: true,
          len: [5, 1500]
        }
      },
      status: {
        type: DataTypes.ENUM('PENDING', 'APPROVED', 'REJECTED'),
        allowNull: false,
        defaultValue: 'PENDING',
        comment: 'PENDING: butuh approval admin, APPROVED: tampil di publik, REJECTED: ditolak'
      },
      is_approved: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      approved_by: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id'
        },
        onDelete: 'SET NULL'
      },
      approved_at: {
        type: DataTypes.DATE,
        allowNull: true
      },
      catatan_moderasi: {
        type: DataTypes.STRING(255),
        allowNull: true
      },
      ip_address: {
        type: DataTypes.STRING(45),
        allowNull: true
      },
      user_agent: {
        type: DataTypes.TEXT,
        allowNull: true
      }
    },
    {
      tableName: 'komentar_berita',
      timestamps: true,
      underscored: true,
      indexes: [
        { fields: ['berita_id'] },
        { fields: ['status'] },
        { fields: ['is_approved'] },
        { fields: ['created_at'] }
      ]
    }
  );

  return KomentarBerita;
}

module.exports = { initKomentarBeritaModel };
