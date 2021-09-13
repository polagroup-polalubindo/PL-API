const voucher = require("express").Router();
const controller = require("../../controllers/voucherController");
const authentication = require("../../middleware/authentication");
const upload = require("../../middleware/multer");

voucher.post("/voucher", authentication, upload.single('banner'), controller.tambahVoucher);
voucher.get("/voucher", controller.getAllVoucher);
voucher.get("/voucher/:id", controller.getOneVoucher);
voucher.put("/voucher/:id", authentication, upload.single('banner'), controller.editVoucher);
voucher.delete("/voucher/:id", authentication, controller.deleteVoucher);

module.exports = voucher;
