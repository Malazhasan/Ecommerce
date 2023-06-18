const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET);
const { Order } = require("../models/orderModel")
const { Cart } = require("../models/cartModel")
const { Product } = require("../models/productModel")
const { User } = require("../models/userModel")


const validateID = require("../middleware/validate_ID")
const router = express.Router();
const { getAll, createOne, deleteOne, getOne, updateOne } = require('../utils/factory');

const ApiError = require('../utils/apiError');

const { checkAuth, checkAuthrorization } = require("../middleware/Auth");





//User Routes


//Admin Routes

router.use(checkAuth)
router.route('/')
  .get(checkAuthrorization("admin","user"),async(req,res,next)=>{
    console.log(req.user);
    if (req.user.role==="user")req.body.filter={user:req.user._id}
    next()
  },getAll(Order))
  //we can set route with cartId {{URL}}/order/:cartId
  .post( checkAuthrorization("user"),async (req, res, next) => {
    let tax=0
    let shippingPrice=0
    const cart=await Cart.findOne({user:req.user._id})
    if(!cart) return res.json({msg:"empty cart"})
    const user=await User.findById(req.user._id);
   const {details,phone,city,postalCode}= user.address.id(req.body.address)
    const order=await Order.create({
      user:req.user._id,
      cartItems:cart.cartItems,
      shippingAddress:{details,phone,city,postalCode},
    })
    const totalPrice=cart.totalPriceAfterDiscount?cart.totalPriceAfterDiscount:cart.totalCartPrice
    order.totalOrderPrice=totalPrice+tax+shippingPrice
    await order.save()
    // cart.cartItems.forEach(async e=>{
    //   await Product.findOneAndUpdate({_id:e.product},{$inc:{quantity:-e.quantity,sold:+e.quantity}})
    // })
const bulkOptions=cart.cartItems.map((e)=>({
 updateOne:{
  filter:{_id:e.product},
  update:{$inc:{quantity:-e.quantity,sold:+e.quantity}}
}
}))
console.log(bulkOptions);
await Product.bulkWrite(bulkOptions,{})

   await cart.deleteOne()
   res.json({
    data:order
   })
  })
 
 router.put('/:id/pay',checkAuthrorization("admin"),async(req,res,next)=>{
  const  order =await Order.findById(req.params.id)
  order.isPaid=true;
  order.paidAt=Date.now()
  await order.save()
  res.json({data:order})
 })

 router.put('/:id/deliver',checkAuthrorization("admin"),async(req,res,next)=>{
  const  order =await Order.findById(req.params.id)
  order.isDelivered=true;
  order.deliveredAt=Date.now()
  await order.save()
  res.json({data:order})
 })

router.route('/:id')
  .get(validateID,checkAuthrorization("admin","user"),async (req,res,next)=>{
    let order
    if(req.user.role==="user"){
      order =await Order.findOne({user:req.user._id, _id:req.params.id})
    }else{
      order =await Order.findById(req.params.id)
    }
    res.json({
      data:order
    })
  })


  router.post('/applycoupon',checkAuthrorization("user"),async(req,res,next)=>{
    
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

  //paymob.com   hyperpay.com   


router.get('/checkout-session/:cartId',checkAuthrorization("user"),async (req, res, next) => {
  // app settings
  const taxPrice = 0;
  const shippingPrice = 0;

  // 1) Get cart depend on cartId
  const cart = await Cart.findById(req.params.cartId);
  if (!cart) {
    return next(
      new ApiError(`There is no such cart with id ${req.params.cartId}`, 404)
    );
  }

  // 2) Get order price depend on cart price "Check if coupon apply"
  const cartPrice = cart.totalPriceAfterDiscount
    ? cart.totalPriceAfterDiscount
    : cart.totalCartPrice;

  const totalOrderPrice = cartPrice + taxPrice + shippingPrice;

  // 3) Create stripe checkout session
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        name: req.user.name,
        amount: totalOrderPrice * 100,
        currency: 'usd',
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `${req.protocol}://${req.get('host')}/order`,
    cancel_url: `${req.protocol}://${req.get('host')}/cart`,
    customer_email: req.user.email,
    client_reference_id: req.params.cartId,
    metadata: req.body.shippingAddress,
  });

  // 4) send session to response
  res.status(200).json({ status: 'success', session });
});

const createCardOrder = async (session) => {
  const cartId = session.client_reference_id;
  const shippingAddress = session.metadata;
  const oderPrice = session.amount_total / 100;

  const cart = await Cart.findById(cartId);
  const user = await User.findOne({ email: session.customer_email });

  // 3) Create order with default paymentMethodType card
  const order = await Order.create({
    user: user._id,
    cartItems: cart.cartItems,
    shippingAddress,
    totalOrderPrice: oderPrice,
    isPaid: true,
    paidAt: Date.now(),
    paymentMethodType: 'card',
  });

  // 4) After creating order, decrement product quantity, increment product sold
  if (order) {
    const bulkOption = cart.cartItems.map((item) => ({
      updateOne: {
        filter: { _id: item.product },
        update: { $inc: { quantity: -item.quantity, sold: +item.quantity } },
      },
    }));
    await Product.bulkWrite(bulkOption, {});

    // 5) Clear cart depend on cartId
    await Cart.findByIdAndDelete(cartId);
  }
};

// @desc    This webhook will run when stripe payment success paid
// @route   POST /webhook-checkout
// @access  Protected/User
exports.webhookCheckout = async (req, res, next) => {
  const sig = req.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
  if (event.type === 'checkout.session.completed') {
    //  Create order
    createCardOrder(event.data.object);
  }

  res.status(200).json({ received: true });
};



exports.orderRoute = router;



