const mongoose = require('mongoose');



const productSchema = new mongoose.Schema({ 
    productName: {
        type: String,
        required: true,
        unique: true,
    },
    category: {
        type : mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true,
    },
    price:{type: Number,
        required: true,
        default: 0,
    },
    description: {
        type: String,
        required: true,
        maxlength: 500,},


    stock:{
        type: Number,
        required: true,
        default: 0,
    },
    image: {
        type: String,
        default : '',},
    
    dateCreated: {
        type: Date,
        default : Date.now,
    },
    
})                                





module.exports = mongoose.model('Product', productSchema);