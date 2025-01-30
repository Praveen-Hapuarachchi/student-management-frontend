import React, { useState } from 'react';
import { Dialog, DialogContent, DialogTitle, Button, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { sendUserAuthRequest } from '../../api-helpers/api-helpers';
import {jwtDecode} from 'jwt-decode'; // Correct import

const FormDialog = ({ open = false, onClose }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await sendUserAuthRequest({ email, password });

            if (response && response.token) {
                const token = response.token;
                localStorage.setItem('jwtToken', token);

                // Decode the token
                const decodedToken = jwtDecode(token);
                console.log('Decoded Token:', decodedToken); // Debug log

                const userRole = decodedToken.role;
                const userId = decodedToken.id; // Assuming 'userId' exists in the decoded token
                const userName = decodedToken.fullName; // Assuming 'userName' exists in the decoded token
                console.log('User Role:', userRole); // Debug log
                console.log('User ID:', userId); // Debug log

                // Save the userId in localStorage
                localStorage.setItem('userId', userId);
                localStorage.setItem('userName', userName);
                

                // Direct navigation based on the user role
                if (userRole === 'ROLE_PRINCIPAL') {
                    console.log('Navigating to Principal Dashboard'); // Debug log
                    navigate('/protected/principal');
                } else if (userRole === 'ROLE_TEACHER') {
                    console.log('Navigating to Teacher Dashboard'); // Debug log
                    navigate('/protected/teacher');
                } else if (userRole === 'ROLE_STUDENT') {
                    console.log('Navigating to Student Dashboard'); // Debug log
                    navigate('/protected/student');
                } else {
                    setError('Unknown role, unable to navigate.');
                    console.error('Unrecognized role:', userRole); // Debug log
                }
            } else {
                setError('Login failed. Please check your credentials.');
            }
        } catch (error) {
            setError('An error occurred during login.');
            console.error('Login error:', error); // Debug log
        }
    };

    return (
        <Dialog open={open} onClose={onClose} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">Login</DialogTitle>
            <DialogContent>
                <form onSubmit={handleFormSubmit}>
                    <TextField
                        label="Email"
                        type="email"
                        fullWidth
                        margin="normal"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <TextField
                        label="Password"
                        type="password"
                        fullWidth
                        margin="normal"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    <Button type="submit" variant="contained" color="primary" fullWidth>
                        Login
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default FormDialog;