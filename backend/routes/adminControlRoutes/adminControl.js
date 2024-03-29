const express = require('express');
const adminControl = require('../../models/adminControl');
const router = express.Router();
const fetchuser = require('../../middleware/fetchUser');
const isAdmin = require('../../middleware/isAdmin');


router.post('/trainingNames', fetchuser, isAdmin, async (req, res) => {
    try {
        const { Training_No, Training1_name, Training2_name, Training3_name, Training4_name, Placement_name } = req.body;

        // Assuming you have a unique identifier to find the document, for example, its ID
        const filter = { _id: "6601b9b78136ffb755b06ad8" }; // Replace with your actual unique identifier

        const update = {
            Training_No,
            Training1_name,
            Training2_name,
            Training3_name,
            Training4_name,
            Placement_name
        };


        const options = { new: true }; // To return the updated document

        const updatedDocument = await adminControl.findOneAndUpdate(filter, update, options);
        if(!updatedDocument){
            return res.status(404).json({success:false,message:'Not able to update the data'})
        }
        res.status(200).json({ success: true, data: updatedDocument });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.get('/trainingNames',  async (req, res) => {
    try {

        const Training_names = await adminControl.find({ })
      
        if (!Training_names) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        return res.status(200).json({ success: true, data: Training_names });

    }
    catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, message: 'Internal server error occurred' });
    }
});
module.exports = router;