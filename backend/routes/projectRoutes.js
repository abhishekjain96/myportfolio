const express = require('express');
const router = express.Router();
const {
    getProjects,
    createProject,
    updateProject,
    deleteProject
} = require('../controllers/projectController');
const authMiddleware = require('../middleware/authMiddleware');

router.route('/')
    .get(getProjects)
    .post(authMiddleware, createProject);

router.route('/:id')
    .put(authMiddleware, updateProject)
    .delete(authMiddleware, deleteProject);

module.exports = router;