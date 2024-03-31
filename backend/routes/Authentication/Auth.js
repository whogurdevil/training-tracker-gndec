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
    // Check if the email ends with "@gndec.ac.in"
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    // if (!emailRegex.test(value) || !value.endsWith('@gndec.ac.in')) {
    if (!emailRegex.test(value)) {
      throw new Error('Invalid email format or not a gndec mail');
    }
    return true; // Return true if validation passes
  }),
  body('crn').custom((value) => {
    // Check if the urn is exactly 7 digits or in the format "Tr-xxx"
    if (!/^\d{7}$|^Tr\d{3}$/.test(value)) {
      throw new Error('Invalid crn. It should be exactly 7 digits or in the format "Tr-xxx"');
    }
    return true; // Return true if validation passes
  }),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // console.log(errors.array());
      return res.status(400).json({ success: false, message: "Invalid Credentials", errors: errors.array() });
    }
  //  console.log("Hello")
    const validateUser = await SignUp.findOne({ email: req.body.email });
    const validateCrn = await SignUp.findOne({ crn: req.body.crn });
    if (validateUser) {
      return res.status(400).json({ success: false, message: 'Email id already exist' });
    }
    if (validateCrn) {
      return res.status(400).json({ success: false, message: 'CRN already exist' });
    }
    // console.log("hello")
    try {
      const myPlaintextPassword = req.body.password;
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(myPlaintextPassword, salt);
      const { crn, email } = req.body;
      // console.log("ji")

      try {
        const signup = await SignUp.create({
          crn: crn,
          email: email,
          password: hash,
          isVerified: false,
          userInfo: { urn: crn },
          tr101: {},
          tr102: {},
          tr103: {},
          tr104: {},
          placementData: {},
        });
        await signup.save();
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

router.post('/login', body('password', 'Password should have a minimum length of 5').isLength({ min: 5 }), body('crn').custom((value) => {
  if (!/^\d{7}$|^Tr\d{3}$/.test(value)) {
    throw new Error('Invalid crn. It should be exactly 7 digits and should not start with "0"');
  }
  return true; // Return true if validation passes
}), async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, message: "Invalid Credentials", errors: errors.array() });
  }

  const { crn, password } = req.body;
  const user = await SignUp.findOne({ crn });

  if (!user) {
    return res.status(400).json({ success: false, message: "User Not found" });
  }

  const passwordCompare = await bcrypt.compare(password, user.password);
  if (passwordCompare) {
    let roleSpecificData;


    if (user.role === 'superadmin') {
      roleSpecificData = {
        id: user.id,
        role: 'superadmin',
      };
    } else if (user.role === 'admin') {
      roleSpecificData = {
        id: user.id,
        role: 'admin',
      };
    }
    else {
      roleSpecificData = {
        id: user.id,
        role: 'user',
      };
    }

    const data = {
      crn: user.crn,
      user: roleSpecificData
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