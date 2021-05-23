"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Alamat extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Alamat.belongsTo(models.User);
    }
  }
  Alamat.init(
    {
      kecamatan: DataTypes.STRING,
      kelurahan: DataTypes.STRING,
      alamat: DataTypes.STRING,
      kodepos: DataTypes.STRING,
      userId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Alamat",
    }
  );
  return Alamat;
};
