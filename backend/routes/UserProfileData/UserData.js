const express = require('express');
const UserInfo = require('../../models/UserInfo').UserInfo;
const SignUpdata = require('../../models/UserInfo').SignUp;
const router = express.Router();

// Route to create a new user profile
router.post('/', async (req, res) => {
    try {
        const { Name, contact, crn, branch, batch, gender, admissionType, section, mentor , mother,father,personalMail } = req.body.formData;

        const urn = req.body.urn
        const userInfo = await SignUpdata.findOne({ urn: urn });

        if (!userInfo) {
            return res.status(404).json({ message: 'UserInfo not found' });
        }

        // Create a new user profile object
        const newsignup = new UserInfo({
            Name,
            contact,
            crn,
            section,
            mentor,
            branch,
            batch,
            gender,
            admissionType,
            mother,
            father,
            personalMail
        });
        userInfo.userInfo = newsignup;
        const savedUserInfo = await userInfo.save();

        // Respond with the saved userInfo
        res.status(201).json({ success: true, data: savedUserInfo });;
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});
router.get('/:urn', async (req, res) => {
    try {
        const urn = req.params.urn;
        const userInfo = await SignUpdata.findOne({ urn: urn });
        if (!userInfo) {
            return res.status(404).json({ message: 'UserInfo not found' });
        }

        // Respond with the user information
        res.status(200).json({ success: true, data: userInfo.userInfo });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
