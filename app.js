const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const Campground = require("./models/campground");
const ejsMate = require('ejs-mate');
const {
    title
} = require('process');
const {
    urlencoded
} = require('express');
const {
    constants
} = require('buffer');

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

mongoose.connection.on('error', console.error.bind(console, 'connection error:'));
mongoose.connection.once("open", () => console.log("Database connected"));

const app = express()
const PORT = process.env.PORT || 3000

app.engine("ejs", ejsMate)
app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))

app.use(methodOverride("_method"))
app.use(express.json())
app.use(express.urlencoded({
    extended: true
}))

app.get("/", (req, res) => {
    res.render("home")
})

app.get("/campgrounds", async (req, res) => {
    const campgrounds = await Campground.find()
    res.render("campgrounds/index", {
        campgrounds
    })
})

app.post("/campgrounds", async (req, res) => {
    await new Campground(req.body.campground).save()
    res.redirect("campgrounds")
})

app.get("/campgrounds/:id/edit", async (req, res) => {
    const camp = await Campground.findById(req.params.id)
    res.render(`campgrounds/edit`, {
        camp
    })
})

app.patch('/campgrounds/:id', async (req, res) => {
    await Campground.findByIdAndUpdate(req.params.id, req.body.campground, {
        runValidators: true
    })
    res.redirect(`/campgrounds/${req.params.id}`)
})

app.get("/campgrounds/new", (req, res) => {
    res.render("campgrounds/new")
})

app.get('/campgrounds/:id', async (req, res) => {
    const camp = await Campground.findById(req.params.id)
    res.render('campgrounds/show', {
        camp
    })
})

app.delete("/campgrounds/:id", async (req, res) => {
    await Campground.findByIdAndDelete(req.params.id)
    res.redirect('/campgrounds')
})

app.listen(PORT, () => console.log("Server is up on: " + PORT))