const express = require('express');
const brandController = require('./controller')

const upload = require('../multer/multer')

const router = express.Router();


router.get("/get-all-brand", brandController.getAllBrand);
router.get("/get-brand/:id", brandController.getBrandById);
router.post("/create-brand", upload.fields([{ name: "brandImage", maxCount: 1 }]), brandController.createBrand);
router.put("/update-brand", upload.fields([{ name: "brandImage", maxCount: 1 }]), brandController.updateBrand);
router.delete("/delete-brand/:id", brandController.deleteBrand);


module.exports = router;