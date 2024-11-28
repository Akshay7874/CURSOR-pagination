// routes/orders.js

const express = require('express');
const Order = require('../models/orders'); // Import the Order model
const router = express.Router();

// GET /api/orders - Fetch orders with cursor pagination
router.get('/', async (req, res) => {
  const { cursor, limit = 50, sort = 'createdAt', sortDirection = 'asc' } = req.query;

  const sortOptions = {};
  sortOptions[sort] = sortDirection === 'asc' ? 1 : -1; // Sorting order



  let query = {};
  if (cursor) {
    query = { _id: { $gt: cursor } }; // Pagination query: fetch records after the provided cursor
  }
  console.log(query);

  try {
    // Fetch orders from the database
    const orders = await Order.find(query)
      .sort(sortOptions) // Apply sorting
      .limit(Number(limit)); // Limit the number of results per page

    // Determine the next cursor (for pagination)
    const nextCursor = orders.length === Number(limit) ? orders[orders.length - 1]._id : null;

    // Respond with the orders and pagination info
    res.json({
      data: orders,
      nextCursor: nextCursor ? nextCursor.toString() : null,
      totalCount: await Order.countDocuments(), // Total number of orders
      totalfetched: orders.length, // Number of orders fetched in this request
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching orders' });
  }
});

module.exports = router;
