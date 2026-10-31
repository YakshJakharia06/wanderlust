const Listing = require("./models/listing");
const Review = require("./models/review");
const { listingSchema, reviewSchema } = require('./schema.js');
const ExpressError = require('./utils/ExpressError.js');


// if logged in or not.
module.exports.isLoggedInListing = (req, res, next) => {
	if (!req.isAuthenticated()) {
		// if a user is editing/creating then but not logged in but after login then the user should redirect to the previous access path/url.
		req.session.redirectUrl = req.originalUrl;
		// console.log(req.session.redirectUrl);
		req.flash("error", "You must be logged in to Create listing.");
		return res.redirect("/login");
	}
	next();
};

module.exports.isLoggedInReview = (req, res, next) => {
	if (!req.isAuthenticated()) {
		// if a user is editing/creating then but not logged in but after login then the user should redirect to the previous access path/url.
		req.session.redirectUrl = req.originalUrl;
		req.flash("error", "You must be logged in to Create Review.");
		return res.redirect("/login");
	}
	next();
};


// One issue with RedirectUrl is that after logging the passport resets the req.session so we need to make a new middleware to save the previous path the user was trying to access.
module.exports.savedRedirectUrl = (req, res, next) => {
	if (req.session.redirectUrl) {
		res.locals.redirectUrl = req.session.redirectUrl;
		// console.log(req.session.redirectUrl);
	}
	next();
};


// authorization for editing and deleting reviews/listings
module.exports.isOwnerListing = async (req, res, next) => {
	let { id } = req.params;
	let listing = await Listing.findById(id);
	if (res.locals.currUser && !listing.owner._id.equals(res.locals.currUser._id)) {
		req.flash("error", "You are not the owner of this listing, you cannot edit/delete this listing");
		res.redirect(`/listings/${id}`);
	}
	next();
};

module.exports.isOwnerReview = async (req, res, next) => {
	let { reviewId } = req.params;
	let review = await Review.findById(reviewId);
	if (res.locals.currUser && !review.author._id.equals(res.locals.currUser._id)) {
		req.flash("error", "You are not the author of this review, you cannot edit/delete this review");
		res.redirect(`/listings/${reviewId}`);
	}
	next();
};

// validates
module.exports.validateListing = (req, res, next) => {
	let { error } = listingSchema.validate(req.body);
	if (error) {
		let errMsg = error.details.map((el) => el.message).join(",");
		throw new ExpressError(400, errMsg);
	} else {
		next();
	}
};

module.exports.validateReview = (req, res, next) => {
	let { error } = reviewSchema.validate(req.body);
	if (error) {
		let errMsg = error.details.map((el) => el.message).join(",");
		throw new ExpressError(400, errMsg);
	} else {
		next();
	}
};
