const transaksiKomisi = require('express').Router()
const controller = require('../../controllers/transaksiKomisiController')


transaksiKomisi.post('/transaksiKomisi',controller.createTransaksiKomisi)

module.exports = transaksiKomisi