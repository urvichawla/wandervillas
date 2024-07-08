
const Listing=require("./models/listing");
const Review=require("./models/review");
const {listingSchema,reviewSchema}=require("./schema.js");
module.exports.isloggedin=(req,res,next)=>{
    //console.log(req.path,"..",req.originalUrl);
    //console.log(req.user);
    if(!req.isAuthenticated()){
        req.session.redirecturl=req.originalUrl;
        req.flash("error","you must be logged in to create a new listing");
        return res.redirect("/login");
      }
      next();
}
module.exports.saveredirecturl=(req,res,next)=>{
    if(req.session.redirecturl){
        res.locals.redirecturl=req.session.redirecturl;
    }
    next();
}
module.exports.isowner= async (req,res,next)=>{
    let {id}=req.params;

    // if(!req.body.listing){
    //   throw new ExpressError(400,"send valid data for listing")
    // }
    let listing=await Listing.findById(id);
    if(!listing.owner.equals(res.locals.currUser._id)){
      req.flash("error","you are not the owner of this listing");
      return res.redirect(`/listings/${id}`);
    }
    next();

}
module.exports.isreviewauthor= async (req,res,next)=>{
    let {id,reviewid}=req.params;

    // if(!req.body.listing){
    //   throw new ExpressError(400,"send valid data for listing")
    // }
    let review=await Review.findById(reviewid);
    if(!review.author.equals(res.locals.currUser._id)){
      req.flash("error","you are not the author of this review");
      return res.redirect(`/listings/${id}`);
    }
    next();

}