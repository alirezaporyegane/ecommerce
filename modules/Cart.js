const mongoose = require('mongoose'),
Schema = mongoose.Schema;

const cartSchema = new Schema({
  userId: {
    type: String,
    required: true,
    unique: true
  },
  products: [
    {
      productId: {
        type: String
      },
      quantity: {
        type: Number,
        default: 1
      }
    }
  ]
},
{ timestamps: true }
);

module.exports = mongoose.model('cart', cartSchema)