const { Cart, Produk, User, Transaksi } = require("../models");

class Controller {
  static getCart = async (req, res) => {
    try {
      const shoppingCart = await Cart.findAll({ include: [Produk, User] });
      return res.status(200).json(shoppingCart);
    } catch (error) {
      return res.status(400).json(error);
    }
  };

  static checkOut = async (req,res) =>{
      try {
          const {value}= req.body
          const {transaksiData} = req.body
          console.log(transaksiData)
          const {id} = await Transaksi.create(transaksiData)
          value.map(val=>{
            val.transaksiId = id
          })
        const carts = await Cart.bulkCreate(value)
        return res.status(201).json(carts)
      } catch (error) {
          return res.status(400).json(error)
      }
  }
}

module.exports = Controller;
