const mongoose = require('mongoose');
const cities = require('./cities');
const { descriptors, places } = require('./seedHelpers');
const Campground = require("../models/campground");

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

mongoose.connection.on('error', console.error.bind(console, 'connection error:'));
mongoose.connection.once("open", () => console.log("Database connected!"));

const sampleTitle = array => array[Math.floor(Math.random() * array.length)]

const seedDB = async() => {
    await Campground.deleteMany({})
    for(i = 0;i < 50; i++){
        const randomLocation = Math.floor(Math.random() * 1000)
        const camp = new Campground({
            title: `${sampleTitle(descriptors)}  ${sampleTitle(places)}`,
            location: `${cities[randomLocation].city}  ${cities[randomLocation].state}`,
            image: 'https://source.unsplash.com/random/?camping',
            description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Mollitia sequi eum blanditiis, odit ipsa sunt quia soluta aliquid culpa quaerat ullam fugit deleniti praesentium, tempore corporis obcaecati porro, rerum quos.",
            price: ((Math.random() * 30) + 10).toFixed(2)
        })
        await camp.save()
    }
}

seedDB()
.then(() => mongoose.connection.close())