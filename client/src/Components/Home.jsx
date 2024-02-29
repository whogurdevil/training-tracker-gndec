import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Grid, Typography } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const Home = () => {
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
                        component={Link}
                        to="/dashboard"
                        endIcon={<ArrowForwardIcon />}
                    >
                        Profile Data
                    </Button>
                </Grid>
                {/* Progress 2: Training 101 */}
                <Grid item xs={6} sm={2}>
                    <Button
                        variant="contained"
                        color="primary"
                        component={Link}
                        to="/"
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
                        component={Link}
                        to="/"
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
                        component={Link}
                        to="/"
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
                        component={Link}
                        to="/"
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
                        component={Link}
                        to="/"
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
