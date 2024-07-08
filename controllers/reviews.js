const Review=require("../models/review.js");
const Listing=require("../models/listing.js");

module.exports.addreview=async(req,res)=>{
    let listing =await Listing.findById(req.params.id);
    let newReview=new Review(req.body.review);
    newReview.author=req.user._id;
    console.log(newReview);
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success","review created");
    res.redirect(`/listings/${listing._id}`);
  

  };
  module.exports.deletereview=async(req,res)=>{
    let {id,reviewid}=req.params;
    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewid}});
    
    await Review.findByIdAndDelete(reviewid);
    req.flash("success","Review deleted");
    res.redirect(`/listings/${id}`);
  };