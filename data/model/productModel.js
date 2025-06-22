import {Schema, model, Types} from 'mongoose'
const {ObjectId} = Types

const productSchema = new Schema({
    //refering the users by id who created the product
        user:{
        type:ObjectId,
        ref:'Inventory-User',
        required:true
    },
    productID:{
        type:String,
        required:[true, "Please add a product number"],
        trim:true,
        unique:true
    },
    name: {
        type: String,
        required: [true, "Please add a name"],
        trim: true
    },
    description: {
        type: String,
        required: [true, "Please add a description"],
        trim: true,
    },
    price: {
        type: Number,
        required: [true, "Please add a price"],
        trim: true,

    },
    quantity: {
        type: Number,
        required: [true, "Please add a quantity"],
        trim: true,

    },
    category: {
        type: String,
        required: [true, "Please add a category"],
        trim: true,

    },
    image: {
        type: String,
        required: [true, "Please add a image"],
        trim: true,

    },
    createdAt: {
        type: Date,
        default: Date.now, 
      }
});

const Product = model('Products', productSchema);

export default Product
