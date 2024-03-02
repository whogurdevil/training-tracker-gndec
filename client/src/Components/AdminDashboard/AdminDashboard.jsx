import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { Card, Modal, Box, Typography, Grid, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import EditIcon from '@mui/icons-material/Edit';    

const AdminForm = () => {
    const [users, setUsers] = useState([]);
    const [selectedBatch, setSelectedBatch] = useState('');
    const [selectedBranch, setSelectedBranch] = useState('');
    const [selectedTraining, setSelectedTraining] = useState('');

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const token = localStorage.getItem('authtoken');
                const response = await axios.get('http://localhost:8000/api/users/getallusers/', {
                    headers: {
                        "auth-token": token // Include the authentication token in the request headers
                    }
                });
                const filteredUsers = response.data.data
                .filter(user => user.role === 'user')
                .sort((a, b) => a.urn - b.urn);
                setUsers(filteredUsers);
                
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };
        
        fetchUsers();
    }, []);
    
    const filteredUsers = useMemo(() => {
        let filteredData = [...users];
        
        if (selectedBatch) {
            filteredData = filteredData.filter(user => user.userInfo && user.userInfo.batch === selectedBatch);
        }
    
        if (selectedBranch) {
            filteredData = filteredData.filter(user => user.userInfo && user.userInfo.branch === selectedBranch);
        }
    
        if (selectedTraining) {
            filteredData = filteredData.filter(user => user[selectedTraining]);
        }
    
        return filteredData;
    }, [users, selectedBatch, selectedBranch, selectedTraining]);
    
    const columns = useMemo(
        () => {
            let customColumns = [
                { accessorKey: "urn", header: "URN" },
                { accessorKey: "userInfo.Name", header: "Name" },
                { accessorKey: "userInfo.crn", header: "CRN" }
            ];
    
            if (selectedTraining === 'placementData') {
                customColumns.push(
                    { accessorKey: "placementData.package", header: "Package" },
                    { accessorKey: "placementData.appointmentLetter", header: "Appointment Letter" },
                    { accessorKey: "placementData.appointmentDate", header: "Appointment Date" },
                    { accessorKey: "placementData.company", header: "Company" },
                    
                );
                customColumns.push({
                    accessorKey: `${selectedTraining}.lock`,
                    header: "Verified",
                    // Add a conditional expression to convert boolean to string
                    Cell: ({ row }) => (row[`${selectedTraining}.lock`] ? "Yes" : "No"),
                  });
                  
            } else if (selectedTraining) {
                customColumns.push(
                    { accessorKey: `${selectedTraining}.technology`, header: "Technology" },
                    { accessorKey: `${selectedTraining}.certificate`, header: "Certificate" },
                    { accessorKey: `${selectedTraining}.projectName`, header: "Project Name" },
                    { accessorKey: `${selectedTraining}.type`, header: "Type" },
                    
                );
                customColumns.push({
                    accessorKey: `${selectedTraining}.lock`,
                    header: "Verified",
                    // Add a conditional expression to convert boolean to string
                    Cell: ({ row }) => (row[`${selectedTraining}.lock`] ? "Yes" : "No"),
                  });
            }

            // Add the edit icon column
            customColumns.push({
                accessorKey: "edit",
                header: "Mark Verification",
                Cell: ({ row }) => (
                    <EditIcon
                        onClick={() => handleEdit(row)}
                        style={{ cursor: 'pointer' }}
                    />
                ),
            });

            return customColumns;
        },
        [selectedTraining]
    );

    const handleEdit = (row) => {
        console.log("Eh krna hle")
        // Update the 'Verified' value to 'Yes' for the clicked row
        // You need to implement the logic to update the 'lock' value in the user object
        // For example:
        // const updatedUser = { ...row, [`${selectedTraining}.lock`]: true };
        // Then update the users state with the updated user
        // setUsers(users.map(user => user.id === row.id ? updatedUser : user));
    };

    const table = useMaterialReactTable({
        data: filteredUsers,
        columns
    });

    const [open, setOpen] = useState(false);
    const [modalContent, setModalContent] = useState(null);

    const handleModalOpen = (content) => {
        setModalContent(content);
        setOpen(true);
    };

    const handleModalClose = () => {
        setOpen(false);
    };

    const handleBatchChange = (event) => {
        setSelectedBatch(event.target.value);
    };

    const handleBranchChange = (event) => {
        setSelectedBranch(event.target.value);
    };

    const handleTrainingChange = (event) => {
        setSelectedTraining(event.target.value);
    };

    return (
        <div style={{ marginTop: '100px', padding: '0 20px' }}>
            <Grid container spacing={2} justifyContent="space-around">
                <Grid item style={{  marginBottom: 20 }}>
                    <FormControl style={{width:200}}>
                        <InputLabel>Batch</InputLabel>
                        <Select value={selectedBatch} onChange={handleBatchChange}>
                            <MenuItem value="">All</MenuItem>
                            <MenuItem value="2020-2024">2020-2024</MenuItem>
                            <MenuItem value="2021-2025">2021-2025</MenuItem>
                            {/* Add other batch options */}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item style={{ marginBottom: 20 }}>
                    <FormControl style={{ width: 200 }}>
                        <InputLabel>Branch</InputLabel>
                        <Select value={selectedBranch} onChange={handleBranchChange}>
                            <MenuItem value="">All</MenuItem>
                            <MenuItem value="CSE">Computer Science & Engineering</MenuItem>
                            {/* Add other branch options */}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item style={{ marginBottom: 20 }}>
                    <FormControl style={{ width: 200 }}>
                        <InputLabel>Training</InputLabel>
                        <Select value={selectedTraining} onChange={handleTrainingChange}>
                            <MenuItem value="">All</MenuItem>
                            <MenuItem value="tr101">Training 101</MenuItem>
                            <MenuItem value="tr102">Training 102</MenuItem>
                            <MenuItem value="tr103">Training 103</MenuItem>
                            <MenuItem value="tr104">Training 104</MenuItem>
                            <MenuItem value="placementData">Placement Data</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
            </Grid>
            <Card variant="outlined" style={{ marginBottom: '50px'}}>
                <MaterialReactTable table={table}/>
            </Card>

            <Modal open={open} onClose={handleModalClose}>
                <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', boxShadow: 24, p: 4 }}>
                    {modalContent && (
                        <>
                            <Typography variant="h6" gutterBottom>
                                {Object.keys(modalContent).map((key) => (
                                    <div key={key}>
                                        <strong>{key}: </strong> {modalContent[key]}
                                    </div>
                                ))}
                            </Typography>
                        </>
                    )}
                </Box>
            </Modal>
        </div>
    );
};

export default AdminForm;
