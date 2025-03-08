const Listing=require("./models/listing");
const Review=require("./models/review");

const ExpressError=require("./utils/ExpressError.js");
const {listingSchema,reviewSchema}=require("./schemaValidation.js");

module.exports.isLoggedIn=(req,res,next)=>{
if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl;
        req.flash("error","you must be logged in!");
        return res.redirect("/login");
    }
    next();
    // console.log(req.user);
    console.log("************   REQ.USER:",req.user);
    // console.log(req.session);
    
}

module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){  // checks whether  any redirectUrl is saved in sesssion
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner=async(req,res,next)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id);
     if(!listing.owner.equals(res.locals.currUser._id)){
        req.flash("error","you're are not the owner!");
         return res.redirect(`/listings/${id}`);
     }
     next();
} 

module.exports.isReviewAuther=async(req,res,next)=>{
    let {id,reviewId}=req.params;
    let  review=await Review.findById(reviewId);
    if(!review.auther.equals(res.locals.currUser._id)){
        req.flash("error","you're are not the auther!");
         return res.redirect(`/listings/${id}`);
    }
    next();
}

// res.locals.isauther=(review.auther.equals(res.locals.currUser._id));

module.exports.validateListing=(req,res,next)=>{
    let {error}=listingSchema.validate(req.body);
    // console.log(result);

    if(error){
        let errMsg = error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);

    } else{
        next();
    }
}

module.exports.validateReview=(req,res,next)=>{
    let{error}=reviewSchema.validate(req.body);

    if(error){
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
}