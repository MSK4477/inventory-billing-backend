import asyncHandler from "express-async-handler";
import Product from "../data/models/productModel.js";


//creating products
export const createProduct = asyncHandler(async (req, res) => { 
    const { productID, name, description, price, quantity, category, image } = req.body;

    const isPoductExist = await Product.findOne({ productID: productID })
  
    if(isPoductExist){
        res.status(400).json({error:"Product Already Exist", code:0})
        throw new Error("Product Already Exist")
    }
    if(req.id == null){
        res.status(400).json({error:"Session Expired Login Again To Continue", code:0})
    }
  console.log(isPoductExist)
    const product = await Product.create({
        user: req.id,
        productID,
        name,
        description,
        price,
        quantity,
        category,
        image
    })
    // console.log(product)
    console.log("id",req.id)

    res.status(200).json({message:"product created successfully",productData:product, code:1})
})

//get the products
export const getProducts = asyncHandler(async (req, res) => {

    const products = await Product.find({}).populate("user", "name email phone")
    

    res.json({pr:products})
})

//get the product
export const getProduct = asyncHandler(async (req, res) => {

    const { productID } = req.body

    const product = await Product.findOne({productID:productID}).populate("user", "name email phone")
    

    res.json({pr:product})
})


//Updating Products

export const updateProduct = asyncHandler(async (req, res) => {

    const  { productID } = req.params

    const update = await Product.findOneAndUpdate({productID:productID}, req.body, {new:true})
     if(!update){
         res.status(400).json({error:"Product Not Found", code:0})
     return;
        }else{
    res.status(200).json({message:"Product Updated Successfully", code:1})
        }
        res.status(500).json({error:"internal server error", code:2})

})

//Deleting Products
export const deleteProduct = asyncHandler(async (req, res) => {

const { productID } = req.params

const product = await Product.findOne({productID:productID})

if(!product){
    res.status(400).json({error:"Product Not Found", code:0})
return;
}else{
    await Product.findOneAndDelete({productID:productID})
     res.status(200).json({message:"Product Deleted Successfully", code:1})
}
res.status(500).json({error:"internal server error", code:2})
})


