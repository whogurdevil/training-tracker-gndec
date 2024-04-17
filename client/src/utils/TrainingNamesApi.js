// apiUtils.js

import axios from 'axios';

const API_URL = import.meta.env.VITE_ENV === 'production' ? import.meta.env.VITE_PROD_BASE_URL : import.meta.env.VITE_DEV_BASE_URL;

export const fetchTrainingNames = async () => {
    try {
        const response = await axios.get(`${API_URL}admin/trainingNames`);
        return response.data.data;
    } catch (error) {
        console.error('Error fetching training names:', error);
        return [];
    }
};
export const initialTrainingNames = [
    {
        "Training_No": 4,
        "Training1_name": "Training 101",
        "Training2_name": "Training 102",
        "Training3_name": "Training 103",
        "Training4_name": "Training 104",
        "Placement_name": "Placement Data",
    }
];