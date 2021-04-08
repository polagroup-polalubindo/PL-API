const { TransaksiKomisi, Komisi } = require("../models");

class Controller {
  static createTransaksiKomisi = async (req, res) => {
    try {
      const { komisiId, userId, nominal } = req.body;
      const transaksi = await TransaksiKomisi.create({
        komisiId,
        userId,
        nominal,
      });
      const { dataValues } = await Komisi.findOne({
        where: { id: komisiId },
        include: TransaksiKomisi,
      });
      if (dataValues.sisaKomisi === 0) {
        dataValues.sisaKomisi = dataValues.totalKomisi - nominal;
      } else {
        dataValues.sisaKomisi -= nominal;
      }
      const updateKomisi = await Komisi.update(dataValues, {
        where: { id: komisiId },
      });
      return res.status(200).json({ message: `success withdraw komisi` });
    } catch (error) {
      return res.status(400).json(error);
    }
  };
}

module.exports = Controller;
