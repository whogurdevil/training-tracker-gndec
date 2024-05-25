import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { Card, Modal, Box, Typography, Grid, MenuItem, Select, FormControl, InputLabel, LinearProgress , Skeleton,TextField , Button , CircularProgress } from '@mui/material';
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import { fetchTrainingNames, initialTrainingNames } from '../../utils/TrainingNamesApi';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import VerifyAllComponent from '../../Components/VerifyAll';
import ExportCsvComponent from '../../Components/ExportCsvData';
import ExportExcelComponent from '../../Components/ExportExcelData';
const API_URL = import.meta.env.VITE_ENV === 'production' ? import.meta.env.VITE_PROD_BASE_URL : import.meta.env.VITE_DEV_BASE_URL
import { decodeAuthToken } from '../../utils/AdminFunctions';
import UnVerifyAllComponent from '../../Components/UnVerifyAll';
import PlacementModal from '../../Components/PlacementModal';
import ExpandCircleDownIcon from '@mui/icons-material/ExpandCircleDown';


import { fetchUsers, changeLock, getTrainingOptions , viewCertificate } from '../../utils/AdminFunctions';

const AdminForm = () => {
    const [users, setUsers] = useState([]);
    const [selectedBatch, setSelectedBatch] = useState('');
    const [selectedBranch, setSelectedBranch] = useState('');
    const [selectedTraining, setSelectedTraining] = useState('');
    const [editStatus, setEditStatus] = useState({});
    const [refresh, setRefresh] = useState(false); // Refresh state
    const [loading, setLoading] = useState(true);
    const [allBatches, setallBatches] = useState([])
    const [admintype, Setadmintype] = useState(null)
    const [verificationStatus, setVerificationStatus] = useState({});
    const [trainingNames, setTrainingNames] = useState(initialTrainingNames);
    const token = localStorage.getItem("authtoken");
    const crn = decodeAuthToken(token);
    const [showModal, setShowModal] = useState(false);
    const [selectedRowData, setSelectedRowData] = useState(null);
    const navigate = useNavigate()

    useEffect(() => {
        const fetchData = async () => {
            try {
                const usersData = await fetchUsers();
                setUsers(usersData.users);
                setallBatches(usersData.batches)
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
        const admin = crn && crn.length >= 3 ? crn.slice(-1) : crn;
        
        Setadmintype(admin)
        loadTrainingNames();
       

            fetchData();
        
    }, [refresh]);

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
            { accessorKey: "crn", header: "CRN" },
            { accessorKey: "userInfo.Name", header: "Name" },
            { accessorKey: "userInfo.urn", header: "URN" },
            { accessorKey: "userInfo.mentor", header: "Mentor" },
            { accessorKey: "userInfo.batch", header: "Batch" },
            { accessorKey: "userInfo.section", header: "Section" },
            { accessorKey: "userInfo.contact", header: "Contact" }
        ];
        if(selectedTraining){

            if (selectedTraining === 'placementData') {
                customColumns.push({
                    accessorKey: `${selectedTraining}.isPlaced`,
                    header: "Placement Status",
                    Cell: ({ row }) => (row.original[selectedTraining].isPlaced ? "Yes" : "No"),
                });
                customColumns.push({
                    accessorKey: `${selectedTraining}.highStudy`,
                    header: "Higher Study",
                    Cell: ({ row }) => (row.original[selectedTraining].highStudy ? "Yes" : "No"),
                });
                customColumns.push({
                    accessorKey: `${selectedTraining}.gateStatus`,
                    header: "Gate Status",
                    Cell: ({ row }) => (row.original[selectedTraining].gateStatus ? "Yes" : "No"),
                });
                customColumns.push(
                    {
                        accessorKey: "viewMore",
                        header: "View More",
                        Cell: ({ row }) => (
                            <ExpandCircleDownIcon
                                onClick={() => {
                                    setSelectedRowData(row.original);
                                    setShowModal(true);
                                }}
                                style={{ cursor: 'pointer' }}
                            />
                        ),
                    }
                );

                //view more
            } else  {
            customColumns.push(
              
                {
                    accessorKey: `${selectedTraining}.technology`,
                    header: "Technology",
                    Cell: ({ row }) => row.original[selectedTraining].technology.join(" , ")
                },
                { accessorKey: `${selectedTraining}.organization`, header: "Organization" },
                { accessorKey: `${selectedTraining}.projectName`, header: "Project Name" },
                { accessorKey: `${selectedTraining}.type`, header: "Type" },
                {
                    accessorKey: `${selectedTraining}.certificate`, header: "Certificate", Cell: ({ row }) => (
                        <PictureAsPdfIcon onClick={() => handleViewCertificate(row)} style={{ cursor: 'pointer' }} />
                    )
                },
            );
           
        }
            customColumns.push({
                accessorKey: `${selectedTraining}.lock`,
                header: "Verified",
                Cell: ({ row }) => (row.original[selectedTraining].lock ? "Yes" : "No"),
            });

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
    }, [selectedTraining, editStatus,verificationStatus]);


    const VerificationIcon = ({ lockStatus, handleLock, row }) => {
        const [loading, setLoading] = useState(false);
        const crn = row.original.crn;
        const currentStatus = verificationStatus[crn] !== undefined ? verificationStatus[crn] : lockStatus;
        
        const handleClick = async () => {
            setLoading(true);
            await handleLock(row);
            setLoading(false);
        };

        if (loading) {
            return <CircularProgress size={24} />;
        }
        return currentStatus ? (
            <CheckCircleIcon style={{ color: 'green', cursor: 'pointer' }} onClick={handleClick} />
        ) : (
            <QuestionMarkIcon style={{ color: 'red', cursor: 'pointer' }} onClick={handleClick} />
        );
    };

    const handleLock = async (row) => {
        try {
            const crn = row.original.crn;
            const currentStatus = verificationStatus[crn] !== undefined ? verificationStatus[crn] : row.original[selectedTraining].lock;
            const newStatus = !currentStatus;
            let successMessage = await changeLock(crn, currentStatus, selectedTraining === 'placementData', selectedTraining);
            if (successMessage) {
                setVerificationStatus(prevStatus => ({
                    ...prevStatus,
                    [crn]: newStatus
                }));
                toast.success("User Data Verification Changed");
                return true;
            } else {
                toast.error("Error in Status Changing");
                return false;
            }
            
        } catch (error) {
            toast.error(error.message);
        }
    };

    const table = useMaterialReactTable({
        data: filteredUsers,
        columns
    });
    const handleRefresh = () => {
        setRefresh(prevRefresh => !prevRefresh);
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

    const getAdminTrainingOptions = () => {
        return getTrainingOptions(admintype,trainingNames);
    };
    const navigateToEditProfile = (data) => {
        return navigate('/admin/editProfile');
    }

    return (
        <div>
            {loading ? ( // Render loader if loading is true
                <>
                    <LinearProgress />
                    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '40px', marginBottom: "100px", width: '98vw', height: '100vh' }}>
                        <Box
                            sx={{
                                width: '90vw',
                                height: '50vh',
                                border: 1,
                                borderColor: 'lightgray',
                                borderRadius: 1,
                                backgroundColor: 'white',
                            }}
                        >
                            <Skeleton
                                animation={'wave'}
                                sx={{ width: '300px', height: '60px', marginLeft: 2, marginBlock: 1 }}

                            />
                            <hr />

                            <Box
                                sx={{
                                    paddingInline: 2,
                                    display: 'flex',
                                    flexDirection: 'row',
                                    justifyContent: 'space-between'
                                }}
                            >
                                <Skeleton
                                    animation={'wave'}
                                    sx={{
                                        width: '20vw',
                                        height: '40px'
                                    }}
                                />
                                <Skeleton
                                    animation={'wave'}
                                    sx={{
                                        width: '20vw',
                                        height: '40px'
                                    }}
                                />
                                <Skeleton
                                    animation={'wave'}
                                    sx={{
                                        width: '20vw',
                                        height: '40px'
                                    }}
                                />
                                <Skeleton
                                    animation={'wave'}
                                    sx={{
                                        width: '20vw',
                                        height: '40px'
                                    }}
                                />
                            </Box>
                        </Box>
                    </div>
                </>

            ) : (
                    <div style={{ padding: '0 40px', marginTop: '40px', marginBottom: "100px" }}>
                    <Grid container spacing={2} justifyContent="space-around">
                        <Grid item style={{ marginBottom: 20 }}>
                                <FormControl style={{ width: 200 }}>
                                    <TextField select value={selectedBatch} label={'Batch'} 
                                    onChange={handleBatchChange}
                                        variant="outlined"
                                        fullWidth
                                        required
                                        name="Select Batch">
                                        <MenuItem value="" sx={{ maxHeight: '200px' }} >All</MenuItem>
                                        {allBatches.map((data, index) => (
                                            <MenuItem key={index}  value={data}>{data}</MenuItem>
                                        ))}
                                    </TextField>
                                </FormControl>
                        </Grid>
                        <Grid item style={{ marginBottom: 20 }}>
                            <FormControl style={{ width: 200 }}>
                                <TextField select value={selectedBranch} label="Branch" onChange={handleBranchChange}>
                                    <MenuItem value="">All</MenuItem>
                                    <MenuItem value="CSE">Computer Science & Engineering</MenuItem>
                                </TextField>
                            </FormControl>
                        </Grid>
                        <Grid item style={{ marginBottom: 20 }}>
                            <FormControl style={{ width: 200 }}>
                                <TextField select label={'Select Training'} value={selectedTraining} onChange={handleTrainingChange}>
                                    {getAdminTrainingOptions().map((option) => (
                                        <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                                    ))}
                                </TextField>
                            </FormControl>

                        </Grid>
                            <Grid item style={{ marginBottom: 20 }}>

                                <Button onClick={navigateToEditProfile} variant="outlined" sx={{ py: 2 }}>
                                    Change Student Data
                                </Button>
                                </Grid>
                    </Grid>
                    <Card variant="outlined" style={{ marginBottom: '50px' }}>
                        <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between' }}>
                                <div style={{ display: 'flex', flexDirection: 'row', gap: '10px' }}>
                                    <ExportCsvComponent data={filteredUsers} columns={columns} selectedTraining={selectedTraining} />
                                    <ExportExcelComponent data={filteredUsers} columns={columns} selectedTraining={selectedTraining} />
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
                        {showModal && (
                            <PlacementModal
                                showModal={showModal}
                                onClose={() => setShowModal(false)}
                                placementData={selectedRowData}
                            />
                        )}
                   
                    <ToastContainer />
                </div>
            )}
        </div>
    );
};

export default AdminForm;
