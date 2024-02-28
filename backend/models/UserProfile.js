const mongoose = require('mongoose');

const userProfileSchema = new mongoose.Schema({
    firstName: { type: String },
    lastName: { type: String },
    email: {
        type: String,
        match: /^\S+@\S+\.\S+$/ // Regex for email validation
    },
    contact: {
        type: String,
        match: /^[0-9]{10}$/ // Regex for 10-digit numeric contact number
    },
    experience: { type: String },
    education: { type: String },
    skills: { type: [String]},
    location: { type: String},
    resume: String,
});

const UserProfile = mongoose.model('UserProfile', userProfileSchema);

module.exports = UserProfile;
