// api/index.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const adminRoutes = require('../routes/adminRoutes');
const path = require('path');

const app = express();

// Security fix: Restrict CORS to only your Vercel frontend domain.
const corsOptions = {
    origin: 'https://teamtitans06-fwpi.vercel.app',
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Login route
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

// API Routes
app.use('/api', adminRoutes);

// Export the Express app as a Vercel serverless function
module.exports = app;