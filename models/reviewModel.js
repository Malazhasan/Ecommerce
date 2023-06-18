const mongoose = require('mongoose');
const Joi=require("joi")
const {Product}=require("./productModel")
// 1- Create Schema
const reviewSchema = new mongoose.Schema(
  {
    title: {
      type: String,
    },
    ratings: {
      type: Number,
      min: [1, 'Min ratings value is 1.0'],
      max: [5, 'Max ratings value is 5.0'],
      required: [true, 'review ratings required'],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to user'],
    },
    // parent reference (one to many)
    product: {
      type: mongoose.Schema.ObjectId,
      ref: 'Product',
      required: [true, 'Review must belong to product'],
    },
  },
  { timestamps: true}
);

reviewSchema.pre('findOne',function(){
// console.log(await this.find());
  this.populate({ path: "user", select: "name" })
  // .populate("product", "title -_id");
})

reviewSchema.statics.calcAverageRatingsAndQuantity=async function(productId){
  
   const res=await this.aggregate([
    {$match: { product:productId  }},
      { $group : { _id : '$product' , avgRatings : { $avg : "$ratings" },ratingsQuantity:{$sum:1} }}
    // , avgRatings : { $avg : "$ratings" },ratingsQuantity:{$sum:1} } }
    // {$group:{_id:"$product" ,avgRatings:{$avg:"$ratings"},ratingsQuantity:{$sum:1}}}
  ])
console.log("here");
 if (res.length > 0) {
  await Product.findByIdAndUpdate(productId,{ratingsQuantity:res[0].ratingsQuantity,ratingsAverage:res[0].avgRatings})

} else {
  await Product.findByIdAndUpdate(productId,{ratingsQuantity:res[0].ratingsQuantity,ratingsAverage:res[0].avgRatings})

}

}
reviewSchema.post("save",async function(){
  await this.constructor.calcAverageRatingsAndQuantity(this.product)
})
// reviewSchema.post("deleteOne",async function(doc){
// console.log(doc);

// await this.model("Review").calcAverageRatingsAndQuantity(doc.product);
// })
//reviewSchema.pre("deleteOne",{ query: true, document: true },function(next){next()})
// reviewSchema.post('find', { document: true }, async function(doc) {
//   console.log(doc);
//   console.log(this);
//   await this.model('Review').calcAverageRatingsAndQuantity(doc.product);
// });

// reviewSchema.methods.generateToken=function(){
// return jwt.sign({userId:this._id},process.env.JWT,{expiresIn:'1d'})
// }
// const setImageURL = (doc) => {
//   if (doc.profileImg) {
//     const imageUrl = `${process.env.BASE_URL}/users/${doc.profileImg}`;
//     doc.profileImg = imageUrl;
//   }
// };
// reviewSchema.post('init', (doc) => {
//   setImageURL(doc);
// });

// // create
// reviewSchema.post('save', (doc) => {
//   setImageURL(doc);
// });

// reviewSchema.pre("save",async function(next){
// if(!this.isModified('password')) return next()

//   this.password=await bcrypt.hash(this.password,10)
// })

const ReviewModel = mongoose.model('Review', reviewSchema);



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


module.exports.Review = ReviewModel;
// module.exports.validate = validateUser;
// module.exports.validateSingUp = validateSingUp;
// module.exports.validatelogin = validatelogin;
// module.exports.validateUpdate = validateUpdate;
// module.exports.validateChangePassword=validateChangePassword
// module.exports.validatefoget=validatefoget
// module.exports.validateverify=validateverify
// module.exports.validateUserUpdate=validateUserUpdate
// module.exports.validateChangeUserPassword=validateChangeUserPassword

