const router = require("express").Router();
const user = require("./user-router");
const brand = require("./brand-router");
const produk = require("./produk-router");
const cart = require("./cart-router");
const transaksi = require("./transaksi-router");
const transaksiKomisi = require("./transaksiKomisi-router");
const komisi = require("./komisi-router");
const api = require("./api-router");
const alamat = require("./alamat-router");
const voucher = require("./voucher-router");
const area = require("./area-router");

router.use(user);
router.use(brand);
router.use(produk);
router.use(cart);
router.use(transaksi);
router.use(transaksiKomisi);
router.use(komisi);
router.use(api);
router.use(alamat);
router.use(area);
router.use(voucher);

module.exports = router;
