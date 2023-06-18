const mongoose = require('mongoose');
const Joi=require("joi")
// 1- Create Schema
const brandSChema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Brand required'],
      unique: [true, 'Brand must be unique'],
      minlength: [3, 'Too short Brand name'],
      maxlength: [32, 'Too long Brand name'],
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
    const imageUrl = `${process.env.BASE_URL}/brands/${doc.image}`;
    doc.image = imageUrl;
  }
};
brandSChema.post('init', (doc) => {
  setImageURL(doc);
});

// create
brandSChema.post('save', (doc) => {
  setImageURL(doc);
});

const BrandModel = mongoose.model('Brand', brandSChema);

function validateBrand(req) {
 const sch=Joi.object({
  name:Joi.string().min(3).max(32).required(),
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
// findOne, findAll and update brandSChema.post('init', (doc) => {
  setImageURL(doc);
});

// create brandSChema.post('save', (doc) => {
  setImageURL(doc);
});
 */
// 2- Create model

module.exports.Brand = BrandModel;
module.exports.validate = validateBrand;
