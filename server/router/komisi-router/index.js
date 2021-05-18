const komisi = require("express").Router();
const controller = require("../../controllers/komisiController");
const authentication = require("../../middleware/authentication");

komisi.get("/komisi", authentication, controller.getKomisiData);

module.exports = komisi;
