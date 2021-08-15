const voucher = require("express").Router();
const controller = require("../../controllers/voucherController");
const authentication = require("../../middleware/authentication");

voucher.post("/voucher", authentication, controller.tambahVoucher);
voucher.get("/voucher", authentication, controller.getAllVoucher);
voucher.get("/voucher/:id", authentication, controller.getOneVoucher);
voucher.put("/voucher/:id", authentication, controller.editVoucher);
voucher.delete("/voucher/:id", authentication, controller.deleteVoucher);

module.exports = voucher;
