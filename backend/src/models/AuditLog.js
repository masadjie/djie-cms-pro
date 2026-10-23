const { DataTypes, Model } = require('sequelize');

class AuditLog extends Model {}

const initAuditLogModel = (sequelize) => {
  AuditLog.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      user_id: {
        type: DataTypes.UUID,
        allowNull: true
      },
      nik: {
        type: DataTypes.STRING(16),
        allowNull: true
      },
      role: {
        type: DataTypes.STRING(50),
        allowNull: true
      },
      action: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'Contoh: LOGIN, BUAT_PERMOHONAN, UPDATE_STATUS_PERMOHONAN, CREATE_LAYANAN'
      },
      module: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'Contoh: AUTH, LAYANAN, PERMOHONAN, ADMIN_OPD'
      },
      ip_address: {
        type: DataTypes.STRING(45),
        allowNull: true
      },
      user_agent: {
        type: DataTypes.STRING(255),
        allowNull: true
      },
      details: {
        type: DataTypes.JSON,
        allowNull: true
      }
    },
    {
      sequelize,
      modelName: 'AuditLog',
      tableName: 'audit_logs',
      updatedAt: false // Immutable audit trail log
    }
  );

  return AuditLog;
};

module.exports = { AuditLog, initAuditLogModel };
