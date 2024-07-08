const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync.js");
//const {listingSchema}=require("../schema.js");
const {reviewSchema}=require("../schema.js");
const {isloggedin,isreviewauthor}=require("../middleware.js");
const ExpressError=require("../utils/ExpressError.js");
const Listing=require("../models/listing.js");
const Review=require("../models/review.js");
const reviewcontroller=require("../controllers/reviews.js");

const validateReview=(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body);
    //console.log(result);
    if(error){
      let errmsg=error.details.map((el)=> el.message).join(",");
      throw new ExpressError(400,errmsg);
    }
    else{
      next();
    }

  };
router.post("/",isloggedin,validateReview,wrapAsync(reviewcontroller.addreview));
  //delete review rout
  router.delete("/:reviewid",isloggedin,isreviewauthor,wrapAsync(reviewcontroller.deletereview));
//   app.all("*",(req,res,next)=>{
//     next(new ExpressError(404,"page not found!"))
//   })
 
  module.exports=router;