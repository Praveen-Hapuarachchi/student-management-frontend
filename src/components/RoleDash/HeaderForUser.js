import React, { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode'; // Fix import
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import SchoolIcon from '@mui/icons-material/School';
import LogoutIcon from '@mui/icons-material/Logout';
import EditIcon from '@mui/icons-material/Edit'; // Import EditIcon
import Avatar from '@mui/material/Avatar';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { useNavigate } from 'react-router-dom';
import { updateUser } from '../../api-helpers/api-helpers'; // Ensure the correct path to the updateUser function

import NotificationsIcon from '@mui/icons-material/Notifications'; // Import NotificationsIcon
import IconButton from '@mui/material/IconButton'; // Import IconButton

// Helper function to convert string to color
function stringToColor(string) {
  let hash = 0;
  for (let i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }
  let color = '#';
  for (let i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  return color;
}

// Function to create avatar initials from name
function stringAvatar(name) {
  return {
    sx: {
      bgcolor: stringToColor(name),
    },
    children: `${name.split(' ')[0][0] || ''}${name.split(' ')[1] ? name.split(' ')[1][0] : ''}`,
  };
}

const HeaderForUser = () => {
  const [userDetails, setUserDetails] = useState({ id: '', name: '', email: '', role: '' });
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editProfileData, setEditProfileData] = useState({ fullName: '', password: '' });
  const navigate = useNavigate();

  // Decode token to get user details
  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    if (token) {
      const decoded = jwtDecode(token);
      console.log("Decoded Token:", decoded); // Log the decoded token for debugging
      setUserDetails({
        id: decoded.id || 'N/A', // Adjust this line according to the actual token structure
        name: decoded.fullName || 'N/A',
        email: decoded.sub || 'N/A',
        role: decoded.role || 'N/A',
      });
    }
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setIsEditing(false);
  };

  // Handle profile editing toggle
  const handleEditToggle = () => {
    setEditProfileData({ fullName: userDetails.name, password: '' });
    setIsEditing(!isEditing);
  };

  // Handle profile data change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditProfileData((prevData) => ({ ...prevData, [name]: value }));
  };

  // Save edited profile data
  const handleSave = async () => {
    const updatedUser = await updateUser(userDetails.id, {
      fullName: editProfileData.fullName,
      password: editProfileData.password,
    });

    if (updatedUser) {
      setUserDetails((prevDetails) => ({
        ...prevDetails,
        name: editProfileData.fullName,
      }));
      setIsEditing(false);
    }
  };

  return (
    <>
      <AppBar position="static">
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

            {/* Notifications Icon */}
            <Box sx={{ flexGrow: 1 }} />
            <IconButton
              color="inherit"
              sx={{ mr: 2}} // Add spacing
              onClick={() => alert('Notifications clicked!')} // Placeholder action
            >
              <NotificationsIcon sx={{ fontSize: '2rem' }}/>
            </IconButton>

            {/* Profile Icon */}
            <Avatar {...stringAvatar(userDetails.name)} onClick={handleOpen} sx={{ cursor: 'pointer', ml: 'auto', mr: 2 }} />
          </Toolbar>
        </Container>
      </AppBar>

      {/* User Details Modal */}
      <Modal open={open} onClose={handleClose}>
        <Box sx={{ padding: '20px', backgroundColor: '#fff', margin: '20px auto', width: '300px', borderRadius: '8px', boxShadow: 24 }}>
          <h2>User Details</h2>
          {!isEditing ? (
            <>
              <p>ID: {userDetails.id}</p>
              <p>Name: {userDetails.name}</p>
              <p>Email: {userDetails.email}</p>
              <p>Role: {userDetails.role}</p>
              <Button
                variant="contained"
                onClick={handleEditToggle}
                startIcon={<EditIcon />} // Add EditIcon here
                sx={{
                  mt: 2,
                  mb: 2,
                  color: '#fff',
                  backgroundColor: '#3f51b5',
                  '&:hover': {
                    backgroundColor: '#2c387e',
                  },
                  width: '100%',
                }}
              >
                EDIT PROFILE
              </Button>
            </>
          ) : (
            <>
              <TextField
                label="Full Name"
                name="fullName"
                value={editProfileData.fullName}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Password"
                name="password"
                type="password"
                value={editProfileData.password}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
              <Button
                variant="contained"
                onClick={handleSave}
                sx={{
                  mt: 2,
                  mb: 2,
                  color: '#fff',
                  backgroundColor: '#3f51b5',
                  '&:hover': {
                    backgroundColor: '#2c387e',
                  },
                  width: '100%',
                }}
              >
                SAVE
              </Button>
            </>
          )}

          {/* Logout Button inside Modal */}
          <Button
            variant="contained"
            endIcon={<LogoutIcon />}
            onClick={handleLogout}
            sx={{
              color: '#000',
              backgroundColor: '#f5f5f5',
              border: '1px solid #ccc',
              '&:hover': {
                backgroundColor: '#e0e0e0',
                border: '1px solid #bbb',
              },
              width: '100%',
            }}
          >
            LOGOUT
          </Button>
        </Box>
      </Modal>
    </>
  );
};

export default HeaderForUser;
