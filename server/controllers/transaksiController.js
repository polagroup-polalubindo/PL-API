const { Transaksi, Cart, Produk, User } = require("../models");

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
        where: { statusPembayaran: "menunggu konfirmasi" },
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

  static konfirmasiTransaksi = async (req, res) => {
    const {
      Carts,
      id,
      statusPembayaran,
      statusPengiriman,
      statusPesanan,
      totalHarga,
      ongkosKirim,
    } = req.body;
    const konfirmasi = await Transaksi.update(
      { id, statusPembayaran, statusPengiriman, statusPesanan },
      { where: { id } }
    );

    const customerData = await User.findOne({ where: { id: Carts[0].userId } });
    customerData.totalPembelian += totalHarga - ongkosKirim;
    const update = await User.update(
      { totalPembelian: customerData.totalPembelian },
      {
        where: { id: customerData.id },
      }
    );
  };

  static tolakPesanan = async (req, res) => {
    const {
      Carts,
      alamatPengiriman,
      bankAsal,
      bankTujuan,
      id,
      invoice,
      jumlahBayar,
      metodePembayaran,
      namaPenerima,
      namaRekening,
      ongkosKirim,
      referralCode,
      statusPembayaran,
      statusPengiriman,
      statusPesanan,
      telfonPenerima,
      totalHarga,
    } = req.body;
    const data = await Transaksi.update(
      {
        alamatPengiriman,
        bankAsal,
        bankTujuan,
        id,
        invoice,
        jumlahBayar,
        metodePembayaran,
        namaPenerima,
        namaRekening,
        ongkosKirim,
        referralCode,
        statusPembayaran,
        statusPengiriman,
        statusPesanan,
        telfonPenerima,
        totalHarga,
      },
      { where: { id } }
    );
    const promiseGetProdukData = [];
    const produk = [];
    Carts.map((cart) => {
      produk.push({ qty: cart.qty, produkId: cart.produkId });
      promiseGetProdukData.push(
        Produk.findOne({ where: { id: cart.produkId } })
      );
    });
    const produkData = await Promise.all(promiseGetProdukData);
    const promiseEditProduk = [];
    produkData.map((item) => {
      produk.map((el) => {
        if (item.id === el.produkId) {
          item.stock += el.qty;
          promiseEditProduk.push(
            Produk.update(item.dataValues, { where: { id: item.id } })
          );
        }
      });
    });
    const editedProduk = await Promise.all(promiseEditProduk);

    return res.status(200).json(editedProduk);
  };
}

module.exports = Controller;
