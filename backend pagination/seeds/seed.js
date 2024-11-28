// seeds/seed.js
require('dotenv').config();  // This will load variables from .env file into process.env

const mongoose = require('mongoose');
const Order = require('../models/Orders');
const { faker } = require('@faker-js/faker'); // Correct import for @faker-js/faker

// MongoDB connection string
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

// Seed function to generate 10,000 random orders
async function seedData() {
    const orders = [];
    for (let i = 0; i < 10000; i++) {  // Change 10 to 10000 to generate more data
        const order = {
            serialno: faker.string.uuid(),
            customerName: `${faker.person.firstName()} ${faker.person.lastName()}`, // Updated to use faker.person
            orderAmount: faker.commerce.price(),
            status: faker.helpers.arrayElement(['pending', 'processing', 'completed', 'cancelled']),
            items: Array.from({ length: Math.floor(Math.random() * 5) + 1 }, () => ({
                name: faker.commerce.productName(),
                quantity: Math.floor(Math.random() * 10) + 1,  // Random quantity between 1 and 10
                price: faker.commerce.price(),
            })),
            createdAt: faker.date.past(),
        };
        orders.push(order);
    }

    try {
        await Order.insertMany(orders); // Insert the generated orders into the database
        console.log('Data seeded successfully!');
        mongoose.connection.close();
    } catch (error) {
        console.error('Error seeding data:', error);
    }
}


// Run the seed function
seedData();
