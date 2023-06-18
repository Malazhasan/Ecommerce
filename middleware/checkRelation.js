const log = require('../startup/logger');
const ApiError = require('../utils/apiError');
const { Brand } = require("../models/brandModel")
const { Category } = require("../models/categoryModel")
const { SubCategory } = require("../models/subCategoryModel")


module.exports = async function (req, res, next) {
  if(req.body.category){
  const category = await Category.findById(req.body.category)
  if (!category) return res.status(400).json({ error: `invalid category ID ${req.body.category}` })
  }
  if (req.body.subcategories) {
    const subcategories = await SubCategory.find({ _id: { $exists: true, $in: req.body.subcategories } }).select('_id')
    if (subcategories.length !== req.body.subcategories.length) {
      return res.status(400).json({ error: `invalid subcategories ID ${req.body.subcategories}` })
    }
    const belongSubs = await SubCategory.find({ category: req.body.category }).select('_id')
    console.log("belongSubs ==>", belongSubs.toString());
    const subdb = []
    belongSubs.forEach((e) => {
      subdb.push(e._id.toHexString())
    })
    const result = req.body.subcategories.every(e => subdb.includes(e))
    if (!result) return res.status(400).json({ error: ` subcategories IDs dont belong to same category   ${req.body.subcategories}` })
  }

  if (req.body.brand) {
    const brand = await Brand.findById(req.body.brand)
    if (!brand) return res.status(400).json({ error: `invalid brand ID ${req.body.category}` })
  }

  //const result=subcategories.find(e=>req.body.subcategories.indexOf(e._id))
  //console.log(result);


  next()

}