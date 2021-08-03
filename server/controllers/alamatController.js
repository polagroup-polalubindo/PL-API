const { Alamat, Province, City, District } = require("../models");

class Controller {
  static tambahAlamat = async (req, res) => {
    const { kecamatan,
      kota,
      provinsi,
      kelurahan,
      alamat,
      detail,
      kodepos,
      keterangan } = req.body,
      { id } = req.query;
    let data, idSelected;

    if (id) {
      data = await Alamat.update({
        provinsiId: provinsi,
        kotaId: kota,
        kecamatanId: kecamatan,
        kelurahan,
        alamat,
        detail,
        kodepos,
        keterangan
      }, { where: { id } });
      idSelected = id
    } else {
      let checkAlamat = await Alamat.findOne({ where: { userId: req.user.id } })
      if (checkAlamat) {
        data = await Alamat.update({
          provinsiId: provinsi,
          kotaId: kota,
          kecamatanId: kecamatan,
          kelurahan,
          alamat,
          detail,
          kodepos,
          keterangan
        }, { where: { id: checkAlamat.id } });
        idSelected = checkAlamat.id
      } else {
        data = await Alamat.create({
          provinsiId: provinsi,
          kotaId: kota,
          kecamatanId: kecamatan,
          kelurahan,
          alamat,
          detail,
          kodepos,
          userId: req.user.id,
          keterangan
        });
        idSelected = data.id
      }
    }

    data = await Alamat.findByPk(idSelected, {
      include: [
        { model: Province, attribute: ['id', 'name'] },
        { model: City, attribute: ['id', 'name'] },
        { model: District, attribute: ['id', 'name'] }
      ]
    })
    return res.status(201).json({ data, status: "success" });
  };

  static editAlamat = async (req, res) => {
    const { kecamatanId,
      kotaId,
      provinsiId,
      kelurahan,
      alamat,
      detail,
      kodepos, } = req.body;
    const data = await Alamat.update(
      {
        kecamatanId,
        kotaId,
        provinsiId,
        kelurahan,
        alamat,
        detail,
        kodepos,
      },
      { where: { userId: req.user.id } }
    );
    return res.status(200).json({ status: "success" });
  };

  static getAllAlamat = async (req, res) => {
    const { userId } = req.query, query = {};

    if (userId) query = { userId }

    const data = await Alamat.findAll({ where: query }
    );
    return res.status(200).json({ status: "success" });
  };

  static deleteAlamat = async (req, res) => {
    const data = await Alamat.destroy({ where: { userId: req.params.id } });
    return res.status(200).json({ status: "success" });
  };
}

module.exports = Controller;
