const mongoose = require('mongoose')
const { findOneAndRemove } = require('../models/campground')
const { Schema } = mongoose

mongoose.connect("mongodb://localhost:27017/relationshipDB", {
	useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("Connected")).catch((e) => console.log(e))

const productSchema = new Schema({
	name: String,
	price: Number, 
	season: {
		type:String, 
		enum: ['Spring', "Summer", 'Fall', 'Winter']
	}
})

const farmSchema = new Schema({
	name:String,
	city: String,
	product:[{ type: Schema.Types.ObjectId, ref: 'Product' }]
})

const Product = mongoose.model('Product', productSchema)
const Farm = mongoose.model('Farm', farmSchema)

// Product.insertMany([
// 	{name:"Lemon", price:0.86, season:'Summer'},
// 	{name:"Apple", price:1.6, season:'Winter'},
// 	{name:"Tomatoes", price:0.70, season:'Spring'},
// 	{name:"Banana", price:2.99, season:'Fall'},
// 	{name:"Orranges", price:1.16, season:'Spring'},
// ])

// const makeFarm = async () => {
// 	const farm = new Farm({ name:"Farm Name", city: 'LA' })
// 	const lemon = await Product.findOne({name:"Apple"})
// 	farm.product.push(lemon)
// 	await farm.save()
// 	console.log(farm)
// 	console.log(lemon)
// }

const addProducts = async () => {
	const farm = await Farm.findOne({name:'Farm Name'})
	const product = await Product.findOne({name:'Banana'})
	farm.product.push(product)
	await farm.save()
	console.log(farm)
}

Farm.findOne({name:"Farm Name"})
	.populate('product')
	.then(farm => console.log(farm))