'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class City extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      City.hasMany(models.Alamat, {foreignKey: 'kotaId'});
      City.hasMany(models.Transaksi, {foreignKey: 'recipientCityId'});
    }
  };
  City.init({
    name: DataTypes.STRING,
    provinceId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'City',
  });
  return City;
};