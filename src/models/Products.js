const mongoose = require('mongoose'),
Schema = mongoose.Schema;

const productSchema = new Schema({
  title: {
    type: String,
    required: true,
    unique: true
  },
  desc: {
    type: String,
    required: true,
    unique: true
  },
  img: {
    type: String,
    required: true
  },
  categories: {
    type: Array,
    default: false
  },
  size: {
    type: String,
  },
  color: {
    type: String,
  },
  price: {
    type: String,
    default: false
  },
},
{ timestamps: true }
);

module.exports = mongoose.model('Product', productSchema)