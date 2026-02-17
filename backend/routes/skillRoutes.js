const express = require('express');
const router = express.Router();
const {
    getSkills,
    createSkill,
    updateSkill,
    deleteSkill
} = require('../controllers/skillController');
const authMiddleware = require('../middleware/authMiddleware');

router.route('/')
    .get(getSkills)
    .post(authMiddleware, createSkill);

router.route('/:id')
    .put(authMiddleware, updateSkill)
    .delete(authMiddleware, deleteSkill);

module.exports = router;