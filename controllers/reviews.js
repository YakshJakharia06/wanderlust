const Review = require("../models/review");
const Listing = require('../models/listing.js');


// CREATE REVIEW ROUTE
module.exports.createReview = async (req, res) => {
	// agar mergeParams use nhi karte tho ye listing ki id me undefined ya null aata kyuki humare parent route "/listings/:id/reviews" hai aur voh dusre file me hai isliye usko like le nhi pata isliye mergeParams se saare parent ke params ko bhi le sake isliye use karte hai

	let listing = await Listing.findById(req.params.id);
	let newReview = new Review(req.body.review);
	newReview.author = req.user._id;
	listing.reviews.push(newReview);
	await newReview.save();
	await listing.save();
	console.log("Review saved");

	req.flash("success", "New Review Created!");
	res.redirect(`/listings/${listing._id}`);
};

// EDIT REVIEW ROUTE
module.exports.editReview = async (req, res) => {
	let { id, reviewId } = req.params;

	const listing = await Listing.findById(id);
	const review = await Review.findById(reviewId);

	res.render("listings/reviewEdit", { listing, review });
};

// UPDATE REVIEW ROUTE
module.exports.updateReview = async (req, res) => {
	let { id, reviewId } = req.params;

	await Review.findByIdAndUpdate(reviewId, { ...req.body.review }, { runValidators: true });

	res.redirect(`/listings/${id}`);
};

// DELETE ROUTE
module.exports.destroyReview = async (req, res) => {
	let { id, reviewId } = req.params;
	// to delete from the list.
	await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
	// to delete the review from review database
	await Review.findByIdAndDelete(reviewId);

	req.flash("deleted", "Review Deleted Successfully!");
	res.redirect(`/listings/${id}`);
};
