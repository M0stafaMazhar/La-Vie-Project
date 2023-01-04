const mongoose = require('mongoose');

const blogSchema = mongoose.Schema({
    autherId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true,
        trim: true
    },

    autherName:{
        type: String,
        required: true,
        trim: true
    },

    title: {
        type: String,
        required: true,
        trim: true,
        minlength: 5,
        maxlength: 20,
    },

    content: {
        type: String,
        required: true,
        trim: true,
        minlength: 20,
        maxlength: 500,
    },

    images:[{
        type: String,
        trim: true,
    }],

    tags: [{
        type: String,
        trim: true,
        required: true,
    }],

    reviews:[{
            userId:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users',
            required: true,
            trim: true,
        },

        rating:{
            type: Number,
            required: true,
            max:5
        },

        comment:{
            type: String,
            trim: true,
            maxlength: 500,
        }
    

    }],

}
     , {timestamps: true})




blogSchema.methods.toJSON = function(){
    const data = this.toObject();
    delete data.__v;
    return data;
}

const blogs = mongoose.model('blogs' , blogSchema);


module.exports = blogs