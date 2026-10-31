const Listing = require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });
// stylesService exposes listStyles(), createStyle(), getStyle(), etc.


// INDEX ROUTE
module.exports.index = async (req, res) => {

	let { category } = req.query;
    console.log(category);

	let { search } = req.query;
	let filter = {};

	if (!search && category !== "undefined") {
		search = category;
	};

	if (search && search.trim() !== "") {

		search = search.trim();

		// Convert plural words into singular
		let singular = search.toLowerCase();

		if (/(ches|shes|xes|zes|sses)$/.test(singular)) {
			singular = singular.slice(0, -2);
		} else if (/ies$/.test(singular)) {
			singular = singular.slice(0, -3) + "y";
		} else if (/s$/.test(singular) && !/ss$/.test(singular)) {
			singular = singular.slice(0, -1);
		}

		// Generate singular and plural variations
		let variations = [search, singular];

		if (/(s|x|z|ch|sh)$/.test(singular)) {
			variations.push(singular + "es");
		} else if (/[^aeiou]y$/.test(singular)) {
			variations.push(singular.slice(0, -1) + "ies");
		} else {
			variations.push(singular + "s");
		}

		// Create search regex
		const searchRegex = new RegExp(
			[...new Set(variations)]
				.map(word => word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
				.join("|"),
			"i"
		);

		filter = {
			$or: [
				{ title: searchRegex },
				{ location: searchRegex },
				{ country: searchRegex }
			]
		};
	}

	// IMPORTANT: Use filter here, not {}
	const allListings = await Listing.find(filter);

	res.render("listings/index", {
		allListings,
		search
	});
};

// NEW ROUTE
module.exports.renderNewForm = async (req, res) => {
	res.render("listings/new");
};

// SHOW ROUTE
module.exports.showListing = async (req, res) => {
	let { id } = req.params;
	const listing = await Listing.findById(id).populate({ path: "reviews", populate: { path: "author" } }).populate("owner");

	if (!listing) {
		req.flash("error", "Listing you requested for does not exist!");
		res.redirect("/listings");
	}
	// console.log(listing);
	res.render("listings/show", { listing });
};

// CREATE ROUTE
module.exports.createListing = async (req, res, next) => {

	const geoResponse = await geocodingClient.forwardGeocode({
		query: req.body.listing.location,
		limit: 1
	}).send();

	const feature = geoResponse.body.features[0];

	if (!feature || !feature.geometry) {
		return next(
			new ExpressError(400, "Location not found. Please enter a valid location.")
		);
	}

	const newListing = new Listing(req.body.listing);
	newListing.owner = req.user._id;
	newListing.image = { url: req.file.path, filename: req.file.filename };

	newListing.geometry = feature.geometry;
	console.log("Saved coordinates:", feature.geometry.coordinates);

	await newListing.save();

	req.flash("success", "New Listing Created!");
	res.redirect("/listings");

};

// EDIT ROUTE
module.exports.editListing = async (req, res) => {

	let { id } = req.params;
	const listing = await Listing.findById(id);

	if (!listing) {
		req.flash("error", "Listing you requested for does not exist!");
		return res.redirect("/listings");
	}

	let originalImageUrl = listing.image.url;
	originalImageUrl.replace("/upload", "/upload/h_300,w_250");

	res.render("listings/edit", { listing, originalImageUrl });
};

// UPDATE ROUTE
module.exports.updateListing = async (req, res) => {
	let { id } = req.params;
	let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

	if (typeof req.file !== "undefined") {
		let url = req.file.path;
		let filename = req.file.filename;
		listing.image = { url, filename };
		await listing.save();
	}

	req.flash("success", "Listing Updated!");
	res.redirect(`/listings/${id}`);
};

// DELETE ROUTE
module.exports.deleteListing = async (req, res) => {
	let { id } = req.params;
	await Listing.findByIdAndDelete(id);
	req.flash("deleted", "Listing Deleted Successfully!");
	res.redirect("/listings");
};
