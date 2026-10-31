const express = require('express');
const wrapAsync = require('../utils/wrapAsync');
// mergeParams use kiya taki parent route me id vagera hai tho usko bhi yaha use kar sake
const router = express.Router({ mergeParams: true });
const passport = require('passport');
const { savedRedirectUrl } = require('../middleware.js');
const userController = require("../controllers/users.js");


router.get("/signup", userController.renderSignupForm);

router.post("/signup", wrapAsync(userController.signup));

router.get("/login", userController.renderloginForm);

router.post("/login", savedRedirectUrl, passport.authenticate("local", { failureRedirect: "/login", failureFlash: true } ), wrapAsync(userController.login));

router.get("/logout", userController.logout);


module.exports = router;
