const user = require('express').Router()
const controller = require('../../controllers/userController')
const authorization = require('../../middleware/authorization')
const authentication = require('../../middleware/authentication')

// CUSTOMER SIDE

user.post('/register',controller.register)
user.post('/login',controller.login)


// CMS

user.get('/customer',authentication,authorization,controller.getAllCustomer)
user.post('/customer',authentication,authorization,controller.addCustomer)
user.get(`/customer/:customerId`,authentication,authorization,controller.getOne)
user.put(`/customer/:customerId`,authentication,authorization,controller.editData)
user.delete(`/customer/:customerId`,authentication,authorization,controller.deleteCustomer)



module.exports = user