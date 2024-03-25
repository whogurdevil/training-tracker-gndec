const mongoose = require('mongoose');


const adminController = new mongoose.Schema({
    Training_No:{
        type:Number
    },
    Training1_name: { type: String },
    Training2_name: { type: String },
    Training3_name: { type: String },
    Training4_name: { type: String },
    Placement_name:{type:String}
});

const adminControl = mongoose.model('adminControl', adminController);
module.exports=adminControl;