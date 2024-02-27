const express = require('express');
const router = express.Router();
const userInfo = require('../../models/User');
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt');
const JWT_Token = process.env.JWT_TOKEN;
router.use(express.json());

router.post('/signup',
  body('name', 'name should have a minimum length of 3').isLength({ min: 3 }),
  body('password', 'password should have a minimum length of 5').isLength({ min: 5 }),
  body('email').custom((value) => {
    // Check if the email ends with "@gndec.ac.in"
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    if (!emailRegex.test(value) || !value.endsWith('@gmail.com')) {
      throw new Error('Invalid email format or email must end with @gmail.com');
    }
    return true; // Return true if validation passes
  }),
  body('phone').custom((value) => {
    // Check if the phone number is exactly 10 digits and doesn't start with "0"
    if (!/^[1-9]\d{9}$/.test(value)) {
      throw new Error('Invalid phone number. It should be exactly 10 digits and should not start with "0"');
    }
    return true; // Return true if validation passes
  }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: "Invalid Credentials", errors: errors.array() });
    }
    const validateUser = await userInfo.findOne({ email: req.body.email });
    const validatephone = await userInfo.findOne({ phone: req.body.phone });
    if (validateUser) {
      return res.status(400).json({ success: false, message: 'email id already exist' });
    }
    if (validatephone) {
      return res.status(400).json({ success: false, message: 'phone number already exist' });
    }
    try {
      const myPlaintextPassword = req.body.password;
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(myPlaintextPassword, salt);
      const { name, email, phone, gender, progressValue } = req.body;
      // Find the maximum jersey number assigned
      const userDetail = await userInfo.create({
        name: name,
        email: email,
        password: hash,
        phone: phone,
        gender: gender,
        isVerified: false,
      });
      await userDetail.save();
      // Instead of returning just progressValue, return the entire userDetail object
      return res.status(201).json({ success: true, userDetail });
    } catch (error) {
      res.status(400).json({ success: false, message: error.keyValue });
    }
  }
);
router.post('/login', body('password', 'Password should have a minimum length of 5').isLength({ min: 5 }), body('email').custom((value) => {
  // Check if the email ends with "@gndec.ac.in"
  const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
  if (!emailRegex.test(value) || !value.endsWith('@gmail.com')) {
    throw new Error('Invalid email format or email must end with @gmail.com');
  }
  return true; // Return true if validation passes
}), async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, message: "Invalid Credentials", errors: errors.array() });
  }

  const { email, password } = req.body;
  const user = await userInfo.findOne({ email });

  if (!user) {
    return res.status(400).json({ success: false, message: "User Not found" });
  }

  const passwordCompare = await bcrypt.compare(password, user.password);
  if (passwordCompare) {
    let roleSpecificData;

    if (user.role === 'user') {
      roleSpecificData = {
        id: user.id,
        role: 'user'
      };
    } else if (user.role === 'admin') {
      roleSpecificData = {
        id: user.id,
        role: 'admin'
      };
    }

    const data = {
      user: roleSpecificData
    };

    if (user.isVerified === true) {
      const authToken = jwt.sign(data, JWT_Token);
      return res.status(200).json({ success: true, authtoken: authToken });
    } else {
      return res.status(200).json({ success: true, message: "verify" });
    }
  }

  return res.status(400).json({ success: false, message: "Please try to login with the correct credentials" });
});


module.exports = router;