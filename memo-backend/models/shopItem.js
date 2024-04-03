const mongoose = require('mongoose');

const shopItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  image: {
    type: String
  },
  soldOut: {
    type: Boolean,
    default: false
  },
  currency: {
    type: String,
    enum: ['coin', 'token'],
    required: true
  },
  price: {
    type: Number
  },
  attack: {
    type: Number,
    required: true
  }
});

const ShopItem = mongoose.model('ShopItem', shopItemSchema);

module.exports = ShopItem;