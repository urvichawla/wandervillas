const User=require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const { check, validationResult } = require('express-validator');
module.exports.rendersignupform=(req,res)=>{
    res.render("users/signup.ejs");
};
module.exports.signup = [
    check('email')
        .isEmail().withMessage('Enter a valid email address'),
    check('password')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
        .matches(/[0-9]/).withMessage('Password must contain at least one number')
        .matches(/[a-zA-Z]/).withMessage('Password must contain at least one letter')
        .matches(/[^a-zA-Z0-9]/).withMessage('Password must contain at least one special character'),
    wrapAsync(async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const errorMessages = errors.array().map(error => error.msg);
            req.flash('error', errorMessages);
            return res.redirect('/signup');
        }
        try {
            let { username, email, password } = req.body;
            const newuser = new User({ email, username });
            const registereduser = await User.register(newuser, password);
            console.log(registereduser);
            req.login(registereduser, (err) => {
                if (err) {
                    return next(err);
                }
                req.flash("success", "User was registered");
                res.redirect("/listings");
            });
        } catch (e) {
            req.flash("error", e.message);
            res.redirect("/signup");
        }
    })
];
// module.exports.signup=[
//     check('email', 'Email is invalid').isEmail(),
//     check('password')
//         .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
//         .matches(/[0-9]/).withMessage('Password must contain at least one number')
//         .matches(/[a-zA-Z]/).withMessage('Password must contain at least one letter')
//         .matches(/[^a-zA-Z0-9]/).withMessage('Password must contain at least one special character'),

// async(req,res)=>{
//     try{
//     let {username,email,password}=req.body;
//     const newuser=new User({email,username});
//    const registereduser=await  User.register(newuser,password);
//    console.log(registereduser);
//    req.login(registereduser,(err)=>{
//     if(err){
//         return next(err);
//     }
//     req.flash("success","user was registered");
//    res.redirect("/listings");
//    })
   
//     }
//     catch(e){
//         req.flash("error",e.message);
//         res.redirect("/signup");
//     }

// }
// ];
module.exports.renderloginform=(req,res)=>{
    res.render("users/login.ejs");
};
module.exports.login=async (req,res)=>{
    req.flash("success","Welcome to WanderVillas");
    let redirecturl=res.locals.redirecturl || "/listings";
   // res.redirect(res.locals.redirecturl);
   res.redirect(redirecturl);

};
module.exports.logout=(req,res)=>{
    req.logout((error)=>{
        if(error){
          return next(error);
        }
        req.flash("success","you are logged out");
        res.redirect("/listings");
    })
}