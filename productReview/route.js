const express = require("express");
const router = express.Router();
const reviewController = require("./controller");
const authenticateToken = require('../utils/middleware')

router.get("/get-all-review", authenticateToken.authenticateToken, reviewController.getAllReviews);
router.get("/get-review/:id", authenticateToken.authenticateToken, reviewController.getReviewById);
router.post("/create-review", authenticateToken.authenticateToken, reviewController.createReview);
router.put("/update-review", authenticateToken.authenticateToken, reviewController.updateReview);
router.delete("/delete-review/:id", authenticateToken.authenticateToken, reviewController.deleteReview);

module.exports = router;
