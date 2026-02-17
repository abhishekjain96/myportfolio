const Achievement = require('../models/Achievement');

// @desc    Get all achievements
// @route   GET /api/achievements
// @access  Public
const getAchievements = async (req, res) => {
    try {
        const achievements = await Achievement.find().sort('order');
        res.json(achievements);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create achievement
// @route   POST /api/achievements
// @access  Private
const createAchievement = async (req, res) => {
    try {
        const achievement = new Achievement(req.body);
        await achievement.save();
        res.status(201).json(achievement);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update achievement
// @route   PUT /api/achievements/:id
// @access  Private
const updateAchievement = async (req, res) => {
    try {
        const achievement = await Achievement.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        
        if (!achievement) {
            return res.status(404).json({ message: 'Achievement not found' });
        }
        
        res.json(achievement);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete achievement
// @route   DELETE /api/achievements/:id
// @access  Private
const deleteAchievement = async (req, res) => {
    try {
        const achievement = await Achievement.findByIdAndDelete(req.params.id);
        
        if (!achievement) {
            return res.status(404).json({ message: 'Achievement not found' });
        }
        
        res.json({ message: 'Achievement deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getAchievements,
    createAchievement,
    updateAchievement,
    deleteAchievement
};