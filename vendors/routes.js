const express = require('express');
const VendorController = require('./controller')

const router = express.Router();


router.get('/get-all-Vendor', VendorController.getAllVendors)
router.get('/get-Vendor/:id', VendorController.getVendorsById)
router.post('/create-Vendor', VendorController.createVendors);
router.put('/update-Vendor', VendorController.updateVendors);
router.delete('/delete-Vendor/:id', VendorController.deleteVendors);


module.exports = router;