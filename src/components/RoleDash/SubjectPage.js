import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getSubjectById , removeMaterial ,getAnnouncements , createAnnouncement ,deleteAnnouncement} from '../../api-helpers/api-helpers';
import HeaderForUser from './HeaderForUser';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { Button, List, ListItem, ListItemText, TextField ,IconButton } from '@mui/material';

import { Description, PictureAsPdf, InsertDriveFile, Image } from '@mui/icons-material';
import DeleteIcon from '@mui/icons-material/Delete'; // Import DeleteIcon


// Function to get the appropriate icon based on file type
const getFileIcon = (fileType) => {
    switch (fileType) {
        case 'application/pdf':
            return <PictureAsPdf style={{ marginRight: '8px' }} />;
        case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        case 'application/msword':
            return <Description style={{ marginRight: '8px' }} />;
        case 'image/png':
        case 'image/jpeg':
            return <Image style={{ marginRight: '8px' }} />;
        default:
            return <InsertDriveFile style={{ marginRight: '8px' }} />; // Default icon for unknown types
    }
};

// Function to get current user roles from the token
const getCurrentUserRoles = () => {
    const token = localStorage.getItem('jwtToken');
    if (token) {
        const payload = JSON.parse(atob(token.split('.')[1]));
        // Return the role as a string instead of an array if there's only one role
        return payload.role ? payload.role : '';
    }
    return '';
};

const SubjectPage = () => {
    const { subjectId } = useParams(); // Extract subjectId from route parameters
    const [subject, setSubject] = useState(null);
    const [error, setError] = useState(null);
    const [enrollmentStatus, setEnrollmentStatus] = useState(false); // To track enrollment status
    const [enrolledStudents, setEnrolledStudents] = useState([]); // List of enrolled students
    const [file, setFile] = useState(null); // Store the selected file
    const [materials, setMaterials] = useState([]); // Initialize materials state
    
    const [announcements, setAnnouncements] = useState([]); // State for announcements
    const [announcementTitle, setAnnouncementTitle] = useState(''); // State for announcement title
    const [announcementDescription, setAnnouncementDescription] = useState(''); // State for announcement description
    const [scheduledFor, setScheduledFor] = useState(''); // State for scheduledFor

    const roles = getCurrentUserRoles();
    const isTeacher = roles === 'ROLE_TEACHER'; // Simplified role checking
    const isStudent = roles === 'ROLE_STUDENT'; // Check for student role

    useEffect(() => {
        const fetchSubject = async () => {
            try {
                if (subjectId) {
                    const fetchedSubject = await getSubjectById(subjectId);
                    setSubject(fetchedSubject);
                } else {
                    setError('Invalid subject ID.');
                }
            } catch (err) {
                setError('Error fetching subject.');
            }
        };

        const fetchAnnouncements = async () => {
            try {
                const data = await getAnnouncements(subjectId);
                setAnnouncements(data);
            } catch (err) {
                console.error('Error fetching announcements:', err);
            }
        };

        // Fetch subject details
        fetchSubject();
        fetchAnnouncements();

        // Check enrollment status for student
        const checkEnrollmentStatus = async () => {
            const token = localStorage.getItem('jwtToken');
            if (!token) {
                console.error("No token found. Please log in.");
                return;
            }
            const decodedToken = jwtDecode(token); // Decode the token
            const studentId = decodedToken.id; // Get the student ID from the token

            try {
                const response = await axios.get(`http://localhost:8050/api/subjects/${subjectId}/enrollment-status`, {
                    params: { studentId: studentId },
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                });

                if (response.data.isEnrolled) {
                    setEnrollmentStatus(true); // Set enrollment status to true
                } else {
                    setEnrollmentStatus(false); // Set enrollment status to false
                }
            } catch (error) {
                console.error("Error checking enrollment status:", error.response ? error.response.data : error.message);
                setEnrollmentStatus(false); // Set failure state in case of error
            }
        };

        // Fetch enrolled students for teacher
        const fetchEnrolledStudents = async () => {
            try {
                const token = localStorage.getItem('jwtToken');
                const response = await axios.get(`http://localhost:8050/api/subjects/${subjectId}/students`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    }
                });

                if (response && response.status === 200) {
                    setEnrolledStudents(response.data); // Set enrolled students
                } else {
                    console.error("Error fetching enrolled students.");
                }
            } catch (error) {
                console.error("Error fetching enrolled students:", error.response ? error.response.data : error.message);
            }
        };

         // Fetch materials for teacher or student
         const fetchMaterials = async () => {
            try {
                const token = localStorage.getItem('jwtToken');
                const response = await axios.get(`http://localhost:8050/api/subjects/${subjectId}/materials`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    }
                });

                if (response && response.status === 200) {
                    setMaterials(response.data); // Set materials
                } else {
                    console.error("Error fetching materials.");
                }
            } catch (error) {
                console.error("Error fetching materials:", error.response ? error.response.data : error.message);
            }
        };

        // Check if the student is already enrolled when component is mounted
        if (isStudent) {
            checkEnrollmentStatus();
            fetchMaterials();
        }

        // Fetch enrolled students for the teacher when component is mounted
        if (isTeacher) {
            fetchEnrolledStudents();
            fetchMaterials();
        }

    }, [subjectId, isStudent, isTeacher]);

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        setFile(selectedFile); // Store the selected file
    };

    const handleFileUpload = async () => {
        if (!file) {
            console.error("No file selected.");
            return;
        }

        const token = localStorage.getItem('jwtToken');
        if (!token) {
            console.error("No token found. Please log in.");
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.post(`http://localhost:8050/api/subjects/${subjectId}/materials/upload`, formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.status === 200) {
                console.log("Material uploaded successfully");
            } else {
                console.error("Failed to upload material");
            }
        } catch (error) {
            console.error("Error uploading material:", error.response ? error.response.data : error.message);
        }
    };

    const handleEnroll = async () => {
        const token = localStorage.getItem('jwtToken');

        if (!token) {
            console.error("No token found. Please log in.");
            return;
        }

        // Decode the token to get the student ID (you can use a library like jwt-decode)
        const decodedToken = jwtDecode(token);
        const studentId = decodedToken.id; // Get the student ID from the decoded token

        try {
            // Make the POST request with subjectId and studentId as query params
            const response = await axios.post(`http://localhost:8050/api/subjects/${subjectId}/enroll`, null, {
                params: { studentId: studentId },
                headers: {
                    Authorization: `Bearer ${token}`, // Add the token in Authorization header
                }
            });

            if (response.status === 200) {
                console.log("Student enrolled successfully");
                setEnrollmentStatus(true); // Update enrollment status to true after successful enrollment
            } else {
                console.error("Failed to enroll in the subject");
                setEnrollmentStatus(false); // Set failure state
            }
        } catch (error) {
            console.error("Error enrolling student:", error.response ? error.response.data : error.message);
            setEnrollmentStatus(false); // Set failure state in case of error
        }
    };

   

    const handleRemoveMaterial = async (materialId) => {
        const isSuccess = await removeMaterial(subjectId, materialId);
        if (isSuccess) {
            // Update materials list after successful deletion
            setMaterials((prevMaterials) => prevMaterials.filter((material) => material.id !== materialId));
        } else {
            console.error("Could not delete material.");
        }
    };

    const handleCreateAnnouncement = async () => {
        const token = localStorage.getItem('jwtToken');
        if (!token) {
            console.error("No token found. Please log in.");
            return;
        }
    
        const newAnnouncement = {
            subjectId: subjectId,
            title: announcementTitle,
            description: announcementDescription,
            scheduledFor: new Date(scheduledFor).toISOString().slice(0, 19),
        };
    
        console.log("JWT Token:", token);  // Log the token
        console.log("New Announcement Payload:", newAnnouncement);  // Log the payload
    
        try {
            const response = await createAnnouncement(newAnnouncement);
            if (response) {
                setAnnouncements((prev) => [...prev, response]);
                setAnnouncementTitle('');
                setAnnouncementDescription('');
                setScheduledFor('');
            }
        } catch (err) {
            console.error("Error creating announcement:", err);
        }
    };

    const handleDeleteAnnouncement = async (announcementId) => {
        const response = await deleteAnnouncement(announcementId);
        if (response) {
            // Update the UI after successful deletion (e.g., remove the deleted announcement from the list)
            setAnnouncements(prev => prev.filter(announcement => announcement.id !== announcementId));
        }
    };
    
    

    
    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            <HeaderForUser />
            <h1>Subject Details</h1>
            {subject ? (
                <div>
                    <p><strong>ID:</strong> {subject.id || 'N/A'}</p>
                    <p><strong>Teacher:</strong> {subject?.teacher?.fullName || 'N/A'}</p>
                    <p><strong>Email:</strong> {subject?.teacher?.email || 'N/A'}</p>
                    <p><strong>Name:</strong> {subject.name || 'N/A'}</p>
                    <p><strong>Year:</strong> {subject.year || 'N/A'}</p>
                    <p><strong>Grade:</strong> {subject.grade || 'N/A'}</p>
                    <p><strong>Class:</strong> {subject.subjectClass || 'N/A'}</p>

                    {isTeacher && (
                        <div>
                            <h3>Create Announcement</h3>
                            <TextField
                                label="Title"
                                value={announcementTitle}
                                onChange={(e) => setAnnouncementTitle(e.target.value)}
                                fullWidth
                                margin="normal"
                            />
                            <TextField
                                label="Description"
                                value={announcementDescription}
                                onChange={(e) => setAnnouncementDescription(e.target.value)}
                                fullWidth
                                margin="normal"
                            />
                            <TextField
                                label="Scheduled For"
                                type="datetime-local" // Use datetime-local for date and time input
                                value={scheduledFor}
                                onChange={(e) => setScheduledFor(e.target.value)}
                                fullWidth
                                margin="normal"
                            />
                            <Button variant="contained" color="primary" onClick={handleCreateAnnouncement}>
                                Create Announcement
                            </Button>
                        </div>
                    )}
                    <h3>Announcements</h3>
                    <List>
                        {announcements.map((announcement) => (
                            <ListItem key={announcement.id}>
                                <ListItemText
                                    primary={announcement.title}
                                    secondary={`${announcement.description} (Scheduled for: ${new Date(announcement.scheduledFor).toLocaleString()})`}
                                />
                                {isTeacher && (
                                    <IconButton
                                    edge="end"
                                    color="error"
                                    onClick={() => handleDeleteAnnouncement(announcement.id)}
                                >
                                    <DeleteIcon />
                                </IconButton>
                                )}
                            </ListItem>
                        ))}
                    </List>

                    {isTeacher && (
                        <div>
                            <h3>Upload Subject Material</h3>
                            <input
                                type="file"
                                onChange={handleFileChange}
                                accept=".pdf,.docx,.jpg,.png" // Accepting common file types
                            />
                            <button onClick={handleFileUpload}>Upload Material</button>

                            <h2>Enrolled Students</h2>
                            <ul>
                                {enrolledStudents.length > 0 ? (
                                    enrolledStudents.map((student) => (
                                        <li key={student.id}>
                                            {student.fullName} - {student.email}
                                        </li>
                                    ))
                                ) : (
                                    <p>No students enrolled in this subject yet.</p>
                                )}
                            </ul>
                        </div>
                    )}

                    {isStudent && (
                        <div style={{ marginTop: '20px' }}>
                            {!enrollmentStatus ? (
                                <Button 
                                    style={{
                                        padding: '10px 20px',
                                        backgroundColor: '#007bff',
                                        color: '#fff',
                                        border: 'none',
                                        borderRadius: '5px',
                                        cursor: 'pointer',
                                        fontSize: '16px',
                                    }}
                                    onClick={handleEnroll}
                                >
                                    Enroll
                                </Button >
                            ) : (
                                <p style={{ color: 'green', marginTop: '10px' }}>
                                    You are enrolled successfully in this subject.
                                </p>
                            )}
                        </div>
                    )}

                    {/* Display materials for teacher and student */}
                    {(isTeacher || enrollmentStatus) && materials && materials.length > 0 ? (
                        <div>
                            <h3>Lecture Materials</h3>
                            <List>
                                {materials.map((material, id) => (
                                    <ListItem key={id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                            {getFileIcon(material.fileType)} {/* Display the appropriate icon */}
                                            <ListItemText primary={material.fileName} secondary={material.fileType} />
                                        </div>
                                        <div>
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                href={`http://localhost:8050/api/subjects/${subjectId}/materials/${material.id}/download`}  // Make sure the URL is correct
                                                target="_blank"
                                                download={material.fileName}  // Ensure the file name (with extension) is passed
                                                style={{ marginRight: '10px' }}
                                                onClick={(e) => {
                                                    // Prevent the default action of the href
                                                    e.preventDefault();
                                            
                                                    // Retrieve the JWT token from localStorage
                                                    const token = localStorage.getItem("jwtToken");
                                            
                                                    if (token) {
                                                        // Make the API request with the Authorization header
                                                        fetch(`http://localhost:8050/api/subjects/${subjectId}/materials/${material.id}/download`, {
                                                            method: 'GET',
                                                            headers: {
                                                                'Authorization': `Bearer ${token}`  // Send token in the Authorization header
                                                            }
                                                        })
                                                        .then(response => {
                                                            if (response.ok) {
                                                                return response.blob();  // Get the response as a Blob
                                                            } else {
                                                                throw new Error('Failed to download file');
                                                            }
                                                        })
                                                        .then(blob => {
                                                            // Create a link to trigger the download of the file
                                                            const url = window.URL.createObjectURL(blob);
                                                            const link = document.createElement('a');
                                                            link.href = url;
                                                            link.setAttribute('download', material.fileName);  // Set the filename
                                                            document.body.appendChild(link);
                                                            link.click();
                                                            link.remove();
                                                        })
                                                        .catch(error => {
                                                            console.error('Error during download:', error);
                                                        });
                                                    } else {
                                                        console.error('No token found, authentication required');
                                                    }
                                                }}
                                            >
                                                Download
                                            </Button>
                                            {isTeacher && (
                                                <Button
                                                    variant="contained"
                                                    color="secondary"
                                                    onClick={() => handleRemoveMaterial(material.id)}
                                                >
                                                    Remove
                                                </Button>
                                            )}
                                        </div>
                                    </ListItem>
                                ))}
                            </List>
                        </div>
                    ) : (
                        <p>No materials available.</p>
                    )}
                </div>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
};

export default SubjectPage;
