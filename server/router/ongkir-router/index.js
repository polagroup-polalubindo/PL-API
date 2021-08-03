const router = require('express').Router()
const controller = require('../../controllers/APIController')

router.get('/ongkir',controller.getCost)

module.exports = router