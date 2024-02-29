const mongoose = require('mongoose');

const userInfoSchema = new mongoose.Schema({
  Name: { type: String },
  contact: {
    type: String,
    match: /^[0-9]{10}$/ // Regex for 10-digit numeric contact number
  },
  crn: { type: Number, unique: true, match: /^[0-9]{7}$/ },
  branch: { type: String, default: 'Computer Science & Enginnering' },
  gender: { type: String },
  batch: { type: String },
  admissionType: {type: String} //leet or non leet
});

const tr101Schema = new mongoose.Schema({
  technology:{ type: [String] },
  certificate: String,
  projectName: { type: String },
  type: { type: String},
});
const tr102Schema = new mongoose.Schema({
  technology:{ type: [String] },
  certificate: String,
  projectName: { type: String },
  type: { type: String},
});
const tr103Schema = new mongoose.Schema({
  technology:{ type: [String] },
  certificate: String,
  projectName: { type: String },
  type: { type: String},
});
const tr104Schema = new mongoose.Schema({
  technology:{ type: [String] },
  certificate: String,
  projectName: { type: String },
  type: { type: String},
});

const placementDataSchema = new mongoose.Schema({
  company : {type: String},
  appointmentDate : {type: Date},
  appointmentLetter : String,
  package : {type: Number}
});

const SignupSchema = new mongoose.Schema({
  urn: { type: Number, required: true, unique: true, match: /^[0-9]{7}$/ },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
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

module.exports={SignUp,UserInfo,Tr101,Tr102,Tr103,Tr104,PlacementData}

