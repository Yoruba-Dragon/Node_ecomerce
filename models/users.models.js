const mongoose= require('mongoose');
const bcrypt = require ('bcryptjs');
const jwt = require('jsonwebtoken')
const cartModels = require('./cart.models');

const userSchema = new  mongoose.Schema({

    name:{
        type: String,
        required: [true,'enter your name'],
        maxLength:20,
        trim: true
    },
    email:{
        type: String,
        required:[ true, 'please enter your email'],
        unique: true,
        lowercase:true,
        match:[ /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,})+$/,
            'Please enter a valid email address']
    },
    password:{
        type : String,
        minLength:6,
        requiure : [true, 'Please enter your password'],
        select : false
    }, 
    isAdmin:{
        type: Boolean,
        default: false
    }
    
},{ 
    timestamps:true
})

userSchema.pre('save', async function(next){
    if(!this.isModified('password')) return next();
    const salt= await bcrypt.genSalt(10)
    this.password  = await bcrypt.hash(this.password,salt);
    next();
});
userSchema.methods.matchPassword = async function (enteredPassword){
    return await bcrypt.compare(enteredPassword, this.password);
};
userSchema.methods.getSignedJwtToken = function(){
    return jwt.sign(
        {id: this._id, isAdmin: this.isAdmin},
        process.env.JWT_SECRET,
        {expiresIn: process.env.JWT_expire}

    )
};
userSchema.post('save', async function(doc, next) {
    try {
        const existingCart= await cartModels.findOne({ user: doc._id });
        if (!existingCart){
            const newCart = new cartModels({ user: doc._id, items: [] });
            await newCart.save();
        }
        console.log('Cart created for user:', doc._id);
        next();
    } catch (error) {
        console.error('Error creating cart for user:', doc._id, error);
        next(error);
    }
})

module.exports= mongoose.model('User', userSchema)