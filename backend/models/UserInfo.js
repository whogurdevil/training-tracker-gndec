const mongoose = require('mongoose');

const userInfoSchema = new mongoose.Schema({
  Name: { type: String },
  contact: {
    type: String,
    match: /^[0-9]{10}$/ // Regex for 10-digit numeric contact number
  },
  crn: { type: Number },
  branch: { type: String, default: 'Computer Science & Enginnering' },
  section: { type: String }, //section
  mentor: { type: String }, //mentor
  gender: { type: String },
  batch: { type: String },
  admissionType: { type: String } //leet or non leet
});

const tr101Schema = new mongoose.Schema({
  organization: { type: String }, //to save org name
  technology: { type: [String] },
  certificate: String,
  projectName: { type: String },
  type: { type: String },
  lock: { type: Boolean, default: false }
});
const tr102Schema = new mongoose.Schema({
  organization: { type: String }, //to save org name
  technology: { type: [String] },
  certificate: String,
  projectName: { type: String },
  type: { type: String },
  lock: { type: Boolean, default: false }
});
const tr103Schema = new mongoose.Schema({
  organization: { type: String }, //to save org name
  technology: { type: [String] },
  certificate: String,
  projectName: { type: String },
  type: { type: String },
  lock: { type: Boolean, default: false }
});
const tr104Schema = new mongoose.Schema({
  organization: { type: String }, //to save org name
  technology: { type: [String] },
  certificate: String,
  projectName: { type: String },
  type: { type: String },
  lock: { type: Boolean, default: false }
});

const placementDataSchema = new mongoose.Schema({
  isPlaced:{ type: Boolean, default: false },//to open placement data if isPlaced
  company: { type: String },
  placementType: { type: String }, //oncampus, offcampus
  appointmentNo: { type: Number },
  appointmentLetter: String,
  package: { type: Number },
  highStudy: { type: String }, //yes no enterprenuership
  lock: { type: Boolean, default: false }
});

const SignupSchema = new mongoose.Schema({
  urn: { type: Number, required: true, unique: true, match: /^[0-9]{7}$/ },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    default: 'user'
  },
  isVerified: { type: Boolean, default: false },
  userInfo: { type: userInfoSchema },
  tr101: { type: tr101Schema },
  tr102: { type: tr102Schema },
  tr103: { type: tr103Schema },
  tr104: { type: tr104Schema },
  placementData: { type: placementDataSchema },
});

const UserInfo = mongoose.model('UserInfo', userInfoSchema);
const Tr101 = mongoose.model('Tr101', tr101Schema);
const Tr102 = mongoose.model('Tr102', tr102Schema);
const Tr103 = mongoose.model('Tr103', tr103Schema);
const Tr104 = mongoose.model('Tr104', tr104Schema);
const PlacementData = mongoose.model('PlacementData', placementDataSchema);
const SignUp = mongoose.model('Signup', SignupSchema);

module.exports = { SignUp, UserInfo, Tr101, Tr102, Tr103, Tr104, PlacementData }