const express = require('express');
const bannerController = require('./controller')

const upload = require('../multer/multer')

const router = express.Router();


router.get("/get-all-banner", bannerController.getAllBanners);
router.get("/get-banner/:id", bannerController.getBannerById);
router.post("/create-banner", upload.fields([{ name: "bannerImage", maxCount: 1 }]), bannerController.createBanner);
router.put("/update-banner", upload.fields([{ name: "bannerImage", maxCount: 1 }]), bannerController.updateBanner);
router.delete("/delete-banner/:id", bannerController.deleteBanner);


module.exports = router;