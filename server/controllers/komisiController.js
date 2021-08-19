const { Komisi, TransaksiKomisi, User, Transaksi } = require("../models");
const { Op } = require('sequelize')

class Controller {
  static getKomisiData = async (req, res) => {
    const data = await Komisi.findAll({ where: { userId: req.user.id }, order: [['id', 'DESC']] });
    return res.status(200).json(data);
  };

  static getAllKomisi = async (req, res) => {
    let {
      month,
      year,
      keyword,
      status,
      limit,
      page } = req.query, condition = {}, query = {}, conditionUser = {}

    if (month) condition.month = month
    if (year) condition.year = year

    if (limit) {
      let offset = +page
      if (offset > 0) offset = offset * +limit
      query = { offset, limit: +limit }
    }

    if (keyword) conditionUser = { nama: { [Op.substring]: keyword } }

    if (status) condition.status = status

    const data = await Komisi.findAll({
      where: condition,
      include: [
        {
          model: TransaksiKomisi,
          include: [Transaksi, { model: User, attributes: ['id', 'nama', 'noNPWP', 'bank', 'namaRekening', 'noKtp', 'noRekening'] }]
        },
        {
          model: User,
          where: conditionUser,
          attributes: ['id', 'nama', 'noNPWP', 'bank', 'namaRekening', 'noKtp', 'noRekening']
        }
      ],
      ...query
    });
    return res.status(200).json(data);
  };

  static updateKomisi = async (req, res) => {
    let { status } = req.body;
    const data = await Komisi.update({ status }, { where: { id: req.params.id } });
    return res.status(200).json(data);
  };

}
module.exports = Controller;
