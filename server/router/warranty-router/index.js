const warranty = require("express").Router();
const controller = require("../../controllers/warrantyController");
const authentication = require("../../middleware/authentication");

warranty.post("/warranty", authentication, controller.tambahWarranty);
warranty.get("/warranty", authentication, controller.getAllWarranty);
warranty.get("/warranty/:id", controller.getOneWarranty);
warranty.put("/warranty/:id", authentication, controller.editWarranty);
warranty.put("/warranty/:id/claim", controller.claimWarranty);
warranty.delete("/warranty/:id", authentication, controller.deleteWarranty);

module.exports = warranty;
