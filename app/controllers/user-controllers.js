const helper = require('../helpers/helpers')
const userModel = require('../../db/models/user-model')

class UserContrllers{
    static register = async (req , res)=>{
        try{
            const userData = new userModel(req.body)
            await userData.save()
            helper.sendMail(userData.email, userData._id)
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
}



module.exports = UserContrllers;