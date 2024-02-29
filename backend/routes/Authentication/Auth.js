const express = require('express');
const router = express.Router();
const { SignUp } = require('../../models/UserInfo');
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt');
const JWT_Token = process.env.JWT_TOKEN;
router.use(express.json());

router.post('/signup',
  body('password', 'password should have a minimum length of 5').isLength({ min: 5 }),
  body('email').custom((value) => {
    console.log('.......in regex......')
    // Check if the email ends with "@gndec.ac.in"
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    // if (!emailRegex.test(value) || !value.endsWith('@gndec.ac.in')) {
      if (!emailRegex.test(value) ) {
      throw new Error('Invalid email format or not a gndec mail');
    }
    return true; // Return true if validation passes
  }),
  body('urn').custom((value) => {
    // Check if the phone number is exactly 10 digits and doesn't start with "0"  
    if (!/^\d{7}$/.test(value)) {
      throw new Error('Invalid urn. It should be exactly 7 digits and should not start with "0"');
    }
    return true; // Return true if validation passes
  }),
  async (req, res) => {
    console.log('.......in q......')
    console.log(req.body)
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: "Invalid Credentials", errors: errors.array() });
    }
    const validateUser = await SignUp.findOne({ email: req.body.email });
    const validateUrn = await SignUp.findOne({ urn: req.body.urn });
    if (validateUser) {
      return res.status(400).json({ success: false, message: 'email id already exist' });
    }
    if (validateUrn) {
      return res.status(400).json({ success: false, message: 'URN already exist' });
    }
    try {
      const myPlaintextPassword = req.body.password;
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(myPlaintextPassword, salt);
      const { urn, email } = req.body;

      try {
        const signup = await SignUp.create({
          urn: urn,
          email: email,
          password: hash,
          isVerified: false,
          userInfo: {crn:urn},
          tr101: {},
          tr102: {},
          tr103: {},
          tr104: {},
          placementData: {},
        });
        await signup.save();
        console.log(signup)
      } catch (error) {
        console.error('Error creating document:', error);
      }

      // Instead of returning just progressVlue, return the entire userDetail object

      return res.status(201).json({ success: true, message: 'successfully signup' });
    } catch (error) {
      res.status(400).json({ success: false, message: error.keyValue });
    }
  }
);

router.post('/login', body('password', 'Password should have a minimum length of 5').isLength({ min: 5 }), body('urn').custom((value) => {
  if (!/^\d{7}$/.test(value)) {
    console.log('....err in urn')
    throw new Error('Invalid urn. It should be exactly 7 digits and should not start with "0"');
  }
  return true; // Return true if validation passes
}), async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, message: "Invalid Credentials", errors: errors.array() });
  }

  const { urn, password } = req.body;
  const user = await SignUp.findOne({ urn });

  if (!user) {
    return res.status(400).json({ success: false, message: "User Not found" });
  }

  const passwordCompare = await bcrypt.compare(password, user.password);
  if (passwordCompare) {
    let roleSpecificData;


    if (user.role === 'user') {
      roleSpecificData = {
        id: user.id,
        role: 'user',
      };
    } else if (user.role === 'admin') {
      roleSpecificData = {
        id: user.id,
        role: 'admin',
      };
    }

    const data = {
      urn: user.urn,
      user:roleSpecificData
    };

    if (user.isVerified === true) {
      const authToken = jwt.sign(data, JWT_Token);
      return res.status(200).json({ success: true, authtoken: authToken, body: data });
    } else {
      return res.status(200).json({ success: true, message: "verify" });
    }
  }

  return res.status(400).json({ success: false, message: "Please try to login with the correct credentials" });
});


module.exports = router;