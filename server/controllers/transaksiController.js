const { Transaksi, Cart, Produk } = require("../models");

class Controller {
  static getAllTransaksi = async (req, res) => {
    try {
      const allTransaksi = await Transaksi.findAll({
        include: { model: Cart, include: Produk },
      });
      return res.status(200).json(allTransaksi);
    } catch (error) {
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
      const edited = await Transaksi.update({
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
      },{where:{id:req.params.transaksiId}})
      return res.status(200).json({message:`success editing transaksi`})
    } catch (error) {
        return res.status(400).json(error)
    }
  };
}

module.exports = Controller;
