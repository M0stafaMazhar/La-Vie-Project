const productModel = require("../../db/models/products-model")
const helper = require("../helpers/helpers")



class Products{
    static addProduct = async(req , res)=>{
        try{
            const productData = new productModel({sellerId: req.user._id , ...req.body})
            await productData.save()
            helper.resHandler(res , 200 , true , productData , "product added successfully")
        }
        catch(err){
            helper.resHandler(res , 500 , false , err , err.message)
        }
    }

    static allProducts = async (req , res)=>{
        try{
            const products = await productModel.find()
            if(!products)throw new Error("no products to show yet")
            helper.resHandler(res, 200, true, products, "all products")
        }
        catch(err){
            helper.resHandler(res, 500, false, err, err.message)
        }
    }

    static showProduct = async(req,res)=>{
        try{
            const productData = await productModel.findById(req.params.id)
            if(!productData)throw new Error("no product found")
            helper.resHandler(res, 200, true, productData, "product found")
        }
        catch(err){
            helper.resHandler(res, 500, false, err, err.message)
        }
    }

    static updateProduct = async(req, res)=>{
        try{
            const productData = await productModel.findOne({_id : req.params.id , sellerId: req.user._id})
            if(!productData)throw new Error("no product found")
            Object.assign(productData, req.body)
            await productData.save()
            helper.resHandler(res, 200, true, productData, "product updated successfully")
        }
        catch(err){
            helper.resHandler(res, 500, false, err, err.message)
        }
    }

    static deleteProduct = async(req, res)=>{
            try{
                await productModel.findOneAndDelete({_id:req.params.id , sellerId:req.user._id})
                helper.resHandler(res, 200, true, "product deleted successfully")
            }
            catch(err){
                helper.resHandler(res, 500, false, err, err.message)
            }
        }







    static addReview = async (req,res)=>{
        try{
            const productData = await productModel.findById(req.params.id);
            if(!productData) throw new Error("couldn't find product")
            if(productData.sellerId.toString() == req.user._id.toString()) throw new Error("can't rate your own product")
            const r = {userID: req.user._id , ...req.body.review}
            productData.reviews.push({userId: req.user._id , ...req.body.review })
            await productData.save()
            helper.resHandler(res, 200, true , r, "review added successfully")

        }
        catch(err){
            helper.resHandler(res, 500, false, err, err.message)
        }
    }
 

    static deleteReview = async (req, res) => {
        try{
            const productData = await productModel.findOne({_id:req.params.productId , autherId:req.user._id})
            
            if(!productData) throw new Error("couldn't find product")
            const review = productData.reviews.find(r => r._id.toString() == req.params.reviewId.toString())
            if(!review) throw new Error("couldn't find review")

            productData.reviews = productData.reviews.filter(r => r._id.toString() != req.params.reviewId.toString())
            await productData.save()

            helper.resHandler(res, 200, true, {}, "review deleted successfully")
        }
        catch(err){
            helper.resHandler(res, 500, false, err, err.message)
        }
    }


    

    static editReview = async(req , res)=>{
        try{
            const productData = await productModel.findOne({_id:req.params.productId , autherId : req.user._id})
            
            if(!productData) throw new Error("couldn't find product")
            const reviewIndex = productData.reviews.findIndex(r => r._id.toString() == req.params.reviewId.toString())
            if(!productData.reviews[reviewIndex]) throw new Error("couldn't find review")

            Object.assign(productData.reviews[reviewIndex], req.body.review)
            await productData.save()

            helper.resHandler(res, 200, true, productData.reviews[reviewIndex], "review updated successfully")


        }
        catch(err){
            helper.resHandler(res, 500, false, err, err.message)    
        }
    }

    static showReviews = async(req,res)=>{
        try{
            const productData = await productModel.findById(req.params.id)
            if(!productData) throw new Error("couldn't find product")
            if(!productData.reviews) throw new Error("no reviews to show yet")
            helper.resHandler(res, 200 , true, {...productData.reviews}, "all product reviews")
        }
        catch(err){
            helper.resHandler(res, 500, false, err, err.message)
        }
    }

    static bookMark = async(req , res)=>{
        try{
            const productData = await productModel.findById(req.params.id)
            if(!productData) throw new Error("couldn't find product")
            req.user.bookMarks.push({type:"product" , productId :productData._id})
            await req.user.save()
            helper.resHandler(res, 200, true, req.user.bookMarks, "book mark added successfully")
        }
        catch(err){
            helper.resHandler(res, 500, false, err, err.message)
        }
    }

    static addToCart = async (req,res) => {
        try{
            const productData = await productModel.findById(req.params.id)
            if(!productData) throw new Error("couldn't find product")
            req.user.shopingCart.push({productId: productData._id , productName: productData.productName, price: productData.price})
            await req.user.save()
            helper.resHandler(res, 200, true, req.user.shopingCart,"product added to cart")
        }
        catch(err){
            helper.resHandler(res, 500, false, err, err.message)
        }
    }

    static removeFromCart = async (req,res) => {
        try{
            req.user.shopingCart = req.user.shopingCart.filter(p => p.productId.toString() != req.params.id.toString())
            await req.user.save()
            helper.resHandler(res, 200, true, req.user.shopingCart, "product removed from cart")
        }
        catch(err){
            helper.resHandler(res, 500, false, err, err.message)
        }
    }

}



module.exports = Products