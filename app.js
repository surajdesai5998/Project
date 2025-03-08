const express=require("express");
const app=express();
const mongoose=require('mongoose');
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require('ejs-mate');
const session=require("express-session");
const flash=require("connect-flash");
const MongoStore=require("connect-mongo");

const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");

const {isLoggedIn}=require("./middleware.js");


if(process.env.NODE_ENV !="production"){
    require('dotenv').config();
    // console.log(process.env.CLOUD_API_KEY);
}

// const Listing=require("./models/listing.js");
// const  Review=require("./models/review.js");

// const wrapAsync=require("./utils/wrapAsync.js");
   const ExpressError=require("./utils/ExpressError.js");
// const {listingSchema,reviewSchema}=require("./schemaValidation.js");

const ListingRouter=require("./routes/routeListing.js");
const ReviewRouter=require("./routes/routeReview.js");
const UserRouter=require("./routes/routeUser.js");

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));

app.use(methodOverride("_method"));
app.use(express.urlencoded({extended:true}));

app.engine('ejs', ejsMate); 
app.use(express.static(path.join(__dirname,"/public")));



// const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust";
const dbUrl=process.env.ATLASDB_URL;


const store=MongoStore.create({
    mongoUrl:dbUrl,
    crypto:{
        secret:process.env.SECRET
    },
    touchAfter:24*3600,     //  interval bet session updates(in seconds).
});

store.on("error",()=>{
    console.log("Error in MONGO SESSION STORE");
});

const sessionOptions={
    store:store,        // sessions store in MongoDB storage instead of memory.
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:new Date(Date.now()+7*24*60*60*1000),
        maxAge:7*24*60*60*1000,
        httpOnly:true   // to avoid cross-scripting attacks.
    }
}

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    next();
});



async function main(){
    await mongoose.connect(dbUrl);
}

main().then(()=>{
    console.log("mongoDB connection successful..");
})
.catch((err)=>{
    console.log(err);
});




passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());




//mounting the router
app.use("/listings",ListingRouter);
app.use("/listings/:id/reviews",ReviewRouter);
app.use("/",UserRouter);




// Error Handling                        
app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page Not Found!"));
});



app.use((err,req,res,next)=>{
    // res.send("Something went wrong");     //for error class

    let{status=500,message="Somerhing went wrong"}=err;
    // res.status(status).send(message);
    res.status(status).render("listings/error.ejs",{err});
});



app.listen(8080,()=>{
    console.log("app is listening on port 8080");  
});