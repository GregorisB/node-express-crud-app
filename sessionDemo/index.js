const express = require('express')
const session = require('express-session')
const app = express()

const sessionConfig = {
    secret: 'thisshouldbeabettersecret!',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        // maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionOption))

app.get('/view', (req, res) => {
	req.session.count ? req.session.count +=1 : req.session.count = 1
	res.send("Views " + req.session.count)
})

app.get('/register', (req, res) => {
	const { username = "No name" } = req.query
	req.session.username = username
	res.redirect('/greet')
})

app.get('/greet', (req, res) => {
	const { username } = req.session
	res.send(`Hello ${username}`)
})

app.listen(3000, () => console.log('Server stared!!!!!!!!'))