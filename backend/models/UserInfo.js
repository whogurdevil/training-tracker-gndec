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
  skills: { type: [String] },
  location: { type: String },
  resume: String,
});

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  gender: { type: String, required: true },
  role: { type: String, default: "user" },
  isVerified: { type: Boolean, default: false },
  // Embedding userProfileSchema
  userProfile: { type: userProfileSchema }
});

const UserInfo = mongoose.model('UserInfo', userSchema);
const UserProfile = mongoose.model('UserProfile', userProfileSchema)
module.exports.UserInfo = UserInfo;
module.exports.UserProfile = UserProfile;
