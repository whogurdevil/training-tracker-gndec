import axios from "axios";
import { openBase64NewTab } from "./base64topdf";
const API_URL =
    import.meta.env.VITE_ENV === "production"
        ? import.meta.env.VITE_PROD_BASE_URL
        : import.meta.env.VITE_DEV_BASE_URL;
import { jwtDecode } from "jwt-decode";

export const fetchBatches = async () => {
    try {
        const token = localStorage.getItem("authtoken");
        const response = await axios.get(`${API_URL}admin/getBatches`, {
            headers: {
                "auth-token": token,
            },
        });

        const fetchedBatches = response.data.data;
        const sortedBatches = fetchedBatches.sort((b, a) => a.localeCompare(b));
        console.log(sortedBatches);
        return { batches: sortedBatches };
    } catch (error) {
        console.error("Error fetching users:", error);
        throw new Error("Error fetching users");
    }
};

export const fetchUsers = async () => {
    try {
        const token = localStorage.getItem("authtoken");
        const response = await axios.get(`${API_URL}users/getallusers/`, {
            headers: {
                "auth-token": token,
            },
        });
        const filteredUsers = response.data.data
            .filter((user) => user.role === "user")
            .filter((user) => user.userInfo.Name !== undefined)
            .sort((a, b) => a.crn - b.crn);

        // Extracting unique batches from userinfo.batch
        const batches = filteredUsers.reduce((acc, user) => {
            if (user.userInfo.batch) {
                const batch = user.userInfo.batch.split("-")[0]; // Assuming batch is in format: YYYY-NNN
                const endYear = user.userInfo.batch.split("-")[1]; // Assuming batch is in format: YYYY-NNN
                const fullBatch = `${batch}-${endYear}`; // Combine start and end year to get full batch range
                if (!acc.includes(fullBatch)) {
                    acc.push(fullBatch);
                }
            }
            return acc;
        }, []);
        const sortedBatches = batches.sort((b, a) => a.localeCompare(b));

        console.log("dfhdkhfadsf");
        console.log(sortedBatches);
        return { users: filteredUsers, batches: sortedBatches };
    } catch (error) {
        console.error("Error fetching users:", error);
        throw new Error("Error fetching users");
    }
};

export const changeLock = async (
    crn,
    lockStatus,
    isPlacement,
    selectedTraining,
) => {
    try {
        const token = localStorage.getItem("authtoken");
        let url = "";
        let data = {};

        if (isPlacement) {
            url = `${API_URL}placement/updatelock`;
            data = {
                crn: crn,
                lock: !lockStatus, // Toggle the lock status
            };
        } else {
            const trainingNumber = selectedTraining.substring(2);
            url = `${API_URL}tr${trainingNumber}/updatelock`;
            data = {
                crn: crn,
                lock: !lockStatus, // Toggle the lock status
            };
        }

        const response = await axios.post(url, data, {
            headers: {
                "auth-token": token,
            },
        });

        return response.data.success;
    } catch (error) {
        throw new Error("Error updating verification status:", error);
    }
};

export const getTrainingOptions = (adminType, trainingNames) => {
    const options = [{ value: "", label: "All" }];

    const trainingNumber = trainingNames[0]["Training_No"];
    console.log(trainingNumber);
    console.log(adminType);
    if (adminType == trainingNumber) {
        options.push({
            value: `tr10${adminType}`,
            label: ` ${trainingNames[0][`Training${adminType}_name`]}`,
        });

        options.push({ value: "placementData", label: "Placement Data" });
    } else {
        options.push({
            value: `tr10${adminType}`,
            label: ` ${trainingNames[0][`Training${adminType}_name`]}`,
        });
    }

    return options;
};

export const viewCertificate = (row, selectedTraining) => {
    if (selectedTraining === "placementData") {
        if (
            row.original.placementData &&
            row.original.placementData.appointmentLetter
        ) {
            openBase64NewTab(row.original.placementData.appointmentLetter);
        } else {
            console.error(
                "Appointment Letter not found for this user in placement data.",
            );
        }
    } else if (
        selectedTraining &&
        row.original[selectedTraining] &&
        row.original[selectedTraining].certificate
    ) {
        openBase64NewTab(row.original[selectedTraining].certificate);
    } else {
        console.error(
            "Certificate not found for this user or training data is missing.",
        );
    }
};

export const decodeAuthToken = (token) => {
    try {
        if (!token) {
            throw new Error("Token is null or empty");
        }
        const decodedToken = jwtDecode(token);
        const crn = decodedToken.crn;
        return crn;
    } catch (error) {
        console.error("Error decoding JWT token:", error);
        return null;
    }
};
export const decodeUserRole = (token) => {
    try {
        if (!token) {
            throw new Error("Token is null or empty");
        }
        const decodedToken = jwtDecode(token);
        const role = decodedToken.user.role;
        return role;
    } catch (error) {
        console.error("Error decoding JWT token:", error);
        return null;
    }
};
