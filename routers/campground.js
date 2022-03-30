const express = require('express')
const router = express.Router()
const catchAsync = require('../utils/catchAsync');
const Campground = require("../models/campground");
const Review = require("../models/review");
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

const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body)
    if (error){
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    }else{
        next()
    }
}

router.get("/", (req, res) => {
    res.render("home")
})

router.get("/campgrounds", catchAsync(async (req, res) => {
    const campgrounds = await Campground.find()
    res.render("campgrounds/index", {
        campgrounds
    })
}))

router.get("/campgrounds/new", (req, res) => {
    res.render("campgrounds/new")
})

router.post("/campgrounds", validateCampground, catchAsync(async (req, res, next) => {
    const campground = await new Campground(req.body.campground).save()
    res.redirect(`campgrounds/${campground.id}`)

}))

router.get("/campgrounds/:id/edit", catchAsync(async (req, res) => {
    const camp = await Campground.findById(req.params.id)
    res.render(`campgrounds/edit`, {
        camp
    })
}))

router.patch('/campgrounds/:id', validateCampground, catchAsync(async (req, res) => {
    await Campground.findByIdAndUpdate(req.params.id, req.body.campground, {
        runValidators: true
    })
    res.redirect(`/campgrounds/${req.params.id}`)
}))

router.get('/campgrounds/:id', catchAsync(async (req, res) => {
    const camp = await Campground.findById(req.params.id).populate("reviews")
    res.render('campgrounds/show', {
        camp
    })
}))

router.delete("/campgrounds/:id", catchAsync(async (req, res) => {
    await Campground.findByIdAndDelete(req.params.id)
    res.redirect('/campgrounds')
}))

router.post("/campgrounds/:id/review", validateReview, catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id)
    const review = await new Review(req.body.review)
    campground.reviews.push(review)
    await campground.save()
    await review.save()
    res.redirect(`/campgrounds/${campground.id}`)
}))

router.delete('/campgrounds/:id/review/:reviewId', catchAsync(async (req, res) => {
    const { id, reviewId } = req.params
    console.log(await Campground.findById(id))
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
    await Review.findByIdAndDelete(reviewId)
    console.log(await Campground.findById(id))
    res.redirect(`/campgrounds/${id}`)
}))

module.exports = router