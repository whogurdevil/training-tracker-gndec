import { Typography, Link } from "@mui/material";

const Footer = () => {
  return (
    <footer style={{ backgroundColor: '#900000', color: 'white', textAlign: 'center', padding: '20px', position: 'fixed', bottom: 0, left: 0, width: '100%', zIndex: '100' }}>
      <Typography variant="body1">
        {'Made with 🤍 by '}
        <span>
          <Link
            // href="/forgotpassword"
            // variant="body2"
            sx={{
              color: 'white',
              textDecoration: 'underline'
            }}
          >
            { 'Genconians' }
          </Link>
        </span>
      </Typography>
    </footer>
  );
}

export default Footer