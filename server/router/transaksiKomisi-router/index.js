const transaksiKomisi = require("express").Router();
const controller = require("../../controllers/transaksiKomisiController");
const authentication = require("../../middleware/authentication");
const authorization = require("../../middleware/authorization");

transaksiKomisi.post(
  "/withdrawKomisi",
  authentication,
  controller.withdrawKomisi
);
transaksiKomisi.get(
  "/transaksiKomisi",
  authentication,
  controller.getTransaksiKomisi
);

// cms
transaksiKomisi.get(
  "/all-transaksi",
  authentication,
  authorization,
  controller.getAllTransaksi
);
module.exports = transaksiKomisi;
