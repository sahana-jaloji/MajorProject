const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");

router.get("/signup", (req, res) => {
    res.render("users/signup.ejs");
})

router.post("/signup", wrapAsync(async(req, res) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ email, username });
        const registeredUser = await User.register(newUser, password);
        req.flash("success", "user registered successfully");
        res.redirect("/listings");
    } catch (err) {
        req.flash("error", "username is already exists");
        res.redirect("/signup");
    }

}));

router.get("/login", (req, res) => {
    res.render("users/login.ejs");
})

router.post("/login", passport.authenticate("local", {
    failureRedirect: '/login',
    failureFlash: true
}), async(req, res) => {
    req.flash("success", "Successfully logged in");
    res.redirect("/listings");
})

module.exports = router;