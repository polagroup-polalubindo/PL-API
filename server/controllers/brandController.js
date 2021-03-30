const { Brand , Produk} = require("../models");

class Controller {
  static getAllBrand = async (req, res) => {
    try {
      const brandList = await Brand.findAll();
      return res.status(200).json(brandList);
    } catch (error) {
      return res.status(400).json(error);
    }
  };

  static addNewBrand = async (req, res) => {
    try {
      const { namaBrand, fotoBrand } = req.body;
      const newBrand = await Brand.create({ namaBrand, fotoBrand });
      return res.status(201).json(newBrand);
    } catch (error) {
      return res.status(400).json(error);
    }
  };

  static getOneBrand = async (req, res) => {
    try {
      const data = await Brand.findOne({ where: { id: req.params.brandId } });
      return res.status(200).json(data);
    } catch (error) {
      return res.status(400).json(error);
    }
  };

  static editBrand = async (req, res) => {
    try {
      const { namaBrand, fotoBrand, komisiStatus, discountStatus } = req.body;
      const edited = await Brand.update(
        { namaBrand, fotoBrand, komisiStatus, discountStatus },
        { where: { id: req.params.brandId } }
      );
      return res.status(200).json({ message: `success editing brand` });
    } catch (error) {
      return res.status(400).json(error);
    }
  };

  static deleteBrand = async (req, res) => {
    try {
      const deleted = await Brand.destroy({
        where: { id: req.params.brandId },
      });
      return res.status(200).json({ message: `success deleting brand` });
    } catch (error) {
      return res.status(400).json(error);
    }
  };


  static getProductList = async (req,res) =>{
    try {
      const ProductList = await Brand.findAll({where:{id:req.params.brandId},include:Produk})
      return res.status(200).json(ProductList)
    } catch (error) {
      console.log(error)
      return res.status(400).json(error)
    }
  }
}

module.exports = Controller;
