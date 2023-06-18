const mongoose = require('mongoose');
const Joi=require("joi")
// 1- Create Schema
const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Category required'],
      unique: [true, 'Category must be unique'],
      minlength: [3, 'Too short category name'],
      maxlength: [32, 'Too long category name'],
    },
    // A and B => shopping.com/a-and-b
    slug: {
      type: String,
      lowercase: true,
    },
    image: String,
  },
  { timestamps: true }
);

const setImageURL = (doc) => {
  if (doc.image) {
    const imageUrl = `${process.env.BASE_URL}/categories/${doc.image}`;
    doc.image = imageUrl;
  }
};
categorySchema.post('init', (doc) => {
  setImageURL(doc);
});

// create
categorySchema.post('save', (doc) => {
  setImageURL(doc);
});

const CategoryModel = mongoose.model('Category', categorySchema);

function validateCategory(req) {
 const sch=Joi.object({
  name:Joi.string().min(3).max(32).required(),
  image:Joi.string()
 }) 
 return sch.validate(req)
}


// findOne, findAll and update
/* 
 
// 2- Create model */


module.exports.Category = CategoryModel;
module.exports.validate = validateCategory;
