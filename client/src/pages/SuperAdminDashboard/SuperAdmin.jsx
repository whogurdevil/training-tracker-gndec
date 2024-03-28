import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { Card, Modal, Box, Typography, Grid, MenuItem, Select, FormControl, InputLabel, Button } from '@mui/material';
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ExportComponent from '../../Components/ExportData';
const API_URL = import.meta.env.VITE_ENV === 'production' ? import.meta.env.VITE_PROD_BASE_URL : 'http://localhost:8000/'
import VerifyAllComponent from '../../Components/VerifyAll';
import UnVerifyAllComponent from '../../Components/UnVerifyAll';
import { useNavigate } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';
import { fetchTrainingNames, initialTrainingNames } from '../../utils/TrainingNamesApi';
import { fetchUsers, changeLock, viewCertificate } from '../../utils/AdminFunctions';

const SuperAdminForm = () => {
    const [users, setUsers] = useState([]);
    const [selectedBatch, setSelectedBatch] = useState('');
    const [selectedBranch, setSelectedBranch] = useState('');
    const [selectedTraining, setSelectedTraining] = useState("");
    const [editStatus, setEditStatus] = useState({});
    const [refresh, setRefresh] = useState(false); // Refresh state
    const [loading, setLoading] = useState(true); // Loading state
    const [trainingNames, setTrainingNames] = useState(initialTrainingNames);
    const navigate = useNavigate()

    useEffect(() => {
        const fetchData = async () => {
            try {
                const usersData = await fetchUsers();
                setUsers(usersData);
                setLoading(false);
            } catch (error) {
                setLoading(false);
            }
        };
        const loadTrainingNames = async () => {
            try {
                const data = await fetchTrainingNames();
                setTrainingNames(data);
            } catch (error) {
                console.error('Error loading training names:', error);
            }
        };

        console.log(users)
        loadTrainingNames();
        fetchData();
    }, [refresh]);

    const navigateToStats = (data) => {
        return navigate('/superadmin/placementStats', { state: { data } });
    }
    const navigateToTrainingNames = (data) => {
        return navigate('/superadmin/trainingNames');
    }

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

    const handleViewCertificate = (row) => {
        viewCertificate(row, selectedTraining);
    };


    const columns = useMemo(() => {
        let customColumns = [
            { accessorKey: "urn", header: "URN" },
            { accessorKey: "userInfo.Name", header: "Name" },
            { accessorKey: "userInfo.crn", header: "CRN" },
            { accessorKey: "userInfo.mentor", header: "Mentor" },
            { accessorKey: "userInfo.batch", header: "Batch" },
            { accessorKey: "userInfo.section", header: "Section" },
            { accessorKey: "userInfo.contact", header: "Contact" }
        ];

        if (selectedTraining === 'placementData') {
            customColumns.push(
                {
                    accessorKey: `${selectedTraining}.certificate`, header: "Certificate", Cell: ({ row }) => (
                        <PictureAsPdfIcon onClick={() => handleViewCertificate(row)} style={{ cursor: 'pointer' }} />
                    )
                },
                { accessorKey: "placementData.package", header: "Package" },
                { accessorKey: "placementData.appointmentNo", header: "Appointment Number" },
                { accessorKey: "placementData.company", header: "Company" },
                { accessorKey: "placementData.highStudy", header: "Higher Studies" },

            );
            customColumns.push({
                accessorKey: `${selectedTraining}.lock`,
                header: "Verified",
                Cell: ({ row }) => (row.original[selectedTraining].lock ? "Yes" : "No"),
            });
            customColumns.push({
                accessorKey: `${selectedTraining}.isPlaced`,
                header: "Placement Status",
                Cell: ({ row }) => (row.original[selectedTraining].isPlaced ? "Yes" : "No"),
            });
        } else if (selectedTraining && selectedTraining !== '') {
            customColumns.push(
                {
                    accessorKey: `${selectedTraining}.certificate`, header: "Certificate", Cell: ({ row }) => (
                        <PictureAsPdfIcon onClick={() => handleViewCertificate(row)} style={{ cursor: 'pointer' }} />
                    )
                },
                { accessorKey: `${selectedTraining}.technology`, header: "Technology" },
                { accessorKey: `${selectedTraining}.organization`, header: "Organization" },
                { accessorKey: `${selectedTraining}.projectName`, header: "Project Name" },
                { accessorKey: `${selectedTraining}.type`, header: "Type" }
            );
            customColumns.push({
                accessorKey: `${selectedTraining}.lock`,
                header: "Verified",
                Cell: ({ row }) => (row.original[selectedTraining].lock ? "Yes" : "No"),
            });
        }

        if (selectedTraining) {
            customColumns.push({
                accessorKey: "edit",
                header: "Mark Verification",
                Cell: ({ row }) => (
                    <VerificationIcon
                        lockStatus={row.original[selectedTraining].lock}
                        handleLock={handleLock}
                        row={row}
                    />
                ),
            });
        }

        return customColumns;
    }, [selectedTraining, editStatus]);


    const VerificationIcon = ({ lockStatus, handleLock, row }) => {
        const handleClick = () => {
            handleLock(row);
        };

        return lockStatus ? (
            <CheckCircleIcon style={{ color: 'green', cursor: 'pointer' }} onClick={handleClick} />
        ) : (
            <QuestionMarkIcon style={{ color: 'red', cursor: 'pointer' }} onClick={handleClick} />
        );
    }

    const handleLock = async (row) => {
        try {
            let successMessage = await changeLock(row.original.urn, row.original[selectedTraining].lock, selectedTraining === 'placementData', selectedTraining);
            toast.success(successMessage);
            setRefresh(prevRefresh => !prevRefresh);
        } catch (error) {
            toast.error(error.message);
        }
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
    // Function to handle refreshing data after verification status change
    const handleRefresh = () => {
        setRefresh(prevRefresh => !prevRefresh);
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
        console.log(event.target.value)
        setSelectedTraining(event.target.value);
    };

    return (
        <div style={{ padding: '0 20px', marginTop: '20px' }}>
            {loading ? ( // Render loader if loading is true

                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <CircularProgress />
                </Box>
            ) : (
                <div style={{ padding: '0 20px', marginTop: '20px' }}>
                    <Grid container spacing={2} justifyContent="space-around">
                        <Grid item style={{ marginBottom: 20 }}>
                            <FormControl style={{ width: 200 }}>
                                <InputLabel>Batch</InputLabel>
                                <Select value={selectedBatch} onChange={handleBatchChange}>
                                    <MenuItem value="">All</MenuItem>
                                    <MenuItem value="2020-2024">2020-2024</MenuItem>
                                    <MenuItem value="2021-2025">2021-2025</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item style={{ marginBottom: 20 }}>
                            <FormControl style={{ width: 200 }}>
                                <InputLabel>Branch</InputLabel>
                                <Select value={selectedBranch} onChange={handleBranchChange}>
                                    <MenuItem value="">All</MenuItem>
                                    <MenuItem value="CSE">Computer Science & Engineering</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item style={{ marginBottom: 20 }}>
                            <FormControl style={{ width: 200 }}>
                                <InputLabel>Training</InputLabel>
                                <Select value={selectedTraining} onChange={handleTrainingChange}>
                                    <MenuItem value="">All</MenuItem>
                                    {Array.from({ length: trainingNames[0]["Training_No"] }, (_, index) => {
                                        const trainingNumber = index + 1;
                                        const trainingName = trainingNames[0][`Training${trainingNumber}_name`];
                                        return (
                                            <MenuItem key={`tr${trainingNumber}`} value={`tr10${trainingNumber}`}>
                                                {trainingName}
                                            </MenuItem>
                                        );
                                    })}
                                    <MenuItem value="placementData">{trainingNames[0]["Placement_name"]}</MenuItem>
                                </Select>

                            </FormControl>
                        </Grid>
                    </Grid>
                    <Card variant="outlined" style={{ marginBottom: '50px' }}>
                        <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', }}>
                            <div style={{ display: 'flex', gap: '10px', flexDirection: 'row' }}>
                                <ExportComponent data={filteredUsers} columns={columns} selectedTraining={selectedTraining} />
                                <div style={{ marginTop: '10px', display: 'flex', gap: '5px' }}>
                                        {selectedTraining == "placementData" && (
                                            <Button onClick={() => navigateToStats(filteredUsers)} variant="contained" color="primary">
                                            View Placement Stats
                                        </Button>
                                        )}
                                    
                                    <Button onClick={() => navigateToTrainingNames()} variant="contained" color="primary">
                                        Set Training Names
                                    </Button>
                                </div>
                            </div>



                                {selectedTraining && (
                                    <div style={{ marginTop: '10px', marginRight: '10px', display: 'flex', justifyContent: 'space-between', gap: '10px' }}>
                                        <VerifyAllComponent selectedTraining={selectedTraining} refresh={refresh} onRefresh={handleRefresh} />
                                        <UnVerifyAllComponent selectedTraining={selectedTraining} refresh={refresh} onRefresh={handleRefresh} />
                                    </div>
                                )}
                        </div>
                        <MaterialReactTable table={table} />
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
                    <ToastContainer />
                </div>
            )}
        </div>
    );
};

export default SuperAdminForm;
