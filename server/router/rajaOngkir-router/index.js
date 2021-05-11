const rajaOngkir = require('express').Router()
const controller = require('../../controllers/APIController')

rajaOngkir.get('/province',controller.getProvince)
rajaOngkir.get('/city',controller.getCity)
rajaOngkir.get('/cost',controller.getCost)
rajaOngkir.get('/cost/:destination/:courier/:weight',controller.getTotalCost)

module.exports = rajaOngkir