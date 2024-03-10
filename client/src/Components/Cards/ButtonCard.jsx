import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { ArrowForwardIos } from '@mui/icons-material';
import { Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {Button} from '@mui/material';


export default function ButtonCard(data) {
  const handleNavigate = (route, number) => {
    navigate(route, { state: { number: number } })
  }
  const navigate = useNavigate();
  return (
    <Button
      endIcon={<ArrowForwardIos />}
      disabled={data.disabled}
      onClick={() => handleNavigate(data.path, data.param)}
      sx={{
        width: '90vw',
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between' ,
        color:'black', 
        backgroundColor:'#f5f5f5',
        marginY: 1, 
        padding: 2,
        boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.25)', // Add shadow here
        '&:hover': {
          backgroundColor: '#900000',
          color:'white'
        },
      }}>
      <div style={{justifyContent: 'left'}}>
        <div>
          <Typography gutterBottom textAlign={'left'} component="div"  sx={{ maxWidth: '20vw', marginY: 'auto', fontSize:18 }}>
            {data.text}
          </Typography>
        </div>
      </div>
  
    </Button>
  );
}
