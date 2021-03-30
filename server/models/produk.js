'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Produk extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Produk.belongsTo(models.Brand)
      Produk.belongsToMany(models.User,{through:models.Cart})
      Produk.hasMany(models.Cart)
    }
  };
  Produk.init({
    namaProduk: {
      type: DataTypes.STRING,
      allowNull:false,
      validate:{
        notEmpty:true,
      }
    },
    deskripsi: {
      type: DataTypes.STRING,
      allowNull:false,
      validate:{
        notEmpty:true,
      }
    },
    fotoProduk: DataTypes.STRING,
    videoProduk: DataTypes.STRING,
    stock: DataTypes.INTEGER,
    statusProduk: DataTypes.BOOLEAN,
    sku: {
      type: DataTypes.STRING,
      allowNull:false,
      validate:{
        notEmpty:true,
      }
    },
    weight: DataTypes.INTEGER,
    panjang: DataTypes.INTEGER,
    lebar: DataTypes.INTEGER,
    tinggi: DataTypes.INTEGER,
    komisi: DataTypes.INTEGER,
    komisiProduk: DataTypes.BOOLEAN,
    price: DataTypes.INTEGER,
    brandId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Produk',
  });

  Produk.beforeCreate((produk,option)=>{
    produk.stock = 0
    produk.statusProduk = true
    produk.komisi = 10
    produk.komisiProduk = true
  })
  return Produk;
};