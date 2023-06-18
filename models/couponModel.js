const mongoose = require('mongoose');

// 1- Create Schema
const couponSChema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, 'Coupon name required'],
      unique: true,
    },
    expire: {
      type: Date,
      required: [true, 'Coupon expire time required'],
    },
    discount: {
      type: Number,
      required: [true, 'Coupon discount value required'],
    },
  },
  { timestamps: true }
);


const CouponModel = mongoose.model('Coupon', couponSChema);




/* const setImageURL = (doc) => {
  if (doc.image) {
    const imageUrl = `${process.env.BASE_URL}/categories/${doc.image}`;
    doc.image = imageUrl;
  }
};
// findOne, findAll and update couponSChema.post('init', (doc) => {
  setImageURL(doc);
});

// create couponSChema.post('save', (doc) => {
  setImageURL(doc);
});
 */
// 2- Create model

module.exports.Coupon = CouponModel;

