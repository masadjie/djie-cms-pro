const { DataTypes, Model } = require('sequelize');

class VisitorLog extends Model {}

const initVisitorLogModel = (sequelize) => {
  VisitorLog.init(
    {
      id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true
      },
      ip_address: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      session_id: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      path: {
        type: DataTypes.STRING(255),
        allowNull: false,
        defaultValue: '/'
      },
      referrer: {
        type: DataTypes.STRING(500),
        allowNull: true
      },
      referrer_type: {
        type: DataTypes.ENUM('SEARCH', 'DIRECT', 'SOCIAL', 'INTERNAL', 'EXTERNAL'),
        defaultValue: 'DIRECT'
      },
      device_type: {
        type: DataTypes.ENUM('MOBILE', 'DESKTOP', 'TABLET'),
        defaultValue: 'DESKTOP'
      },
      browser: {
        type: DataTypes.STRING(50),
        allowNull: true,
        defaultValue: 'Chrome'
      },
      os: {
        type: DataTypes.STRING(50),
        allowNull: true,
        defaultValue: 'Windows'
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      }
    },
    {
      sequelize,
      modelName: 'VisitorLog',
      tableName: 'visitor_logs',
      timestamps: true,
      updatedAt: false,
      createdAt: 'created_at',
      indexes: [
        { fields: ['created_at'] },
        { fields: ['path'] },
        { fields: ['device_type'] },
        { fields: ['referrer_type'] },
        { fields: ['ip_address'] }
      ]
    }
  );

  return VisitorLog;
};

module.exports = {
  VisitorLog,
  initVisitorLogModel
};
