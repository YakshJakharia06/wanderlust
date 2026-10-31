const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync.js');
const { isLoggedInListing, isOwnerListing, validateListing } = require('../middleware.js');
// multer is used for uploading of files.
const multer = require('multer');
const { storage } = require("../cloudConfig.js");
// upload is making an folder name upload where all the uploaded files are saved/stored.
const upload = multer({ storage });
// const upload = multer({ dest: 'upload/' });		// it automatically makes an folder name uplaods in our project folder.



// controllers
const listingController = require("../controllers/listings.js");

router
	.route("/")
	// INDEX ROUTE
	.get(wrapAsync(listingController.index))
	// CREATE ROUTE
	.post(
		isLoggedInListing,
		upload.single("listing[image]"),
		validateListing,
		wrapAsync(listingController.createListing)
	);


//NEW ROUTE
router.get('/new', isLoggedInListing, listingController.renderNewForm);


router
	.route("/:id")
	// show route
	.get(wrapAsync(listingController.showListing))
	// edit route
	.put(isLoggedInListing,
		isOwnerListing,
		upload.single("listing[image]"),
		validateListing,
		wrapAsync(listingController.updateListing))
	// delete route
	.delete(isLoggedInListing, wrapAsync(listingController.deleteListing));


// EDIT ROUTE
router.get('/:id/edit', isLoggedInListing, wrapAsync(listingController.editListing));


module.exports = router;