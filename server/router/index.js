const router = require('express').Router()
const user = require('./user-router')
const brand = require('./brand-router')
const produk = require('./produk-router')
const cart = require('./cart-router')

router.use(user)
router.use(brand)
router.use(produk)
router.use(cart)


module.exports = router