const { DataTypes, Model } = require('sequelize');

class Permohonan extends Model {}

const initPermohonanModel = (sequelize) => {
  Permohonan.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      nomor_tiket: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        comment: 'Nomor unik pelacakan tiket layanan (misal: TMG-20260930-001)'
      },
      user_id: {
        type: DataTypes.UUID,
        allowNull: false
      },
      layanan_id: {
        type: DataTypes.UUID,
        allowNull: false
      },
      nik_pemohon: {
        type: DataTypes.STRING(16),
        allowNull: false
      },
      nama_pemohon: {
        type: DataTypes.STRING(150),
        allowNull: false
      },
      telepon_pemohon: {
        type: DataTypes.STRING(25),
        allowNull: false
      },
      alamat_pemohon: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      catatan_pemohon: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      data_berkas: {
        type: DataTypes.JSON,
        allowNull: true,
        comment: 'JSON list dokumen yang diunggah pemohon'
      },
      status: {
        type: DataTypes.ENUM(
          'DIAJUKAN',
          'VERIFIKASI_BERKAS',
          'DIPROSES_OPD',
          'MENUNGGU_PERBAIKAN',
          'SELESAI',
          'DITOLAK'
        ),
        defaultValue: 'DIAJUKAN'
      },
      catatan_petugas: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      file_output_url: {
        type: DataTypes.STRING(500),
        allowNull: true,
        comment: 'Dokumen hasil permohonan yang dapat didownload warga jika selesai'
      },
      verified_by: {
        type: DataTypes.UUID,
        allowNull: true
      },
      verified_at: {
        type: DataTypes.DATE,
        allowNull: true
      },
      completed_at: {
        type: DataTypes.DATE,
        allowNull: true
      }
    },
    {
      sequelize,
      modelName: 'Permohonan',
      tableName: 'permohonan'
    }
  );

  return Permohonan;
};

module.exports = { Permohonan, initPermohonanModel };
