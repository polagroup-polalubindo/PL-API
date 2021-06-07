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
        include: [Produk],
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
          email: userData?.email,
          phone: userData?.phone,
          nama: userData?.nama,
          password: userData?.phone,
        });
        newUserId = dataValues.id;
        const komisiCustomer = await Komisi.create({ userId: dataValues.id });
        access_token = generateToken(dataValues);
      } else {
        const userLogin = verifyToken(req.body.access_token);
        const data = await User.findOne({ where: { email: userLogin.email } });
        newUserId = data.id;
        access_token = req.body.access_token;
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
      return res.status(201).json({ access_token, transaksiId: id });
    } catch (error) {
      console.log(error);
      error.name === "SequelizeValidationError"
        ? res.status(400).json({ errMessage: error.errors[0].message })
        : res.status(400).json(error);
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
        telfonPenerima,
        referral,
        kurir,
        expiredAt,
      } = req.body;
      const { ref } = req.query;
      if (ref) {
        const { id, referralStatus } = await User.findOne({
          where: { referral: ref },
        });
        if (referralStatus) {
          const addNewTransaksiKomisi = await TransaksiKomisi.create({
            komisiId: id,
            userId: req.user.id,
            nominal: totalHarga * 0.1,
            transaksiId: req.params.transaksiId,
          });

          const getUserKomisiData = await Komisi.findOne({
            where: { userId: id },
          });

          getUserKomisiData.totalKomisi =
            getUserKomisiData.totalKomisi + Number(totalHarga) * 0.1;
          if (getUserKomisiData.sisaKomisi === 0) {
            getUserKomisiData.sisaKomisi = getUserKomisiData.totalKomisi;
          } else {
            getUserKomisiData.sisaKomisi += Number(totalHarga) * 0.1;
          }

          const addTotalKomisi = await Komisi.update(
            getUserKomisiData.dataValues,
            { where: { userId: id } }
          );
        }
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
          telfonPenerima,
          referral,
          kurir,
          expiredAt,
        },
        { where: { id: req.params.transaksiId } }
      );
      return res.status(200).json({ message: `payment confirmed` });
    } catch (error) {
      return res.status(400).json({ errMessage: error.errors });
    }
  };
}

module.exports = Controller;
