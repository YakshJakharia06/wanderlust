const dns = require("node:dns");
dns.setServers(["1.1.1.1", "8.8.8.8"]);

if (process.env.NODE_ENV != "production") {
	require("dotenv").config();
}

const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

// Mapbox geocoding client (this was missing)
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapToken = process.env.MAP_TOKEN; // use the same name as in your .env
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

const db = process.env.MONGODB_URL || "mongodb://localhost:27017/MajorProject";

async function main() {
	await mongoose.connect(db);
}

const initDB = async () => {
	// add geometry to every listing
	for (let listing of initData.data) {
		let response = await geocodingClient
			.forwardGeocode({
				query: `${listing.location}, ${listing.country}`,
				limit: 1,
			})
			.send();

		if (!response.body.features.length) {
			throw new Error(`Location not found: ${listing.location}`);
		}

		listing.geometry = response.body.features[0].geometry;
	}

	await Listing.deleteMany({});

	initData.data = initData.data.map((obj) => ({
		...obj,
		owner: "6ae5eeddb4d745358711718b",
	}));

	await Listing.insertMany(initData.data);
	console.log("Data was initialized");
};

main()
	.then(() => {
		console.log("Database connected successfully");
		return initDB();
	})
	.then(() => mongoose.connection.close())
	.catch((err) => {
		console.log("Error -", err);
		mongoose.connection.close();
	});