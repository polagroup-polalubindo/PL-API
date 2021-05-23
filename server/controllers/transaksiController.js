const { Transaksi, Cart, Produk } = require("../models");

class Controller {
  static getTransaksiBeforePayment = async (req, res) => {
    try {
      const allTransaksi = await Transaksi.findAll({
        where: { statusPembayaran: null },
        include: {
          where: { userId: req.user.id },
          model: Cart,
          include: Produk,
        },
      });
      return res.status(200).json(allTransaksi);
    } catch (error) {
      console.log(error);
      return res.status(400).json(error);
    }
  };

  static getTransaksiAfterPayment = async (req, res) => {
    try {
      const allTransaksi = await Transaksi.findAll({
        where: { statusPembayaran: "success" },
        include: {
          where: { userId: req.user.id },
          model: Cart,
          include: Produk,
        },
      });
      return res.status(200).json(allTransaksi);
    } catch (error) {
      console.log(error);
      return res.status(400).json(error);
    }
  };

  static editTransaksi = async (req, res) => {
    try {
      const {
        invoice,
        totalHarga,
        ongkosKirim,
        statusPesanan,
        statusPembayaran,
        statusPengiriman,
        metodePembayaran,
        namaRekening,
        jumlahBayar,
        bankAsal,
        bankTujuan,
        namaPenerima,
        alamatPengiriman,
      } = req.body;
      const edited = await Transaksi.update(
        {
          invoice,
          totalHarga,
          ongkosKirim,
          statusPesanan,
          statusPembayaran,
          statusPengiriman,
          metodePembayaran,
          namaRekening,
          jumlahBayar,
          bankAsal,
          bankTujuan,
          namaPenerima,
          alamatPengiriman,
        },
        { where: { id: req.params.transaksiId } }
      );
      return res.status(200).json({ message: `success editing transaksi` });
    } catch (error) {
      return res.status(400).json(error);
    }
  };

  // CMS

  static getAllTransaksi = async (req, res) => {
    const data = await Transaksi.findAll({
      include: { model: Cart, include: Produk },
    });
    return res.status(200).json(data);
  };
}

module.exports = Controller;
