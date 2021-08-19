const {
  Transaksi,
  Cart,
  Produk,
  User,
  Komisi,
  TransaksiKomisi,
} = require("../models");
const { Op } = require("sequelize");
const cronJob = require("cron").CronJob;

class Controller {
  static getTransaksiBeforePayment = async (req, res) => {
    try {
      const allTransaksi = await Transaksi.findAll({
        where: { statusPembayaran: "menunggu pembayaran" },
        include: {
          where: { userId: req.user.id },
          model: Cart,
          include: Produk,
        },
        order: [
          ['createdAt', 'DESC']
        ],
      });
      return res.status(200).json(allTransaksi);
    } catch (error) {
      console.log(error);
      return res.status(500).json(error);
    }
  };

  static getTransaksiAfterPayment = async (req, res) => {
    try {
      const allTransaksi = await Transaksi.findAll({
        where: {
          statusPengiriman: {
            [Op.or]: [
              "menunggu konfirmasi",
              "siap di kirim",
              "dalam pengiriman",
              "selesai",
              "pesanan di tolak",
              "pesanan selesai",
              "dibatalkan"
            ],
          },
          statusPesanan: {
            [Op.or]: [
              "menunggu konfirmasi",
              "pesanan di konfirmasi",
              "pesanan di tolak",
              "pesanan selesai",
              "dibatalkan"
            ],
          },
        },
        include: {
          where: { userId: req.user.id },
          model: Cart,
          include: Produk,
        },
        order: [
          ['createdAt', 'DESC']
        ]
      });
      return res.status(200).json(allTransaksi);
    } catch (error) {
      console.log(error);
      return res.status(500).json(error);
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
      return res.status(500).json(error);
    }
  };

  // CMS

  static getAllTransaksi = async (req, res) => {
    let {
      page,
      limit,
      keyword,
      statusPesanan,
      statusPengiriman,
      range,
      date,
      status
    } = req.query, condition = {}, query = {}

    if (limit) {
      let offset = +page
      if (offset > 0) offset = offset * +limit
      query = { offset, limit: +limit }
    }
    if (keyword) condition = {
      [Op.or]: [
        { invoice: { [Op.substring]: keyword } },
        { noResi: { [Op.substring]: keyword } },
        { namaPenerima: { [Op.substring]: keyword } },
      ]
    }

    if (statusPesanan) condition.statusPesanan = statusPesanan
    if (statusPengiriman) condition.statusPengiriman = statusPengiriman

    if (range === 'hari') {
      condition.createdAt = date
    } else if (range === 'minggu') {
      let day = new Date(date).getDay() === 0 ? 7 : new Date(date).getDay()
      let dateMonday = new Date(date).getDate() - (day - 1)
      let dateSunday = dateMonday + 6
      condition.createdAt = {
        [Op.and]: {
          [Op.gte]: new Date(new Date(date).getFullYear(), new Date(date).getMonth(), dateMonday),
          [Op.lte]: new Date(new Date(date).getFullYear(), new Date(date).getMonth(), dateSunday)
        }
      }
    } else if (range === 'bulan') {
      condition.createdAt = {
        [Op.and]: {
          [Op.gte]: new Date(`${new Date(date).getFullYear()}-${new Date(date).getMonth() + 1 < 10 ? `0${new Date(date).getMonth() + 1}` : new Date(date).getMonth() + 1}-01`),
          [Op.lt]: new Date(`${new Date(date).getFullYear()}-${new Date(date).getMonth() + 2 < 10 ? `0${new Date(date).getMonth() + 2}` : new Date(date).getMonth() + 2}-01`)
        }
      }
    } else if (range === 'tahun') {
      condition.createdAt = {
        [Op.and]: {
          [Op.gte]: new Date(`${new Date(date).getFullYear()}-01-01`),
          [Op.lt]: new Date(`${new Date(date).getFullYear() + 1}-01-01`)
        }
      }
    }

    if (status) condition.statusPembayaran = status

    const data = await Transaksi.findAll({
      where: condition,
      include: { model: Cart, include: [Produk, User] },
      order: [
        ['createdAt', 'DESC']
      ],
      ...query
    });

    const getAllData = await Transaksi.findAll({
      where: condition
    });
    return res.status(200).json({ data: data, totalTransaksi: getAllData.length });
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
      referralCode,
      insuranceFee
    } = req.body;

    // if (referralCode !== null) {
    //   const userData = await User.findOne({
    //     where: { referral: referralCode },
    //   });
    //   const komisiData = await Komisi.findOne({
    //     where: { userId: userData.id },
    //   });

    //   if (userData.referralStatus) {
    //     const addNewTransaksiKomisi = await TransaksiKomisi.create({
    //       komisiId: komisiData.id,
    //       userId: Carts[0].userId,
    //       nominal: (totalHarga - ongkosKirim) * 0.1,
    //       transaksiId: id,
    //     });

    //     const getUserKomisiData = await Komisi.findOne({
    //       where: { userId: userData.id },
    //     });

    //     getUserKomisiData.totalKomisi =
    //       getUserKomisiData.totalKomisi +
    //       Number(totalHarga - ongkosKirim) * 0.1;
    //     if (getUserKomisiData.sisaKomisi === 0) {
    //       getUserKomisiData.sisaKomisi = getUserKomisiData.totalKomisi;
    //     } else {
    //       getUserKomisiData.sisaKomisi +=
    //         Number(totalHarga - ongkosKirim) * 0.1;
    //     }

    //     const addTotalKomisi = await Komisi.update(
    //       getUserKomisiData.dataValues,
    //       {
    //         where: { userId: userData.id },
    //       }
    //     );
    //   }
    // }
    const konfirmasi = await Transaksi.update(
      { id, statusPembayaran, statusPengiriman, statusPesanan },
      { where: { id } }
    );

    const customerData = await User.findOne({ where: { id: Carts[0].userId } });
    customerData.totalPembelian += totalHarga - ongkosKirim - insuranceFee;
    const update = await User.update(
      { totalPembelian: customerData.totalPembelian },
      {
        where: { id: customerData.id },
      }
    );
    return res.status(200).json({ message: "success" });
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

    return res.status(200).json({ message: "success" });
  };

  static updateResi = async (req, res) => {
    const { noResi, statusPengiriman, id, expiredAt } = req.body;
    const data = await Transaksi.update(
      { noResi, statusPengiriman, expiredAt },
      { where: { id } }
    );
    return res.status(200).json({ message: "success" });
  };

  static kirimPesanan = async (req, res) => {
    let hoursNow = new Date().getHours(), minuteNow = new Date().getMinutes()
    let tanggalKirim

    if (new Date().getDay() === 6) { // PESANAN HARI SABTU
      tanggalKirim = new Date(new Date().setDate(new Date().getDate() + 2))
    } else if (new Date().getDay() === 0) { // PESANAN HARI MINGGU
      tanggalKirim = new Date(new Date().setDate(new Date().getDate() + 1))
    } else { //PESANAN HARI SENIN - JUMAT
      if (hoursNow < 14 || (hoursNow === 14 && minuteNow <= 15)) {
        tanggalKirim = new Date()
      }
      else { // JIKA PESANAN LEBIH DARI JAM 14:15
        if (new Date(new Date().setDate(new Date().getDate() + 1)).getDay() === 6)
          tanggalKirim = new Date(new Date().setDate(new Date().getDate() + 3))
        else if (new Date(new Date().setDate(new Date().getDate() + 1)).getDay() === 0)
          tanggalKirim = new Date(new Date().setDate(new Date().getDate() + 2))
        else tanggalKirim = new Date(new Date().setDate(new Date().getDate() + 1))
      }
    }

    await Transaksi.update(
      { tanggalPengiriman: tanggalKirim },
      { where: { id: req.params.id } }
    );
    return res.status(200).json({ message: "success" });
  };


  static ubahStatusPembayaran = async (req, res) => {
    const { statusPembayaran, id } = req.body;
    const transaksi = await Transaksi.update(
      { statusPembayaran },
      { where: { id } }
    );
    return res.status(200).json({ messsage: "success" });
  };

  static pesananSelesai = async (req, res) => {
    const {
      Carts,
      id,
      statusPengiriman,
      statusPesanan,
      totalHarga,
      ongkosKirim,
      referralCode,
    } = req.body;
    let statusReferralCode = true
    if (referralCode !== null) {
      const userData = await User.findOne({
        where: { referral: referralCode },
      });

      if (userData && userData.referralStatus) {
        let komisiSelectedId, totalKomisi;

        const komisiData = await Komisi.findOne({
          where: { userId: userData.id, month: new Date().getMonth() + 1, year: new Date().getFullYear() },
        });

        if (komisiData) { // check data komisi di bulan tersebut
          komisiSelectedId = komisiData.id
          totalKomisi = komisiData.totalKomisi
        } else {
          const { dataValues } = await Komisi.create({
            userId: userData.id,
            totalKomisi: 0,
            sisaKomisi: 0,
            month: new Date().getMonth() + 1,
            year: new Date().getFullYear(),
            status: 'Menunggu Transfer'
          });

          komisiSelectedId = dataValues.id
          totalKomisi = 0
        }

        await TransaksiKomisi.create({
          komisiId: komisiSelectedId,
          userId: Carts[0].userId,
          nominal: (totalHarga - ongkosKirim) * 0.1,
          transaksiId: id,
        });

        totalKomisi = totalKomisi + Number(totalHarga - ongkosKirim) * 0.1;

        await Komisi.update(
          { totalKomisi },
          {
            where: { id: komisiSelectedId },
          }
        );
      } else {
        statusReferralCode = false
      }
    }

    const data = await Transaksi.update(
      { statusPengiriman, statusPesanan, referralCode: statusReferralCode ? referralCode : null },
      { where: { id } }
    );

    return res.status(200).json({ message: "success" });
  };
}

module.exports = Controller;
