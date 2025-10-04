const express = require('express');
const brandController = require('./controller')

const authenticateToken = require('../utils/middleware')

const upload = require('../multer/multer')

const router = express.Router();


router.get("/get-all-brand", authenticateToken.authenticateToken, brandController.getAllBrand);
router.get("/get-brand/:id", authenticateToken.authenticateToken, brandController.getBrandById);
router.post("/create-brand", upload.fields([{ name: "brandImage", maxCount: 1 }]), authenticateToken.authenticateToken, brandController.createBrand);
router.put("/update-brand", upload.fields([{ name: "brandImage", maxCount: 1 }]), authenticateToken.authenticateToken, brandController.updateBrand);
router.delete("/delete-brand/:id", authenticateToken.authenticateToken, brandController.deleteBrand);


module.exports = router;