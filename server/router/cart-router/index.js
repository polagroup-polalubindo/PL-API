const cart = require('express').Router()
const controller = require('../../controllers/cartController')
const authentication = require('../../middleware/authentication')

cart.get('/cart',controller.getCart)
cart.post('/checkout',controller.checkOut)
cart.post ('/cart/:referralCode/:transaksiId',authentication,controller.paymentConfirmation)
cart.get('/testget',controller.testget)
module.exports = cart