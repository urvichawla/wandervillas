const express=require("express");
const router=express.Router();

const wrapAsync=require("../utils/wrapAsync.js");
const {listingSchema}=require("../schema.js");
const {reviewSchema}=require("../schema.js");
const ExpressError=require("../utils/ExpressError.js");

const Listing=require("../models/listing.js");

const {userSchema}=require("../schema.js");
const User=require("../models/user.js");
const {isloggedin, isowner}=require("../middleware.js");
const listingcontroller=require("../controllers/listings.js");
const multer=require("multer");
const {storage}=require("../CloudConfig.js");
const upload=multer({storage});
const validateListing=(req,res,next)=>{
    let {error}=listingSchema.validate(req.body);
    //console.log(result);
    if(error){
      let errmsg=error.details.map((el)=> el.message).join(",");
      throw new ExpressError(400,errmsg);
    }
    else{
      next();
    }

  };
  router
  .route("/")
  .get(wrapAsync(listingcontroller.index))
  .post(isloggedin,upload.single("listing[image]"),validateListing, wrapAsync(listingcontroller.createListing));


//router.get("/",wrapAsync(listingcontroller.index));

router.get("/new",isloggedin,listingcontroller.rendernewform);
router
.route("/:id")
.get(wrapAsync(listingcontroller.showlisting))
.put(isloggedin,isowner, upload.single("listing[image]"),validateListing,wrapAsync(listingcontroller.updatelisting))
.delete(isloggedin,isowner, wrapAsync(listingcontroller.destroylisting));

  //router.get("/:id", wrapAsync(listingcontroller.showlisting));
  //router.post("/",isloggedin,validateListing, wrapAsync(listingcontroller.createListing));
  router.get("/:id/edit",isloggedin,isowner, wrapAsync(listingcontroller.rendereditform));
 // router.put("/:id",isloggedin,isowner, validateListing,wrapAsync(listingcontroller.updatelisting));
  //router.delete("/:id",isloggedin,isowner, wrapAsync(listingcontroller.destroylisting));
  module.exports=router;