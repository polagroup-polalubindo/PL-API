const brand = require('express').Router()
const controller = require('../../controllers/brandController')
const authorization = require('../../middleware/authorization')
const authentication = require('../../middleware/authentication')



brand.get('/brand',controller.getAllBrand)

brand.get('/brandProducts/:brandId',controller.getProductList)
// CMS

brand.post('/brand',authentication,authorization,controller.addNewBrand)
brand.get('/brand/:brandId',authentication,authorization,controller.getOneBrand)
brand.put('/brand/:brandId',authentication,authorization,controller.editBrand)
brand.delete('/brand/:brandId',authentication,authorization,controller.deleteBrand)

module.exports = brand