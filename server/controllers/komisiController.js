const { Komisi, TransaksiKomisi, User, Transaksi } = require("../models");

class Controller {
  static getKomisiData = async (req, res) => {
    const data = await Komisi.findAll({ where: { userId: req.user.id }, order: [['id', 'DESC']] });
    return res.status(200).json(data);
  };

  static getAllKomisi = async (req, res) => {
    let { month, year } = req.query, condition = {}
    if (month) condition.month = month
    if (year) condition.year = year
    const data = await Komisi.findAll({ where: condition, include: [{ model: TransaksiKomisi, include: [Transaksi, { model: User, attributes: ['id', 'nama', 'noNPWP', 'bank', 'namaRekening', 'noKtp', 'noRekening'] }] }, { model: User, attributes: ['id', 'nama', 'noNPWP', 'bank', 'namaRekening', 'noKtp', 'noRekening'] }] });
    return res.status(200).json(data);
  };

  static updateKomisi = async (req, res) => {
    let { status } = req.body;
    const data = await Komisi.update({ status }, { where: { id: req.params.id } });
    return res.status(200).json(data);
  };

}
module.exports = Controller;
