const express = require('express');
const Tr101 = require('../../models/UserInfo').Tr101;
const SignUpdata = require('../../models/UserInfo').SignUp;
const router = express.Router();
const fetchuser = require('../../middleware/fetchUser');
const isAdmin = require('../../middleware/isAdmin');
// Route to create a new user profile
router.post('/', async (req, res) => {
    try {
        const { organization, technology, projectName, type, certificate, organizationType } = req.body.formData;
        const urn = req.body.urn
        const userInfo = await SignUpdata.findOne({ urn: urn });


        if (!userInfo) {
            return res.status(404).json({ message: 'UserInfo not found' });
        }
        if (userInfo.tr101.lock) {
            return res.status(404).json({ message: 'You are already locked not play with me buddy' });
        }

        // Create a new user profile object
        const TR101 = new Tr101({
            organization,
            technology,
            projectName,
            type,
            certificate,
            organizationType
        });

        userInfo.tr101 = TR101;

        const savedUserInfo = await userInfo.save();

        // Respond with the saved userInfo
        res.status(201).json({ success: true, data: savedUserInfo });;
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});
router.post('/updatelock', fetchuser,isAdmin, async (req, res) => {
    try {
        const { urn, lock } = req.body;
        const trainingField = "tr101.lock";
        userData = await SignUpdata.findOneAndUpdate(
            { urn: urn },
            { [trainingField]: lock },
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
router.get('/:urn', async (req, res) => {
    try {
        const urn = req.params.urn;
        const userInfo = await SignUpdata.findOne({ urn: urn }).populate('tr101');

        if (!userInfo) {
            return res.status(404).json({ message: 'UserInfo not found' });
        }

        // Respond with the user information
        res.status(200).json({ success: true, data: userInfo.tr101 });
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
            user.tr101.lock = true; // Set lock status to true (or whatever your logic is)
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
            user.tr101.lock = false; // Set lock status to true (or whatever your logic is)
            return await user.save();
        }));

        // Respond with the updated user data
        res.status(200).json({ success: true, data: updatedUsers });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
