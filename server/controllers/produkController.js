const { Produk, Brand } = require("../models");
const baseUrl = `http://157.230.248.17/`;
// const baseUrl = `http://localhost:80/`;
class Controller {
  static getAll = async (req, res) => {
    try {
      const allProduk = await Produk.findAll({ include: Brand });
      return res.status(200).json(allProduk);
    } catch (error) {
      return res.status(400).json(error);
    }
  };

  static addProduk = async (req, res) => {
    try {
      const {
        file,
        body: { data },
      } = req;
      const newData = JSON.parse(data);
      newData.fotoProduk = baseUrl + file.filename;
      newData.stock = +newData.stock;
      const addProduk = await Produk.create(newData);
      return res.status(201).json(addProduk);
    } catch (error) {
      return res.status(400).json(error);
    }
  };

  static getOneProduk = async (req, res) => {
    try {
      const oneProduk = await Produk.findOne({
        where: { id: req.params.produkId },
      });
      return res.status(200).json(oneProduk);
    } catch (error) {
      return res.status(400).json(error);
    }
  };

  static editProduk = async (req, res) => {
    try {
      const {
        namaProduk,
        deskripsi,
        fotoProduk,
        videoProduk,
        stock,
        sku,
        weight,
        panjang,
        lebar,
        tinggi,
        // price,
        hargaSatuan,
        brandId,
        statusProduk,
        komisiProduk,
      } = req.body;
      const editedProduk = await Produk.update(
        {
          namaProduk,
          deskripsi,
          fotoProduk,
          videoProduk,
          stock,
          sku,
          weight,
          panjang,
          lebar,
          tinggi,
          // price,
          hargaSatuan,
          brandId,
          statusProduk,
          komisiProduk,
        },
        { where: { id: req.params.produkId } }
      );
      return res.status(200).json(editedProduk);
    } catch (error) {
      return res.status(400).json(error);
    }
  };

  static ubahStatus = async (req, res) => {
    const { statusProduk } = req.body;
    console.log(statusProduk, "<<<<<<<");
    const newData = await Produk.update(
      { statusProduk },
      { where: { id: req.params.id } }
    );
    console.log(newData);
  };

  static deleteProduk = async (req, res) => {
    try {
      const deleted = await Produk.destroy({
        where: { id: req.params.produkId },
      });
      return res.status(200).json({ message: `produk deleted` });
    } catch (error) {
      return res.status(400).json(error);
    }
  };
}

module.exports = Controller;
