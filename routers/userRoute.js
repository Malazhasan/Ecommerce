const express = require('express');
const { User, validate,validateUpdate,validateChangePassword ,validateUserUpdate,validateChangeUserPassword} = require("../models/userModel")
const validateMiddleware = require("../middleware/validate")
const validateID = require("../middleware/validate_ID")
const router = express.Router();
const bcrypt=require("bcryptjs")

const { getAll,createOne,deleteOne,getOne,updateOne } = require('../utils/factory');
const { uploadImage } = require('../middleware/imageUploadMiddleware');
const ApiError = require('../utils/apiError');

const {checkAuth,checkAuthrorization}=require("../middleware/Auth")



router.use(checkAuth)
//User Routes


router.get("/myprofile",[],async(req,res,next)=>{
  const user=await User.findById(req.user._id)
  res.send(user)

})
router.put("/myprofile",[validateMiddleware(validateUserUpdate)],async(req,res,next)=>{
  const user=await User.findByIdAndUpdate(req.user._id,req.body,{new:true})
  res.send(user)

})

router.put("/changeuserpassword",[validateMiddleware(validateChangeUserPassword)],async(req,res,next)=>{
  const user=await User.findById(req.user._id);
  
  
  user.password=req.body.password
  user.passwordChangedAt=Date.now();
 
  await user.save()

  res.json({token:user.generateToken()})

})

router.delete("/disactive",[],async(req,res,next)=>{
  const user=await User.findByIdAndUpdate(req.user._id,{active:false},{new:true})

  res.send("user is not active")

})

router.use(checkAuthrorization("admin"))
//Admin Routes
   router.put("/changepassword/:id",[validateID,validateMiddleware(validateChangePassword)],async(req,res,next)=>{
      const user=await User.findById(req.params.id);
      if(!user)return next(new ApiError(`no user found with ${req.params.id}`,400))
      if(!await bcrypt.compare(req.body.oldPassword,user.password)){
        return next(new ApiError("old password is incorrect",400))
      }
      user.password=req.body.password;
      user.passwordChangedAt=Date.now()
      await user.save()
      res.json({token:user.generateToken()})
   })

   
router.route('/')
  .get(getAll(User))
  .post(uploadImage("profileImg","users"),validateMiddleware(validate),createOne(User));


router.route('/:id')
  .get(validateID, getOne(User))
  .put([validateID,uploadImage("profileImg","users") ,validateMiddleware(validateUpdate)],updateOne(User) )
  .delete(validateID,deleteOne(User)
  );

module.exports = router;
