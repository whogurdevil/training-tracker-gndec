const express = require('express');
const UserProfile = require('../../models/UserProfile');
const router = express.Router();

// Route to create a new user profile
router.post('/', async (req, res) => {
    try {
     
        const { firstName, lastName, email, contact, experience, education, skills, location, resume } = req.body;
        
        // Check if all required fields are provided
    

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

        // Save the user profile to the database
        const savedUserProfile = await userProfile.save();

        // Respond with the saved user profile
        res.status(201).json(savedUserProfile);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Route to get all user profiles
router.get('/', async (req, res) => {
    try {
        const userProfiles = await UserProfile.find();
        res.status(200).json(userProfiles);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Route to get a user profile by ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const userProfile = await UserProfile.findById(id);
        if (!userProfile) {
            return res.status(404).json({ message: 'User profile not found' });
        }
        res.status(200).json(userProfile);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Route to delete a user profile by ID
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const deletedUserProfile = await UserProfile.findByIdAndDelete(id);
        if (!deletedUserProfile) {
            return res.status(404).json({ message: 'User profile not found' });
        }
        res.status(200).json({ message: 'User profile deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Add more routes as needed for updating, deleting, etc.

module.exports = router;
