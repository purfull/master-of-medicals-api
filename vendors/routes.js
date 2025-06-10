const express = require('express');
const VendorController = require('./controller')

const authenticateToken = require('../utils/middleware')

const router = express.Router();


router.get('/get-all-vendor', authenticateToken.authenticateToken, VendorController.getAllVendors)
router.get('/get-vendor/:id', authenticateToken.authenticateToken, VendorController.getVendorsById)
router.post('/create-vendor', VendorController.createVendors);
router.put('/update-vendor', authenticateToken.authenticateToken, VendorController.updateVendors);
router.delete('/delete-vendor/:id', authenticateToken.authenticateToken, VendorController.deleteVendors);


module.exports = router;