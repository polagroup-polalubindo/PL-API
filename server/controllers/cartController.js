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
      const shoppingCart = await Cart.findAll({ include: [Produk, User] });
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
        return res.status(201).json({ message: `checkout success` });
      }
      return res.status(201).json({ access_token });
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

  static testget = async (req, res) => {
    try {
      const prod1 = {
        id: 1,
        namaProduk: "Macbook Pro 13 M1",
        deskripsi: "2021",
        fotoProduk: null,
        videoProduk: null,
        stock: 2,
        statusProduk: true,
        sku: "MBPM1",
        weight: 1000,
        panjang: null,
        lebar: null,
        tinggi: null,
        komisi: 10,
        komisiProduk: true,
        price: 18000000,
        brandId: 1,
        createdAt: "2021-04-01T03:34:39.000Z",
        updatedAt: "2021-04-01T03:34:39.000Z",
        BrandId: 1,
      };
      const prod2 = {
        id: 3,
        namaProduk: "TUF X506",
        deskripsi: "2020",
        fotoProduk: null,
        videoProduk: null,
        stock: 20,
        statusProduk: true,
        sku: "TUF506",
        weight: 1000,
        panjang: null,
        lebar: null,
        tinggi: null,
        komisi: 10,
        komisiProduk: true,
        price: 14500000,
        brandId: 2,
        createdAt: "2021-04-01T03:35:39.000Z",
        updatedAt: "2021-04-01T03:35:39.000Z",
        BrandId: 2,
      };
      const test = await Promise.all([
        Produk.update(prod1, { where: { id: 1 } }),
        Produk.update(prod2, { where: { id: 3 } }),
      ]);
      res.status(200).json(test);
    } catch (error) {
      res.status(400).json(error);
    }
  };
}

module.exports = Controller;
