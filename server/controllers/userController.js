const { User, Komisi, TransaksiKomisi, Alamat } = require("../models");
const { compareHash } = require("../helpers/bcrypt");
const { generateToken, verifyToken } = require("../helpers/jwt");

class Controller {
  // Customer

  static register = async (req, res) => {
    const { email, phone, nama, password } = req.body;
    let newUser;
    try {
      if (!password) {
        newUser = await User.create({ email, phone, nama, password: phone });
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
      error.name === "SequelizeValidationError"
        ? res.status(400).json({ errMessage: error.errors[0].message })
        : res.status(400).json(error);
    }
  };

  static login = async (req, res) => {
    const { email, phone, password } = req.body;
    try {
      let data = null;
      if (email) {
        console.log("mail");
        data = await User.findOne({ where: { email } });
      }
      if (phone) {
        console.log("phone");
        data = await User.findOne({ where: { phone } });
      }
      if (data) {
        const validasiPassword = compareHash(password, data.password);
        if (validasiPassword) {
          const access_token = generateToken(data.dataValues);
          return res.status(200).json({ data, access_token });
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

  static checkToken = async (req, res) => {
    try {
      const decode = await verifyToken(req.headers.access_token);
      let dataUserLogin = await User.findByPk(decode.id);

      if (dataUserLogin) {
        return res.status(200).json({ data: dataUserLogin });
      } else {
        throw { message: `user not found` };
      }
    } catch (error) {
      console.log(error)
      return res.status(400).json(error);
    }
  };

  static getUserRefcode = async (req, res) => {
    const data = await verifyToken(req.params.access_token);
    return res.status(200).json(data.referral);
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

  static getUserData = async (req, res) => {
    const data = await User.findOne({ where: { id: req.user.id } });
    return res.status(200).json(data);
  };

  static addKtpAndNPWP = async (req, res) => {
    try {
      const { noKtp, noNPWP, bank, noRekening, namaRekening } = req.body;
      const editData = await User.update(
        { noKtp, noNPWP, bank, noRekening, namaRekening, statusPremier: "menunggu approval" },
        { where: { id: req.user.id } }
      );
      return res.status(200).json({ message: "success" });
    } catch (error) {
      return res.status(400).json(error);
    }
  };

  static addAlamat = async (req, res) => {
    const { alamat } = req.body;
    const updateAlamat = await User.update(
      { alamat },
      { where: { id: req.user.id } }
    );
    return res.status(200).json({ message: "success" });
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
      const {
        email,
        phone,
        nama,
        referralStatus,
        statusPremier,
        discount,
        bank,
        noRekening,
        photo,
        noKtp,
        noNPWP,
        totalPembelian,
      } = req.body;
      const newCustomer = await User.create({
        email,
        phone,
        nama,
        password: phone,
        referralStatus,
        statusPremier,
        discount,
        bank,
        noRekening,
        photo,
        noKtp,
        noNPWP,
        totalPembelian,
      });
      const komisiCustomer = await Komisi.create({ userId: newCustomer.id });
      return res.status(200).json({
        message: `success adding customer`,
        nama: newCustomer.nama,
        phone: newCustomer.phone,
        email: newCustomer.email,
      });
    } catch (error) {
      error.name === "SequelizeValidationError"
        ? res.status(400).json({ errMessage: error.errors[0].message })
        : res.status(400).json(error);
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

  static ubahstatusPremier = async (req, res) => {
    const { statusPremier, referralStatus, id } = req.body;
    const updateStatus = await User.update(
      { statusPremier, referralStatus: statusPremier === 'aktif' ? 1 : 0 },
      { where: { id } }
    );
    console.log(updateStatus);
    return res.status(200).json({ message: "success" });
  };

  static ubahStatusCustomer = async (req, res) => {
    const { status } = req.body;
    const updateStatus = await User.update(
      { status },
      { where: { id: req.user.id } }
    );
    return res.status(200).json({ message: "success" });
  };

  static editData = async (req, res) => {
    try {
      const { email, password, phone, nama, status, discountStatus, discount } =
        req.body;
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
