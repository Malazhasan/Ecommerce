const mongoose = require('mongoose');
const Joi=require("joi")
const bcrypt=require("bcryptjs");
const jwt=require("jsonwebtoken")
// 1- Create Schema


const addressSchema=new mongoose.Schema({
  alias: {type:String,unique: true,required:true},
    details: String,
    phone: String,
    city: String,
    postalCode: String,
})
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, 'name required'],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    email: {
      type: String,
      required: [true, 'email required'],
      unique: true,
      lowercase: true,
    },
    phone: String,
    profileImg: String,

    password: {
      type: String,
      required: [true, 'password required'],
      minlength: [6, 'Too short password'],
    },
    passwordChangedAt: Date,
    passwordResetCode: String,
    passwordResetExpires: Date,
    passwordResetVerified: Boolean,
    role: {
      type: String,
      enum: ['user', 'manager', 'admin'],
      default: 'user',
    },
    active: {
      type: Boolean,
      default: true,
    },
    wishlist:[{
      type:mongoose.Schema.Types.ObjectId,
      ref:"Product"
    }],
    address:[addressSchema]
  },
  { timestamps: true }
);




userSchema.methods.generateToken=function(){
return jwt.sign({userId:this._id},process.env.JWT,{expiresIn:'1d'})
}
const setImageURL = (doc) => {
  if (doc.profileImg) {
    const imageUrl = `${process.env.BASE_URL}/users/${doc.profileImg}`;
    doc.profileImg = imageUrl;
  }
};
userSchema.post('init', (doc) => {
  setImageURL(doc);
});

// create
userSchema.post('save', (doc) => {
  setImageURL(doc);
});

userSchema.pre("save",async function(next){
if(!this.isModified('password')) return next()

  this.password=await bcrypt.hash(this.password,10)
})

const UserModel = mongoose.model('User', userSchema);



function validateUser(req) {
 const sch=Joi.object({
  name:Joi.string().min(3).max(32).required(),
  email:Joi.string().email().required(),
  profileImg:Joi.string(),
  phone:Joi.string(),
  password:Joi.string().required().min(6),
  confirmPssword:Joi.ref("password"),
  role:Joi.string(),
  active:Joi.string()
 }) .with("password","confirmPssword")
 return sch.validate(req)
}

function validateUpdate(req) {
  const sch=Joi.object({
   name:Joi.string().min(3).max(32),
   email:Joi.string().email(),
   profileImg:Joi.string(),
   phone:Joi.string(),
   role:Joi.string(),
   active:Joi.string()
  }) 
  return sch.validate(req)
 }
 function validateUserUpdate(req) {
  const sch=Joi.object({
   name:Joi.string().min(3).max(32),
   email:Joi.string().email(),
   profileImg:Joi.string(),
   phone:Joi.string(),
   active:Joi.string()
  }) 
  return sch.validate(req)
 }
 function validateChangePassword(req) {
  const sch=Joi.object({
    oldPassword:Joi.string().required().min(6),
    password:Joi.string().required().min(6),
    confirmPssword:Joi.ref("password")
  }) .with('password',"confirmPssword") 
  

  return sch.validate(req)
 }
 function validateChangeUserPassword(req) {
  const sch=Joi.object({
    password:Joi.string().required().min(6),
    confirmPssword:Joi.ref("password")
  }) .with('password',"confirmPssword") 
  

  return sch.validate(req)
 }
 function validateSingUp(req) {
  const sch=Joi.object({
   name:Joi.string().min(3).max(32).required(),
   email:Joi.string().email().required(),
   password:Joi.string().required().min(6),
   confirmPssword:Joi.ref("password"),
  }) .with("password","confirmPssword")
  return sch.validate(req)
 }

 function validatelogin(req) {
  const sch=Joi.object({
   email:Joi.string().email().required(),
   password:Joi.string().required().min(6),
  })
  return sch.validate(req)
 }
 function validatefoget(req) {
  const sch=Joi.object({
   email:Joi.string().email().required(),
  })
  return sch.validate(req)
 }

 function validateverify(req) {
  const sch=Joi.object({
   email:Joi.string().email().required(),
   resetcode:Joi.string().required()
  })
  return sch.validate(req)
 }


 
// findOne, findAll and update
/* 
 
// 2- Create model */


module.exports.User = UserModel;
module.exports.validate = validateUser;
module.exports.validateSingUp = validateSingUp;
module.exports.validatelogin = validatelogin;
module.exports.validateUpdate = validateUpdate;
module.exports.validateChangePassword=validateChangePassword
module.exports.validatefoget=validatefoget
module.exports.validateverify=validateverify
module.exports.validateUserUpdate=validateUserUpdate
module.exports.validateChangeUserPassword=validateChangeUserPassword

