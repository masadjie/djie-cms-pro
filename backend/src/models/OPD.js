const { DataTypes, Model } = require('sequelize');

class OPD extends Model {}

const initOPDModel = (sequelize) => {
  OPD.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      kode_opd: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        comment: 'Contoh: DISKOMINFO, DISDUKCAPIL, DPMPTSP, DINKES'
      },
      nama_opd: {
        type: DataTypes.STRING(255),
        allowNull: false
      },
      singkatan: {
        type: DataTypes.STRING(50),
        allowNull: true
      },
      deskripsi: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      alamat: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      email_resmi: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      telepon: {
        type: DataTypes.STRING(50),
        allowNull: true
      },
      website: {
        type: DataTypes.STRING(255),
        allowNull: true
      },
      logo_url: {
        type: DataTypes.STRING(500),
        allowNull: true
      },
      kepala_dinas: {
        type: DataTypes.STRING(150),
        allowNull: true
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
      }
    },
    {
      sequelize,
      modelName: 'OPD',
      tableName: 'opds'
    }
  );

  return OPD;
};

module.exports = { OPD, initOPDModel };
