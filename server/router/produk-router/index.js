const produk = require("express").Router();
const controller = require("../../controllers/produkController");
const authorization = require("../../middleware/authorization");
const authentication = require("../../middleware/authentication");
const upload = require("../../middleware/multer");


produk.get("/produk", controller.getAll);

// CMS

produk.post(
  "/produk",
  upload.single("file"),
  authentication,
  authorization,
  controller.addProduk
);
produk.get(
  "/produk/:produkId",
  authentication,
  authorization,
  controller.getOneProduk
);
produk.put(
  "/produk/:produkId",
  authentication,
  authorization,
  controller.editProduk
);
produk.put(
  "/ubah-status-produk/:id",
  authentication,
  authorization,
  controller.ubahStatus
);
produk.delete(
  "/produk/:produkId",
  authentication,
  authorization,
  controller.deleteProduk
);

module.exports = produk;
