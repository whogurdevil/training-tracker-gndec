import React, { useState, useEffect } from 'react';
import { Container } from '@mui/material';
import ButtonCard from './Cards/ButtonCard';
import { LooksOneRounded, LooksTwoRounded, Looks3Rounded, Looks4Rounded, Looks5Rounded, Looks6Rounded } from '@mui/icons-material';
import { jwtDecode } from "jwt-decode";
import axios from 'axios';

const API_URL = import.meta.env.VITE_ENV === 'production' ? import.meta.env.VITE_PROD_BASE_URL : 'http://localhost:8000/'


const Home = () => {
    const [batchYear, setBatchYear] = useState(null);
    const [isLeet,setIsLeet ] = useState(false);

    useEffect(() => {
        const fetchBatchYear = async () => {
            try {
                // Fetch batch year from profile data
                const token = localStorage.getItem("authtoken");
                // console.log(token)
                const urn = decodeAuthToken(token);
                // console.log(urn)
                const url = `${API_URL}api/users/getuser/${urn}`
                const response = await axios.get(url, {
                    headers: {
                        "auth-token": token // Include the authentication token in the request headers
                    }
                });

                const data = response.data.data
               
                var difference = 0;
                console.log(data.userInfo.admissionType)
                if (data.userInfo.batch) {
                    const batchYear = parseInt(data.userInfo.batch.split('-')[0]);

                    const currentYear = new Date().getFullYear();
                    difference = currentYear - batchYear;
                }
                else {

                    difference = 0;
                }
                if (data.userInfo.admissionType === "Non LEET"){
                    setIsLeet(true);
                }


                setBatchYear(difference);
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
            sx={{ marginX: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {cardsData.map((data, index) => (

                <ButtonCard key={index}  {...data} />

            ))}
        </Container>
    );
};

export default Home;
