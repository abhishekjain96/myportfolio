const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    fullDescription: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    tech: [{
        type: String
    }],
    features: [{
        type: String
    }],
    liveUrl: {
        type: String,
        default: '#'
    },
    codeUrl: {
        type: String,
        default: '#'
    },
    order: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Project', projectSchema);