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
      Transaksi.belongsTo(models.Province, { foreignKey: 'recipientProvinceId' });
      Transaksi.belongsTo(models.City, { foreignKey: 'recipientCityId' });
      Transaksi.belongsTo(models.District, { foreignKey: 'recipientDistrictId' });
    }
  }
  Transaksi.init(
    {
      invoice: DataTypes.STRING,
      totalHarga: DataTypes.INTEGER,
      ongkosKirim: DataTypes.INTEGER,
      kurir: DataTypes.STRING,
      serviceKurir: DataTypes.STRING,
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
      tanggalPengiriman: DataTypes.DATE,
      insurance: DataTypes.BOOLEAN,
      insuranceFee: DataTypes.INTEGER,
      recipientProvinceId: DataTypes.INTEGER,
      recipientCityId: DataTypes.INTEGER,
      recipientDistrictId: DataTypes.INTEGER,
      recipientAddress: DataTypes.STRING,
      recipientZipCode: DataTypes.STRING,
      orderNo: DataTypes.STRING,
      itemName: DataTypes.STRING,
      itemQuantity: DataTypes.INTEGER,
      weight: DataTypes.STRING,
      expressType: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Transaksi",
    }
  );
  return Transaksi;
};
