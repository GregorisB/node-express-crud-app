const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
	res.send('All shelters')
})

router.post('/', (req, res) => {
	res.send('Create shelter')
})

router.get('/:id', (req, res) => {
	res.send('One Shelter')
})
router.get("/:id/edit", (req, res) => {
	res.send("shelter edit")
})

module.exports = router