const express = require('express');
const UserInfo = require('../../models/UserInfo').UserInfo;
const router = express.Router();
const UserProfile=require('../../models/UserInfo').UserProfile;

// Route to create a new user profile
router.post('/', async (req, res) => {
    try {
        const { userId, firstName, lastName, email, contact, experience, education, skills, location, resume } = req.body;

        // Find the UserInfo document by its ID
        console.log("in post.....")
        console.log(userId)
        console.log(req.body)
        const userInfo = await UserInfo.findById( userId );
        console.log(userInfo)
        if (!userInfo) {
            return res.status(404).json({ message: 'UserInfo not found' });
        }

        // Create a new user profile object
        const userProfile = new UserProfile({
            firstName,
            lastName,
            email,
            contact,
            experience,
            education,
            skills,
            location,
            resume
        });

        // Add the userProfile object to the userInfo
        userInfo.userProfile = userProfile;

        // Save the updated userInfo document
        const savedUserInfo = await userInfo.save();

        // Respond with the saved userInfo
        res.status(201).json(savedUserInfo);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Route to get all user profiles
router.get('/', async (req, res) => {
    try {
        // Retrieve all UserInfo documents and populate the userProfile field
        const userInfos = await UserInfo.find().populate('userProfile');
        res.status(200).json(userInfos.map(userInfo => userInfo.userProfile));
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Route to get a user profile by ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        // Find the UserInfo document by its ID and populate the userProfile field
        const userInfo = await UserInfo.findById(id).populate('userProfile');
        if (!userInfo || !userInfo.userProfile) {
            return res.status(404).json({ message: 'User profile not found' });
        }
        res.status(200).json(userInfo.userProfile);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Route to delete a user profile by ID
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        // Find the UserInfo document by its ID and remove the userProfile field
        const userInfo = await UserInfo.findById(id);
        if (!userInfo || !userInfo.userProfile) {
            return res.status(404).json({ message: 'User profile not found' });
        }
        userInfo.userProfile = null;
        await userInfo.save();
        res.status(200).json({ message: 'User profile deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
