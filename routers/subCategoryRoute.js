const express = require('express');
const {  SubCategory, validate } = require("../models/subCategoryModel")
const validateMiddleware = require("../middleware/validate")
const postnested = require("../middleware/postnestedRoute")
const getnested = require("../middleware/getnestedRoute")
const validateID = require("../middleware/validate_ID")
const router = express.Router({mergeParams:true});
const { getAll,createOne,deleteOne,getOne,updateOne } = require('../utils/factory');
const { uploadImage } = require('../middleware/imageUploadMiddleware');
const {checkAuth,checkAuthrorization}=require("../middleware/Auth")



router.route('/')
  .get([validateID,getnested], getAll(SubCategory))
  .post([checkAuth,checkAuthrorization("admin","manger")],[validateID,postnested,uploadImage('image',"subCategories"),validateMiddleware(validate)],createOne(SubCategory));


router.route('/:id')
  .get(validateID, getOne(SubCategory) )
  .put([checkAuth,checkAuthrorization("admin","manger")],[validateID,uploadImage('image',"subCategories"),validateMiddleware(validate)],updateOne(SubCategory)  )
  .delete([checkAuth,checkAuthrorization("admin")],validateID,deleteOne(SubCategory));

module.exports = router;
