const { DataTypes, Model } = require('sequelize');
const bcrypt = require('bcryptjs');

class User extends Model {
  async comparePassword(candidatePassword) {
    if (!this.password || !candidatePassword) return false;
    try {
      if (this.password.startsWith('$2')) {
        const isBcryptMatch = await bcrypt.compare(candidatePassword, this.password);
        if (isBcryptMatch) return true;
      }
      return candidatePassword === this.password;
    } catch (err) {
      return candidatePassword === this.password;
    }
  }
}

const initUserModel = (sequelize) => {
  User.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      nik: {
        type: DataTypes.STRING(16),
        allowNull: true,
        unique: true,
        validate: {
          len: [16, 16]
        },
        comment: 'NIK 16 digit warga untuk single identity login'
      },
      name: {
        type: DataTypes.STRING(150),
        allowNull: false
      },
      email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true
        }
      },
      phone: {
        type: DataTypes.STRING(20),
        allowNull: true
      },
      password: {
        type: DataTypes.STRING(255),
        allowNull: false
      },
      role: {
        type: DataTypes.ENUM('SUPER_ADMIN', 'ADMIN_OPD', 'EDITOR', 'VERIFIKATOR', 'WARGA'),
        defaultValue: 'WARGA',
        allowNull: false
      },
      opd_id: {
        type: DataTypes.UUID,
        allowNull: true,
        comment: 'ID OPD jika user bertindak sebagai operator/admin OPD'
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
      },
      failed_login_attempts: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      },
      locked_until: {
        type: DataTypes.DATE,
        allowNull: true
      },
      last_login_at: {
        type: DataTypes.DATE,
        allowNull: true
      }
    },
    {
      sequelize,
      modelName: 'User',
      tableName: 'users',
      hooks: {
        beforeCreate: async (user) => {
          if (user.password && !user.password.startsWith('$2')) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(user.password, salt);
          }
        },
        beforeSave: async (user) => {
          if (user.changed('password') && !user.password.startsWith('$2')) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(user.password, salt);
          }
        }
      }
    }
  );

  return User;
};

module.exports = { User, initUserModel };
