const user = require("express").Router();
const controller = require("../../controllers/areaController");
const authentication = require("../../middleware/authentication");

user.get(
  `/area/province`,
  // authentication,
  controller.getAllProvince
);

user.get(
  `/area/city`,
  // authentication,
  controller.getAllCity
);

user.get(
  `/area/district`,
  // authentication,
  controller.getAllDistrict
);

module.exports = user;
