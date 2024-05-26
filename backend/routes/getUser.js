const express = require('express');
const router = express.Router();
const SignUp = require('../models/UserInfo').SignUp;
const fetchuser = require('../middleware/fetchUser');
const isAdmin = require('../middleware/isAdmin');


router.get('/getuser/:crn', fetchuser, async (req, res) => {
  try {
    const crn = req.params.crn;
    const user = await SignUp.findOne({ crn: crn })
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    return res.status(200).json({ success: true, data: user });

  }
  catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, message: 'Internal server error occurred' });
  }
});
router.get('/getallusers', fetchuser, isAdmin, async (req, res) => {
  try {
    // Fetch all users
    const users = await SignUp.find({}).select('-password');

    // Return the list of users
    return res.status(200).json({ success: true, data: users });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, message: 'Internal server error occurred' });
  }
});
router.put('/updateUser/:crn', fetchuser, isAdmin, async (req, res) => {
  const { crn } = req.params; // Get CRN from request parameters
  const updatedFormData = req.body.updatedFormData; // Get updated user data from request body
  try {
    // Find user by CRN and update with updatedFormData 
    const updatedUser = await SignUp.findOneAndUpdate(
      { crn: crn }, // Filter condition: find user by CRN
      {
        $set: {
          email: updatedFormData.email,
          crn: updatedFormData.crn,
          isVerified: updatedFormData.isVerified,
          'userInfo.mother': updatedFormData.userInfo.mother,
          'userInfo.Name': updatedFormData.userInfo.Name,
          'userInfo.contact': updatedFormData.userInfo.contact,
          'userInfo.urn': updatedFormData.userInfo.urn,
          'userInfo.branch': updatedFormData.userInfo.branch,
          'userInfo.batch': updatedFormData.userInfo.batch,
          'userInfo.gender': updatedFormData.userInfo.gender,
          'userInfo.admissionType': updatedFormData.userInfo.admissionType,
          'userInfo.mentor': updatedFormData.userInfo.mentor,
          'userInfo.father': updatedFormData.userInfo.father,
          'userInfo.personalMail': updatedFormData.userInfo.personalMail,
          'userInfo.section': updatedFormData.userInfo.section,
        }
      },
      { new: true } // Return updated user data
    );

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    // (updatedUser)
    // User updated successfully
    return res.status(200).json({ success: true, data: updatedUser, message: "Data Updated Successfully" });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ success: false, message: 'Internal server error occurred' });
  }
});
router.get('/getUsersByBatch', fetchuser, isAdmin, async (req, res) => {
  try {
    const { batch, trainingType } = req.query;

    if (!batch || !trainingType) {
      return res.status(400).json({ success: false, message: 'Batch and training type are required' });
    }

    const allowedTrainingTypes = ['tr101', 'tr102', 'tr103', 'tr104', 'placementData'];
    if (!allowedTrainingTypes.includes(trainingType)) {
      return res.status(400).json({ success: false, message: 'Invalid training type' });
    }



    // Fetch users with the specified batch and role 'user'
    const users = await SignUp.find({
      'userInfo.batch': batch,
      role: 'user'
    }).select(`crn email ${trainingType} userInfo`);

    // Return the list of users with the specified training type and user data
    return res.status(200).json({ success: true, data: users });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, message: 'Internal server error occurred' });
  }
});



module.exports = router;