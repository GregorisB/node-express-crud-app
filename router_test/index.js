const express = require("express")
const app = express()
const sheltersRouter = require('./router/shelters')
app.use('/shelters', sheltersRouter)
app.listen(3030, () =>console.log('OK!!!!!!'))