const express = require("express")
const app = express()
const mongoose = require("mongoose")
const Listing = require("./models/listing.js")
const path = require("path")
const methodOverride = require("method-override")
const ejsMate = require("ejs-mate")
const wrapAsync = require("./utils/wrapAsync.js")
const ExpressError = require("./utils/ExpressError.js")
const {listingSchema} = require("./schema.js")
const Review = require("./models/review.js")

app.set("views engine", "ejs")
app.set("views", path.join(__dirname, "/views"))
app.use(express.static(path.join(__dirname, "/public")))
app.use(express.urlencoded({extended: true}))
app.use(methodOverride("_method"))
app.engine("ejs",ejsMate)
app.use(express.static(path.join(__dirname, "/public")))


const MONGO_URL = "mongodb://127.0.0.1:27017/divorceDB";

async function main() {
   await mongoose.connect(MONGO_URL)
}
main().then(()=>{
    console.log("connected to DB")
}).catch((err)=>{
    console.log(err)
})

const validateListing = (req,res,next) =>{
    let {error} = listingSchema.validate(req.body)
    if(error){
        throw new ExpressError(400,error);
    }else{
        next()
    }
}

//Index Route
app.get("/listings", wrapAsync(async (req,res)=>{
    const allListings = await Listing.find({})
    let allReview = await Review.find({})
   res.render("listings/index.ejs", {allListings, allReview})
}))


//New Route
app.get("/listings/new", (req,res)=>{
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
app.post("/listings",validateListing, wrapAsync( async (req,res,next)=>{
   
    let listing = req.body.listing
    const newListing =  new Listing(listing)
    await newListing.save();
    res.redirect("/listings")
})) 

//Show Route
app.get("/listings/:id", wrapAsync(async(req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs", {listing})
}))


//edit route
app.get("/listings/:id/edit", wrapAsync(async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id)
   res.render("listings/edit.ejs", {listing})
}))
//update route
app.put("/listings/:id", validateListing, wrapAsync(async(req,res)=>{
    let {id} = req.params;
    let listing = req.body.listing
    const updateListing = await Listing.findByIdAndUpdate(id, listing, {new: true})
    console.log(updateListing)
    res.redirect(`/listings/${id}`)
}))

//Delete Route
app.delete("/listings/:id", wrapAsync(async (req,res)=>{
    let {id} = req.params;
    const deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing)
    res.redirect("/listings")
}))

//Reviews
//Post Route
app.post("/listings/reviews", async(req,res)=>{
    let newReview = new Review(req.body.review)
    let result = await newReview.save()
    console.log(result)
    res.redirect("/listings")
})

app.delete("/listings/reviews/:reviewId", async(req,res)=>{
    let{reviewId} = req.params;
    let result = await Review.findByIdAndDelete(reviewId)
    res.redirect("/listings")
})

// //index route
// app.get("/listings", async(req,res)=>{
//     let allReview = await Review.find({})
//     res.render("listings/index.ejs", {allReview})
// })





// app.get("/testlisting", async (req,res)=>{
//     let sampleListing = new Listing({
//         title: "My New Villa",
//         description : "By the beach",
//         price: 1200,
//         location: "Calangute, Goa",
//         country: "India"
//     })
//    await sampleListing.save()
//    console.log("sample was saved")
//    res.send("testing succesful")
// })


app.get("/",(req,res)=>{
    res.send("Hi I am root")
})

app.all("*", (req,res,next)=>{
    next(new ExpressError(404, "Page Not Found!"))
})

//Error handling middleware
app.use((err, req, res, next)=>{
    let{status = 500, message = "something went wrong"} = err
    res.status(status).render("error.ejs", {err})
})


app.listen(8080, ()=>{
    console.log("server is listening to port 8080")
})

