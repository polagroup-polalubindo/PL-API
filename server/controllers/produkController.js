const { Produk, Brand, HargaGrosir, Sertifikasi } = require("../models");
const baseUrl = `http://157.230.248.17/`;
// const baseUrl = `http://localhost:80/`;
class Controller {
  static getAll = async (req, res) => {
    try {
      let {
        page,
        limit,
        status
      } = req.query

      let allProduk, totalProduk
      if (limit) {
        let offset = +page, condition = {}, query = {}
        if (offset > 0) offset = offset * +limit
        query = { offset, limit: +limit }
        if (status) condition = { statusProduk: status }

        allProduk = await Produk.findAll({ where: condition, include: [Brand, HargaGrosir, Sertifikasi], ...query, order: [['id', 'DESC']] });
        let getAllProduk = await Produk.findAll({ where: condition });
        totalProduk = getAllProduk.length
      } else {
        allProduk = await Produk.findAll({ where: { statusProduk: 1 }, include: Brand });
        totalProduk = allProduk.length
      }

      return res.status(200).json({ data: allProduk, totalProduk });
    } catch (error) {
      console.log(error)
      return res.status(500).json(error);
    }
  };

  static addProduk = async (req, res) => {
    try {
      const {
        files,
        body: { data },
      } = req;

      const newData = JSON.parse(data);

      newData.videoProduk = newData.urlVideo
      newData.discount = newData.diskon || 0
      newData.komisiLevel1 = newData.komisiLevel1 || 0
      newData.komisiLevel2 = newData.komisiLevel2 || 0
      newData.komisiLevel3 = newData.komisiLevel3 || 0
      delete newData.urlVideo

      if (files) {
        delete newData.fotoProduk
        delete newData.MSDS
        delete newData.TDS

        let checkFotoProduk = files.find(el => el.fieldname === 'image')
        let checkMSDS = files.find(el => el.fieldname === 'MSDS')
        let checkTDS = files.find(el => el.fieldname === 'TDS')

        newData.fotoProduk = checkFotoProduk ? baseUrl + checkFotoProduk.filename : ''
        newData.MSDS = checkMSDS ? baseUrl + checkMSDS.filename : ''
        newData.TDS = checkTDS ? baseUrl + checkTDS.filename : ''
      }

      newData.stock = +newData.stock;

      const addProduk = await Produk.create(newData);

      if (files) { // ADD SERTIFIKASI
        let checkSertifikasi = await files.filter(el => el.fieldname === 'sertifikasi')

        if (checkSertifikasi.length > 0) {
          checkSertifikasi.forEach(async element => {
            await Sertifikasi.create({ produkId: addProduk.id, path: baseUrl + element.filename })
          });
        }
      }

      if (newData.hargaGrosir.length > 0) {
        newData.hargaGrosir.forEach(async el => {
          if (el.banyaknya && el.harga) await HargaGrosir.create({ produkId: addProduk.id, banyak: el.banyaknya, harga: el.harga })
        })
      }

      return res.status(201).json(addProduk);
    } catch (error) {
      return res.status(500).json(error);
    }
  };

  static getOneProduk = async (req, res) => {
    try {
      const oneProduk = await Produk.findOne({
        where: { id: req.params.produkId },
      });
      return res.status(200).json(oneProduk);
    } catch (error) {
      return res.status(500).json(error);
    }
  };

  static editProduk = async (req, res) => {
    try {
      const {
        files,
        file,
        body: { data },
        params: { produkId },
      } = req;
      const newData = JSON.parse(data);

      newData.videoProduk = newData.urlVideo
      newData.discount = newData.diskon || 0
      newData.komisiLevel1 = newData.komisiLevel1 || 0
      newData.komisiLevel2 = newData.komisiLevel2 || 0
      newData.komisiLevel3 = newData.komisiLevel3 || 0

      if (file) newData.fotoProduk = baseUrl + file.filename;

      if (files) {
        delete newData.fotoProduk
        delete newData.MSDS
        delete newData.TDS

        let checkFotoProduk = files.find(el => el.fieldname === 'image')
        let checkMSDS = files.find(el => el.fieldname === 'MSDS')
        let checkTDS = files.find(el => el.fieldname === 'TDS')

        newData.fotoProduk = checkFotoProduk ? baseUrl + checkFotoProduk.filename : ''
        newData.MSDS = checkMSDS ? baseUrl + checkMSDS.filename : ''
        newData.TDS = checkTDS ? baseUrl + checkTDS.filename : ''
      }

      newData.stock = +newData.stock;

      let editedProduk = await Produk.update(newData, { where: { id: produkId } });

      if (files) { // ADD SERTIFIKASI
        let allSertifikasiSelectedProduct = await Sertifikasi.findAll({ where: { produkId: produkId } })

        // HAPUS SERTIFIKASI BILA SUDAH DIHAPUS DI FRONTEND
        if (newData.Sertifikasis.length === 0) await Sertifikasi.destroy({ where: { produkId: produkId } })
        else {
          allSertifikasiSelectedProduct.forEach(async (el) => {
            let check = newData.Sertifikasis.find(element => element.id === el.id)
            if (!check) await Sertifikasi.destroy({ where: { id: el.id } })
          })
        }

        let checkSertifikasi = await files.filter(el => el.fieldname === 'sertifikasi')

        if (checkSertifikasi.length > 0) {
          checkSertifikasi.forEach(async element => {
            await Sertifikasi.create({ produkId: produkId, path: baseUrl + element.filename })
          });
        }
      }

      if (newData.hargaGrosir.length === 0) {
        await HargaGrosir.destroy({ where: { produkId: produkId } })
      } else if (newData.hargaGrosir.length > 0) {
        let allHargaGrosirSelectedProduct = await HargaGrosir.findAll({ where: { produkId: produkId } })

        // HAPUS HARGAGROSIR BILA SUDAH DIHAPUS DI FRONTEND
        if (newData.hargaGrosir.length === 0) await HargaGrosir.destroy({ where: { produkId: produkId } })
        else {
          allHargaGrosirSelectedProduct.forEach(async (el) => {
            let check = newData.hargaGrosir.find(element => element.id === el.id)
            if (!check) await HargaGrosir.destroy({ where: { id: el.id } })
          })
        }

        newData.hargaGrosir.forEach(async el => {
          if (el.banyaknya && el.harga && !el.id) await HargaGrosir.create({ produkId: produkId, banyak: el.banyaknya, harga: el.harga })
        })
      }


      return res.status(200).json(editedProduk);
    } catch (error) {
      return res.status(500).json(error);
    }
  };

  static ubahStatus = async (req, res) => {
    const { statusProduk } = req.body;
    const newData = await Produk.update(
      { statusProduk },
      { where: { id: req.params.id } }
    );
  };

  static deleteProduk = async (req, res) => {
    try {
      const deleted = await Produk.destroy({
        where: { id: req.params.produkId },
      });
      return res.status(200).json({ message: `produk deleted` });
    } catch (error) {
      return res.status(500).json(error);
    }
  };
}

module.exports = Controller;
