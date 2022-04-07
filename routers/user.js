const express = require('express')
const router = express.Router()
const passport = require('passport');
const catchAsync = require('../utils/catchAsync');
const User = require('../models/user')

router.get('/', (req, res) => {
	res.render('home')
})

router.get("/register", (req, res) => {
	res.render('register')
})

router.post('/register', catchAsync(async (req, res, next) => {
	try {
		const { email, username, password } = req.body
		const user = new User({email, username})
		const newUser = await User.register(user, password)
		req.login(newUser, err => {
			if (err) return next(err)
			req.flash('success', "Welcome back")
			res.redirect('/campgrounds')
		})
 	}catch(e){
		req.flash("error", e.message)
		res.redirect('/register')
	}
}))

router.get('/login', (req, res) => {
	res.render("login")
})

router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), (req, res) => {
	const redirectUrl = req.session.returnTo || '/campgrounds'
	req.flash('success', "Welcome back")
	res.redirect(redirectUrl)
})

router.get('/logout', (req, res) => {
	req.logout()
	req.flash("success", "Goodbey!")
	res.redirect('/')
})

module.exports = router