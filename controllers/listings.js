const Listing = require("../models/listing");

module.exports.index = async(req, res) =>{
    const allListings = await Listing.find({});
    const dest = "none"
    res.render("./listings/index.ejs", {allListings, dest});
};  

// search
module.exports.search = async(req,res) =>{
    const {dest} = req.query;
    const allListings = await Listing.find({});
    res.render("./listings/index.ejs", {allListings, dest});
}

// search icons
module.exports.searchIcon = async(req,res) =>{
    const dest = req.params.id;
    const allListings = await Listing.find({});
    res.render("./listings/index.ejs", {allListings, dest});
}

module.exports.renderNewForm = (req, res) =>{
    res.render("./listings/new.ejs");
};

module.exports.showListing = async(req, res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id)
    .populate({path : "reviews", populate :{path: "author"}})
    .populate("owner");
    if(!listing){
        req.flash("error", "Listing you requested for does not exist!");
        res.redirect("/listings");
    }
    res.render("./listings/show.ejs", {listing});
};

module.exports.createListing = async(req, res)=>{
    let url = req.file.path;
    let filename = req.file.filename;
    const newlisting = new Listing(req.body.listing);
    newlisting.owner = req.user._id;
    newlisting.image = {url, filename};
    await newlisting.save();
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
};

module.exports.renderEditForm = async(req, res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error", "Listing you requested for does not exist!");
        res.redirect("/listings");
    }

    let originalImg = listing.image.url;
    //originalImg = originalImg.replace("/upload", "/upload/h_300,w_250");
    res.render("./listings/edit.ejs", {listing, originalImg});
};

module.exports.updateListing = async(req, res)=>{
    let {id} = req.params;
    let listing = await Listing.findByIdAndUpdate(id, {...req.body.listing});

    if(typeof req.file !== "undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = {url, filename};
        await listing.save();
    }
    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async(req, res)=>{
    let {id} = req.params;
    const deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
};