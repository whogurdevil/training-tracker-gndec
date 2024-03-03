const express = require('express');
const Tr102 = require('../../models/UserInfo').Tr102;
const SignUpdata = require('../../models/UserInfo').SignUp;
const router = express.Router();

// Route to create a new user profile
router.post('/', async (req, res) => {
    try {
        const { technology, projectName, type, certificate } = req.body.formData;
        const urn = req.body.urn

        const userInfo = await SignUpdata.findOne({ urn: urn });

        if (!userInfo) {
            return res.status(404).json({ message: 'UserInfo not found' });
        }

        // Create a new user profile object
        const TR102 = new Tr102({
            technology,
            projectName,
            type,
            certificate
        });

        userInfo.tr102 = TR102;

        const savedUserInfo = await userInfo.save();
        console.log(savedUserInfo);

        // Respond with the saved userInfo
        res.status(201).json({ success: true, data: savedUserInfo });;
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});
router.post('/updatelock', async (req, res) => {
    try {
        const { urn, lock } = req.body;
        const trainingField = "tr102.lock";
        console.log(req.body)
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
        res.status(200).json({ success: true, data: userInfo.tr102 });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
