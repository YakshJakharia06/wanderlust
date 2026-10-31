const dns = require("node:dns");

dns.setServers(["1.1.1.1", "8.8.8.8"]);

if (process.env.NODE_ENV != "production") {
	require('dotenv').config();
}


const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const { MongoStore } = require('connect-mongo');
const flash = require('connect-flash');
const passport = require("passport");
const LocalStrategy = require('passport-local');


// models file --> Schemas
const User = require('./models/user.js');

// error handlers
const ExpressError = require('./utils/ExpressError.js');

// routes
const listingRoutes = require('./routes/listing.js');
const reviewRoutes = require('./routes/reviews.js');
const userRoutes = require('./routes/user.js');



app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);


const db = process.env.MONGODB_URL || "mongodb://localhost:27017/MajorProject";

main().then((res) => {
	console.log("Database connected successfully");
}).catch((err) => {
	console.log("Error in db connection -", err);
});


async function main() {
	await mongoose.connect(db);
}

const store = MongoStore.create({
	mongoUrl: db,
	crypto: {
		secret: process.env.SECRET
	},
	touchAfter: 24*3600,
});

store.on("error", () => {
	console.log("ERROR in MONGO STORE", err);
})

const sessionOptions = {
	store,
	secret: process.env.SECRET,
	resave: false,
	saveUninitialized: true,
	cookie: {
		expires: Date.now() + 7 * 24 * 60 * 60 * 1000,		// date + (days after delete) * (hours in a day) * (min) * (sec) * (millisec)
		maxAge: 7 * 24 * 60 * 60 * 1000,
		httpOnly: true,
	}
};


app.get('/', (req, res) => {
	res.redirect('/listings');
});



app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());		// same website when page-to-page no login required again and again only one login
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req, res, next) => {
	// global variables
	res.locals.success = req.flash("success");
	res.locals.deleted = req.flash("deleted");
	res.locals.error = req.flash("error");
	res.locals.currUser = req.user;
	next();		// always call next otherwise we will be stuck at here only.
});


app.use("/listings", listingRoutes);
app.use("/listings/:id/reviews", reviewRoutes);

app.use("/", userRoutes);


app.use((err, req, res, next) => {
	if (res.headersSent) {
		return next(err);
	}
	
  let { statusCode=500, message="Something went wrong"} = err;
  // res.status(statusCode).send(message);
  res.status(statusCode).render("error.ejs", { statusCode, message});
});


app.all("/{*splat}", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found"));
});



app.listen(3000, () => {
	console.log("Server running on http://localhost:3000");
});