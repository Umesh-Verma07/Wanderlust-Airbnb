const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");

const listingController = require("../controllers/listings.js");

const multer  = require('multer')
const {storage} = require("../cloudConfig.js");
const upload = multer({storage});

router.route("/")
.get(wrapAsync(listingController.index))
.post(isLoggedIn, upload.single("listing[image]"), validateListing, wrapAsync(listingController.createListing));


//Search
router.get("/search", wrapAsync(listingController.search));

//Search Icon
router.get("/search/:id", wrapAsync(listingController.searchIcon));

// New Route
router.get("/new", isLoggedIn, listingController.renderNewForm);

router.route("/:id")
.get(isLoggedIn, wrapAsync(listingController.showListing))
.put(isLoggedIn,isOwner, upload.single("listing[image]"), validateListing, wrapAsync(listingController.updateListing))
.delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));

// Edit Route
router.get("/:id/edit", isOwner, isLoggedIn, wrapAsync(listingController.renderEditForm));

module.exports = router;