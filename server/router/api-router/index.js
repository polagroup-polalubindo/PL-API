const router = require('express').Router()
const controller = require('../../controllers/APIController')

router.get('/ongkir',controller.getCost)
router.get('/tracking/:waybillNo',controller.tracking)

module.exports = router