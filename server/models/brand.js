'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Brand extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Brand.hasMany(models.Produk, { foreignKey: 'brandId'})
    }
  };
  Brand.init({
    namaBrand: {
      type: DataTypes.STRING,
      allowNull:false,
      validate:{
        notEmpty:true,
      }
    },
    fotoBrand: DataTypes.STRING,
    komisiStatus: DataTypes.BOOLEAN,
    discountStatus: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Brand',
  });

  Brand.beforeCreate((brand,option)=>{
    brand.komisiStatus = true
    brand.discountStatus = false
  })

  return Brand;
};