const cart = require("express").Router();
const controller = require("../../controllers/cartController");
const authentication = require("../../middleware/authentication");

cart.get("/cart", authentication, controller.getCart);
cart.post("/checkout", controller.checkOut);
cart.post("/cart/:transaksiId", authentication, controller.paymentConfirmation);
module.exports = cart;
