const express = require('express');
const AddressController = require('./controller')

const authenticateToken = require('../utils/middleware')
const router = express.Router();


router.get('/get-all-address',authenticateToken.authenticateToken, AddressController.getAllAddresses)
router.get('/get-address/:id', authenticateToken.authenticateToken, AddressController.getAddressById)
router.post('/create-address', authenticateToken.authenticateToken, AddressController.createAddress);
router.put('/update-address', authenticateToken.authenticateToken, AddressController.updateAddress);
router.delete('/delete-address/:id', authenticateToken.authenticateToken, AddressController.deleteAddress);


module.exports = router;