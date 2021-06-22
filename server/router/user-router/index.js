const user = require("express").Router();
const controller = require("../../controllers/userController");
const authorization = require("../../middleware/authorization");
const authentication = require("../../middleware/authentication");

// CUSTOMER SIDE

user.post("/register", controller.register);
user.post("/login", controller.login);
user.get("/check-token", controller.checkToken);
user.get("/refcode/:access_token", controller.getUserRefcode);

user.get(
  "/customer/:customerId",
  authentication,
  controller.getCustomerTransaction
);
user.get("/customerData", authentication, controller.getUserData);

user.post("/add-ktp-npwp", authentication, controller.addKtpAndNPWP);
user.post("/add-alamat", authentication, controller.addAlamat);

// CMS

user.get("/customer", authentication, authorization, controller.getAllCustomer);
user.post(
  "/add-customer",
  authentication,
  authorization,
  controller.addCustomer
);
user.post(
  "/ubah-status-premier",
  authentication,
  authorization,
  controller.ubahstatusPremier
);
user.post(
  "/ubah-status-customer",
  authentication,
  authorization,
  controller.ubahStatusCustomer
);

user.get(
  `/customer/:customerId`,
  authentication,
  authorization,
  controller.getOne
);
user.put(
  `/customer/:customerId`,
  authentication,
  authorization,
  controller.editData
);
user.delete(
  `/customer/:customerId`,
  authentication,
  authorization,
  controller.deleteCustomer
);

module.exports = user;
