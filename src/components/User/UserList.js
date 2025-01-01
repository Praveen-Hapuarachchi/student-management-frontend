import React, { useState } from 'react';
import axios from 'axios';
import { Button } from '@mui/material';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('/users/all');
      setUsers(response.data);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <Button 
        variant="contained"
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
        onClick={fetchUsers}  // Corrected function call
      >
        Get Users List
      </Button>
      {error && <p>Error: {error}</p>}
      {users.length > 0 && (  // Corrected 'admins' to 'users'
        <ul>
          {users.map((user) => (
            <li key={user.email}> {/* Ensure email is unique */}
              {user.email}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UserList;
