const express = require('express');
const offerBannerController = require('./controller')

const upload = require('../multer/multer')

const router = express.Router();


router.get("/get-all-banner", offerBannerController.getAllOfferBanners);
router.get("/get-banner/:id", offerBannerController.getOfferBannerById);
router.post("/create-banner", upload.fields([{ name: "bannerImage", maxCount: 1 }]), offerBannerController.createOfferBanner);
router.put("/update-banner", upload.fields([{ name: "bannerImage", maxCount: 1 }]), offerBannerController.updateOfferBanner);
router.delete("/delete-banner/:id", offerBannerController.deleteOfferBanner);


module.exports = router;