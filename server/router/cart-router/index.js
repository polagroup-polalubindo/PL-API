const cart = require('express').Router()
const controller = require('../../controllers/cartController')

cart.get('/cart',controller.getCart)
cart.post('/cart',controller.checkOut)
module.exports = cart