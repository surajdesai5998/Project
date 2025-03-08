const Listing = require("../models/listing");

const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });


module.exports.index = async (req, res) => {
    const allListing = await Listing.find({});
    // console.log(allListing);
    res.render("listings/index.ejs", { allListing });
};


module.exports.renderNewForm = (req, res) => {

    if (!req.isAuthenticated()) {
        req.flash("error", "you must be logged in to create listing");
        return res.redirect("/login");
    }
    res.render("listings/new.ejs");
};


module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    // console.log(req.params.id);
    const listing = await Listing.findById(id)
        // .populate("reviews") .populate("owner");
        .populate({                 // nested populate
            path: "reviews",
            populate: {
                path: "auther",
            }
        })
        .populate("owner");

    console.log(listing);
    if (!listing) {
        req.flash("error", "Listing you requested for does not exist.");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing });
};


module.exports.createListing = async (req, res, next) => {
    let fullLoction = `${req.body.listing.location},${req.body.listing.country}`;
    let response = await geocodingClient.forwardGeocode({
        query: fullLoction,
        limit: 1
    }).send();

    let url = req.file.path;
    let filename = req.file.filename;
    // console.log("filename:",filename,"\n Url:",url);
    const newListing = new Listing(req.body.listing);    //
    newListing.owner = req.user._id;
    newListing.image = { url, filename }
    newListing.geometry = response.body.features[0].geometry;

    await newListing.save();
    console.log(newListing);
    req.flash("success", "New Listing Created!");        // flash 
    res.redirect("/listings");
};



module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);

    if (!listing) {
        req.flash("error", "Listing you requested for does not exist.");
        res.redirect("/listings");
    }
    // cloudinary img blur
    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250,e_blur");
    res.render("listings/edit.ejs", { listing, originalImageUrl });
};


module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    //  ******** Edit image ***********************
    if (typeof req.file !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;

        listing.image = { url, filename }
        await listing.save();
    }

    // update location on map
    let fullLoction = `${req.body.listing.location},${req.body.listing.country}`;
    console.log("fullLoction:", fullLoction);
    let response = await geocodingClient.forwardGeocode({
        query: fullLoction,
        limit: 1
    })
        .send();

    listing.geometry = response.body.features[0].geometry
    await listing.save();
    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
};


module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
};