const jwt = require("jsonwebtoken");
const User = require("../../db/models/user-model")

const auth = async(req , res , next) =>{
    try{
        const token = req.header("authorization").replace("Bearer ", "")
        const decoded = jwt.verify(token, process.env.PASS);
        if(!decoded._id) throw new Error("User not found: invalid token")
        let user = await User.findOne({ _id:decoded._id , "tokens.token": token})
        req.user = user
        req.token = token
        next()
    }
    catch(err){
        res.status(500).send({apiStatus: false, err, message:err.message})
    }
            
}

module.exports = { auth }