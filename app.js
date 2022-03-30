const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const ExpressError = require('./utils/ExpressError');
const campgroundRouter = require('./routers/campground')
const { title } = require('process');
const { urlencoded } = require('express');
const { constants } = require('buffer');
const res = require('express/lib/response');
const { redirect } = require('express/lib/response');

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



app.use('/', campgroundRouter)

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

app.listen(PORT, () => console.log("Server is up on: localhost:" + PORT))