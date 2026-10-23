const { DataTypes, Model } = require('sequelize');

class Layanan extends Model {}

const initLayananModel = (sequelize) => {
  Layanan.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      opd_id: {
        type: DataTypes.UUID,
        allowNull: false
      },
      kategori_id: {
        type: DataTypes.UUID,
        allowNull: false
      },
      kode_layanan: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true
      },
      nama_layanan: {
        type: DataTypes.STRING(255),
        allowNull: false
      },
      slug: {
        type: DataTypes.STRING(300),
        allowNull: false,
        unique: true
      },
      deskripsi: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      dasar_hukum: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      biaya: {
        type: DataTypes.STRING(100),
        defaultValue: 'Gratis (Rp 0)'
      },
      estimasi_waktu: {
        type: DataTypes.STRING(100),
        defaultValue: '1 - 3 Hari Kerja'
      },
      output_layanan: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment: 'Contoh: KTP-el, Kartu Keluarga, SKCK, Izin Usaha'
      },
      tipe_layanan: {
        type: DataTypes.ENUM('ONLINE_FULL', 'SEMI_ONLINE', 'INFORMASI_OFFLINE', 'LINK_EKSTERNAL'),
        defaultValue: 'ONLINE_FULL'
      },
      link_eksternal: {
        type: DataTypes.STRING(500),
        allowNull: true
      },
      jam_operasional: {
        type: DataTypes.STRING(200),
        defaultValue: 'Senin - Jumat (08.00 - 16.00 WIB)'
      },
      kontak_pengaduan: {
        type: DataTypes.STRING(255),
        allowNull: true
      },
      is_populer: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      status_layanan: {
        type: DataTypes.ENUM('AKTIF', 'MAINTENANCE', 'NONAKTIF'),
        defaultValue: 'AKTIF'
      },
      total_dilihat: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      },
      total_diajukan: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      }
    },
    {
      sequelize,
      modelName: 'Layanan',
      tableName: 'layanan'
    }
  );

  return Layanan;
};

module.exports = { Layanan, initLayananModel };
