const transaksi = require("express").Router();
const controller = require("../../controllers/transaksiController");
const authentication = require("../../middleware/authentication");
const authorization = require("../../middleware/authorization");

transaksi.get(
  "/transaksiBeforePayment",
  authentication,
  controller.getTransaksiBeforePayment
);
transaksi.get(
  "/transaksiAfterPayment",
  authentication,
  controller.getTransaksiAfterPayment
);
transaksi.put(
  "/transaksi/:transaksiId",
  authentication,
  controller.editTransaksi
);

// CMS

transaksi.get(
  "/transaksi",
  authentication,
  authorization,
  controller.getAllTransaksi
);

transaksi.post(
  "/konfirmasi-transaksi",
  authentication,
  authorization,
  controller.konfirmasiTransaksi
);

transaksi.post(
  "/tolak-pesanan",
  authentication,
  authorization,
  controller.tolakPesanan
);
module.exports = transaksi;
