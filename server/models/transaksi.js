"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Transaksi extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Transaksi.hasMany(models.Cart);
      Transaksi.hasMany(models.TransaksiKomisi);
    }
  }
  Transaksi.init(
    {
      invoice: DataTypes.STRING,
      totalHarga: DataTypes.INTEGER,
      ongkosKirim: DataTypes.INTEGER,
      kurir: DataTypes.STRING,
      statusPesanan: DataTypes.STRING,
      statusPembayaran: DataTypes.STRING,
      statusPengiriman: DataTypes.STRING,
      noResi: DataTypes.STRING,
      metodePembayaran: DataTypes.STRING,
      namaRekening: DataTypes.STRING,
      jumlahBayar: DataTypes.INTEGER,
      bankAsal: DataTypes.STRING,
      bankTujuan: DataTypes.STRING,
      namaPenerima: DataTypes.STRING,
      alamatPengiriman: DataTypes.STRING,
      telfonPenerima: DataTypes.STRING,
      referralCode: DataTypes.STRING,
      expiredAt: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "Transaksi",
    }
  );
  return Transaksi;
};
