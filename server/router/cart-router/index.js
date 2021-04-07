const cart = require('express').Router()
const controller = require('../../controllers/cartController')
const authentication = require('../../middleware/authentication')

cart.get('/cart',controller.getCart)
cart.post('/cart',controller.checkOut)
cart.post ('/cart/:referralCode/:transaksiId',authentication,controller.paymentConfirmation)
module.exports = cart