import { Typography, Link, IconButton } from "@mui/material";
import { styled } from '@mui/material/styles';
import React, { useState } from "react";
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import {ArrowForwardIosTwoTone} from '@mui/icons-material'

const HtmlTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: '#f5f5f9',
    color: 'rgba(0, 0, 0, 0.87)',
    minWidth: 150,
    maxWidth: 220,
    fontSize: theme.typography.pxToRem(12),
    border: '1px solid #dadde9',
  },
}));

const Footer = () => {
  const [openTooltip, setOpenTooltip] = useState(false);

  const handleTooltipOpen = () => {
    setOpenTooltip(true);
  };

  const handleTooltipClose = () => {
    setOpenTooltip(false);
  };

  return (
    <footer style={{ backgroundColor: '#900000', color: 'white', textAlign: 'center', padding: '20px', position: 'fixed', bottom: 0, left: 0, width: '100%', zIndex: '100' }}>
      <Typography variant="body1">
        {'Made with 🤍 by '}
        <span>
          <HtmlTooltip
            open={openTooltip}
            onClose={handleTooltipClose}
            title={
              <React.Fragment>
                <Typography color="inherit" >Contributors</Typography>
                <hr/>
                <Link href={'https://github.com/whogurdevil'} target="_blank">{'Gurdev Singh (2115049)'} <span>
                  <IconButton> <ArrowForwardIosTwoTone fontSize="small" color="primary"/> </IconButton>
                  </span></Link>
                <br/>
                <Link href={'https://github.com/sangam2109'} target="_blank">{'Sangam Arora (2115127)'}<span>
                  <IconButton> <ArrowForwardIosTwoTone fontSize="small" color="primary"/> </IconButton>
                  </span></Link>
                <br/>
                <Link href={'https://github.com/Harnoor007'} target="_blank">{'Harnoor Birdi (2115059)'}<span>
                  <IconButton> <ArrowForwardIosTwoTone fontSize="small" color="primary"/> </IconButton>
                  </span></Link>
                <br/>
                <Link href={'https://github.com/tavleenkaur100'} target="_blank">{'Tavleen Kaur (2115152)'}<span>
                  <IconButton> <ArrowForwardIosTwoTone fontSize="small" color="primary"/> </IconButton>
                  </span></Link>
                <br/>
                <Link href={'https://github.com/Vanshika-211'} target="_blank">{'Vanshika Verma (2115158)'}<span>
                  <IconButton> <ArrowForwardIosTwoTone fontSize="small" color="primary"/> </IconButton>
                  </span></Link>
              </React.Fragment>
            }
          >
            <Link
              sx={{
                color: 'white',
                textDecoration: 'underline',
                cursor:'pointer'

              }}
              onClick={handleTooltipOpen}
            >
              {'Genconians'}
            </Link>
          </HtmlTooltip>
        </span>
      </Typography>
    </footer>
  );
}

export default Footer;
