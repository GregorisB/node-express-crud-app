const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const Campground = require("./models/campground");
const ejsMate = require('ejs-mate');
const ExpressError = require('./utils/ExpressError');
const catchAsync = require('./utils/catchAsync');
const { campSchema } = require('./models/schemas');
const {
    title
} = require('process');
const {
    urlencoded
} = require('express');
const {
    constants
} = require('buffer');
const res = require('express/lib/response');

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

const validateCampground = (req, res, next) => {
    const {
        error
    } = campSchema.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next()
    }
}

app.get("/", (req, res) => {
    res.render("home")
})

app.get("/campgrounds", catchAsync(async (req, res) => {
    const campgrounds = await Campground.find()
    res.render("campgrounds/index", {
        campgrounds
    })
}))

app.get("/campgrounds/new", (req, res) => {
    res.render("campgrounds/new")
})

app.post("/campgrounds", validateCampground, catchAsync(async (req, res, next) => {

    const campground = await new Campground(req.body.campground).save()
    res.redirect(`campgrounds/${campground.id}`)

}))

app.get("/campgrounds/:id/edit", catchAsync(async (req, res) => {
    const camp = await Campground.findById(req.params.id)
    res.render(`campgrounds/edit`, {
        camp
    })
}))

app.patch('/campgrounds/:id', validateCampground, catchAsync(async (req, res) => {
    await Campground.findByIdAndUpdate(req.params.id, req.body.campground, {
        runValidators: true
    })
    res.redirect(`/campgrounds/${req.params.id}`)
}))

app.get('/campgrounds/:id', catchAsync(async (req, res) => {
    const camp = await Campground.findById(req.params.id)
    res.render('campgrounds/show', {
        camp
    })
}))

app.delete("/campgrounds/:id", catchAsync(async (req, res) => {
    await Campground.findByIdAndDelete(req.params.id)
    res.redirect('/campgrounds')
}))

app.all('*', (req, res, next) => {
    next(new ExpressError("Page not found!", 404))
})

app.use((err, req, res, next) => {
    const {
        status = 500
    } = err
    if (!err.message) err.message = "Something went wrong"
    res.status(status).render('error', {
        err
    })
})

app.listen(PORT, () => console.log("Server is up on: " + PORT))