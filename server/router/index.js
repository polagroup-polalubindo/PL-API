const router = require('express').Router()
const user = require('./user-router')
const brand = require('./brand-router')
const produk = require('./produk-router')
const cart = require('./cart-router')
const transaksi = require('./transaksi-router')
const transaksiKomisi = require('./transaksiKomisi-router')

router.use(user)
router.use(brand)
router.use(produk)
router.use(cart)
router.use(transaksi)
router.use(transaksiKomisi)


module.exports = router