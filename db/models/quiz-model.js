const mongoose = require('mongoose')



const questionSchema = mongoose.Schema({
    level:{
        type: String,
        required:true,
        trim: true,
        enum: ['beginner' , 'advanced' , 'professional']
    },

    points:{
        type: Number,
        required:true,
        min:1,
        max:5
    },

    question:{
        type: String,
        required:true,
        trim: true,
        maxlength: 100
    },

    answers:[{
        answer:{
            type: String,
            required:true,
            trim: true,
            maxlength: 50
        },
        correct:{
            type: Boolean,
            required:true,
            default:false
        }
    }]

} , {timestamps : true})





questionSchema.methods.toJSON = function(){
    const data = this.toObject();
    delete data.__v;
    return data;
}



const questions = mongoose.model('questions' , questionSchema)


module.exports = questions