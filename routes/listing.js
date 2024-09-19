const express = require("express")
const router = express.Router()
const app = express()
const mongoose = require("mongoose")
const Listing = require("../models/listing.js")
const path = require("path")
const methodOverride = require("method-override")
const ejsMate = require("ejs-mate")
const wrapAsync = require("../utils/wrapAsync.js")
const ExpressError = require("../utils/ExpressError.js")
const {listingSchema} = require("../schema.js")
const Review = require("../models/review.js")


const validateListing = (req,res,next) =>{
    let {error} = listingSchema.validate(req.body)
    if(error){
        throw new ExpressError(400,error);
    }else{
        next()
    }
}



//Index Route
router.get("/listings", wrapAsync(async (req,res)=>{
    const allListings = await Listing.find({})
    let allReview = await Review.find({})
   res.render("listings/index.ejs", {allListings, allReview})
}))


//New Route
router.get("/listings/new", (req,res)=>{
    res.render("listings/new.ejs")
})
//Create Route
// app.post("/listings", (req,res)=>{
//     let{title, description,image, price, country, location} = req.body;

//     let newData = new Listing ({
//         title: title,
//         description: description,
//         image : image,
//         price: price,
//         country: country,
//         location: location
//     })
//    newData.save().then((res)=>{
//     console.log("data was saved")
//    }).catch((err)=>{
//     console.log(err)
//    })
//     res.redirect("/listings")
// })

//create route
router.post("/listings",validateListing, wrapAsync( async (req,res,next)=>{
   
    let listing = req.body.listing
    const newListing =  new Listing(listing)
    await newListing.save();
    res.redirect("/listings")
})) 

//Show Route
router.get("/listings/:id", wrapAsync(async(req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs", {listing})
}))


//edit route
router.get("/listings/:id/edit", wrapAsync(async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id)
   res.render("listings/edit.ejs", {listing})
}))
//update route
router.put("/listings/:id", validateListing, wrapAsync(async(req,res)=>{
    let {id} = req.params;
    let listing = req.body.listing
    const updateListing = await Listing.findByIdAndUpdate(id, listing, {new: true})
    console.log(updateListing)
    res.redirect(`/listings/${id}`)
}))

//Delete Route
router.delete("/listings/:id", wrapAsync(async (req,res)=>{
    let {id} = req.params;
    const deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing)
    res.redirect("/listings")
}))

module.exports = router