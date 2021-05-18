const { Komisi } = require("../models");

class Controller {
  static getKomisiData = async (req, res) => {
    const data = await Komisi.findOne({ where: { userId: req.user.id } });
    return res.status(200).json(data);
  };
}
module.exports = Controller;
