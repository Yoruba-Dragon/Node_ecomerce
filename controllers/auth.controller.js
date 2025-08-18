const User= require('../models/users.models')
exports.register =  async(req,res)=>{
    
    try{
        const {name, email, password, role}= req.body;
        const existingUser= await User.findOne({email: req.body.email})
        if (existingUser) {
            return res.status(400).json({error: 'User already exists'});
        }
        if (!name || !email || !password){
            return res.status(400).json({error: 'Please provide all required fields'});
        }
        const user = await User.create({
            name, 
            email,
            password,
            role
        })
        sendTokenResponse(user, 201,res);

    }catch (err){
        res.status(400).json({error: err.message})
    }
 };

exports.login = async (req,res)=>{
    const{email, password}= req.body;

    if (!email || !password){
            return res.status(400).json({error: 'Please provide email and password'});
        }
        const user = await User.findOne({email}). select('+password');
    if(!user|| ! (await user.matchPassword(password))){
        return res.status(401).json({error: 'Invalid credentials'})

    } 
    sendTokenResponse(user,200,res)
};
const sendTokenResponse = (user, statusCode, res)=>{
    const token = user.getSignedJwtToken();
    res.status(statusCode).json({
        success: true,
        token
    });
};


 