import { AppBar, Button, Container, Toolbar, Typography } from '@mui/material';
import React, { useState } from 'react';
import SchoolIcon from '@mui/icons-material/School';
import LoginIcon from '@mui/icons-material/Login';
import Form from './form/Form';

const Header = () => {
  const [openLoginForm, setOpenLoginForm] = useState(false); // State to control the login form dialog

  const handleLoginClick = () => {
    setOpenLoginForm(true); // Open the login form dialog when the button is clicked
  };

  const handleCloseLoginForm = () => {
    setOpenLoginForm(false); // Close the login form dialog
  };

  return (
    <>
         <AppBar
        position="static"
        sx={{
          backgroundColor: '#228B22', // Change the AppBar background color
        }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <SchoolIcon sx={{ display: { xs: 'flex', md: 'flex' }, mr: 1, fontSize: '3rem' }} />
            <Typography
              variant="h6"
              noWrap
              component="a"
              href="/"
              sx={{
                mr: 2,
                display: { xs: 'flex', md: 'flex' },
                fontFamily: '"Roboto", "Arial", sans-serif',
                fontWeight: 700,
                letterSpacing: '.3rem',
                color: 'inherit',
                textDecoration: 'none',
              }}
            >
              STUDENT MANAGEMENT SYSTEM
            </Typography>
            <Button
              className="user-button"
              onClick={handleLoginClick} // Open dialog on click
              variant="contained"
              endIcon={<LoginIcon />}
              sx={{
                ml: 'auto',
                color: '#000',
                backgroundColor: '#fff',
                border: '1px solid #ccc',
                '&:hover': {
                  backgroundColor: '#f5f5f5',
                  border: '1px solid #bbb',
                },
              }}
            >
              LOGIN
            </Button>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Render the login form dialog */}
      <Form open={openLoginForm} onClose={handleCloseLoginForm} />
    </>
  );
};

export default Header;
