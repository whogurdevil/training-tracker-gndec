const express = require('express');
const placementData = require('../../models/UserInfo').PlacementData;
const SignUpdata = require('../../models/UserInfo').SignUp;
const router = express.Router();
const fetchuser = require('../../middleware/fetchUser');
const isAdmin = require('../../middleware/isAdmin');

// Route to create or update a user's placement data

router.post('/', async (req, res) => {
    try {
        const { company, placementType, highStudy, appointmentNo, appointmentLetter, package, isPlaced, gateStatus, gateCertificate, designation, appointmentDate, highStudyplace } = req.body.formData;
        const urn = req.body.urn;
        let userInfo = await SignUpdata.findOne({ urn: urn });

        if (!userInfo) {
            return res.status(404).json({ message: 'UserInfo not found' });
        }


        // Create new placement data
        userInfo.placementData = new placementData({
            company,
            placementType,
            highStudy,
            appointmentNo,
            appointmentLetter,
            package,
            isPlaced,
            gateStatus,
            gateCertificate,
            appointmentDate,
            designation,
            highStudyplace
        });


        // console.log(await userInfo.save())
        // Save the updated user info
        const savedUserInfo = await userInfo.save();

        // console.log(savedUserInfo)
        // Respond with the saved userInfo
        res.status(201).json({ success: true, data: savedUserInfo });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Route to update lock status
router.post('/updatelock', fetchuser, isAdmin, async (req, res) => {
    try {
        const { urn, lock } = req.body;

        const userData = await SignUpdata.findOneAndUpdate(
            { urn: urn },
            { 'placementData.lock': lock },
            { new: true }
        );

        if (!userData) {
            return res.status(404).json({ message: 'User data not found' });
        }

        // Respond with the updated user data
        res.status(200).json({ success: true, data: userData });
    } catch (error) {
        res.status(400).json({ message: error.message });
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
            user.placementData.lock = true; // Set lock status to true (or whatever your logic is)
            return await user.save();
        }));

        // Respond with the updated user data
        res.status(200).json({ success: true, data: updatedUsers });
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
            user.placementData.lock = false; // Set lock status to true (or whatever your logic is)
            return await user.save();
        }));

        // Respond with the updated user data
        res.status(200).json({ success: true, data: updatedUsers });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});
// Route to get user's placement data
// Route to get user's placement data
router.get('/:urn', async (req, res) => {
    try {
        const urn = req.params.urn;
        const userInfo = await SignUpdata.findOne({ urn: urn });
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
