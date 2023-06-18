const mongoose = require('mongoose');
const Joi=require("joi")
// 1- Create Schema
const subCategorySchema = new mongoose.Schema(
{
    name: {
      type: String,
      required: [true, 'subCategory required'],
      unique: [true, 'subCategory must be unique'],
      minlength: [3, 'Too short subCategory name'],
      maxlength: [32, 'Too long subCategory name'],
    },
    // A and B => shopping.com/a-and-b
    slug: {
      type: String,
      lowercase: true,
    },
    category:{
      type:mongoose.Schema.ObjectId,
      ref:"Category",
      required:true
    }
    ,
    image: String,
  },
  { timestamps: true }
);


const setImageURL = (doc) => {
  if (doc.image) {
    const imageUrl = `${process.env.BASE_URL}/subCategories/${doc.image}`;
    doc.image = imageUrl;
  }
};
subCategorySchema.post('init', (doc) => {
  setImageURL(doc);
});

// create
subCategorySchema.post('save', (doc) => {
  setImageURL(doc);
});

const SubCategory = mongoose.model('subCategory', subCategorySchema);

function validatesubCategory(req) {
 const sch=Joi.object({
  name:Joi.string().min(3).max(32).required(),
  category:Joi.objectId(),
  image:Joi.string()
 }) 
 return sch.validate(req)
}
/* const setImageURL = (doc) => {
  if (doc.image) {
    const imageUrl = `${process.env.BASE_URL}/categories/${doc.image}`;
    doc.image = imageUrl;
  }
};
// findOne, findAll and update
categorySchema.post('init', (doc) => {
  setImageURL(doc);
});

// create
categorySchema.post('save', (doc) => {
  setImageURL(doc);
});
 */
// 2- Create model

module.exports.SubCategory = SubCategory;
module.exports.validate = validatesubCategory;
