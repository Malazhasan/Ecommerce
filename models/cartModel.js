const mongoose = require('mongoose');

// 1- Create Schema
const cartSChema = new mongoose.Schema(
  {
    cartItems: [
      {
        product: {
          type: mongoose.Schema.ObjectId,
          ref: 'Product',
        },
        quantity: {
          type: Number,
          default: 1,
        },
        color: String,
        price: Number,
      },
    ],
    totalCartPrice: Number,
    totalPriceAfterDiscount: Number,
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);


const cartModel = mongoose.model('Cart', cartSChema);




/* const setImageURL = (doc) => {
  if (doc.image) {
    const imageUrl = `${process.env.BASE_URL}/categories/${doc.image}`;
    doc.image = imageUrl;
  }
};
// findOne, findAll and update cartSChema.post('init', (doc) => {
  setImageURL(doc);
});

// create cartSChema.post('save', (doc) => {
  setImageURL(doc);
});
 */
// 2- Create model

module.exports.Cart = cartModel;

