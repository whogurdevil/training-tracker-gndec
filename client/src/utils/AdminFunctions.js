import axios from 'axios';
import {  openBase64NewTab } from './base64topdf';
const API_URL = import.meta.env.VITE_ENV === 'production' ? import.meta.env.VITE_PROD_BASE_URL : 'http://localhost:8000/';

export const fetchUsers = async () => {
    try {
        const token = localStorage.getItem('authtoken');
        const response = await axios.get(`${API_URL}api/users/getallusers/`, {
            headers: {
                "auth-token": token
            }
        });
        const filteredUsers = response.data.data
            .filter(user => user.role === 'user')
            .filter(user => user.userInfo.Name !== undefined)
            .sort((a, b) => a.urn - b.urn);

        // Extracting unique batches from userinfo.batch
        const batches = filteredUsers.reduce((acc, user) => {
            if (user.userInfo.batch) {
                const batch = user.userInfo.batch.split('-')[0]; // Assuming batch is in format: YYYY-NNN
                const endYear = user.userInfo.batch.split('-')[1]; // Assuming batch is in format: YYYY-NNN
                const fullBatch = `${batch}-${endYear}`; // Combine start and end year to get full batch range
                if (!acc.includes(fullBatch)) {
                    acc.push(fullBatch);
                }
            }
            return acc;
        }, []);
        const sortedBatches = batches.sort((b, a) => a.localeCompare(b));
        return { users: filteredUsers, batches: sortedBatches };
    } catch (error) {
        console.error('Error fetching users:', error);
        throw new Error('Error fetching users');
    }
};


export const changeLock = async (urn, lockStatus, isPlacement , selectedTraining) => {
    try {
        const token = localStorage.getItem('authtoken');
        let url = '';
        let data = {};

        if (isPlacement) {
            url = `${API_URL}placement/updatelock`;
            data = {
                urn: urn,
                lock: !lockStatus // Toggle the lock status
            };
        } else {
            const trainingNumber = selectedTraining.substring(2);
            url = `${API_URL}tr${trainingNumber}/updatelock`;
            data = {
                urn: urn,
                lock: !lockStatus // Toggle the lock status
            };
        }

        const response = await axios.post(url, data, {
            headers: {
                'auth-token': token
            }
        });
        if (response.data.success) {
            return 'Verification Status Change successfully!';
        } else {
            throw new Error('Failed to update verified status.');
        }
    } catch (error) {
        throw new Error('Error updating verification status:', error);
    }
};


export const getTrainingOptions = (admintype) => {
    const options = [
        { value: "", label: "All" }
    ];

    if (admintype === "101" ) {
        options.push({ value: "tr101", label: "Training 101" });
    } else if (admintype === "102" ) {
        options.push(
            { value: "tr101", label: "Training 101" },
            { value: "tr102", label: "Training 102" }
        );
    } else if (admintype === "103" ) {
        options.push(
            { value: "tr101", label: "Training 101" },
            { value: "tr102", label: "Training 102" },
            { value: "tr103", label: "Training 103" }
        );
    } else if (admintype === "104") {
        options.push(
            { value: "tr101", label: "Training 101" },
            { value: "tr102", label: "Training 102" },
            { value: "tr103", label: "Training 103" },
            { value: "tr104", label: "Training 104" },
            { value: "placementData", label: "Placement Data" }
        );
    }

    return options;
};


export const viewCertificate = (row, selectedTraining) => {
    if (selectedTraining === 'placementData') {
        if (row.original.placementData && row.original.placementData.appointmentLetter) {
            openBase64NewTab(row.original.placementData.appointmentLetter);
        } else {
            console.error("Appointment Letter not found for this user in placement data.");
        }
    } else if (selectedTraining && row.original[selectedTraining] && row.original[selectedTraining].certificate) {
        openBase64NewTab(row.original[selectedTraining].certificate);
    } else {
        console.error("Certificate not found for this user or training data is missing.");
    }
};
