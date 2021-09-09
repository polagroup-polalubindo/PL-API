const {
  Cart,
  Produk,
  User,
  Transaksi,
  TransaksiKomisi,
  Komisi,
  Voucher
} = require("../models");
const { generateToken } = require("../helpers/jwt");
const { verifyToken } = require("../helpers/jwt");
const { transporter, checkOutMail } = require("../helpers/mailer");
const { scheduleCancelExpiredTransaction } = require('../helpers/scheduler')

class Controller {
  static getCart = async (req, res) => {
    try {
      const shoppingCart = await Cart.findAll({
        where: { userId: req.user.id },
        include: [Produk],
      });
      return res.status(200).json(shoppingCart);
    } catch (error) {
      return res.status(500).json(error);
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

        access_token = generateToken(dataValues);
      } else {
        const userLogin = verifyToken(req.body.access_token);
        const data = await User.findOne({ where: { email: userLogin.email } });
        newUserId = data.id;
        access_token = req.body.access_token;
      }

      if (transaksiData.referralCode) {
        const checkUserReferralCode = await User.findOne({
          where: { referral: referralCode },
        });

        if (!checkUserReferralCode) delete transaksiData.referralCode
      }

      let month = new Date().getMonth() + 1 < 10 ? `0${new Date().getMonth() + 1}` : new Date().getMonth() + 1
      let date = new Date().getDate() < 10 ? `0${new Date().getDate()}` : new Date().getDate()
      let lastTransaction = await Transaksi.findOne({ order: [['id', 'DESC']], attributes: ['id', 'invoice'] })

      let lastInvoice = lastTransaction.invoice.split('/'), newNumber, newNumberString;
      if (lastInvoice) {
        let lastNoUrutInvoice = +lastInvoice[lastInvoice.length - 1]
        newNumber = lastNoUrutInvoice + 1
        newNumberString = '' + newNumber

        for (let i = newNumberString.length; i < 4; i++) {
          newNumberString = `0${newNumberString}`
        }
      }

      transaksiData.invoice = `INV/${new Date().getFullYear()}${month}${date}/VK/${newNumberString}`
      transaksiData.orderNo = `IDVK${new Date().getFullYear()}${month}${date}${newNumberString}`

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

      if (transaksiData.voucher1) {
        let voucherSelected = await Voucher.findOne({ where: { id: transaksiData.voucher1, isUnlimited: 0 } })

        await Voucher.update({ usageQuota: +voucherSelected.usageQuota - 1 }, { where: { id: voucherSelected.id } })
      }

      if (transaksiData.voucher2) {
        let voucherSelected = await Voucher.findOne({ where: { id: transaksiData.voucher2, isUnlimited: 0 } })

        await Voucher.update({ usageQuota: +voucherSelected.usageQuota - 1 }, { where: { id: voucherSelected.id } })
      }


      res.status(201).json({ access_token, transaksiId: id });

      scheduleCancelExpiredTransaction(id)
    } catch (error) {
      console.log(error);
      error.name === "SequelizeValidationError"
        ? res.status(500).json({ errMessage: error.errors[0].message })
        : res.status(500).json(error);
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
      return res.status(500).json({ errMessage: error.errors });
    }
  };
}

module.exports = Controller;
