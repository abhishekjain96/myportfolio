const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        default: 'ABHISHEK JAIN'
    },
    title: {
        type: String,
        required: true,
        default: 'SOFTWARE DEVELOPER'
    },
    bio: {
        type: String,
        required: true,
        default: 'Building innovative solutions with code 🚀'
    },
    about: {
        type: String,
        required: true,
        default: 'Passionate about creating elegant solutions to complex problems.'
    },
    profilePhoto: {
        type: String,
        default: 'abhishek.png'
    },
    aboutPhoto: {
        type: String,
        default: 'abhishek.png'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Profile', profileSchema);