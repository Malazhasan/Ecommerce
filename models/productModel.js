const mongoose = require('mongoose');
const Joi=require("joi")
const slugify=require("slugify")
const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: [3, 'Too short product title'],
      maxlength: [100, 'Too long product title'],
    },
    slug: {
      type: String,
      required: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: [true, 'Product description is required'],
      minlength: [20, 'Too short product description'],
    },
    quantity: {
      type: Number,
      required: [true, 'Product quantity is required'],
    },
    sold: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'Product price is required'],
      trim: true,
      max: [200000, 'Too long product price'],
    },
    priceAfterDiscount: {
      type: Number,
    },
    colors: [String],

    imageCover: {
      type: String,
      required: [true, 'Product Image cover is required'],
    },
    images: [String],
    category: {
      type: mongoose.Schema.ObjectId,
      ref: 'Category',
      required: [true, 'Product must be belong to category'],
    },
    subcategories: [
      {
        type: [mongoose.Schema.ObjectId],
        ref: 'subCategory',
      },
    ],
    brand: {
      type: mongoose.Schema.ObjectId,
      ref: 'Brand',
    },
    ratingsAverage: {
      type: Number,
      min: [1, 'Rating must be above or equal 1.0'],
      max: [5, 'Rating must be below or equal 5.0'],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true,toJSON:{ virtuals: true },toObject:{virtuals:true} }
);


const setImageURL = (doc) => {
  if (doc.imageCover) {
    const list=[]
    const imageUrl = `${process.env.BASE_URL}/products/${doc.imageCover}`;
    doc.imageCover = imageUrl;
    if(doc.images){
      doc.images.forEach(image => {
        list.push(`${process.env.BASE_URL}/products/${image}`)
      });
      doc.images=list
    }
  }
};
productSchema.virtual("Reviews",{
  localField:"_id",ref:"Review",foreignField:"product"
})
productSchema.post('init', (doc) => {
  setImageURL(doc);
});

// create
productSchema.post('save', (doc) => {
  setImageURL(doc);
});
// Mongoose query middleware
/* productSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'category',
    select: 'name -_id',
  });
  next();
}); */

 function vlidateProduct(req) {
  const sch=Joi.object({
    title:Joi.string().min(3).max(50).required().trim(),
    description:Joi.string().required().min(20),
    quantity:Joi.number().required(),
    sold:Joi.number(),
    price:Joi.number().max(2000).required(),
    priceAfterDiscount:Joi.number(),
    colors:Joi.array(),
    imageCover:Joi.string().required(),
    images:Joi.array().items(Joi.string()),
    category:Joi.objectId().required(),
    subcategories:Joi.array().items(Joi.objectId()),
    brand:Joi.objectId(),
    ratingsAverage: Joi.number().min(1).max(5),
    ratingsQuantity:Joi.number()

   }) 
   return sch.validate(req)
}
function vlidateUpdate(req) {
  const sch=Joi.object({
    title:Joi.string().min(3).max(50).trim(),
    description:Joi.string().min(20),
    quantity:Joi.number(),
    sold:Joi.number(),
    price:Joi.number().max(2000),
    priceAfterDiscount:Joi.number(),
    colors:Joi.array(),
    imageCover:Joi.string(),
    images:Joi.array().items(Joi.string()),
    category:Joi.objectId(),
    subcategories:Joi.array().items(Joi.objectId()),
    brand:Joi.objectId(),
    ratingsAverage: Joi.number().min(1).max(5),
    ratingsQuantity:Joi.number()

   }) 
   return sch.validate(req)
}
module.exports.Product = mongoose.model('Product', productSchema);
module.exports.validate=vlidateProduct;
module.exports.validateUpdate=vlidateUpdate