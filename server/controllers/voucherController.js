const { Voucher, Produk, VoucherProduct } = require("../models");
const Op = require('sequelize').Op

class Controller {
  static tambahVoucher = async (req, res) => {
    try {
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
        nominal,
        keterangan,
        canCombine,
        isUnlimited,
      } = req.body;

      let checkVoucher = await Voucher.findOne({ where: { code } })

      if (checkVoucher) {
        throw { message: 'Code Voucher Existing' }
      } else {
        let data = await Voucher.create({
          banner: req.file ? req.file.path : null,
          name,
          code,
          periodeStart,
          periodeEnd,
          typeVoucher,
          discountMax,
          minimumPurchase,
          usageQuota,
          forAll,
          nominal,
          keterangan,
          canCombine,
          isUnlimited,
        });

        if (forAll === 'false') {
          let newListProduct = JSON.parse(listProduct)
          if (Array.isArray(newListProduct) && newListProduct.length > 0) {
            newListProduct.forEach(async (element) => {
              await VoucherProduct.create({
                voucherId: data.id,
                productId: element.id,
              });
            });
          }
        }
        const getOne = await Voucher.findOne({
          include: { model: VoucherProduct, include: Produk },
        });
        return res.status(201).json({ status: "success", getOne });
      }
    } catch (err) {
      console.log(err)
      res.status(500).json(err)
    }
  };

  static editVoucher = async (req, res) => {
    try {
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
        nominal,
        keterangan,
        canCombine,
        isUnlimited,
      } = req.body;

      let checkVoucher = await Voucher.findOne({ where: { code } })

      if (checkVoucher && +checkVoucher.id !== +req.params.id) {
        throw { message: 'Code Voucher Existing' }
      } else {
        let newData = {
          name,
          code,
          periodeStart,
          periodeEnd,
          typeVoucher,
          discountMax,
          minimumPurchase,
          usageQuota,
          forAll,
          nominal,
          keterangan,
          canCombine,
          isUnlimited,
        }

        if (req.file) newData.banner = req.file.path

        await Voucher.update(
          newData,
          { where: { id: req.params.id } }
        );

        if (forAll === 'false') {
          let newListProduct = JSON.parse(listProduct)
          if (Array.isArray(newListProduct) && newListProduct.length > 0) {
            let allVoucherProduk = await VoucherProduct.findAll({
              where: { voucherId: req.params.id },
            });

            allVoucherProduk.forEach(async (el) => {
              let isAvaiable = newListProduct.find(
                (element) => element.id === el.productId
              );

              if (!isAvaiable)
                await VoucherProduct.destroy({ where: { id: isAvaiable.id } });
            });

            newListProduct.forEach(async (el) => {
              let isAvaiable = allVoucherProduk.find(
                (element) => element.productId === el.id
              );

              if (!isAvaiable)
                await VoucherProduct.create({
                  voucherId: req.params.id,
                  productId: el.id,
                });
            });
          }
        } else if (forAll === 'true') {
          await VoucherProduct.destroy({ where: { voucherId: req.params.id } });
        }

        const getOne = await Voucher.findOne({
          include: { model: VoucherProduct, include: Produk },
        });
        return res.status(200).json({ status: "success", getOne });
      }
    } catch (err) {
      console.log(err)
      res.status(500).json(err)
    }
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
        let offset = +page
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

      condition = {
        ...condition,
        [Op.or]: [
          {
            [Op.and]: [
              { isUnlimited: 0 },
              { usageQuota: { [Op.ne]: 0 } }
            ]
          },
          { isUnlimited: 1 }
        ]
      }

      allVoucher = await Voucher.findAll({ where: condition, include: { model: VoucherProduct, include: Produk }, ...query, order: [['id', 'DESC']] });
      let getAllVoucher = await Voucher.findAll({ where: condition });
      totalVoucher = getAllVoucher.length

      return res.status(200).json({ status: "success", data: allVoucher, totalVoucher });

    } catch (err) {
      console.log(err)
      res.status(500).json(err)
    }
  };

  static getOneVoucher = async (req, res) => {
    const data = await Voucher.findByPk(req.params.id, {
      include: { model: VoucherProduct, include: Produk },
    });
    return res.status(200).json({ status: "success", data });
  };
}

module.exports = Controller;
