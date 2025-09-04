const express = require("express");
const router = express.Router({ mergeParams: true });
const Review = require("../models/review.js");
const { reviewSchema } = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { isLoggedIn } = require("../middleware.js");

const reviewController = require("../controllers/reviews.js");

const isReviewAuthor = async(req, res, next) => {
    const { reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review.author.equals(req.user._id)) {
        req.flash("error", "You are not allowed to delete this review.");
        return res.redirect(`/listings/${req.params.id}`);
    }
    next();
};


const validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};

router.post("/", validateReview, isLoggedIn, wrapAsync(reviewController.createReview));

//Delete Review Route
router.delete("/:reviewId", isReviewAuthor, isLoggedIn, wrapAsync(reviewController.deleteReview));

module.exports = router;