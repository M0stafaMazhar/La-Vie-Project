const helper = require('../helpers/helpers')
const blogModel = require('../../db/models/blogs-model')


class Blogs{

    static addBlog = async (req , res )=>{
        try{
            const autherName = req.user.fName + " "+ req.user.lName
            const blogData = new blogModel({autherId: req.user._id, autherName , ...req.body})
            await blogData.save()
            helper.resHandler(res , 200 , true , blogData , "blog added successfully")
        }
        catch(err){
            helper.resHandler(res , 500 , false , err , err.message)
        }
    }

    static showBlog = async (req , res)=>{
        try{
            const blogData = await blogModel.findById(req.params.id)
            if(!blogData) throw new Error("couldn't find blog")
            helper.resHandler(res, 200, true, blogData, "blog found")
        }
        catch(err){
            helper.resHandler(res, 500, false, err, err.message)
        }
    }

    static allBlogs = async (req,res)=>{
        try{
            const blogsData = await blogModel.find()
            if(!blogsData) throw new Error("No blogs to show yet")
            helper.resHandler(res, 200, true, blogsData, "blogs found")
        }
        catch(err){
            helper.resHandler(res, 500, false, err, err.message)
        }
    }

    static edit = async(req, res)=>{
        try{
            const blogData = await blogModel.findById({_id:req.params.id , autherId:req.user._id})
            if(!blogData) throw new Error("couldn't find blog")
            Object.assign(blogData, req.body)
            await blogData.save()
            helper.resHandler(res, 200, true, blogData, "blog updated successfully")
        }
        catch(err){
            helper.resHandler(res, 500, false, err, err.message)
        }
    }

    static deleteBlog = async (req, res)=>{
        try{
            const blogData = await blogModel.findOne({_id:req.params.id , autherId:req.user._id})
            if(!blogData) throw new Error("couldn't find blog")
            await blogData.remove()
            helper.resHandler(res , 200 , true , {} , "blog deleted successfully")
        }
        catch(err){
            helper.resHandler(res, 500, false, err, err.message)
        }
    }

    static addReview = async (req,res)=>{
        try{
            const blogData = await blogModel.findById(req.params.id);
            if(!blogData) throw new Error("couldn't find blog")
            if(blogData.autherId.toString() == req.user._id.toString()) throw new Error("can't rate your own blog")
            const r = {userID: req.user._id , ...req.body.review}
            blogData.reviews.push({userId: req.user._id , ...req.body.review })
            await blogData.save()
            helper.resHandler(res, 200, true , r, "review added successfully")

        }
        catch(err){
            helper.resHandler(res, 500, false, err, err.message)
        }
    }

    static deleteReview = async (req, res) => {
        try{
            const blogData = await blogModel.findOne({_id:req.params.blogId , autherId:req.user._id})
            
            if(!blogData) throw new Error("couldn't find blog")
            const review = blogData.reviews.find(r => r._id.toString() == req.params.reviewId.toString())
            if(!review) throw new Error("couldn't find review")

            blogData.reviews = blogData.reviews.filter(r => r._id.toString() != req.params.reviewId.toString())
            await blogData.save()

            helper.resHandler(res, 200, true, {}, "review deleted successfully")
        }
        catch(err){
            helper.resHandler(res, 500, false, err, err.message)
        }
    }

    static editReview = async(req , res)=>{
        try{
            const blogData = await blogModel.findOne({_id:req.params.blogId , autherId : req.user._id})
            
            if(!blogData) throw new Error("couldn't find blog")
            const reviewIndex = blogData.reviews.findIndex(r => r._id.toString() == req.params.reviewId.toString())
            if(!blogData.reviews[reviewIndex]) throw new Error("couldn't find review")

            Object.assign(blogData.reviews[reviewIndex], req.body.review)
            await blogData.save()

            helper.resHandler(res, 200, true, blogData.reviews[reviewIndex], "review updated successfully")


        }
        catch(err){
            helper.resHandler(res, 500, false, err, err.message)    
        }
    }

    static showReviews = async(req,res)=>{
        try{
            const blogData = await blogModel.findById(req.params.id)
            if(!blogData) throw new Error("couldn't find blog")
            if(!blogData.reviews) throw new Error("no reviews to show yet")
            helper.resHandler(res, 200 , true, {...blogData.reviews}, "all blogs reviews")
        }
        catch(err){
            helper.resHandler(res, 500, false, err, err.message)
        }
    }

    static bookMark = async(req , res)=>{
        try{
            const blogData = await blogModel.findById(req.params.id)
            if(!blogData) throw new Error("couldn't find blog")
            req.user.bookMarks.push({type:"blog" , blogId :blogData._id})
            await req.user.save()
            helper.resHandler(res, 200, true, req.user.bookMarks, "book mark added successfully")
        }
        catch(err){
            helper.resHandler(res, 500, false, err, err.message)
        }
    }


}





module.exports = Blogs