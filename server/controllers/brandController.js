const { Brand, Produk } = require("../models");
const Op = require('sequelize').Op

class Controller {
  static getAllBrand = async (req, res) => {
    try {
      let {
        page,
        limit,
        keyword,
      } = req.query, condition = {}, query = {}

      if (limit) {
        let offset = +page
        if (offset > 0) offset = offset * +limit
        query = { offset, limit: +limit }
      }
      if (keyword) condition = {
        namaBrand: { [Op.substring]: keyword }
      }

      const brandList = await Brand.findAll({
        where: condition,
        ...query
      });

      const AllBrandList = await Brand.findAll({
        where: condition,
      });
      // console.log(AllBrandList)
      return res.status(200).json({ brandList, totalBrand: AllBrandList.length });
    } catch (error) {
      return res.status(500).json(error);
    }
  };

  static addNewBrand = async (req, res) => {
    try {
      const { namaBrand } = req.body;
      const newBrand = await Brand.create({ namaBrand, fotoBrand: req.file ? req.file.path : null, });
      return res.status(201).json(newBrand);
    } catch (error) {
      console.log(error)
      return res.status(500).json(error);
    }
  };

  static getOneBrand = async (req, res) => {
    try {
      const data = await Brand.findOne({ where: { id: req.params.brandId } });
      return res.status(200).json(data);
    } catch (error) {
      return res.status(500).json(error);
    }
  };

  static editBrand = async (req, res) => {
    try {
      const { namaBrand } = req.body;
      let newData = {
        namaBrand
      }

      if (req.file) newData.fotoBrand = req.file.path

      const edited = await Brand.update(
        newData,
        { where: { id: req.params.brandId } }
      );
      return res.status(200).json({ message: `success editing brand` });
    } catch (error) {
      return res.status(500).json(error);
    }
  };

  static deleteBrand = async (req, res) => {
    try {
      const deleted = await Brand.destroy({
        where: { id: req.params.brandId },
      });
      return res.status(200).json({ message: `success deleting brand` });
    } catch (error) {
      return res.status(500).json(error);
    }
  };

  static getProductList = async (req, res) => {
    try {
      const ProductList = await Brand.findAll({
        where: { id: req.params.brandId },
        include: Produk,
      });
      return res.status(200).json(ProductList);
    } catch (error) {
      return res.status(500).json(error);
    }
  };
}

module.exports = Controller;
