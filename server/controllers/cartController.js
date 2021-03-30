const { Cart, Produk, User } = require("../models");

class Controller {
  static getCart = async (req, res) => {
    try {
      const shoppingCart = await Cart.findAll({ include: [Produk, User] });
      return res.status(200).json(shoppingCart);
    } catch (error) {
      return res.status(400).json(error);
    }
  };
}

module.exports = Controller;
