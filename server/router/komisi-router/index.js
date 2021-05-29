const komisi = require("express").Router();
const controller = require("../../controllers/komisiController");
const authentication = require("../../middleware/authentication");
const authorization = require("../../middleware/authorization");

komisi.get("/komisi", authentication, controller.getKomisiData);

// cms

komisi.get(
  "/all-komisi",
  authentication,
  authorization,
  controller.getAllKomisi
);

module.exports = komisi;
