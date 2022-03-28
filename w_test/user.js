const mongoose = require('mongoose')

mongoose.connect("mongodb://localhost:27017/relationshipDB", {
	useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("Connected")).catch((e) => console.log(e))

const userSchema = new mongoose.Schema({
	firstname: String,
	lastname: String,
	addresses: [
		{
			city: String,
			state: String,
			country: String,
		}
	],
})

const User = mongoose.model("User", userSchema)

const makeUser = async () => {
	const u = new User({
		firstname: "Greg",
		lastname: "Bachts",
	})
	u.addresses.push({
		city: 'Thessaloniki',
		state: 'Thessaloniki',
		country: 'Greece',
	})
	const res = await u.save()
	console.log(res)
}

makeUser();