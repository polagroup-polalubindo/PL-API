const { User, Komisi, TransaksiKomisi } = require("../models");
const { compareHash } = require("../helpers/bcrypt");
const { generateToken } = require("../helpers/jwt");

class Controller {
  // Customer

  static register = async (req, res) => {
    const { email, phone, nama, password } = req.body;
    let newUser;
    try {
      if (!password) {
        newUser = await User.create({ email, phone, nama });
      } else {
        newUser = await User.create({ email, phone, nama, password });
      }
      const komisiCustomer = await Komisi.create({ userId: newUser.id });
      return res.status(201).json({
        message: "success register",
        nama: newUser.nama,
        phone: newUser.phone,
        email: newUser.email,
      });
    } catch (error) {
      return res.status(400).json(error);
    }
  };

  static login = async (req, res) => {
    const { email, password } = req.body;
    try {
      const data = await User.findOne({ where: { email } });
      if (data) {
        const validasiPassword = compareHash(password, data.password);
        if (validasiPassword) {
          const access_token = generateToken(data.dataValues);
          return res.status(200).json({ access_token });
        } else {
          throw { message: `invalid email/password` };
        }
      } else {
        throw { message: `invalid email/password` };
      }
    } catch (error) {
      return res.status(400).json(error);
    }
  };

  static getCustomerTransaction = async (req, res) => {
    try {
      const dataCustomer = await User.findOne({
        where: { id: req.params.customerId },
        include: { model: Komisi, include: TransaksiKomisi },
      });
      return res.status(200).json(dataCustomer);
    } catch (error) {
      return res.status(400).json(error);
    }
  };

  // CMS

  static getAllCustomer = async (req, res) => {
    const data = await User.findAll({
      include: {
        model: Komisi,
        include: { model: TransaksiKomisi, include: User },
      },
    });
    return res.status(200).json(data);
  };

  static addCustomer = async (req, res) => {
    try {
      const { email, phone, nama } = req.body;
      console.log(email, phone, nama);
      const newCustomer = await User.create({ email, phone, nama });
      const komisiCustomer = await Komisi.create({ userId: newCustomer.id });
      return res.status(200).json({
        message: `success adding customer`,
        nama: newCustomer.nama,
        phone: newCustomer.phone,
        email: newCustomer.email,
      });
    } catch (error) {
      return res.status(400).json(error);
    }
  };

  static getOne = async (req, res) => {
    try {
      const customer = await User.findOne({
        where: { id: req.params.customerId },
      });
      return res.status(200).json(customer.dataValues);
    } catch (error) {
      return res.status(400).json(error);
    }
  };

  static editData = async (req, res) => {
    try {
      const {
        email,
        password,
        phone,
        nama,
        status,
        discountStatus,
        discount,
      } = req.body;
      const newData = await User.update(
        { email, password, phone, nama, status, discountStatus, discount },
        { where: { id: req.params.customerId } }
      );
      return res.status(200).json({ message: `edit complete` });
    } catch (error) {
      res.status(400).json(error);
    }
  };

  static deleteCustomer = async (req, res) => {
    try {
      const deleted = await User.destroy({
        where: { id: req.params.customerId },
      });
      return res.status(200).json({ message: `success deleting account` });
    } catch (error) {
      return res.status(400).json(error);
    }
  };
}

module.exports = Controller;
