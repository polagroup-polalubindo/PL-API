const { Province, City, District } = require("../models");

class Controller {
  static getAllProvince = async (req, res) => {
    const data = await Province.findAll({ attributes: ['id', 'name'] });
    return res.status(200).json({ status: "success", totalData: data.length, data });
  };

  static getAllCity = async (req, res) => {
    let { provinceId } = req.query, query = {};
    if (provinceId) {
      query = { provinceId }
    }
    const data = await City.findAll({ where: query, attributes: ['id', 'name', 'provinceId'] });
    return res.status(200).json({ status: "success", totalData: data.length, data });
  };

  static getAllDistrict = async (req, res) => {
    let { cityId } = req.query, query = {};
    if (cityId) {
      query = { cityId }
    }
    const data = await District.findAll({ where: query, attributes: ['id', 'name', 'cityId'] });
    return res.status(200).json({ status: "success", totalData: data.length, data });
  };
}

module.exports = Controller;
