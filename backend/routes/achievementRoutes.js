const express = require('express');
const router = express.Router();
const {
    getAchievements,
    createAchievement,
    updateAchievement,
    deleteAchievement
} = require('../controllers/achievementController');
const authMiddleware = require('../middleware/authMiddleware');

router.route('/')
    .get(getAchievements)
    .post(authMiddleware, createAchievement);

router.route('/:id')
    .put(authMiddleware, updateAchievement)
    .delete(authMiddleware, deleteAchievement);

module.exports = router;