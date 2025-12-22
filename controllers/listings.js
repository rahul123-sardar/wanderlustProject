const Listing=require("../models/listing");
const {listingSchema, reviewSchema}=require("../schema.js");


module.exports.index=async (req, res)=>{
    const allListing = await Listing.find({});
    res.render("./listings/index.ejs", {allListing});
};

module.exports.renderNewForm=(req, res)=>{
    res.render("./listings/new.ejs");
};

module.exports.showListing=async (req, res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id).populate({path:"reviews", populate:{path:"author"}}).populate("owner");
    if(!listing){
        req.flash("error", "Listing you requested for does not exist!");
        return res.redirect("/listing");
    }
    res.render("./listings/show.ejs", {listing});
};

module.exports.createListing=async (req, res)=>{
    let url=req.file.path;
    let filename= req.file.filename;

    let result=listingSchema.validate(req.body);
    console.log(result);
    if(result.error){
        throw new ExpressError(400, result.error);
    }
    const newListing=new Listing(req.body.listing);
    newListing.owner=req.user._id;
    newListing.image={url, filename};
    await newListing.save();
    req.flash("success", "New Listing Created");
    res.redirect("/listings");
    console.log(newListing);
};





module.exports.renderEditForm=async (req, res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    if(!listing){
        req.flash("error", "Listing you requested for does not exist!");
        return res.redirect("/listings");
    }

    let originalImageUrl= listing.image.url;
    originalImageUrl=originalImageUrl.replace("/upload", "/upload/w_250");

    res.render("./listings/edit.ejs", {listing, originalImageUrl});
};


module.exports.updateListing = async (req, res) => {
    let { id } = req.params;

    let listing = await Listing.findById(id);

    // update text fields only
    listing.title = req.body.listing.title;
    listing.description = req.body.listing.description;
    listing.price = req.body.listing.price;
    listing.location = req.body.listing.location;
    listing.country = req.body.listing.country;

    // update image ONLY if a new one is uploaded
    if (req.file) {
        listing.image = {
            url: req.file.path,
            filename: req.file.filename
        };
    }

    await listing.save();

    req.flash("success", "Listing Updated");
    res.redirect(`/listings/${listing._id}`);
};



module.exports.destroyListing= async (req, res)=>{
    let {id}=req.params;
    let deletedListing=await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Listing Deleted");
    res.redirect("/listings");
};
