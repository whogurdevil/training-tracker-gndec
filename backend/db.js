const mongoose = require('mongoose');
const adminControl = require('./models/adminControl');
const { SignUp } = require('./models/UserInfo');
require('dotenv').config();

const db = async () => {
    try {
        await mongoose.connect(process.env.DATABASE);
        console.log("connected to mongodb successfully")

        const adminControlsCount = await adminControl.countDocuments({});
        if (adminControlsCount === 0) {
            await initializeAdminControls();
        }

        const usersCount = await SignUp.countDocuments({});
        if (usersCount === 0) {
            await initializeUsers();
        }


    } catch (error) {
        console.log("Some error occured", error)
    }
}
async function initializeAdminControls() {
    try {
        const adminControls = new adminControl({
            Training_No: 4,
            Training1_name: "Training 101",
            Training2_name: "Training 102",
            Training3_name: "Training 103",
            Training4_name: "Training 104",
            Placement_name: "Placement Data"
        });
        await adminControls.save();
        console.log("Initialized admincontrols collection with a document");
    } catch (error) {
        console.error("Error initializing admincontrols collection:", error);
    }
}
async function initializeUsers() {
    try {
        const user1 = new SignUp({
            crn: "Tr000",
            email: "superadmin@gmail.com",
            password: "$2b$10$IbUz.xayDPWiNLcbQoIqqOHucE.5EwPQAfeMSx0JC0IUT.pGeJlHG",
            role: "superadmin",
            isVerified: true,
            userInfo: {
                urn: 1111111,
                branch: "Computer Science & Enginnering"
            },
            tr101: { technology: [], lock: false },
            tr102: { technology: [], lock: false },
            tr103: { technology: [], lock: false },
            tr104: { technology: [], lock: false },
            placementData: { lock: false }
        });
        await user1.save();
        const user2 = new SignUp({
            crn: "Tr101",
            email: "training101@gmail.com",
            password: "$2b$10$3kZDoENoeP/VPHuEm5xWT.sXKz5dGycptnjtLyd8fBLA9hBoiUPu2",
            role: "admin",
            isVerified: true,
            userInfo: {
                urn: 1111112,
                branch: "Computer Science & Enginnering"
            },
            tr101: { technology: [], lock: false },
            tr102: { technology: [], lock: false },
            tr103: { technology: [], lock: false },
            tr104: { technology: [], lock: false },
            placementData: { lock: false }
        });
        await user2.save();
        const user3 = new SignUp({
            crn: "Tr102",
            email: "training102@gmail.com",
            password: "$2b$10$YdkjLd1seFbyt6B9/UPdoeSU.YajF8lNC5KWwz6UZu5aP06jqAj3u",
            role: "admin",
            isVerified: true,
            userInfo: {
                urn: 1111113,
                branch: "Computer Science & Enginnering"
            },
            tr101: { technology: [], lock: false },
            tr102: { technology: [], lock: false },
            tr103: { technology: [], lock: false },
            tr104: { technology: [], lock: false },
            placementData: { lock: false }
        });
        await user3.save();
        const user4 = new SignUp({
            crn: "Tr103",
            email: "training103@gmail.com",
            password: "$2b$10$Gwu4BWavhNVbsB7viAiuv.MYKu2/vNIH0SbiqDjYCH00JoIIDL1c6",
            role: "admin",
            isVerified: true,
            userInfo: {
                urn: 1111114,
                branch: "Computer Science & Engineering"
            },
            tr101: { technology: [], lock: false },
            tr102: { technology: [], lock: false },
            tr103: { technology: [], lock: false },
            tr104: { technology: [], lock: false },
            placementData: { lock: false }
        });
        await user4.save();
        const user5 = new SignUp({
            crn: "Tr104",
            email: "training104@gmail.com",
            password: "$2b$10$TQC/NMdX9JC4tpXJI68MnOk8VH/oevxmAU.sjB56ki/hh4QPLfib2",
            role: "admin",
            isVerified: true,
            userInfo: {
                urn: 1111115,
                branch: "Computer Science & Engineering"
            },
            tr101: { technology: [], lock: false },
            tr102: { technology: [], lock: false },
            tr103: { technology: [], lock: false },
            tr104: { technology: [], lock: false },
            placementData: { lock: false }
        });
        await user5.save();

        console.log("Initialized users collection with a document");
    } catch (error) {
        console.error("Error initializing users collection:", error);
        throw error;
    }
}

module.exports = { db };