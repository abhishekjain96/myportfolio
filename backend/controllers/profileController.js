const Profile = require('../models/Profile');

// @desc    Get profile
// @route   GET /api/profile
// @access  Public
const getProfile = async (req, res) => {
    try {
        let profile = await Profile.findOne();
        
        // If no profile exists, create default one
        if (!profile) {
            profile = await Profile.create({});
        }
        
        res.json(profile);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update profile
// @route   PUT /api/profile
// @access  Private
const updateProfile = async (req, res) => {
    try {
        let profile = await Profile.findOne();
        
        if (!profile) {
            profile = new Profile(req.body);
        } else {
            Object.assign(profile, req.body);
        }
        
        await profile.save();
        res.json(profile);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getProfile,
    updateProfile
};