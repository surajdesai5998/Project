const express = require("express");
const router = express.Router();
const User = require("../models/user");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware");

const userController = require("../controllers/userController");


router.route("/signup")
    .get(userController.renderSignupForm)
    .post(userController.signUp);

router.route("/login")
    .get(userController.renderLoginForm)
    .post(saveRedirectUrl,
        passport.authenticate("local", {     //passport.authenticate(strategy,options,callback)
            failureRedirect: "/login",
            failureFlash: true
        }
        ),
        userController.login,
    );


router.get("/logout", userController.logout);


module.exports = router;