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
const listing = require("../routes/listing.js")


//Reviews
//Post Route
router.post("/listings/reviews", async(req,res)=>{
    let newReview = new Review(req.body.review)
    let result = await newReview.save()
    console.log(result)
    res.redirect("/listings")
})

router.delete("/listings/reviews/:reviewId", async(req,res)=>{
    let{reviewId} = req.params;
    let result = await Review.findByIdAndDelete(reviewId)
    res.redirect("/listings")
})

module.exports = router;