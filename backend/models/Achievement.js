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
        required: true
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
        required: true
    },
    image: {
        type: String
    },
    order: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Achievement', achievementSchema);