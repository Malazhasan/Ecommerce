const express = require('express');
const { Brand, validate } = require("../models/brandModel")
const validateMiddleware = require("../middleware/validate")
const validateID = require("../middleware/validate_ID")
const router = express.Router();

const { getAll,createOne,deleteOne,getOne,updateOne } = require('../utils/factory');
const { uploadImage } = require('../middleware/imageUploadMiddleware');

const {checkAuth,checkAuthrorization}=require("../middleware/Auth")




router.route('/').get( getAll(Brand))
  .post([checkAuth,checkAuthrorization("admin","manger")],uploadImage("image","brands"),validateMiddleware(validate),createOne(Brand));


router.route('/:id')
  .get(validateID, getOne(Brand))
  .put([checkAuth,checkAuthrorization("admin","manger")],[validateID,uploadImage("image","brands") ,validateMiddleware(validate)],updateOne(Brand) )
  .delete([checkAuth,checkAuthrorization("admin")],validateID,deleteOne(Brand)
  );

module.exports = router;
