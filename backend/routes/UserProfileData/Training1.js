const express = require('express');
const Tr101 = require('../../models/UserInfo').Tr101;
const SignUpdata = require('../../models/UserInfo').SignUp;
const router = express.Router();

// Route to create a new user profile
router.post('/', async (req, res) => {
    try {
        const { urn, technology, projectName, type,certificate } = req.body;
       
        const userInfo = await SignUpdata.findOne({ urn: urn });
        
        if (!userInfo) {
            return res.status(404).json({ message: 'UserInfo not found' });
        }

        // Create a new user profile object
        const TR101 = new Tr101({
           technology,
           projectName,
           type,
           certificate
        });

        userInfo.tr101 = TR101;

        const savedUserInfo = await userInfo.save();
        console.log(savedUserInfo);

        // Respond with the saved userInfo
        res.status(201).json({ success: true, data: savedUserInfo });;
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
