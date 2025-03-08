const mongoose=require("mongoose");
const Schema=mongoose.Schema;

const Review=require("./review.js");
const { required } = require("joi");

const listingSchema=new Schema({
    title:{
        type:String,
        required:true,
    },
    description:String,
    
    // image:{
    //     type:String,  // Historic Canal House
    //     // default:"https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Y2FtcGluZ3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",  
    //     set:(v)=> v==="" ? "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fGxha2V8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60"  
    //        :v,                   // Ski Chalet in Aspen
    //     },
    
    image:{
        url:String,
        filename:String
    },
    price:{
        type:Number,
        required:true,     
    },
    location:String,
    country:String,

    reviews:[ {
        type: Schema.Types.ObjectId,
        ref:"Review",      // model name "Review"
    } ],

    owner:{
        type:Schema.Types.ObjectId,
        ref:"User",
    },
    geometry:{
        
            type: {
              type: String, // Don't do `{ location: { type: String } }`
              enum: ['Point'], // 'location.type' must be 'Point'
              required:true
            },
            coordinates: {
              type: [Number],
            required:true
            }
        },
    // category:{
    //     type:String,
    //     enum:["Trending","Room","Iconic Cities","Mountain","Castles","Amazing Pools","Arctic","Camping","Farms"]
    // }       

});

listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
        await Review.deleteMany({_id:{$in:listing.reviews}});
    }
});

const Listing= mongoose.model("Listing",listingSchema);
module.exports=Listing; 