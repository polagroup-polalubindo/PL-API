const { response } = require("express");
const { TransaksiKomisi, Komisi, User, Transaksi, Cart } = require("../models");

class Controller {
  static withdrawKomisi = async (req, res) => {
    try {
      const { nominal } = req.body;
      const transaksi = await TransaksiKomisi.create({
        userId: req.user.id,
        nominal,
      });
      let data = await Komisi.findOne({ where: { userId: req.user.id } });
      data.sisaKomisi = data.sisaKomisi - nominal;
      const updateKomisi = await Komisi.update(data.dataValues, {
        where: { userId: req.user.id },
      });
      return res.status(200).json({ message: `success withdraw` });
    } catch (error) {
      return res.status(400).json(error);
    }
  };

  static getTransaksiKomisi = async (req, res) => {
    const data = await TransaksiKomisi.findAll({
      where: { komisiId: req.user.id },
      include: [Komisi, User],
    });
    const withdrawedKomisi = await TransaksiKomisi.findAll({
      where: { userId: req.user.id },
      include: User,
    });
    let newData = [...data, ...withdrawedKomisi];
    return res.status(200).json(newData);
  };

  static getAllTransaksi = async (req, res) => {
    const data = await TransaksiKomisi.findAll({
      include: [Transaksi, User],
    });
    const komisiData = await Komisi.findAll();

    const newData = [];

    for (let i = 0; i < data.length; i++) {
      for (let j = 0; j < komisiData.length; j++) {
        if (data[i].komisiId === komisiData[j].id) {
          const filter = newData.filter((el) => el.id === komisiData[j].id);
          if (filter.length === 0) {
            const temp = komisiData[j].dataValues;
            if (!temp.transaksi) {
              temp.transaksi = [];
            }
            temp.transaksi.push(data[i]);
            newData.push(temp);
          } else {
            newData.map((el) => {
              if (el.id === komisiData[j].id) [el.transaksi.push(data[i])];
            });
          }
        }
      }
    }
    return res.status(200).json(newData);
  };
}

module.exports = Controller;
