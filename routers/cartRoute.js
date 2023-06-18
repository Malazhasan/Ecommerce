const express = require('express');
const { Cart } = require("../models/cartModel")
const { Product } = require("../models/productModel")
const { Coupon } = require("../models/couponModel")

const validateID = require("../middleware/validate_ID")

const router = express.Router();


const { getAll, createOne, deleteOne, getOne, updateOne } = require('../utils/factory');

const ApiError = require('../utils/apiError');

const { checkAuth, checkAuthrorization } = require("../middleware/Auth");



function calcTotalprice(cart) {
  let totalPrice = 0

  cart.cartItems.forEach(e => {
    totalPrice += e.price * e.quantity
  })
  cart.totalPriceAfterDiscount=undefined
  return totalPrice
}


//User Routes


//Admin Routes

router.use(checkAuth, checkAuthrorization("user"))
router.route('/')
  .get(async (req, res, next) => {

    const usercart = await Cart.findOne({ user: req.user._id });

      if(!usercart) return res.json({
        msg:"your cart is empty"
      })
      
    res.json({
      numOfItems: usercart.cartItems.length,

      data: usercart
    })
  })
  .post(async (req, res, next) => {
    let usercart = await Cart.findOne({ user: req.user._id });
    const product = await Product.findById(req.body.product)

    if (!usercart) {
     usercart= await Cart.create({
        cartItems: [{
          product: req.body.product,
          color: req.body.color,
          price: product.price
        }],
        user: req.user._id,
        
      })

    }
    else {

      const index = usercart.cartItems.findIndex((item) => item.product.toString() === req.body.product && item.color === req.body.color)
      if (index > -1) {
        usercart.cartItems[index].quantity++;


      }
      else {
        usercart.cartItems.push({
          product: req.body.product,
          color: req.body.color,
          price: product.price
        })

      }

    }

    usercart.totalCartPrice = calcTotalprice(usercart);
    // if (req.body.coupon) {
    //  const coupon= await Coupon.findOne({name:req.body.coupon})
    //  const discountAmount=usercart.totalCartPrice*coupon.discount/100
    //  usercart.totalPriceAfterDiscount=usercart.totalCartPrice-discountAmount
    // }
    await usercart.save()
    res.json({
      numOfItems: usercart.cartItems.length,

      data: usercart
    })
  })
  .put(async (req, res, next) => {
     await Cart.findOneAndRemove({ user: req.user._id });
  
    res.json({
      data: "cart cleared"
    })
  })
  
  ;

router.route('/:itemId')
  .delete(async (req, res, next) => {

    const usercart = await Cart.findOneAndUpdate({ user: req.user._id }, { $pull: { cartItems: { _id: req.params.itemId } } }, { new: true });
    usercart.totalCartPrice = calcTotalprice(usercart);
    await usercart.save()
    res.json({
      numOfItems: usercart.cartItems.length,
      data: usercart
    })
  })
  .put(async (req, res, next) => {

    const usercart = await Cart.findOne({ user: req.user._id });

      if(!usercart) return res.json({
        msg:"your cart is empty"
      })

      const index = usercart.cartItems.findIndex((item) => item._id.toString() === req.params.itemId)
      if (index > -1) {
        usercart.cartItems[index].quantity=req.body.quantity
      }
      else{
       return next(new ApiError("no item found",404)) 
      }
    usercart.totalCartPrice = calcTotalprice(usercart);
    await usercart.save()
    res.json({
      numOfItems: usercart.cartItems.length,

      data: usercart
    })
  })


  router.post('/applycoupon',async(req,res,next)=>{
    
    const usercart = await Cart.findOne({ user: req.user._id, });

    const coupon= await Coupon.findOne({name:req.body.coupon,expire:{$gt:Date.now()}})
    if(!coupon) return next(new ApiError("expired or not found",404))
     const discountAmount=usercart.totalCartPrice*coupon.discount/100
     usercart.totalPriceAfterDiscount=usercart.totalCartPrice-discountAmount
    

    await usercart.save() 
    res.json({
      numOfItems: usercart.cartItems.length,
      data: usercart
    })

  })




module.exports = router;



