'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Komisi extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Komisi.belongsTo(models.User)
      Komisi.hasMany(models.TransaksiKomisi)
    }
  };
  Komisi.init({
    userId: DataTypes.STRING,
    totalKomisi: DataTypes.INTEGER,
    sisaKomisi: DataTypes.INTEGER,
    month: DataTypes.STRING,
    year: DataTypes.STRING,
    status: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Komisi',
  });
  Komisi.beforeCreate((Komisi, option) => {
    Komisi.totalKomisi = 0
    Komisi.sisaKomisi = 0
  })
  return Komisi;
};