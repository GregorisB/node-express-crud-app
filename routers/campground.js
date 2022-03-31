const express = require('express')
const router = express.Router()
const ExpressError = require('../utils/ExpressError');
const catchAsync = require('../utils/catchAsync');
const Campground = require("../models/campground");
const { campSchema, reviewSchema } = require('../models/schemas');


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

router.get("/", catchAsync(async (req, res) => {
    const campgrounds = await Campground.find()
    res.render("campgrounds/index", {
        campgrounds
    })
}))

router.get("/new", (req, res) => {
    res.render("campgrounds/new")
})

router.post("/", validateCampground, catchAsync(async (req, res, next) => {
    const campground = await new Campground(req.body.campground).save()
    req.flash('success', "Camp Created")
    res.redirect(`campgrounds/${campground.id}`)

}))

router.get("/:id/edit", catchAsync(async (req, res) => {
    const camp = await Campground.findById(req.params.id)
    res.render(`campgrounds/edit`, {
        camp
    })
}))

router.patch('/:id', validateCampground, catchAsync(async (req, res) => {
    await Campground.findByIdAndUpdate(req.params.id, req.body.campground, {
        runValidators: true
    })
    req.flash('success', "Camp Updated")
    res.redirect(`/campgrounds/${req.params.id}`)
}))

router.get('/:id', catchAsync(async (req, res) => {
    const camp = await Campground.findById(req.params.id).populate("reviews")
    res.render('campgrounds/show', {
        camp
    })
}))

router.delete("/:id", catchAsync(async (req, res) => {
    await Campground.findByIdAndDelete(req.params.id)
    req.flash('success', "Camp Deleted")
    res.redirect('/campgrounds')
}))



module.exports = router