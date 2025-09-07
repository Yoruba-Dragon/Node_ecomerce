const jwt = require('jsonwebtoken');
const User = require('../models/users.models');
const bcrypt = require('bcryptjs');

const generateToken = (id,role)=> {
    return jwt.sign({ id, role}, process.env.JWT_SECRET,{
    expiresIn: '1d',
    })
};


exports.register = async (req,res)=>{
    try{
        const {name, email, password,role} = req.body;

        let user = await User.findOne({email});
        if (user){
            return res.status(400).json({message: 'User already exists'});
        }

        user = await User.create ({name, email, password, role});
        res.status(201).json({
            message: 'User registered successfully',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id, user.role)
            }
        });
    }catch (error){
        console.error(error);
        res.status(500).json({message: 'Server error'});
    }
}
exports.login = async(req,res)=>{
    try{
         const{email,password}= req.body;
         const user = await User.findOne({email}).select("+password");

         if (!user){
            return res.status(401).json({message: 'User does not exist'})
         }
         const isValid = bcrypt.compareSync(password, user.password)
         if (!isValid){
            return res.send("Invalid password")
         }
        const token = jwt.sign({id: user._id, role: user.role}, process.env.JWT_SECRET,{
            expiresIn: '1hr'});
        console.log(token)
         return res.status(200).cookie("token",token,{
            maxAge:  60 * 60 * 1000,
            secure:true,
            httpOnly:true,
            }).json({
            message: "Login successful",
            user: { id: user.id, email: user.email },
            
        })}catch (error){
            console.error(error);
            res.status(500).json({message: 'Server error'});
        }
}