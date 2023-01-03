const mongoose = require('mongoose')
const validator = require('validator')
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')
const userSchema = new mongoose.Schema({
    fName: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 20,
        trim: true,
        validate(value){
            if(value.includes(" ")){
            throw new Error("Name must be one part only")
            }
        }
    },

    lName:{
        type: String,
        required: true,
        minlength: 5,
        maxlength: 20,
        trim: true,
        validate(value){
            if(value.includes(" ")){
            throw new Error("Name must be one part only")
            }
        }
    },
    googleId:{
        type: String,
        trim: true,
    },

    facebookId:{
        type: String,
        trim: true,
    },

    email:{
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        required: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("invalid email adress")
            }
        }
    },

    password:{
        type: String,
        trim: true,
        required: function(){
            if(this.googleId || this.facebookId) return false
            return true
        },
        // match: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    },

    verified:{
        type: Boolean,
        default: function(){
            if(this.googleId || this.facebookId) return true
            return false
        },
    },

    tokens:[],

    // level:{
    //     type: String,
    //     required: true,
    //     trim: true,
    //     enum: ['beginner' , 'advanced' , 'professional']
    // },

    image:{
        type: String,
        trim: true,
    },

    phone:{
        type: String,
        trim: true,
        validate(value){
            if(validator.isMobilePhone(value , "ar-EG")){
                throw new Error("invalid phone number")
        }
        }
    },

    education:{
        type: String,
        min: 8,
        trim: true
    },

    addresses: [{
        adressType:{
            type: String,
            trim: true,
            required: true,
        },
        details:{}
    }],

    gender:{
        type: String,
        trim: true,
        enum: ['male', 'female']
    },

    age:{
        type: Number
    },

    bookMarks:[{}],

    posts:[{}],

    likes:[{}],

    points:{},

    orders:[{}],

    shopingCart:[{}]

    


} , {timestamps : true})

userSchema.pre('save', async function() {
    if(this.isModified("password")){
        this.password = await bcryptjs.hash(this.password, 5)
    }
})


userSchema.statics.loginUser = async(email, password)=>{
    const userData = await userModel.findOne({email});
    if(!userData.verified) throw new Error("Email not verified, please check your mail box then try again")
    if(!userData) throw new Error("invalid credentials");
    const validatePassword = await bcryptjs.compare(password , userData.password);
    if(!validatePassword) throw new Error("invalid credentials");
    return userData;
}


userSchema.methods.generateToken = async function(){
    const userData = this;
    const token = jwt.sign({_id: this._id} , process.env.PASS);
    userData.tokens = userData.tokens.concat({token})
    await userData.save();
    return token;
}








userSchema.methods.toJSON = function(){
    const data = this.toObject();
    delete data.password;
    delete data.__v;
    delete data.tokens;
    delete data.googleId;
    delete data.facebookId;
    return data;
}


const userModel = mongoose.model('users' , userSchema);



module.exports = userModel