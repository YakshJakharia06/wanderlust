const User = require("../models/user.js");


// RENDER SIGNUP
module.exports.renderSignupForm = async (req, res) => {
	res.render("users/signup.ejs");
};

// POST ROUTE OR SIGNUP
module.exports.signup = async (req, res) => {
	try {
		let { username, email, password } = req.body;
		let newUser = await new User({ email, username });
		const registeredUser = await User.register(newUser, password);
		// console.log(newUser);
		// console.log(registeredUser);
		req.login(registeredUser, (err) => {
			if (err) return next(err);
			req.flash("success", "User was Registred Successfully!\nWelcome to Wanderlust");
			return res.redirect("/listings");
		});
	} catch (err) {
		req.flash("error", err.message);
		res.redirect("/signup");
	}
};

// LOGIN FORM
module.exports.renderloginForm = async (req, res) => {
	res.render("users/login.ejs");
};

// POST LOGIN ROUTE
module.exports.login = async (req, res) => {
	try {
		// if we do login from home page then this because it will show empty.
		const redirectUrl = res.locals.redirectUrl || "/listings";

		req.flash("success", "Login Successful");
		delete req.session.redirectUrl;

		res.redirect(redirectUrl);
	} catch (error) {
		let link = "http://localhost:3000/signup"
		req.flash("error", `Wrong login Credentials! Please enter correct credentials. If not having account go to ${link}`);
		res.redirect("/login");
	}
};

// LOGOUT ROUTE
module.exports.logout = (req, res) => {
	req.logOut((err) => {
		if (err) {
			next(err);
		}
		req.flash("success", "You are logged out now");
		res.redirect("/login");
	});
};
