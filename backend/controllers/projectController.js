const Project = require('../models/Project');

// @desc    Get all projects
// @route   GET /api/projects
// @access  Public
const getProjects = async (req, res) => {
    try {
        const projects = await Project.find().sort('-order');
        res.json(projects);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create project
// @route   POST /api/projects
// @access  Private
const createProject = async (req, res) => {
    try {
        const project = new Project(req.body);
        await project.save();
        res.status(201).json(project);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private
const updateProject = async (req, res) => {
    try {
        const project = await Project.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }
        
        res.json(project);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private
const deleteProject = async (req, res) => {
    try {
        const project = await Project.findByIdAndDelete(req.params.id);
        
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }
        
        res.json({ message: 'Project deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getProjects,
    createProject,
    updateProject,
    deleteProject
};