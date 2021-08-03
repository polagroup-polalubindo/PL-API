const router = require("express").Router();
const controller = require("../../controllers/voucherController");
const authentication = require("../../middleware/authentication");

router.post("/voucher", authentication, controller.tambahVoucher);
router.get("/voucher", authentication, controller.getAllVoucher);
router.get("/voucher/:id", authentication, controller.getOneVoucher);
router.put("/voucher/:id", authentication, controller.editVoucher);
router.delete("/voucher/:id", authentication, controller.deleteVoucher);

module.exports = alamat;
