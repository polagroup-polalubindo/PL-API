"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class TransaksiKomisi extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      TransaksiKomisi.belongsTo(models.Komisi);
      TransaksiKomisi.belongsTo(models.User);
      TransaksiKomisi.belongsTo(models.Transaksi)
    }
  }
  TransaksiKomisi.init(
    {
      komisiId: DataTypes.INTEGER,
      userId: DataTypes.INTEGER,
      transaksiId: DataTypes.INTEGER,
      nominal: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "TransaksiKomisi",
    }
  );
  return TransaksiKomisi;
};
