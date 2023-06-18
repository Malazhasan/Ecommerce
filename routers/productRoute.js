const express = require('express');
const { Product, validate,validateUpdate } = require("../models/productModel")
const validateMiddleware = require("../middleware/validate")
const validateID = require("../middleware/validate_ID")
const setImages = require("../middleware/setImages")
const checkRelation = require("../middleware/checkRelation");
const { getAll,createOne, getOne, updateOne, deleteOne } = require('../utils/factory');
const { multiuploadImage } = require('../middleware/imageUploadMiddleware');
const router = express.Router();
const {checkAuth,checkAuthrorization}=require("../middleware/Auth");
const  ReviewRoute  = require('./reviewRoute');


// multiuploadImage

router.use("/:productId/reviews",ReviewRoute)
router.route('/')
  .get(getAll(Product))
  .post([checkAuth,checkAuthrorization("admin","manger")],[multiuploadImage([{name:"imageCover",maxCount:1},{name:"images",maxCount:5}],"products"),setImages,validateMiddleware(validate), checkRelation],createOne(Product));


router.route('/:id')
  .get(validateID,getOne(Product,"Reviews"))
  .put([checkAuth,checkAuthrorization("admin","manger")],[validateID, checkRelation,multiuploadImage([{name:"imageCover",maxCount:1},{name:"images",maxCount:5}],"products"),setImages,validateMiddleware(validateUpdate)],updateOne(Product))
  .delete([checkAuth,checkAuthrorization("admin")],validateID,deleteOne(Product));

module.exports = router;
