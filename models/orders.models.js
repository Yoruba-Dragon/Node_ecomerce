const mongoose = require('mongoose');


ordersSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User',
        required: true
    },
    items:[
        {
            product:{
                type: mongoose.Schema.Types.ObjectId,
                ref:'Product',
                required: true
            },
            quantity:{
                type: Number,
                required: true,
                min: 1,
                default: 1
            },
            price:{
                type: Number,
                required: true,
                
            }
        }
    ],
    totalPrice:{
        type: Number,
        required: true,
        min: 0
    },

    status:{
        type: String,
        enum: ['pending', 'shipped', 'delivered', 'cancelled'],
        default: 'pending'
    }
},{
    timestamps: true
})

module.exports = mongoose.model('Orders',ordersSchema);