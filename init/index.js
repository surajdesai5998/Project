const mongoose=require('mongoose');
const initData= require("./newData.js");
const Listing=require("../models/listing.js");

const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust";

async function main(){
    await mongoose.connect(MONGO_URL);
}
                    
main().then(()=>{12
    console.log("mongoDB connection successful..");
})
.catch((err)=>{
    console.log(err);
});

// Data Initialisation
const initDB=async()=>{
    await Listing.deleteMany({});
    initData.data =initData.data.map((obj)=>({...obj,owner:"67ab6c490cda81be955d1be2"}));
    await  Listing.insertMany(initData.data);
    console.log("data was initialise");
} 

initDB();