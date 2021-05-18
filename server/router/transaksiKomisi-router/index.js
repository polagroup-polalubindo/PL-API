const transaksiKomisi = require('express').Router()
const controller = require('../../controllers/transaksiKomisiController')
const authentication = require('../../middleware/authentication')

transaksiKomisi.post('/withdrawKomisi',authentication,controller.withdrawKomisi)
// transaksiKomisi.get('/transaksiKomisi',authentication,controller.getTransaksiKomisi)

module.exports = transaksiKomisi