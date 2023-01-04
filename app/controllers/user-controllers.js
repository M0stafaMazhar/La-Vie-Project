const helper = require('../helpers/helpers')
const userModel = require('../../db/models/user-model')
const jwt = require("jsonwebtoken")
class UserContrllers{

    // authentication
    
    static register = async (req , res)=>{
        try{
            const userData = new userModel(req.body)
            await userData.save()
            const message = "Thanks for signing up for la vie, please click the following link to verify your email address : http://localhost:3000/api/user/verify/" + userData._id
            const subject = "Email verification"
            helper.sendMail(userData.email , message , subject)
            helper.resHandler(res , 200 , true , userData , "User added successfully!")
        }
        catch(err){
            helper.resHandler(res , 500 , false , err , err.message)
        }
    }

    static verifyEmail = async (req, res)=>{
        try{
            const user = await userModel.findByIdAndUpdate(req.params.id ,{verified:true})
            helper.resHandler(res , 200 , true , user , "Acount verified successfully!")
        }
        catch(err){
            helper.resHandler(res, 500, false, err, err.message)
        }
    }

    static login = async (req, res)=>{
        try{
            const userData = await userModel.loginUser(req.body.email , req.body.password)
            const token = await userData.generateToken()
            helper.resHandler(res , 200 , true , {userData , token} , "Logged in successfully!")
        }
        catch(err){
            helper.resHandler(res, 500, false, err, err.message)
        }
    }

    static socialLogin (req, res){
        try {
        helper.resHandler(res , 200 , true , req.user , "logged in successfully!")
        } 
        catch (err) {
        helper.resHandler(res, 500, false, err, err.message) 
        }
        
    }

    static logout = async (req, res)=>{
        try{
            req.user.tokens = req.user.tokens.filter(t => t.token !== req.token)
            await req.user.save()
            helper.resHandler(res, 200, true, {} , "Logged out successfully!")
        }
        catch(err){
            helper.resHandler(res, 500, false, err, err.message)
        }
    }

    static forgotPassword = async (req, res) => {
        try{
            const user = await userModel.findOne({email: req.body.email})
            if(!user) throw new Error("User not found")
            const confCode = Math.floor(Math.random()*999999)
            const message = "Confirmation code: " + confCode
            const subject = "Reset Password"
            await user.generateResetToken(confCode)
            helper.sendMail(user.email , message , subject)
            helper.resHandler(res, 200, true, {}, "password reset email sent successfully")
        }
        catch(err){
            helper.resHandler(res, 500, false, err, err.message)
        }
    }

    static resetPassword = async (req, res) => {
        try{
            const user = await userModel.findOne({email: req.body.email})
            const decoded = jwt.verify(user.resetToken , process.env.PASS);
            if(!decoded) throw new Error("Token not found")
            console.log(decoded.code);
            if(decoded.code != req.body.confCode) throw new Error("Invalid code")
            user.password = req.body.password
            user.resetToken = ""
            await user.save()
            helper.resHandler(res, 200, true, user, "password changed successfully")
        }
        catch(err){
            helper.resHandler(res, 500, false, err, err.message)
        }
    }
    
    


    //user profile

    static profile = async (req , res)=>{
        try{
            const userData = await userModel.findById(req.params.id)
            if(!userData) throw new Error("User not found")
            helper.resHandler(res, 200, true, 
                {fName: userData.fName ,
                 lName: userData.lName ,
                 phone: userData.phone , 
                 posts: userData.posts },
                  "user profile data")
        }
        catch(err){
            helper.resHandler(res, 500, false, err, err.message)
        }
    }


    static myProfile = async (req, res) => {
        try{
            helper.resHandler(res , 200 , true, req.user , "Own profile data")
        }
        catch(err){
            helper.resHandler(res, 500, false, err, err.message)
        }
    }

    static editMe = async (req, res) => {
        try{
            Object.assign(req.user, req.body)
            await req.user.save()
            helper.resHandler(res, 200, true, req.user, "profile edited successfully")
        }
        catch(err){
            helper.resHandler(res, 500, false, err, err.message)
        }
    }

    static uploadImage = async (req, res) => {
        try{
            req.user.image = req.file.filename
        }
        catch(err){
            helper.resHandler(res, 500, false, err, err.message)
        }
    }

    static orders = async (req, res) => {
        try{
            helper.resHandler(res, 200, true , req.user.orders , "orders sent successfully")
        }
        catch(err){
            helper.resHandler(res, 500, false, err, err.message)
        }
    }

    static shopingCart = async (req, res) => {
        try{
            helper.resHandler(res, 200, true , req.user.shopingCart , "shoping cart sent successfully")
        }
        catch(err){
            helper.resHandler(res, 500, false, err, err.message)
        }
    }

    static points = async (req, res) => {
        try{
            helper.resHandler(res, 200, true , req.user.points , "shoping cart sent successfully")
        }
        catch(err){
            helper.resHandler(res, 500, false, err, err.message)
        }
    }

    static myBlogs = async (req, res) => {
        try{
            await req.user.populate("myBlogs")
            helper.resHandler(res, 200, true, req.user.myBlogs , "user own blogs")
        }
        catch(err){
            helper.resHandler(res, 500, false, err, err.message)
        }
    }

    static userBlogs = async(req, res)=>{
        try{
            const userData = await userModel.findById(req.params.id)
            await userData.populate("myBlogs")
            helper.resHandler(res, 200, true, userData.myBlogs, "user blogs data")
        }
        catch(err){
            helper.resHandler(res, 500, false, err, err.message)
        }
    }


}



module.exports = UserContrllers;