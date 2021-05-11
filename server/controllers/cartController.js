const {
  Cart,
  Produk,
  User,
  Transaksi,
  TransaksiKomisi,
  Komisi,
} = require("../models");
const { generateToken } = require("../helpers/jwt");
const { verifyToken } = require("../helpers/jwt");
const { transporter, checkOutMail } = require("../helpers/mailer");

class Controller {
  static getCart = async (req, res) => {
    try {
      const shoppingCart = await Cart.findAll({
        where: { userId: req.user.id },
        include: [Produk, User],
      });
      return res.status(200).json(shoppingCart);
    } catch (error) {
      return res.status(400).json(error);
    }
  };

  static checkOut = async (req, res) => {
    try {
      const { userData, transaksiData, value } = req.body;
      let access_token;
      let newUserId;
      if (!req.body.access_token) {
        const { dataValues } = await User.create({
          email: userData.email,
          phone: userData.phone,
          nama: userData.nama,
          password: userData.phone,
        });
        newUserId = dataValues.id;
        const komisiCustomer = await Komisi.create({ userId: dataValues.id });
        access_token = generateToken(dataValues);
      } else {
        const userLogin = verifyToken(req.body.access_token);
        const data = await User.findOne({ where: { email: userLogin.email } });
        newUserId = data.id;
      }
      const { id } = await Transaksi.create(transaksiData);
      const promiseQuery = [];
      value.map((val) => {
        val.UserId = newUserId;
        val.transaksiId = id;
        promiseQuery.push(
          Produk.update(val.produk, { where: { id: val.produk.id } })
        );
      });
      const updateProduk = await Promise.all(promiseQuery);
      const carts = await Cart.bulkCreate(value);
      if (req.body.access_token) {
        return res
          .status(201)
          .json({ message: `checkout success`, transaksiId: id });
      }
      return res.status(201).json({ access_token, transaksiId: id });
    } catch (error) {
      console.log(error);
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
      const { ref } = req.query;
      // console.log(ref,"<<<");
      // const { referralCode } = req.params;
      if (ref) {
        console.log(">>>>>>>> ada ref <<<<<<<<<<");
        const { id } = await User.findOne({
          where: { referral: ref },
        });
        const addNewTransaksiKomisi = await TransaksiKomisi.create({
          komisiId: id,
          userId: req.user.id,
          nominal: totalHarga * 0.1,
        });
        const getUserKomisiData = await Komisi.findOne({ where: { id } });
        getUserKomisiData.totalKomisi =
          getUserKomisiData.totalKomisi + Number(totalHarga) * 0.1;
        const addTotalKomisi = await Komisi.update(
          getUserKomisiData.dataValues,
          { where: { userId: id } }
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
      console.log(edited, "< edit");
      return res.status(200).json({ message: `payment confirmed` });
    } catch (error) {
      return res.status(400).json(error);
    }
  };

  static testget = async (req, res) => {
    try {
      console.log(req.query, "<<<");
      const transaksi = await Transaksi.findAll();
      return res.status(200).json({ message: "test" });
    } catch (error) {
      res.status(400).json(error);
    }
  };
}

module.exports = Controller;
