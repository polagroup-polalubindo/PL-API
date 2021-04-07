const transaksi = require('express').Router()
const controller = require('../../controllers/transaksiController')
const authentication = require('../../middleware/authentication')
const authorization = require('../../middleware/authorization')

transaksi.get('/transaksi',authentication,controller.getAllTransaksi)
transaksi.put('/transaksi/:transaksiId',authentication,controller.editTransaksi)


module.exports = transaksi