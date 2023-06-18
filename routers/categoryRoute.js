const express = require('express');
const { Category, validate } = require("../models/categoryModel")
const validateMiddleware = require("../middleware/validate")
const validateID = require("../middleware/validate_ID")
const { getAll,createOne,deleteOne,getOne,updateOne } = require('../utils/factory');
const {uploadImage}=require("../middleware/imageUploadMiddleware")
const {checkAuth,checkAuthrorization}=require("../middleware/Auth")
const router = express.Router();




router.route('/').
  get( getAll(Category) )
  .post([checkAuth,checkAuthrorization("admin","manger")],uploadImage("image","categories"),validateMiddleware(validate),createOne(Category));


router.route('/:id')
  .get(validateID,getOne(Category))
  .put([checkAuth,checkAuthrorization("admin","manger")],[validateID,uploadImage("image","categories"), validateMiddleware(validate)],updateOne(Category))
  .delete([checkAuth,checkAuthrorization("admin")],validateID,deleteOne(Category));

module.exports = router;
