const express = require('express');
const placementData = require('../../models/UserInfo').PlacementData;
const SignUpdata = require('../../models/UserInfo').SignUp;
const router = express.Router();
const fetchuser = require('../../middleware/fetchUser');
const isAdmin = require('../../middleware/isAdmin');

// Route to create or update a user's placement data
router.post('/', fetchuser, async (req, res) => {
    try {
        const { formData, crn } = req.body;
        let userInfo = await SignUpdata.findOne({ crn: crn });

        if (!userInfo) {
            return res.status(404).json({ message: 'UserInfo not found' });
        }

        // Reset specific fields based on conditions
        if (formData.isPlaced !== true) {
            formData.company = '';
            formData.placementType = '';
            formData.appointmentNo = '';
            formData.appointmentLetter = null;
            formData.package = '';
            formData.designation = '';
            formData.appointmentDate = '';
        }

        if (formData.highStudy !== true) {
            formData.highStudyplace = '';
        }

        if (formData.gateStatus !== true) {
            formData.gateCertificate = '';
        }

        // Create new placement data
        const newPlacementData = new placementData(formData);

        // Assign the new placement data to user's placementData property
        userInfo.placementData = newPlacementData;

        // Save the updated user information
        const savedUserInfo = await userInfo.save();

        // Respond with the saved userInfo
        res.status(201).json({ success: true, data: savedUserInfo });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});


// Route to update lock status
router.post('/updatelock', fetchuser, isAdmin, async (req, res) => {
    try {
        const { crn, lock } = req.body;

        const userData = await SignUpdata.findOneAndUpdate(
            { crn: crn },
            { 'placementData.lock': lock },
            { new: true }
        );

        if (!userData) {
            return res.status(404).json({ success: false, message: 'User data not found' });
        }

        // Respond with the updated user data
        res.status(200).json({ success: true });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

router.post('/verifyall', fetchuser, isAdmin, async (req, res) => {
    try {
        // Get all users with the role "user"
        const usersToUpdate = await SignUpdata.find({ role: 'user' });

        if (!usersToUpdate) {
            return res.status(404).json({ message: 'No users found' });
        }

        // Update the lock status for all users
        const updatedUsers = await Promise.all(usersToUpdate.map(async (user) => {
            try {
                if (user.placementData) {
                    user.placementData.lock = true; // Set lock status to true
                    await user.save();
                } 
                return user;
            } catch (err) {
                console.error(`Error updating user with CRN ${user.crn}: ${err.message}`);
                throw err; // Propagate error to stop execution
            }
        }));

        // Respond with the updated user data
        res.status(200).json({ success: true });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});
router.post('/unverifyall', fetchuser, isAdmin, async (req, res) => {
    try {
        // Get all users with the role "user"
        const usersToUpdate = await SignUpdata.find({ role: 'user' });

        if (!usersToUpdate) {
            return res.status(404).json({ message: 'No users found' });
        }

        // Update the lock status for all users
        const updatedUsers = await Promise.all(usersToUpdate.map(async (user) => {
            try {
                if (user.placementData) {
                    user.placementData.lock = false; // Set lock status to true
                    await user.save();
                } 
                return user;
            } catch (err) {
                console.error(`Error updating user with CRN ${user.crn}: ${err.message}`);
                throw err; // Propagate error to stop execution
            }
        }));

        // Respond with the updated user data
        res.status(200).json({ success: true });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});
// Route to get user's placement data
// Route to get user's placement data
router.get('/:crn', fetchuser, async (req, res) => {
    try {
        const crn = req.params.crn;
        const userInfo = await SignUpdata.findOne({ crn: crn });
        if (!userInfo) {
            return res.status(404).json({ message: 'UserInfo not found' });
        }

        // Prepare placement data to ensure all required fields are present
        let placementData = userInfo.placementData || {};
        if (!placementData) {
            placementData = {
                company: null,
                placementType: null,
                highStudy: '', // Ensure highStudy field exists
                appointmentNo: null,
                appointmentLetter: null,
                package: null,
                isPlaced: false,

            };
        }

        // Respond with the user's placement data
        res.status(200).json({ success: true, data: placementData });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
