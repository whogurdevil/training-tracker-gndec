import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, Typography, Button, Modal, Box, Grid } from '@mui/material';

const UserCard = ({ user }) => {
    const [open, setOpen] = useState(false);
    const [modalContent, setModalContent] = useState(null);

    const handleModalOpen = (content) => {
        setModalContent(content);
        setOpen(true);
    };

    const handleModalClose = () => {
        setOpen(false);
    };

    return (
        <>
            <Card variant="outlined" style={{ marginBottom: '50px' }}>
                <CardContent>
                    <Typography variant="h5" component="div">
                        {user.userInfo.Name}
                    </Typography>
                    <Typography color="text.secondary">
                        Branch: {user.userInfo.branch} | URN: {user.urn}
                    </Typography>
                    <Grid container spacing={1} style={{ marginTop: '10px' }}>
                        <Grid item>
                            <Button variant="contained" onClick={() => handleModalOpen(user.tr101)}>
                                TR101
                                {console.log(user.tr101)}
                            </Button>
                        </Grid>
                        <Grid item>
                            <Button variant="contained" onClick={() => handleModalOpen(user.tr102)}>
                                TR102
                            </Button>
                        </Grid>
                        <Grid item>
                            <Button variant="contained" onClick={() => handleModalOpen(user.tr103)}>
                                TR103
                            </Button>
                        </Grid>
                        <Grid item>
                            <Button variant="contained" onClick={() => handleModalOpen(user.tr104)}>
                                TR104
                            </Button>
                        </Grid>
                        <Grid item>
                            <Button variant="contained" onClick={() => handleModalOpen(user.placementData)}>
                                Placement Data
                            </Button>
                        </Grid>
                    </Grid>
                </CardContent>
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
        </>
    );
};

const SuperAdminForm = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const token = localStorage.getItem('authtoken');
                const response = await axios.get('http://localhost:8000/api/users/getallusers/', {
                    headers: {
                        "auth-token": token // Include the authentication token in the request headers
                    }
                });
                //   console.log(response.data)
                const filteredUsers = response.data.data.filter(user => user.role === 'user');
                setUsers(filteredUsers);

            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchUsers();
    }, []);


    return (
        <div style={{ marginTop: '100px' }}>
            {console.log(users)}
            {users.map((user) => (
                <UserCard key={user._id} user={user} />
            ))}
        </div>
    );
};

export default SuperAdminForm;
