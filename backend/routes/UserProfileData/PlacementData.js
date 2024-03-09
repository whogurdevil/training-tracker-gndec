const express = require('express');
const placementData = require('../../models/UserInfo').PlacementData;
const SignUpdata = require('../../models/UserInfo').SignUp;
const router = express.Router();

// Route to create or update a user's placement data
router.post('/', async (req, res) => {
    try {
        const { company, placementType, highStudy, appointmentNo, appointmentLetter, package, isPlaced } = req.body.formData;
        const urn = req.body.urn;
        console.log(highStudy)
        let userInfo = await SignUpdata.findOne({ urn: urn });

        if (!userInfo) {
            return res.status(404).json({ message: 'UserInfo not found' });
        }

        // Update or create placement data based on existence
        if (userInfo.placementData) {
            // Update existing placement data
            userInfo.placementData.company = company;
            userInfo.placementData.placementType = placementType;
            userInfo.placementData.highStudy = highStudy;
            userInfo.placementData.appointmentNo = appointmentNo;
            userInfo.placementData.appointmentLetter = appointmentLetter;
            userInfo.placementData.package = package;
            userInfo.placementData.isPlaced = isPlaced;
        } else {
            // Create new placement data
            userInfo.placementData = new placementData({
                company,
                placementType,
                highStudy,
                appointmentNo,
                appointmentLetter,
                package,
                isPlaced
            });
        }
        

        // Save the updated user info
        const savedUserInfo = await userInfo.save();
        

        // Respond with the saved userInfo
        res.status(201).json({ success: true, data: savedUserInfo });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Route to update lock status
router.post('/updatelock', async (req, res) => {
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

// Route to get user's placement data
// Route to get user's placement data
router.get('/:urn', async (req, res) => {
    try {
        const urn = req.params.urn;
        const userInfo = await SignUpdata.findOne({ urn: urn }).populate('tr101');

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
                isPlaced: false
            };
        }

        // Respond with the user's placement data
        res.status(200).json({ success: true, data: placementData });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
