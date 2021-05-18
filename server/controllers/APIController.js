const axios = require("axios");

axios.defaults.baseURL = "https://api.rajaongkir.com/starter";
axios.defaults.headers.common["key"] = process.env.APIKEY_RAJAONGKIR;
axios.defaults.headers.post["Content-Type"] =
  "application/x-www-form-urlencoded";

class Controller {
  static getCost = async (req, res) => {
    const { destination, weight, courier } = req.body;
    try {
      const {
        data: { rajaongkir },
      } = await axios.post("/cost", {
        origin: "152",
        destination,
        weight,
        courier,
      });
      return res.status(200).json(rajaongkir);
    } catch (error) {
      return res.status(400).json(error);
    }
  };

  static getTotalCost = async (req, res) => {
    try {
      const { weight, courier, destination } = req.params;
      const { data } = await axios.get(`/city`);
      const filtered = data.rajaongkir.results.filter(
        (el) => el.city_name.toLowerCase() === destination.toLowerCase()
      );
      const {
        data: { rajaongkir },
      } = await axios.post("/cost", {
        origin: "152",
        destination: filtered[0].city_id,
        weight,
        courier,
      });
      return res.status(200).json(rajaongkir.results[0].costs);
    } catch (error) {
      return res.status(400).json(error);
    }
  };

  static getCity = async (req, res) => {
    try {
      const { data } = await axios.get(`/city`);
      return res.status(200).json(data.rajaongkir.results);
    } catch (error) {
      return res.status(400).json(error);
    }
  };

  static getProvince = async (req, res) => {
    try {
      const { data } = await axios.get("/province");
      return res.status(200).json(data);
    } catch (error) {
      return res.status(400).json(error);
    }
  };
}

module.exports = Controller;
