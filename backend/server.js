const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const rateLimit = require('express-rate-limit');

// Load env vars
dotenv.config();

// Connect to database
const connectDB = require('./config/db');
connectDB();

// Route files
const profileRoutes = require('./routes/profileRoutes');
const skillRoutes = require('./routes/skillRoutes');
const projectRoutes = require('./routes/projectRoutes');
const achievementRoutes = require('./routes/achievementRoutes');
const certificateRoutes = require('./routes/certificateRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();

// Body parser
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Enable CORS - allow auth headers for verify request
app.use(cors({
    origin: ['http://localhost:5500', 'http://127.0.0.1:5500', 'http://localhost:3000'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'x-auth-token']
}));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Rate limiting
const limiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Mount routers
app.use('/api/profile', profileRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/achievements', achievementRoutes);
app.use('/api/certificates', certificateRoutes);
app.use('/api/auth', authRoutes);

// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err.message : {}
    });
});

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`);
    server.close(() => process.exit(1));
});