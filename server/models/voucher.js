'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Voucher extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Voucher.belongsToMany(models.Produk, { foreignKey: 'voucherId', through: models.VoucherProduct });
      Voucher.hasMany(models.VoucherProduct, { foreignKey: 'voucherId' });
      // Voucher.hasMany(models.Produk);
    }
  };
  Voucher.init({
    name: DataTypes.STRING,
    code: DataTypes.STRING,
    periodeStart: DataTypes.DATE,
    periodeEnd: DataTypes.DATE,
    typeVoucher: DataTypes.STRING,
    discountMax: DataTypes.INTEGER,
    minimumPurchase: DataTypes.INTEGER,
    usageQuota: DataTypes.INTEGER,
    forAll: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Voucher',
  });
  return Voucher;
};