const helper = require('../helpers/helpers')
const userModel = require('../../db/models/user-model')

class UserContrllers{
    static register = async (req , res)=>{
        try{
            const userData = new userModel(req.body)
            await userData.save()
            const message = "Thanks for signing up for la vie, please click the following link to verify your email address : http://localhost:3000/api/user/verify/"
            const subject = "Email verification"
            helper.sendMail(userData.email, userData._id , message , subject)
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
            const message = "please click the following link to reset your password : http://localhost:3000/api/user/reset-password/"
            const subject = "Reset Password"
            helper.sendMail(user.email , user._id , message , subject)
            helper.resHandler(res, 200, true, {}, "password reset email sent successfully")
        }
        catch(err){
            helper.resHandler(res, 500, false, err, err.message)
        }
    }

    static resetPassword = async (req, res) => {
        try{
            const user = await userModel.findById(req.params.id)
            user.password = req.body.password
            await user.save()
            helper.resHandler(res, 200, true, user, "password changed successfully")
        }
        catch(err){
            helper.resHandler(res, 500, false, err, err.message)
        }
    }
}



module.exports = UserContrllers;