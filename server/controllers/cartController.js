const {
  Cart,
  Produk,
  User,
  Transaksi,
  TransaksiKomisi,
  Komisi,
} = require("../models");
const { generateToken } = require("../helpers/jwt");
const { transporter, checkOutMail } = require("../helpers/mailer");

class Controller {
  static getCart = async (req, res) => {
    try {
      const shoppingCart = await Cart.findAll({ include: [Produk, User] });
      return res.status(200).json(shoppingCart);
    } catch (error) {
      return res.status(400).json(error);
    }
  };

  static checkOut = async (req, res) => {
    try {
      const { value } = req.body;
      const { transaksiData } = req.body;
      const { userData } = req.body;
      let access_token;
      let newUserId;
      if (userData) {
        const { dataValues } = await User.create({
          email: userData.email,
          phone: userData.phone,
          nama: userData.nama,
        });
        newUserId = dataValues.id;
        const komisiCustomer = await Komisi.create({ userId: dataValues.id });
        access_token = generateToken(dataValues);
      }
      const { id } = await Transaksi.create(transaksiData);
      value.map((val) => {
        val.UserId = newUserId;
        val.transaksiId = id;
      });
      const carts = await Cart.bulkCreate(value);
      return res.status(201).json({ carts, access_token });
    } catch (error) {
      return res.status(400).json(error);
    }
  };

  static paymentConfirmation = async (req, res) => {
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
      const { referralCode } = req.params;
      if (referralCode) {
        const { id } = await User.findOne({
          where: { referral: referralCode },
        });
        const addNewTransaksiKomisi = await TransaksiKomisi.create({
          komisiId: id,
          userId: req.user.id,
          nominal: totalHarga,
        });
        const getUserKomisiData = await Komisi.findOne({ where: { id } });
        getUserKomisiData.totalKomisi =
          getUserKomisiData.totalKomisi + Number(totalHarga) * 0.1;
        const addTotalKomisi = await Komisi.update(
          getUserKomisiData.dataValues,
          { where: { id } }
        );
      }
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
      return res.status(200).json({ message: `payment confirmed` });
    } catch (error) {
      return res.status(400).json(error);
    }
  };
}

module.exports = Controller;
