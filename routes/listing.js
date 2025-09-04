const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { listingSchema } = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner } = require("../middleware.js");

const ListingController = require("../controllers/listings.js");

const multer = require('multer')
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

const validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};

//index route
router.get("/", wrapAsync(ListingController.index));

//new route
router.get("/new", isLoggedIn, ListingController.renderNewForm);

//show route
router.get("/:id", wrapAsync(ListingController.show));

//create route
router.post("/", isLoggedIn, upload.single('listing[image]'), validateListing, wrapAsync(ListingController.createListing));
// router.post("/", upload.single('listing[image]'), (req, res) => {
//     console.log(req.file);
//     res.send(req.file);
// });


//edit route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(ListingController.renderEditForm));

//update route
router.put("/:id", isLoggedIn, isOwner, upload.single('listing[image]'), validateListing, wrapAsync(ListingController.updateListing));

//delete route
router.delete("/:id", isLoggedIn, isOwner, wrapAsync(ListingController.deleteListing));

module.exports = router;