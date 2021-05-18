const { TransaksiKomisi, Komisi } = require("../models");

class Controller {
  static withdrawKomisi = async (req, res) => {
    try {
      // const { komisiId, userId, nominal } = req.body;
      // const transaksi = await TransaksiKomisi.create({
      //   komisiId,
      //   userId,
      //   nominal,
      // });
      // const { dataValues } = await Komisi.findOne({
      //   where: { id: komisiId },
      //   include: TransaksiKomisi,
      // });
      // if (dataValues.sisaKomisi === 0) {
      //   dataValues.sisaKomisi = dataValues.totalKomisi
      // } else {
      //   dataValues.sisaKomisi -= nominal;
      // }
      // const updateKomisi = await Komisi.update(dataValues, {
      //   where: { id: komisiId },
      // });
      // return res.status(200).json({ message: `success withdraw komisi` });
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
      console.log(updateKomisi);
      return res.status(200).json({ message: `success withdraw` });
    } catch (error) {
      return res.status(400).json(error);
    }
  };

  // static getTransaksiKomisi = async (req, res) => {
  //   // const data = await TransaksiKomisi.findAll({where:})
  // };
}

module.exports = Controller;
