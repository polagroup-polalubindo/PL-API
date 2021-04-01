'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Cart extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Cart.belongsTo(models.Produk)
      Cart.belongsTo(models.User)
      Cart.belongsTo(models.Transaksi)
    }
  };
  Cart.init({
    produkId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER,
    transaksiId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Cart',
  });
  return Cart;
};