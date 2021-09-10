const brand = require('express').Router()
const controller = require('../../controllers/brandController')
const authorization = require('../../middleware/authorization')
const authentication = require('../../middleware/authentication')
const upload = require("../../middleware/multer");

brand.get('/brand', controller.getAllBrand)
brand.get('/brandProducts/:brandId', controller.getProductList)

// CMS
brand.post('/brand', authentication, authorization, upload.single('logo'), controller.addNewBrand)
brand.get('/brand/:brandId', authentication, authorization, controller.getOneBrand)
brand.put('/brand/:brandId', authentication, authorization, upload.single('logo'), controller.editBrand)
brand.delete('/brand/:brandId', authentication, authorization, controller.deleteBrand)

module.exports = brand