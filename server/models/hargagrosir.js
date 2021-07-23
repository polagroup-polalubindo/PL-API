'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class HargaGrosir extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      HargaGrosir.belongsTo(models.Produk);
    }
  };
  HargaGrosir.init({
    produkId: DataTypes.INTEGER,
    banyak: DataTypes.INTEGER,
    harga: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'HargaGrosir',
  });
  return HargaGrosir;
};