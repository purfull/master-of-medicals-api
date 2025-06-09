const express = require('express');
const CustomerController = require('./controller')

const router = express.Router();


router.get('/get-all-customer', CustomerController.getAllCustomer)
router.get('/get-customer/:id', CustomerController.getCustomerById)
router.post('/create-customer', CustomerController.createCustomer);
router.put('/update-customer', CustomerController.updateCustomer);
router.delete('/delete-customer/:id', CustomerController.deleteCustomer);


module.exports = router;