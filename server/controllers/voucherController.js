const { Voucher, Produk, VoucherProduct } = require("../models");
const Op = require('sequelize').Op

class Controller {
  static tambahVoucher = async (req, res) => {
    const {
      name,
      code,
      periodeStart,
      periodeEnd,
      typeVoucher,
      discountMax,
      minimumPurchase,
      usageQuota,
      forAll,
      listProduct,
    } = req.body;

    let data = await Voucher.create({
      name,
      code,
      periodeStart,
      periodeEnd,
      typeVoucher,
      discountMax,
      minimumPurchase,
      usageQuota,
      forAll,
    });

    if (!forAll && Array.isArray(listProduct) && listProduct.length > 0) {
      listProduct.forEach(async (element) => {
        await VoucherProduct.create({
          voucherId: data.id,
          productId: element.id,
        });
      });
    }
    const getOne = await Voucher.findOne({
      include: { model: VoucherProduct, include: Produk },
    });
    return res.status(201).json({ status: "success", getOne });
  };

  static editVoucher = async (req, res) => {
    const {
      name,
      code,
      periodeStart,
      periodeEnd,
      typeVoucher,
      discountMax,
      minimumPurchase,
      usageQuota,
      forAll,
      listProduct,
    } = req.body;

    let data = await Voucher.update(
      {
        name,
        code,
        periodeStart,
        periodeEnd,
        typeVoucher,
        discountMax,
        minimumPurchase,
        usageQuota,
        forAll,
      },
      { where: { id: req.params.id } }
    );

    if (!forAll && Array.isArray(listProduct) && listProduct.length > 0) {
      let allVoucherProduk = await VoucherProduct.findAll({
        where: { voucerId: req.params.id },
      });

      allVoucherProduk.forEach(async (el) => {
        let isAvaiable = listProduct.find(
          (element) => element.id === el.productId
        );

        if (!isAvaiable)
          await VoucherProduct.destroy({ where: { id: isAvaiable.id } });
      });

      listProduct.forEach(async (el) => {
        let isAvaiable = allVoucherProduk.find(
          (element) => element.productId === el.id
        );

        if (!isAvaiable)
          await VoucherProduct.create({
            voucerId: req.params.id,
            productId: element.id,
          });
      });
    } else if (forAll) {
      await VoucherProduct.destroy({ where: { voucerId: req.params.id } });
    }

    const getOne = await Voucher.findOne({
      include: { model: VoucherProduct, include: Produk },
    });
    return res.status(201).json({ status: "success", getOne });
  };

  static deleteVoucher = async (req, res) => {
    try {
      await Voucher.destroy({ where: { id: req.params.id } });
      await VoucherProduct.destroy({ where: { voucherId: req.params.id } });

      return res
        .status(200)
        .json({ status: "success", id_deleted: req.params.id });
    } catch (err) {
      return res.status(500).json({ err })
    }
  };

  static getAllVoucher = async (req, res) => {
    try {
      let {
        page,
        limit,
        status,
        keyword
      } = req.query

      let allVoucher, totalVoucher, query = {}, condition = {}
      if (limit) {
        let offset = +page, condition = {}, query = {}
        if (offset > 0) offset = offset * +limit
        query = { offset, limit: +limit }
      }

      if (status) {
        if (status === "Sedang Berjalan") {
          condition = {
            [Op.and]: [
              {
                periodeStart: {
                  [Op.lte]: new Date()
                }
              }, {
                periodeEnd: {
                  [Op.gte]: new Date()
                }
              }
            ]
          }
        } else if (status === "Akan Datang") {
          condition = {
            periodeStart: {
              [Op.gte]: new Date()
            }
          }
        } else if (status === "Telah Berakhir") {
          condition = {
            periodeEnd: {
              [Op.lte]: new Date()
            }
          }
        }
      }

      if (keyword) {
        condition = {
          ...condition,
          [Op.or]: [
            { name: { [Op.substring]: keyword } },
            { code: { [Op.substring]: keyword } },
          ]
        }
      }
      // condition = { statusVoucher: status }

      allVoucher = await Voucher.findAll({ where: condition, include: { model: VoucherProduct, include: Produk }, ...query, order: [['id', 'DESC']] });
      let getAllVoucher = await Voucher.findAll({ where: condition });
      totalVoucher = getAllVoucher.length

      return res.status(201).json({ status: "success", data: allVoucher, totalVoucher });

    } catch (err) {
      console.log(err)
      res.status(500).json(err)
    }
  };

  static getOneVoucher = async (req, res) => {
    const data = await Voucher.findByPk(req.params.id, {
      include: { model: VoucherProduct, include: Produk },
    });
    return res.status(201).json({ status: "success", data });
  };
}

module.exports = Controller;
