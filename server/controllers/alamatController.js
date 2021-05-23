const { Alamat } = require("../models");

class Controller {
  static tambahAlamat = async (req, res) => {
    const { kecamatan, kelurahan, alamat, kodePos } = req.body;
    const data = await Alamat.create({
      kecamatan,
      kelurahan,
      alamat,
      kodePos,
      userId: req.user.id,
    });
    return res.status(201).json({ data, status: "success" });
  };

  static editAlamat = async (req, res) => {
    const { kecamatan, kelurahan, alamat, kodePos } = req.body;
    const data = await Alamat.update(
      { kecamatan, kelurahan, alamat, kodePos },
      { where: { userId: req.user.id } }
    );
    return res.status(200).json({ status: "success" });
  };

  static deleteAlamat = async (req, res) => {
    const data = await Alamat.destroy({ where: { userId: req.params.id } });
    return res.status(200).json({ status: "success" });
  };
}

module.exports = Controller;
