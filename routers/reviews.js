const express = require('express')
const router = express.Router({mergeParams: true})
const ExpressError = require('../utils/ExpressError');
const catchAsync = require('../utils/catchAsync');
const Campground = require("../models/campground");
const Review = require("../models/review");
const { reviewSchema } = require('../models/schemas');

const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body)
    if (error){
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    }else{
        next()
    }
}

router.post("/", validateReview, catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id)
    const review = await new Review(req.body.review)
    campground.reviews.push(review)
    await campground.save()
    await review.save()
    req.flash('success', "Review Created")
    res.redirect(`/campgrounds/${campground.id}`)
}))

router.delete('/:reviewId', catchAsync(async (req, res) => {
    const { id, reviewId } = req.params
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
    await Review.findByIdAndDelete(reviewId)
    req.flash('success', "Review Deleted")
    res.redirect(`/campgrounds/${id}`)
}))

module.exports = router