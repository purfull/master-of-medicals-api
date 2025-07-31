const express = require('express');
const router = express.Router();
const orderController = require('./controller');

const authenticateToken = require('../utils/middleware')

router.get('/get-all-orders', authenticateToken.authenticateToken, orderController.getAllOrders);
router.get('/get-order/:id', authenticateToken.authenticateToken, orderController.getOrderById);
router.post('/create-order', authenticateToken.authenticateToken, orderController.createOrder);
router.put('/update-order', authenticateToken.authenticateToken, orderController.updateOrder);
router.put('/update-vendor-order', authenticateToken.authenticateToken, orderController.updateVendorOrder);
router.delete('/delete-order/:id', authenticateToken.authenticateToken, orderController.deleteOrder);

module.exports = router;

