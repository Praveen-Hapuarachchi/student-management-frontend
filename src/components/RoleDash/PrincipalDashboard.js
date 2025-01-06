import React, { useState, useEffect } from 'react';
import { getAllUsers, registerTeacher, deleteUser } from '../../api-helpers/api-helpers'; // Adjust path as necessary
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // Import jwtDecode
import HeaderForUser from '../../components/RoleDash/HeaderForUser';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Footer from '../Footer';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import Stack from '@mui/material/Stack';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));


const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

const PrincipalDashboard = () => {
  const [users, setUsers] = useState([]); // Store users data
  const [error, setError] = useState(null); // Handle errors
  const [loading, setLoading] = useState(false); // Show loading state
  const [showForm, setShowForm] = useState(false); // Show/Hide form
  const [teacherData, setTeacherData] = useState({ fullName: '', email: '', password: '', id: '' }); // Teacher form data
  const navigate = useNavigate();

  // Check if the user is a principal; if not, redirect to login
  useEffect(() => {
    const token = localStorage.getItem('jwtToken'); // Get token from local storage
    if (!token) {
      console.log('No token found, redirecting to login.');
      navigate('/login');
      return;
    }

    try {
      const decodedToken = jwtDecode(token);
      const role = decodedToken.role;

      if (role !== 'ROLE_PRINCIPAL' && role !== 'ROLE_PRINCIPLE') {
        console.log('Unauthorized access attempt, redirecting to login.');
        navigate('/login');
      }
    } catch (error) {
      console.error('Token decoding error:', error);
      localStorage.removeItem('jwtToken');
      navigate('/login');
    }
  }, [navigate]);

  // Fetch all users from the backend API when the component loads
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await getAllUsers();
        if (data) {
          setUsers(data);
        } else {
          setError('No users found.');
        }
      } catch (err) {
        setError('Failed to fetch users.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Handle form submission for adding a new teacher
  const handleAddTeacher = async (e) => {
    e.preventDefault(); // Prevent default form submission
    setError(null);
    setLoading(true);

    try {
      const registeredTeacher = await registerTeacher(teacherData);
      if (registeredTeacher) {
        // After successful registration, refresh the user list
        setUsers([...users, registeredTeacher]);
        setTeacherData({ fullName: '', email: '', password: '', id: '' }); // Clear form fields
        setShowForm(false); // Hide the form after submission
      } else {
        setError('Failed to register teacher.');
      }
    } catch (err) {
      setError('Error registering teacher.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Function to handle user deletion
  const handleDeleteUser = async (userId) => {
    const token = localStorage.getItem('jwtToken'); // Get the JWT token from local storage
    if (token) {
      const deletedUser = await deleteUser(userId, token);
      if (deletedUser) {
        // Refresh the user list after successful deletion
        setUsers(users.filter(user => user.id !== userId));
        console.log(`User with ID ${userId} deleted.`);
      } else {
        console.error('Failed to delete user.');
      }
    }
  };

  // Separate users into teachers and students
  const teachers = users.filter((user) => user.role === 'ROLE_TEACHER');
  const students = users.filter((user) => user.role === 'ROLE_STUDENT');

  return (
    <div>
      <HeaderForUser />
      <h1>Principal Dashboard</h1>

      {loading && <p>Loading...</p>} {/* Display loading state */}
      {error && <p style={{ color: 'red' }}>{error}</p>} {/* Display error message */}

      {/* Teachers Table */}
      {teachers.length > 0 && (
        <div>
          <h2>All Teachers</h2>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 700 }} aria-label="customized table">
              <TableHead>
                <TableRow>
                  <StyledTableCell>Name</StyledTableCell>
                  <StyledTableCell align="right">Email</StyledTableCell>
                  <StyledTableCell align="right">Role</StyledTableCell>
                  <StyledTableCell align="right">ID</StyledTableCell>
                  <StyledTableCell align="center">Action</StyledTableCell> {/* Center Action Column */}
                </TableRow>
              </TableHead>
              <TableBody>
                {teachers.map((teacher) => (
                  <StyledTableRow key={teacher.id}>
                    <StyledTableCell component="th" scope="row">
                      {teacher.fullName}
                    </StyledTableCell>
                    <StyledTableCell align="right">{teacher.email}</StyledTableCell>
                    <StyledTableCell align="right">{teacher.role}</StyledTableCell>
                    <StyledTableCell align="right">{teacher.id}</StyledTableCell>
                    <StyledTableCell align="center"> {/* Center Delete Button */}
                      <Stack direction="row" justifyContent="center" spacing={2}>
                        <Button
                          variant="outlined"
                          startIcon={<DeleteIcon />}
                          onClick={() => handleDeleteUser(teacher.id)}
                        >
                          Delete
                        </Button>
                      </Stack>
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      )}

      {/* Students Table */}
      {students.length > 0 && (
        <div>
          <h2>All Students</h2>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 700 }} aria-label="customized table">
              <TableHead>
                <TableRow>
                  <StyledTableCell>Name</StyledTableCell>
                  <StyledTableCell align="right">Email</StyledTableCell>
                  <StyledTableCell align="right">Role</StyledTableCell>
                  <StyledTableCell align="right">ID</StyledTableCell>
                  <StyledTableCell align="center">Action</StyledTableCell> {/* Center Action Column */}
                </TableRow>
              </TableHead>
              <TableBody>
                {students.map((student) => (
                  <StyledTableRow key={student.id}>
                    <StyledTableCell component="th" scope="row">
                      {student.fullName}
                    </StyledTableCell>
                    <StyledTableCell align="right">{student.email}</StyledTableCell>
                    <StyledTableCell align="right">{student.role}</StyledTableCell>
                    <StyledTableCell align="right">{student.id}</StyledTableCell>
                    <StyledTableCell align="center"> {/* Center Delete Button */}
                      <Stack direction="row" justifyContent="center" spacing={2}>
                        <Button
                          variant="outlined"
                          startIcon={<DeleteIcon />}
                          onClick={() => handleDeleteUser(student.id)}
                        >
                          Delete
                        </Button>
                      </Stack>
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      )}

      {/* Button to show form for adding a new teacher */}
      <button onClick={() => setShowForm(!showForm)}>
        {showForm ? 'Cancel' : 'Add New Teacher'}
      </button>

      {/* Form for adding a new teacher */}
      {showForm && (
        <form onSubmit={handleAddTeacher}>
          <div>
            <label>Full Name:</label>
            <input
              type="text"
              value={teacherData.fullName}
              onChange={(e) => setTeacherData({ ...teacherData, fullName: e.target.value })}
              required
            />
          </div>
          <div>
            <label>Email:</label>
            <input
              type="email"
              value={teacherData.email}
              onChange={(e) => setTeacherData({ ...teacherData, email: e.target.value })}
              required
            />
          </div>
          <div>
            <label>Password:</label>
            <input
              type="password"
              value={teacherData.password}
              onChange={(e) => setTeacherData({ ...teacherData, password: e.target.value })}
              required
            />
          </div>
          <button type="submit" disabled={loading}>
            {loading ? 'Adding...' : 'Add Teacher'}
          </button>
        </form>
      )}
      <Footer />
    </div>
  );
};

export default PrincipalDashboard;
