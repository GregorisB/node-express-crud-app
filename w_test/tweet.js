const mongoose = require('mongoose')
const { Schema } = mongoose

mongoose.connect('mongodb://localhost:27017/relationshipDB', { useNewUrlParser: true, useUnifiedTopology: true})
.then(() => console.log("Connected")).catch(er => console.log(er))

const userSchema = new Schema({
	name: String,
	email: String
})

const tweetSchema = new Schema({
	text: String,
	likes: Number,
	user: { type: Schema.Types.ObjectId, ref: 'User' }
})

const User = mongoose.model('User', userSchema)
const Tweet = mongoose.model("Tweets", tweetSchema)

const makeTweets = async () => {
	// const user = new User({ name: 'Greg', email: "greg@gmail.com" })
	const user = await User.findOne({name: "Greg"})
	const tweet2 = new Tweet({ text: 'lorem text', likes: 23 })
	tweet2.user = user
	user.save()
	tweet2.save()
}

// makeTweets()

const findTweet = async () => {
	const t = await Tweet.find({}).populate('user', 'name')
	console.log(t)
}

findTweet()