const morgan = require('morgan');
const express = require('express'); 
const app = express()

app.use(morgan('tiny'))
const auth = (req, res, next) => {
    const { password } = req.query
    if(password === "123"){
        next()
    }
    res.send("Auth")
}
// app.use((req, res, next) => {
//     console.log("First Middleware")
//     return next()
//     console.log("AFTER")
// })

app.get('/', (req, res) => {
    res.send("HOME")
})

app.get('/dogs', auth, (req, res) => {
    res.status(404).send("DOGS")
})

app.use((req, res) => {
    res.send("Not found")
})

app.listen('3000', () => console.log("SERVER IS ON"))