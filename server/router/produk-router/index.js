const produk = require('express').Router()
const controller = require('../../controllers/produkController')
const authorization = require('../../middleware/authorization')
const authentication = require('../../middleware/authentication')


produk.get('/produk',controller.getAll)

// CMS

produk.post('/produk',authentication,authorization,controller.addProduk)
produk.get('/produk/:produkId',authentication,authorization,controller.getOneProduk)
produk.put('/produk/:produkId',authentication,authorization,controller.editProduk)
produk.delete('/produk/:produkId',authentication,authorization,controller.deleteProduk)



module.exports = produk