const express = require('express');
const CustomerController = require('./controller')

const authenticateToken = require('../utils/middleware')
const router = express.Router();


router.get('/get-all-customer',authenticateToken.authenticateToken, CustomerController.getAllCustomer)
router.get('/get-customer/:id', authenticateToken.authenticateToken, CustomerController.getCustomerById)
router.post('/create-customer', CustomerController.createCustomer);
router.put('/update-customer', authenticateToken.authenticateToken, CustomerController.updateCustomer);
router.delete('/delete-customer/:id', authenticateToken.authenticateToken, CustomerController.deleteCustomer);


module.exports = router;