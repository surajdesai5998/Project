const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const { validateReview, isLoggedIn, isReviewAuther } = require("../middleware.js");

const reviewController = require("../controllers/reviewController.js");


// REVIEW
// post Review
router.post("/", isLoggedIn, validateReview, wrapAsync(reviewController.createReview));

// delete review
router.delete("/:reviewId", isLoggedIn, isReviewAuther, wrapAsync(reviewController.destroyReview));


module.exports = router;