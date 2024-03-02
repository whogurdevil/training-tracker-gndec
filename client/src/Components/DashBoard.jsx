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
    const handleNavigate = () => {

        navigate('/dashboard', { state: { urn: urn } });
    };

    const btnStyle = { height: '30vh', width: '20vw' }
    return (
        <div style={{ paddingTop: '10vh' }}>
            <Typography variant="h5" gutterBottom>
                Progress Tracker
            </Typography>
            <Grid container spacing={1} style={{ marginTop: 40, width:'100vw'}}>
                <Grid direction={'row'}>
                    {/* Progress 1: Profile Data */}
                    <Grid item xs={6} sm={2}>
                        <Button
                            style={btnStyle}
                            variant="contained"
                            color="primary"
                            onClick={handleNavigate}
                            endIcon={<ArrowForwardIcon />}
                            sx={btnStyle}
                        >
                            {console.log(urn)}
                            Profile Data
                        </Button>
                    </Grid>
                    {/* Progress 2: Training 101 */}
                    <Grid item xs={6} sm={2}>
                        <Button
                            style={btnStyle}
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
                            style={btnStyle}
                            variant="contained"
                            color="primary"
                            component={Link}
                            to="/"
                            endIcon={<ArrowForwardIcon />}
                        >
                            Training 102
                        </Button>
                    </Grid>
                </Grid>
                <Grid>
                    {/* Progress 4: Training 103 */}
                    <Grid item xs={6} sm={2}>
                        <Button
                            style={btnStyle}
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
                            style={btnStyle}
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
                            style={btnStyle}
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
            </Grid>
        </div>
    );
};

export default Home;