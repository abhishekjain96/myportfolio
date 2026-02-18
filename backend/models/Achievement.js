const mongoose = require('mongoose');

const achievementSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    details: {
        type: String,
        default: ''
    },
    subTitle: {
        type: String,
        default: ''
    },
    icon: {
        type: String,
        default: 'trophy'
    },
    color: {
        type: String,
        default: 'gold'
    },
    year: {
        type: String,
        default: ''
    },
    image: {
        type: String
    },
    badges: [{ type: String }],
    bullets: [{ type: String }],
    stats: [{
        value: String,
        label: String
    }],
    order: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Achievement', achievementSchema);