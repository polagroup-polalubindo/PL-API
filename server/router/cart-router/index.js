const cart = require('express').Router()
const controller = require('../../controllers/cartController')

cart.get('/cart',controller.getCart)

module.exports = cart