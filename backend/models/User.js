const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  // Other fields in the schema
  name: { type: String, required: true },
  email: { type: String, required: true, unique:true },
  password: { type: String, required: true },
  phone: { type: String, required: true, unique:true },
  gender: { type: String, required: true }, // Ensure "required: true" for the "gender" field
  role:{type: String, default:"user"},
  isVerified:{ type: Boolean, default:false },
});
const userInfo = mongoose.model('userSchema', userSchema);

module.exports = userInfo;