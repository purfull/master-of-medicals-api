const express = require('express');
const productController = require('./controller')
const authenticateToken = require('../utils/middleware')

const upload = require('../multer/multer')

const router = express.Router();


router.get('/get-all-product', authenticateToken.authenticateToken, productController.getAllProduct)
router.get('/get-product/:id', authenticateToken.authenticateToken, productController.getProductById)


router.get('/get-all-catagory', authenticateToken.authenticateToken, productController.getProductCatagory)
router.get('/get-all-sub-catagory/:id', authenticateToken.authenticateToken, productController.getProductSubCatagory)


router.post('/create-product', authenticateToken.authenticateToken, upload.fields([
    { name: "thumbnailImage", maxCount: 1 },
    { name: "galleryImage", maxCount: 10 }, 
  ]), productController.createProduct);
router.put('/update-product', authenticateToken.authenticateToken, upload.fields([
    { name: "thumbnailImage", maxCount: 1 },
    { name: "galleryImage", maxCount: 10 }, 
  ]),  productController.updateProduct);
router.delete('/delete-product/:id', authenticateToken.authenticateToken, productController.deleteProduct);


module.exports = router;