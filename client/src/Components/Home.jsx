import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Grid, Typography } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const urn = location.state && location.state.urn;
    console.log(urn)
    const handleNavigate = (route,number) => {
        navigate(route, { state: { urn: urn, number: number } });
    };

    return (
        <div style={{ padding: '20px' }}>
            <Typography variant="h5" gutterBottom>
                Progress Tracker
            </Typography>
            <Grid container spacing={1} style={{ marginTop: '40px' }}>
                {/* Progress 1: Profile Data */}
                <Grid item xs={6} sm={2}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleNavigate('/dashboard','')}
                        endIcon={<ArrowForwardIcon />}
                    >
                    {console.log(urn)}
                        Profile Data
                    </Button>
                </Grid>
                {/* Progress 2: Training 101 */}
                <Grid item xs={6} sm={2}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleNavigate('/tr','101')}
                        endIcon={<ArrowForwardIcon />}
                    >
                        Training 101
                    </Button>
                </Grid>
                {/* Progress 3: Training 102 */}
                <Grid item xs={6} sm={2}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleNavigate('/tr','102')}
                        endIcon={<ArrowForwardIcon />}
                    >
                        Training 102
                    </Button>
                </Grid>
                {/* Progress 4: Training 103 */}
                <Grid item xs={6} sm={2}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleNavigate('/tr','103')}
                        endIcon={<ArrowForwardIcon />}
                    >
                        Training 103
                    </Button>
                </Grid>
                {/* Progress 5: Training 104 */}
                <Grid item xs={6} sm={2}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleNavigate('/tr','104')}
                        endIcon={<ArrowForwardIcon />}
                    >
                        Training 104
                    </Button>
                </Grid>
                {/* Progress 6: Placement Data */}
                <Grid item xs={6} sm={2}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleNavigate('/placement','')}
                        endIcon={<ArrowForwardIcon />}
                    >
                        Placement Data
                    </Button>
                </Grid>
            </Grid>
        </div>
    );
};

export default Home;
