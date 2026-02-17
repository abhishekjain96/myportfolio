const Skill = require('../models/Skill');

// @desc    Get all skills
// @route   GET /api/skills
// @access  Public
const getSkills = async (req, res) => {
    try {
        const skills = await Skill.find().sort('order');
        res.json(skills);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create skill
// @route   POST /api/skills
// @access  Private
const createSkill = async (req, res) => {
    try {
        const skill = new Skill(req.body);
        await skill.save();
        res.status(201).json(skill);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update skill
// @route   PUT /api/skills/:id
// @access  Private
const updateSkill = async (req, res) => {
    try {
        const skill = await Skill.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        
        if (!skill) {
            return res.status(404).json({ message: 'Skill not found' });
        }
        
        res.json(skill);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete skill
// @route   DELETE /api/skills/:id
// @access  Private
const deleteSkill = async (req, res) => {
    try {
        const skill = await Skill.findByIdAndDelete(req.params.id);
        
        if (!skill) {
            return res.status(404).json({ message: 'Skill not found' });
        }
        
        res.json({ message: 'Skill deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getSkills,
    createSkill,
    updateSkill,
    deleteSkill
};