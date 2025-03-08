const Listing=require("../models/listing");
const Review=require("../models/review");


module.exports.createReview=async(req,res)=>{
    let listing=await Listing.findById(req.params.id);
    let newReview =new Review(req.body.review);
    newReview.auther=req.user._id;      // store auther
    console.log(newReview);
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
    console.log(newReview);
    req.flash("success","New Review created!");
    res.redirect(`/listings/${listing._id}`);

};



module.exports.destroyReview=async(req,res)=>{
    let {id,reviewId}=req.params;
    console.log(req.params);
    
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});     // reviews => arrayName listing.js
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review Deleted!");
    res.redirect(`/listings/${id}`);

};