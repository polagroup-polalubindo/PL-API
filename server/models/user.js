"use strict";
const { Model } = require("sequelize");
const bycrpt = require("bcryptjs");
const { genSaltSync } = require("bcrypt");
const shortid = require("shortid");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.belongsToMany(models.Produk, { through: models.Cart });
      User.hasMany(models.Cart);
      User.hasMany(models.Komisi, { foreignKey: 'userId' });
      User.hasMany(models.TransaksiKomisi);
      User.hasMany(models.Alamat);
      User.hasMany(models.Warranty, { foreignKey: 'userId' })
    }
  }
  User.init(
    {
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          notEmpty: true,
          isEmail: true,
          isUnique: async function (value) {
            const userData = await User.findOne({ where: { email: value } });
            if (userData) {
              throw { message: `email address already in use` };
            }
          },
        },
      },
      password: {
        type: DataTypes.STRING,
        validate: {
          notEmpty: true,
        },
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          notEmpty: true,
          isUnique: async function (value) {
            const userData = await User.findOne({ where: { phone: value } });
            if (userData) {
              throw { message: `phone number already in use` };
            }
          },
        },
      },
      nama: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      // alamat: DataTypes.STRING,
      role: DataTypes.STRING,
      referral: DataTypes.STRING,
      referralStatus: DataTypes.BOOLEAN,
      statusPremier: DataTypes.STRING,
      status: DataTypes.BOOLEAN,
      discountStatus: DataTypes.BOOLEAN,
      discount: DataTypes.INTEGER,
      bank: DataTypes.STRING,
      noRekening: DataTypes.STRING,
      photo: DataTypes.STRING,
      noKtp: {
        type: DataTypes.STRING,
        validate: {
          isUnique: async function (value) {
            const userData = await User.findOne({ where: { noKtp: value } });
            if (userData) {
              throw { message: `no KTP already in use` };
            }
          },
        },
      },
      noNPWP: {
        type: DataTypes.STRING,
        validate: {
          isUnique: async function (value) {
            const userData = await User.findOne({ where: { noNPWP: value } });
            if (userData) {
              throw { message: `no NPWP already in use` };
            }
          },
        },
      },
      totalPembelian: DataTypes.INTEGER,
      namaRekening: DataTypes.STRING
    },
    {
      sequelize,
      modelName: "User",
    }
  );

  User.beforeCreate((user, option) => {
    user.role = "customer";
    user.status = true;
    user.discountStatus = false;
    // user.password = user.phone
    user.referral = shortid.generate();

    const salt = genSaltSync(10);
    user.password = bycrpt.hashSync(user.password, salt);
  });

  User.afterUpdate((user, option) => {
    const salt = genSaltSync(10);
    user.password = bycrpt.hashSync(user.password, salt);
  });
  return User;
};
