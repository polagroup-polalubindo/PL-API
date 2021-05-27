const produk = require("express").Router();
const controller = require("../../controllers/produkController");
const authorization = require("../../middleware/authorization");
const authentication = require("../../middleware/authentication");
const multer = require("multer");
const storage = multer.diskStorage({
  destination: "../../assets",
  filename: function (req, file, cb) {
    cb(null, "IMAGE-" + Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({
  storage: storage,
});
produk.get("/produk", controller.getAll);

// CMS

produk.post("/produk", authentication, authorization, controller.addProduk);
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

produk.post("/upload", upload.single("file"), controller.testUpload);

module.exports = produk;
