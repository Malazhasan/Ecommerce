const express = require('express');
const { User } = require("../models/userModel")

//const validateMiddleware = require("../middleware/validate")
const validateID = require("../middleware/validate_ID")
//const getnested = require("../middleware/getnestedRoute")
//const postnested = require("../middleware/postnestedRoute")

const router = express.Router();


//const { getAll, createOne, deleteOne, getOne, updateOne } = require('../utils/factory');

//const ApiError = require('../utils/apiError');

const { checkAuth, checkAuthrorization } = require("../middleware/Auth");






//User Routes


//Admin Routes


router.route('/')
  .get(checkAuth,async (req, res, next) => {
    const user=await User.findById(req.user._id)
   // const result=await Review.findOne({user:req.user._id,product:req.body.product})
   // if(result)  return next(new ApiError(`You are crested review before`, 400));
    
    res.json({ address:user.address })
  })
  .post( checkAuth,async (req, res, next) => {
    const user=await User.findByIdAndUpdate(req.user._id,{$addToSet:{address:req.body}},{new:true})
   // const result=await Review.findOne({user:req.user._id,product:req.body.product})
   // if(result)  return next(new ApiError(`You are crested review before`, 400));
    
    res.json({ address:user.address })
  });

router.delete("/:id",checkAuth,validateID,async(req,res)=>{
  const user=await User.findByIdAndUpdate(req.user._id,{$pull:{address:{_id:req.params.id}}},{new:true})
  res.json({address:user.address })

})


// router.route('/:id')
//   .get(validateID ,async (req, res, next) => {
//     const { id } = req.params;
//     const doc = await Review.findById(id)
//     if (!doc) {
//       return next(new ApiError(`No doc for this id ${id}`, 404));
//     }
//     res.status(200).json({ data: doc });
//   })
//   .put([validateID,checkAuth,checkAuthrorization("user")], async (req, res, next) => {

//     let doc = await Review.findOne({_id:req.params.id,user:req.user._id})

//     if (!doc) {
//       return next(new ApiError(`No doc for this id ${req.params.id}`, 404));
//     }


//     // if(doc.user._id.toString()!==req.user._id.toString())  return next(new ApiError(`you connot edit this review`, 401));
//    doc.title=req.body.title||doc.title;
//    doc.ratings=req.body.ratings||doc.ratings
//     doc = await doc.save()
//     res.status(200).json({ data: doc });
//   })
//   .delete(validateID,checkAuth,checkAuthrorization("user"),async (req, res, next) =>{
//     let doc = await Review.findByIdAndDelete({_id:req.params.id,user:req.user._id});

//     if (!doc) {
//       return next(new ApiError(`No doc for this id ${req.params.id}`, 404));
//     }

//    await Review.calcAverageRatingsAndQuantity(doc.product)
// //     console.log(doc);
// //     const result=await Review.aggregate([
// //   {$match: { product:doc.product  }},
// //     { $group : { _id : '$product' , avgRatings : { $avg : "$ratings" },ratingsQuantity:{$sum:1} }}
// //   // , avgRatings : { $avg : "$ratings" },ratingsQuantity:{$sum:1} } }
// //   // {$group:{_id:"$product" ,avgRatings:{$avg:"$ratings"},ratingsQuantity:{$sum:1}}}
// // ])

// // console.log(result);
// // if (result.length > 0) {
// // await Product.findByIdAndUpdate(doc.product,{ratingsQuantity:result[0].ratingsQuantity,ratingsAverage:result[0].avgRatings})

// // } else {
// // await Product.findByIdAndUpdate(doc.product,{ratingsQuantity:result[0].ratingsQuantity,ratingsAverage:result[0].avgRatings})

// // }

    
//    // await doc.deleteOne();
//     // if(doc.user._id.toString()!==req.user._id.toString())  return next(new ApiError(`you connot delete this review`, 401));
//   // await doc.deleteOne()
//   res.status(201).json({ data: doc});

//   });

module.exports = router;




// async (req, res, next) => {

//   const docs = await Review.find()
//   //res.send(docs)
//   res.status(200).json({ results: docs.length, data: docs });

// }