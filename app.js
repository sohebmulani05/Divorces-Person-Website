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
const listing = require("./routes/listing.js")
const review = require("./routes/review.js")

app.set("views engine", "ejs")
app.set("views", path.join(__dirname, "/views"))
app.use(express.static(path.join(__dirname, "/public")))
app.use(express.urlencoded({extended: true}))
app.use(methodOverride("_method"))
app.engine("ejs",ejsMate)
app.use(express.static(path.join(__dirname, "/public")))

app.use("/", listing)
app.use("/", review)

const MONGO_URL = "mongodb://127.0.0.1:27017/divorceDB";

async function main() {
   await mongoose.connect(MONGO_URL)
}
main().then(()=>{
    console.log("connected to DB")
}).catch((err)=>{
    console.log(err)
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

