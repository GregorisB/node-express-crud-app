const morgan = require('morgan');
const express = require('express'); 
const app = express()

const AppError = require("./AppError")

app.use(morgan('tiny'))
const auth = (req, res, next) => {
    const { password } = req.query
    if(password === "123"){
        next()
    }
    throw new AppError("Auth is needing!!!", 401)
}

app.get('/', (req, res) => {
    res.send("HOME")
})

app.get('/dogs', auth, (req, res) => {
    res.status(404).send("DOGS")
})

app.get('/error', (req, res) => {
    chicken.fly()
})

app.use((err, req, res, next) => {
    console.log("****************ERROR******************")
    // res.status(500).send("AN ERROR")
    next(err)
})

app.listen('3001', () => console.log("SERVER IS ON"))