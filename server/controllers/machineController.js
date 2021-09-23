const {
  Machine, Warranty,
} = require("../models");
const Op = require('sequelize').Op

class Controller {
  static tambahMachine = async (req, res) => {
    try {
      const {
        noMachine,
        purchaseDate,
        invoice
      } = req.body;

      let data = await Machine.create({
        noMachine,
        purchaseDate,
        invoice
      });

      res.status(201).json({ status: "success", data });
    } catch (err) {
      console.log(err)
      res.status(500).json(err)
    }
  };

  static editMachine = async (req, res) => {
    try {
      const {
        purchaseDate,
        invoice
      } = req.body;

      let data = await Machine.update({
        purchaseDate,
        invoice
      }, {
        where: {
          noMachine: req.params.id
        }
      });

      return res.status(200).json({ status: "success", data });
    } catch (err) {
      console.log(err)
      res.status(500).json(err)
    }
  };

  static deleteMachine = async (req, res) => {
    try {
      await Machine.destroy({ where: { noMachine: req.params.id } });

      return res
        .status(200)
        .json({ status: "success", id_deleted: req.params.id });
    } catch (err) {
      return res.status(500).json({ err })
    }
  };

  static getAllMachine = async (req, res) => {
    try {
      let {
        page,
        limit,
        keyword,
        hasClaim,
        isValid,
      } = req.query

      let getMachine, totalMachine, query = {}, condition = {}, conditionWarranty = {}
      if (limit) {
        let offset = +page
        if (offset > 0) offset = offset * +limit
        query = { offset, limit: +limit }
      }

      if (keyword) {
        condition = {
          [Op.or]: [
            { noMachine: { [Op.substring]: keyword } },
            { invoice: { [Op.substring]: keyword } },
          ]
        }
      }

      if (hasClaim) {
        if (hasClaim === '0') {
          condition = {
            ...condition,
            '$Warranty.hasClaim$': 0,
            '$Warranty.hasClaim$': null,
            '$Warranty.isValid$': 1,
          }
        } else {
          condition = {
            ...condition,
            '$Warranty.hasClaim$': 1,
          }
        }
      }
      if (isValid) {
        condition = {
          ...condition,
          '$Warranty.isValid$': +isValid,
        }
      }

      getMachine = await Machine.findAll({ where: condition, ...query, include: { model: Warranty, where: conditionWarranty } });
      let getAllMachine = await Machine.findAll({ where: condition, include: { model: Warranty, where: conditionWarranty } });
      totalMachine = getAllMachine.length

      return res.status(200).json({ status: "success", data: getMachine, totalMachine });

    } catch (err) {
      console.log(err)
      res.status(500).json(err)
    }
  };

  static getOneMachine = async (req, res) => {
    const data = await Machine.findOne({ where: { noMachine: req.params.id }, include: Warranty });
    return res.status(200).json({ status: "success", data });
  };
}

module.exports = Controller;
