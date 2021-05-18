const router = require("express").Router();
const user = require("./user-router");
const brand = require("./brand-router");
const produk = require("./produk-router");
const cart = require("./cart-router");
const transaksi = require("./transaksi-router");
const transaksiKomisi = require("./transaksiKomisi-router");
const komisi = require("./komisi-router");
const rajaOngkir = require("./rajaOngkir-router");

router.use(user);
router.use(brand);
router.use(produk);
router.use(cart);
router.use(transaksi);
router.use(transaksiKomisi);
router.use(komisi);
router.use(rajaOngkir);

module.exports = router;
