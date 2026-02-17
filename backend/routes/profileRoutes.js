const express = require('express');
const router = express.Router();
const { getProfile, updateProfile } = require('../controllers/profileController');
const authMiddleware = require('../middleware/authMiddleware');

router.route('/')
    .get(getProfile)
    .put(authMiddleware, updateProfile);

module.exports = router;