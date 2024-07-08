const express=require("express");
const router=express.Router();
const User=require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport=require("passport");
const {saveredirecturl}=require("../middleware.js");
const usercontroller=require("../controllers/users.js");

router.get("/signup",usercontroller.rendersignupform);
router.post("/signup",(usercontroller.signup));
router.get("/login",usercontroller.renderloginform);
router.post("/login", saveredirecturl,passport.authenticate("local",{failureRedirect:'/login',failureFlash: true}),usercontroller.login);
router.get("/logout",usercontroller.logout);
module.exports=router;
