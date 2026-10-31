const express = require('express');
// mergeParams use kiya taki parent route me id vagera hai tho usko bhi yaha use kar sake
const router = express.Router({mergeParams: true});
const wrapAsync = require('../utils/wrapAsync.js');
const { isLoggedInReview, validateReview, isOwnerReview } = require('../middleware.js');
const reviewController = require("../controllers/reviews.js");


// Reviews
router.post("/", isLoggedInReview, validateReview, wrapAsync(reviewController.createReview));

// Edit review Route
router.get("/:reviewId/edit", isLoggedInReview, isOwnerReview, reviewController.editReview);

// Update review route
router.put("/:reviewId", isLoggedInReview, isOwnerReview, validateReview, wrapAsync(reviewController.updateReview));

// Delete reviews route
router.delete("/:reviewId", isLoggedInReview, isOwnerReview, wrapAsync(reviewController.destroyReview));


module.exports = router