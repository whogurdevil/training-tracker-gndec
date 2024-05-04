const mongoose = require('mongoose');

const userInfoSchema = new mongoose.Schema({
  Name: { type: String },
  contact: {
    type: String,
    match: /^[0-9]{10}$/ 
  },
  urn: { type: Number },
  branch: { type: String, default: 'Computer Science & Enginnering' },
  section: { type: String }, 
  mentor: { type: String }, 
  gender: { type: String },
  batch: { type: String },
  admissionType: { type: String } ,
  mother: { type: String }, //input
  father: { type: String },//input
  personalMail: { type: String }//input
});

const tr101Schema = new mongoose.Schema({
  organization: { type: String }, 
  technology: { type: [String] },
  certificate: String,
  projectName: { type: String },
  organizationType:{type:String}, //dropdown
  type: { type: String },
  lock: { type: Boolean, default: false }
});
const tr102Schema = new mongoose.Schema({
  organization: { type: String }, 
  technology: { type: [String] },
  certificate: String,
  organizationType: { type: String }, //dropdown
  projectName: { type: String },
  type: { type: String },
  lock: { type: Boolean, default: false }
});
const tr103Schema = new mongoose.Schema({
  organization: { type: String }, 
  technology: { type: [String] },
  organizationType: { type: String }, //dropdown
  certificate: String,
  projectName: { type: String },
  type: { type: String },
  lock: { type: Boolean, default: false }
});
const tr104Schema = new mongoose.Schema({
  organization: { type: String }, 
  technology: { type: [String] },
  organizationType: { type: String }, //dropdown
  certificate: String,
  projectName: { type: String },
  type: { type: String },
  lock: { type: Boolean, default: false }
});

const placementDataSchema = new mongoose.Schema({
  isPlaced:{ type: Boolean, default: false },
  company: { type: String },
  placementType: { type: String }, 
  appointmentNo: { type: String },
  appointmentLetter: String,
  appointmentDate: {
    type: String,// Example: MM-DD-YYYY
  },
  designation: { type: String }, //input
  package: { type: Number },
  highStudy: { type: Boolean, default: false }, 
  highStudyplace: { type: String }, 
  gateStatus: { type: Boolean, default: false }, //yes no enterprenuership
  gateCertificate:{type:String}, //certificate
  lock: { type: Boolean, default: false }
});

const SignupSchema = new mongoose.Schema({
  crn: { type: String, required: true, unique: true },
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