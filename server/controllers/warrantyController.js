const {
  Warranty, User, Machine
} = require("../models");
const Op = require('sequelize').Op
const { scheduleWarranty } = require('../helpers/scheduler')

class Controller {
  static tambahWarranty = async (req, res) => {
    try {
      const {
        noMachine,
        purchasePlace,
        purchaseDate,
        invoice,
      } = req.body;
      let data;

      let checkMachineHasRegister = await Warranty.findOne({ where: { noMachine } })
      let checkMachine = await Machine.findOne({ where: { noMachine } })

      if (checkMachineHasRegister) {
        throw { message: `nomor machine already exist` };
      } else if (!checkMachine) {
        throw { message: `machine number not registered` };
      } else {
        data = await Warranty.create({
          noMachine,
          userId: req.user.id,
          purchaseDate,
          purchasePlace,
          invoice,
          isValid: 1,
          statusClaim: 'Belum diklaim'
        });
      }

      res.status(201).json({ status: "success", data });

      scheduleWarranty(data.id)
    } catch (err) {
      console.log(err)
      res.status(500).json(err)
    }
  };

  static editWarranty = async (req, res) => {
    try {
      const {
        noMachine,
        purchasePlace,
        purchaseDate,
        invoice,
        statusClaim,
      } = req.body;
      let checkMachineHasRegister, checkMachine, data;

      if (noMachine) checkMachineHasRegister = await Warranty.findOne({ where: { noMachine } })
      if (noMachine) checkMachine = await Machine.findOne({ where: { noMachine } })

      if (noMachine && checkMachineHasRegister && checkMachineHasRegister?.id === req.params.id) {
        throw { message: `nomor machine already exist` };
      } else if (!checkMachine) {
        throw { message: `machine number not registered` };
      } else {
        data = await Warranty.update({
          noMachine,
          userId: req.user.id,
          purchasePlace,
          purchaseDate,
          invoice,
          statusClaim
        }, {
          where: {
            id: req.params.id
          }
        });
      }
      return res.status(200).json({ status: "success", data });
    } catch (err) {
      console.log(err)
      res.status(500).json(err)
    }
  };

  static deleteWarranty = async (req, res) => {
    try {
      await Warranty.destroy({ where: { id: req.params.id } });

      return res
        .status(200)
        .json({ status: "success", id_deleted: req.params.id });
    } catch (err) {
      console.log(err)
      return res.status(500).json({ err })
    }
  };

  static getAllWarranty = async (req, res) => {
    try {
      let {
        page,
        limit,
        keyword,
        user,
        status
      } = req.query

      let getWarranty, totalWarranty, query = {}, condition = {}
      if (limit) {
        let offset = +page
        if (offset > 0) offset = offset * +limit
        query = { offset, limit: +limit }
      }

      if (keyword) {
        condition = {
          [Op.or]: [
            { '$User.name$': { [Op.substring]: keyword } },
            { noMachine: { [Op.substring]: keyword } },
            { invoice: { [Op.substring]: keyword } },
          ]
        }
      }

      if (user) {
        condition = {
          ...condition,
          userId: user
        }
      }

      if (status) {
        condition = {
          ...condition,
          statusClaim: status
        }
      }

      getWarranty = await Warranty.findAll({ where: condition, include: User, ...query, order: [['id', 'DESC']] });
      let getAllWarranty = await Warranty.findAll({ where: condition });
      totalWarranty = getAllWarranty.length

      return res.status(200).json({ status: "success", data: getWarranty, totalWarranty });

    } catch (err) {
      console.log(err)
      res.status(500).json(err)
    }
  };

  static getOneWarranty = async (req, res) => {
    const data = await Warranty.findOne({ where: { id: req.params.id }, include: User });
    return res.status(200).json({ status: "success", data });
  };

  static claimWarranty = async (req, res) => {
    try {
      const {
        claim,
        issue,
        claimDate,
      } = req.body;

      await Warranty.update({
        claim,
        issue,
        claimDate,
        hasClaim: 1,
        statusClaim: 'Pengajuan'
      }, {
        where: {
          id: req.params.id
        }
      });

      return res.status(200).json({ status: "success" });
    } catch (err) {
      console.log(err)
      res.status(500).json(err)
    }
  };
}

module.exports = Controller;
