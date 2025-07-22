const express = require('express');
const bannerController = require('./controller')

const authenticateToken = require('../utils/middleware')

const upload = require('../multer/multer')

const router = express.Router();


router.get("/get-all-banner", authenticateToken.authenticateToken, bannerController.getAllBanners);
router.get("/get-banner/:id", authenticateToken.authenticateToken, bannerController.getBannerById);
router.post("/create-banner", upload.fields([{ name: "bannerImage", maxCount: 1 }]), authenticateToken.authenticateToken, bannerController.createBanner);
router.put("/update-banner", upload.fields([{ name: "bannerImage", maxCount: 1 }]), authenticateToken.authenticateToken, bannerController.updateBanner);
router.delete("/delete-banner/:id", authenticateToken.authenticateToken, bannerController.deleteBanner);


module.exports = router;