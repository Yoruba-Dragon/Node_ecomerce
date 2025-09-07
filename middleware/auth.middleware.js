const jtw = require('jsonwebtoken')
const user = require('../models/users.models')



exports.protect =async (req,res,next)=>{
    let token;
     if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
     ){
        token =req.headers.authorization.split('')[1]
     }
     if(!token){
        return res.status(400).json({ error: 'Not authorized, no token'})
     }
     try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.Id);
        next();
     }catch(err){
        return res.status(401).json({error:'Not authorized, token failed'})
     }
}
exports.restrictTo = (...roles)=>{
   return(req,res,next)=>{
      if(!roles.includes(req.user.role)){
         return res.status(403).json({error: "You do not have permission to perform this action"});
      }
      next();
   }
}