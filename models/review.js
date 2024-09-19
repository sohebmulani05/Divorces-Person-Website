const mongoose= require("mongoose")
const {Schema} = mongoose

const reviewSchema = new Schema({
    comment: String,
    rating: {
        type: Number,
        min: 1,
        max: 5
    }
})

const Review = mongoose.model("Review", reviewSchema)
module.exports = Review