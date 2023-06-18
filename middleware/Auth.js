const { verify } = require("jsonwebtoken")
const ApiError = require("../utils/apiError")
const { User } = require("../models/userModel")


module.exports.checkAuth=async (req,res,next)=>{
    if(!req.header("Authorization")|| !req.header("Authorization").startsWith("Bearer")){
        return next(new ApiError("invalid token",401))
    }
    const token=req.header("Authorization").split(" ")[1]
    const pyload=verify(token,process.env.JWT)
    const user=await User.findById(pyload.userId)
    if(!user)return next(new ApiError(`no user found with ${pyload.userId}`,400))
  
   // console.log(Math.round(user.passwordChangedAt.getTime() / 1000));
   // console.log(pyload.iat);
    if(user.passwordChangedAt){
       if(Math.round(user.passwordChangedAt.getTime() / 1000)>pyload.iat)  return next(new ApiError("modified user data please login again",401))
    } 
    req.user=user;
    next();
}


module.exports.checkAuthrorization=function (...list) {
    return async (req,res,next)=>{
       
       if(!list.includes(req.user.role)) {
        return next(new ApiError("unAuthorized User",403))
       }
        next()
    
    }
}

