const mongoose = require('mongoose');

// Schema for individual items in an order
const orderItemSchema = new mongoose.Schema({
  name: String,
  quantity: Number,
  price: Number,
});

// Main schema for the Order
const orderSchema = new mongoose.Schema({
  serialno: {
    type: String,
    required: true,
    unique: true,  // Ensure serialno is unique across orders
  },
  customerName: {
    type: String,
    required: true,  // Ensure customer name is always provided
  },
  orderAmount: {
    type: Number,
    required: true,  // Ensure order amount is provided
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'cancelled'],
    default: 'pending',  // Default status to 'pending'
  },
  items: [orderItemSchema],  // Subdocument array for items in the order
  createdAt: { type: Date, default: Date.now },  // Automatically set the creation date
});

// Create the Order model using the schema
const Order = mongoose.model('Order', orderSchema);

module.exports = Order;

