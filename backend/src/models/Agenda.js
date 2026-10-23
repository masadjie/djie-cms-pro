const { DataTypes, Model } = require('sequelize');

class Agenda extends Model {}

const initAgendaModel = (sequelize) => {
  Agenda.init(
    {
      id: {
        type: DataTypes.INTEGER,
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
      kategori: {
        type: DataTypes.STRING(100),
        defaultValue: 'Pengembangan Karir'
      },
      deskripsi: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      lokasi: {
        type: DataTypes.STRING(255),
        allowNull: false,
        defaultValue: 'Aula BKPSDM Kab. Aceh Tamiang'
      },
      tipe_pelaksanaan: {
        type: DataTypes.ENUM('OFFLINE', 'ONLINE', 'HYBRID'),
        defaultValue: 'OFFLINE'
      },
      start_time: {
        type: DataTypes.DATE,
        allowNull: false
      },
      end_time: {
        type: DataTypes.DATE,
        allowNull: false
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
      },
      link_pendaftaran: {
        type: DataTypes.STRING(500),
        allowNull: true
      }
    },
    {
      sequelize,
      modelName: 'Agenda',
      tableName: 'agenda',
      indexes: [
        { name: 'idx_agenda_slug', unique: true, fields: ['slug'] },
        { name: 'idx_agenda_dates', fields: ['start_time', 'end_time', 'is_active'] }
      ]
    }
  );

  return Agenda;
};

module.exports = { Agenda, initAgendaModel };
