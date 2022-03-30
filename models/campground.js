const mongoose = require('mongoose');
const { Schema } = mongoose;
const Review = require("./review")

const CampgroundSchema = new Schema({
    title: String,
    price:  Number,
    description:  String,
    location:  String,
    image:  String,
    reviews:[
        {
            type: Schema.Types.ObjectId,
            ref: "Review"
        }
    ]
})

CampgroundSchema.post("findOneAndDelete", async function (doc) {
    if(doc){
        const res = await Review.deleteMany({_id: { $in: doc.reviews }})
        console.log(res)
    }
})

module.exports = mongoose.model("Campground", CampgroundSchema)