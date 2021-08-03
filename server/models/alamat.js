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
      Alamat.belongsTo(models.Province, {foreignKey: 'provinsiId'});
      Alamat.belongsTo(models.City, {foreignKey: 'kotaId'});
      Alamat.belongsTo(models.District, {foreignKey: 'kecamatanId'});
    }
  }
  Alamat.init(
    {
      kecamatanId: DataTypes.INTEGER,
      kotaId: DataTypes.INTEGER,
      provinsiId: DataTypes.INTEGER,
      kelurahan: DataTypes.STRING,
      alamat: DataTypes.STRING,
      detail: DataTypes.STRING,
      kodepos: DataTypes.STRING,
      userId: DataTypes.INTEGER,
      keterangan: DataTypes.STRING
    },
    {
      sequelize,
      modelName: "Alamat",
    }
  );
  return Alamat;
};
