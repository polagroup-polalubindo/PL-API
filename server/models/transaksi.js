'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Transaksi extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Transaksi.init({
    invoice: DataTypes.STRING,
    statusPembayaran: DataTypes.BOOLEAN,
    statusPengiriman: DataTypes.BOOLEAN,
    metodePembayaran: DataTypes.STRING,
    namaRekening: DataTypes.STRING,
    jumlahBayar: DataTypes.INTEGER,
    bankAsal: DataTypes.STRING,
    bankTujuan: DataTypes.STRING,
    namaPenerima: DataTypes.STRING,
    alamatPengiriman: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Transaksi',
  });
  return Transaksi;
};