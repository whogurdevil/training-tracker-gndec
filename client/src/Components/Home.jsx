import React from 'react';
import { Container } from '@mui/material';
import ButtonCard from './Cards/ButtonCard';
import { LooksOneRounded, LooksTwoRounded, Looks3Rounded, Looks4Rounded, Looks5Rounded, Looks6Rounded } from '@mui/icons-material'

const Home = () => {
    const cardsData = [
        {
            text:'Profile Data',
            path:'/dashboard',
            param: '',
            startIcon: LooksOneRounded
        },
        {
            text:'Training 101',
            path:'/tr',
            param: '101',
            startIcon: LooksTwoRounded
        },
        {
            text:'Training 102',
            path:'/tr',
            param: '102',
            startIcon: Looks3Rounded
        },
        {
            text:'Training 103',
            path:'/tr',
            param: '103',
            startIcon: Looks4Rounded
        },
        {
            text:'Training 104',
            path:'/tr',
            param: '104',
            startIcon: Looks5Rounded
        },
        {
            text:'Placement Data',
            path:'/placement',
            param: '',
            startIcon: Looks6Rounded
        },
    ];

    return (
        <Container 
        sx={{ paddingTop: 10, marginX: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {cardsData.map((data, index) => (
                <ButtonCard key={index} {...data} />
            ))}
        </Container>
    );
};

export default Home;
