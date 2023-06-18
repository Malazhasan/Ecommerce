const express = require('express');
const { Coupon } = require("../models/couponModel")
const validateID = require("../middleware/validate_ID")

const router = express.Router();


const { getAll, createOne, deleteOne, getOne, updateOne } = require('../utils/factory');

const ApiError = require('../utils/apiError');

const { checkAuth, checkAuthrorization } = require("../middleware/Auth");






//User Routes


//Admin Routes

router.use(checkAuth,checkAuthrorization("admin"))
router.route('/')
  .get(getAll(Coupon))
  .post(createOne(Coupon));


router.route('/:id')
  .get(validateID,getOne(Coupon))
  .put(validateID, updateOne(Coupon))
  .delete(validateID,deleteOne(Coupon));

module.exports = router;




// async (req, res, next) => {

//   const docs = await Review.find()
//   //res.send(docs)
//   res.status(200).json({ results: docs.length, data: docs });

// }