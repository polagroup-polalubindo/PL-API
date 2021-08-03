'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class VoucherProduct extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      VoucherProduct.belongsTo(models.Produk, { foreignKey: 'productId' })
      VoucherProduct.belongsTo(models.Voucher, { foreignKey: 'voucherId' })
    }
  };
  VoucherProduct.init({
    voucherId: DataTypes.INTEGER,
    productId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'VoucherProduct',
  });
  return VoucherProduct;
};