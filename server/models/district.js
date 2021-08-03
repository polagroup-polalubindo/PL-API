'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class District extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      District.hasMany(models.Alamat, {foreignKey: 'kecamatanId'});
      District.hasMany(models.Transaksi, {foreignKey: 'recipientDistrictId'});
    }
  };
  District.init({
    name: DataTypes.STRING,
    cityId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'District',
  });
  return District;
};