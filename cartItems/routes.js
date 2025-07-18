const express = require('express');
const router = express.Router();
const cartItemController = require('./controller');

const authenticateToken = require('../utils/middleware')

router.get('/get-all-cart-items', authenticateToken.authenticateToken, cartItemController.getAllCartItems);
router.get('/get-cart/:id', authenticateToken.authenticateToken, cartItemController.getCartItemByCartId);
router.post('/add-cart-item', authenticateToken.authenticateToken, cartItemController.createCartItem);
router.put('/update-cart-item/:id', authenticateToken.authenticateToken, cartItemController.updateCartItem);
router.delete('/delete-cart-item/:id', authenticateToken.authenticateToken, cartItemController.deleteCartItem);

module.exports = router;
