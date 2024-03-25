import React, { useState, useEffect } from 'react';
import { Container, Skeleton, Typography } from '@mui/material'; // Import Skeleton component
import ButtonCard from '../Components/Cards/ButtonCard';
import { LooksOneRounded, LooksTwoRounded, Looks3Rounded, Looks4Rounded, Looks5Rounded, Looks6Rounded } from '@mui/icons-material';
import { jwtDecode } from "jwt-decode";
import axios from 'axios';

const API_URL = import.meta.env.VITE_ENV === 'production' ? import.meta.env.VITE_PROD_BASE_URL : 'http://localhost:8000/'

const Home = () => {
    const [batchYear, setBatchYear] = useState(null);
    const [isLeet, setIsLeet] = useState(false);
    const [loading, setLoading] = useState(true); // State for loading

    useEffect(() => {
        const fetchBatchYear = async () => {
            try {
                const token = localStorage.getItem("authtoken");
                const urn = decodeAuthToken(token);
                const url = `${API_URL}api/users/getuser/${urn}`
                const response = await axios.get(url, {
                    headers: {
                        "auth-token": token
                    }
                });

                const data = response.data.data

                var difference = 0;

                if (data.userInfo.batch) {
                    const batchYear = parseInt(data.userInfo.batch.split('-')[0]);
                    const currentYear = new Date().getFullYear();
                    difference = currentYear - batchYear;
                }
                else {
                    difference = 0;
                }
                if (data.userInfo.admissionType === "Non LEET") {
                    setIsLeet(true);
                }

                setBatchYear(difference);
                setLoading(false); // Set loading to false once data is fetched
            } catch (error) {
                console.error('Error fetching batch year:', error);
            }
        };

        fetchBatchYear();
    }, []);

    const decodeAuthToken = (token) => {
        try {
            const decodedToken = jwtDecode(token);
            const urn = decodedToken.urn;
            return urn;
        } catch (error) {
            console.error('Error decoding JWT token:', error);
            return null;
        }
    };

    const cardsData = [
        {
            text: 'Profile Data',
            path: '/dashboard',
            param: '',
            startIcon: LooksOneRounded,
            disabled: false
        },
        {
            text: 'Training 101',
            path: '/tr',
            param: '101',
            startIcon: LooksTwoRounded,
            disabled: (!(batchYear > 0) || !isLeet)
        },
        {
            text: 'Training 102',
            path: '/tr',
            param: '102',
            startIcon: Looks3Rounded,
            disabled: !(batchYear > 1)
        },
        {
            text: 'Training 103',
            path: '/tr',
            param: '103',
            startIcon: Looks4Rounded,
            disabled: !(batchYear > 2)
        },
        {
            text: 'Training 104',
            path: '/tr',
            param: '104',
            startIcon: Looks5Rounded,
            disabled: !(batchYear > 3)
        },
        {
            text: 'Placement Data',
            path: '/placement',
            param: '',
            startIcon: Looks6Rounded,
            disabled: !(batchYear > 3)
        },
    ];

    return (
        <Container
            sx={{ marginX: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 5 }}>
            {loading ? ( // Show Skeleton while loading
                cardsData.map((data, index) => (
                    <Skeleton variant='rounded' width={'90vw'} 
                    animation='wave'
                    sx={{
                        width: '90vw',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginY: 1,
                        padding: 2,
                        boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.25)',
                    }}>
                        <div style={{ justifyContent: 'left' }}>
                            <div>
                                <Typography gutterBottom textAlign={'left'} component="div" sx={{ maxWidth: '20vw', marginY: 'auto', fontSize: 18 }}>
                                    Loading
                                </Typography>
                            </div>
                        </div>
                    </Skeleton>
                ))
            ) : (
                cardsData.map((data, index) => (
                    <ButtonCard key={index} {...data} />
                ))
            )}
        </Container>
    );
};

export default Home;
