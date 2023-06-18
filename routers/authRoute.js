const express = require('express');
const { User, validateSingUp,validatelogin,validatefoget,validateverify } = require("../models/userModel")
const validateMiddleware = require("../middleware/validate")
const validateID = require("../middleware/validate_ID")
const router = express.Router();
const bcrypt=require("bcryptjs")
const ApiError = require('../utils/apiError');
const sendEmail=require("../utils/sendEmail")
const crypto=require("crypto")





   router.post("/forgetpassword",[validateMiddleware(validatefoget)],async(req,res,next)=>{
     
    const user=await User.findOne({email:req.body.email});
      if(!user)return next(new ApiError(`no user found with ${req.body.email}`,400))
      const resetCode=Math.floor(100000 + Math.random() * 900000).toString()
      //console.log(resetCode);
      const hash = crypto.createHash('sha256')
      .update(resetCode)
      .digest('hex');


     user.passwordResetCode=hash;
     user.passwordResetExpires=Date.now()+10*60*1000;
     user.passwordResetVerified=false
     await user.save()
     try {
        await sendEmail({email:"jpg21@imgrpost.xyz",resetCode})
      
     } catch (error) {
      user.passwordResetCode=undefined;
     user.passwordResetExpires=undefined;
     user.passwordResetVerified=undefined;
     await user.save()
     return next(new ApiError(`error sending emali ${error}`,500))
     }
 
      res.send("Email sent successfully")
    

   })

   router.post("/verifycode",[validateMiddleware(validateverify)],async(req,res,next)=>{
     
    const user=await User.findOne({email:req.body.email});
      if(!user)return next(new ApiError(`no user found with ${req.body.email}`,400))
      if(!user.passwordResetCode||user.passwordResetExpires<Date.now())return next(new ApiError(`expired or you havent request code yet`,400))
      
      const userCode=req.body.resetcode      
      const hash = crypto.createHash('sha256')
      .update(userCode)
      .digest('hex');
    if(hash!== user.passwordResetCode) return next(new ApiError(`invalid Code`,400))
    user.passwordResetVerified=true
    await user.save()
 
      res.send("Code Checked successfully")
    

   })

   
   router.post("/resetpassword",[validateMiddleware(validatelogin)],async(req,res,next)=>{
     
    const user=await User.findOne({email:req.body.email});
      if(!user)return next(new ApiError(`no user found with ${req.body.email}`,400))
      if(!user.passwordResetVerified)return next(new ApiError(`please veriy code first`,400))
      
      user.password=req.body.password
      user.passwordResetCode=undefined;
      user.passwordResetExpires=undefined;
      user.passwordResetVerified=undefined;
      await user.save()
 
      res.json({token:user.generateToken()})
    

   })

router.post("/signup",[validateMiddleware(validateSingUp)],async(req,res,next)=>{
  const tmp=await User.findOne({email:req.body.email});
  if(tmp)return next(new ApiError(`this email is used ${req.body.email}`,400))

  const user=await new User(req.body).save()
  res.json({date:user,token:user.generateToken()})  

})
router.post("/login",[validateMiddleware(validatelogin)],async(req,res,next)=>{
  const user=await User.findOne({email:req.body.email});
   if(!user)return next(new ApiError(`no user found with ${req.body.email}`,400))
  
   if(!await bcrypt.compare(req.body.password,user.password)){
    return next(new ApiError("password is incorrect",400))
  }
  res.json({date:user,token:user.generateToken()})
  
})


module.exports = router;
