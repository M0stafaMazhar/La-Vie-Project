const mongoose = require('mongoose')


const productSchema = mongoose.Schema({
    sellerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        trim: true,
        required: true
    },

    productName:{
        type:String,
        required:true,
        trim:true,
        minlengh:10,
        maxlengh:20,
    },

    description:{
        type:String,
        trim:true,
        required:true,
        minlengh:50,
        maxlengh:200,
    },

    price:{
        type:Number,
        required:true,
        min: 1 
    },

    stock:{
        type:Number,
        required:true,
        default: 0
    },

    tags: [{
        type: String,
        trim: true,
        required: true,
    }],

    images:[{
        type:String,
        trim:true,
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


},{timestamps: true})




productSchema.methods.toJSON = function(){
    const data = this.toObject();
    delete data.__v;
    return data;
}



const products = mongoose.model('products', productSchema)

module.exports = products