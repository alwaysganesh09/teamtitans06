// api/index.js

// This file serves as the entry point for your Vercel serverless functions.
// All requests to /api/* will be handled by this file.

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const adminRoutes = require('../backend/routes/adminRoutes');

const app = express();

// Security fix: Restrict CORS to only your Vercel frontend domain
// The 'https://teamtitans06.vercel.app' URL is set here to match your live site.
const corsOptions = {
  origin: 'https://teamtitans06.vercel.app',
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Connect to MongoDB using the environment variable.
// Vercel will inject process.env.MONGODB_URI at runtime.
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

// Login route for the admin panel.
// This route is defined here in the main serverless function.
app.post('/api/login', (req, res) => {
  const { password } = req.body;
  const correctPassword = process.env.ADMIN_PASSWORD;

  if (!correctPassword) {
    console.error('ADMIN_PASSWORD environment variable is not set!');
    return res.status(500).json({ success: false, message: 'Server configuration error.' });
  }

  if (password === correctPassword) {
    res.json({ success: true, message: 'Login successful' });
  } else {
    res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
});

// Use your adminRoutes for all other API endpoints.
// The path has been corrected to 'backend/routes/adminRoutes'.
app.use('/api', adminRoutes);

// Export the Express app as the Vercel serverless function.
// Vercel handles the server start-up, so there is no app.listen().
module.exports = app;