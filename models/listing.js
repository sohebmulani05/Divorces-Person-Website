const mongoose = require ("mongoose")
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    name : {
        type: String,
        required: true
    },
    age:{
        type:Number,
        min:[18]
    },
    proffesions:{
        type: String
    },
    description: {
        type: String ,
        },
    image: {
        type: String,
        default: "https://pearlss4development.org/wp-content/uploads/2020/05/profile-placeholder.jpg",
        set: (v) => v === "" ? "https://pearlss4development.org/wp-content/uploads/2020/05/profile-placeholder.jpg" : v
    },
    contact: {
        type: Number,
        min:[10]
    },
    location: {
        type: String
    },
    country: {
        type: String
    }
})

const Listing = mongoose.model("Listing", listingSchema)
module.exports = Listing