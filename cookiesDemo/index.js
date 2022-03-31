const express = require('express')
const cookieParser = require('cookie-parser')
app = express();

app.use(cookieParser('secret'))

app.get('/', (req, res) => {
	const { name = "NO-name" } = req.cookies
	res.send("Hello"+name)
})

app.get('/cookie', (req, res) => {
	res.cookie("firstname", "Greg")
	res.cookie("lastname", "Bacht")
	res.send('Cookie sended')
})

app.get('/signecookie',  (req, res) => {
	res.cookie("fruits", 'apple', { signed: true })
	res.send("ok")
})

app.get('/verify', (req, res) => {
	res.send(req.signedCookies)
})
 
app.listen("3000", () => console.log("Server Started..."))