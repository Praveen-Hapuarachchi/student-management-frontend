// api-helpers.js
import axios from "axios";

// Get all users using axios
export const getAllUsers = async () => {
    try {
        // Retrieve the token from local storage
        const token = localStorage.getItem('jwtToken');
        
        const res = await axios.get("http://localhost:8050/users/all", {
            headers: {
                'Authorization': `Bearer ${token}`, // Attach the Bearer token
                'Content-Type': 'application/json'
            }
        });
        console.log("Full response from API:", res); // Log the entire response

        if (res && res.status === 200) {
            console.log("Users data:", res.data); // Log the users data
            return res.data; // Return the user data if the request was successful
        } else {
            console.log("No Data");
            return null;
        }
    } catch (error) {
        console.error("Error fetching users:", error.response ? error.response.data : error.message);
        return null; // Handle errors
    }
};

// Function to send user authentication request
export const sendUserAuthRequest = async (data) => {
    try {
        const res = await axios.post("http://localhost:8050/auth/login", {
            email: data.email,
            password: data.password,
        });

        if (res && res.status === 200) {
            console.log('Login successful:', res.data); // Log the full response data

            // Store the JWT token and user role in localStorage
            const { token, expiresIn, role, id } = res.data;
            localStorage.setItem('jwtToken', token); // Save token to localStorage

            // Log the token, expiresIn, and role separately
            console.log('Token:', token);
            console.log('Expires In:', expiresIn);
            console.log('Role:', role);
            console.log('ID:', id);

            return res.data; // Return the response data directly
        } else {
            console.error("Unexpected error during login.");
            return null; // Return null if there's an error
        }
    } catch (error) {
        console.error("Error during authentication:", error.response ? error.response.data : error.message);
        return null; // Return null in case of error
    }
};

// Function to register a new teacher
export const registerTeacher = async (teacherData) => {
    try {
        const res = await axios.post("http://localhost:8050/auth/signup", {
            fullName: teacherData.fullName,
            email: teacherData.email,
            password: teacherData.password,
            role: 'TEACHER', // Set the role as a teacher
        });

        if (res && res.status === 200) {
            console.log('Teacher registered successfully:', res.data);
            return res.data; // Return the registered teacher's data
        } else {
            console.error("Error registering teacher.");
            return null;
        }
    } catch (error) {
        console.error("Error during teacher registration:", error.response ? error.response.data : error.message);
        return null;
    }
};

// Function to register a student
export const registerStudent = async (studentData) => {
    try {
        const res = await axios.post("http://localhost:8050/auth/signup", {
            fullName: studentData.fullName,
            email: studentData.email,
            password: studentData.password,
            role: 'STUDENT',  // Set the role as a student
        });

        if (res && res.status === 200) {
            console.log('Student registered successfully:', res.data);
            return res.data;  // Return the registered student's data
        } else {
            console.error("Error registering student.");
            return null;
        }
    } catch (error) {
        console.error("Error during student registration:", error.response ? error.response.data : error.message);
        return null;
    }
};



// Function to delete a user
export const deleteUser = async (userId, token) => {
    try {
        const res = await axios.delete(`http://localhost:8050/auth/delete/${userId}`, {
            headers: {
                Authorization: `Bearer ${token}`,  // Include the token in the Authorization header
            },
        });

        if (res && res.status === 200) {
            console.log(`User with ID ${userId} has been deleted successfully.`);
            return res.data;  // Return the success message
        } else {
            console.error("Error deleting user.");
            return null;
        }
    } catch (error) {
        console.error("Error during user deletion:", error.response ? error.response.data : error.message);
        return null;
    }
};



// Function to get the authenticated user's information
export const getAuthenticatedUser = async () => {
    try {
        // Retrieve the token from local storage
        const token = localStorage.getItem('jwtToken');

        const res = await axios.get("http://localhost:8050/users/me", {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (res && res.status === 200) {
            console.log("Authenticated user data:", res.data); // Log the user data
            return res.data; // Return the authenticated user's data
        } else {
            console.log("No user data available");
            return null;
        }
    } catch (error) {
        console.error("Error fetching authenticated user:", error.response ? error.response.data : error.message);
        return null; // Handle errors
    }
};

export const updateUser = async (userId, userData) => {
    try {
      const token = localStorage.getItem('jwtToken');
      const res = await axios.put(`http://localhost:8050/users/${userId}`, userData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      console.log('User updated successfully:', res.data);
      return res.data;
    } catch (error) {
      console.error('Error updating user:', error.response ? error.response.data : error.message);
      return null;
    }
  };



  export const createSubject = async (subjectData) => {
    try {
        const response = await fetch('http://localhost:8050/api/subjects/create', { // Use port 8050
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('jwtToken')}`, // assuming JWT is stored in localStorage
            },
            body: JSON.stringify(subjectData),
        });

        if (!response.ok) {
            throw new Error('Failed to create subject');
        }

        return await response.json();
    } catch (error) {
        console.error('Error creating subject:', error);
        return null;
    }
};

// Function to get all created subjects
export const getAllCreatedSubjects = async () => {
    try {
        // Retrieve the token from local storage
        const token = localStorage.getItem('jwtToken');

        // Make the GET request to fetch all created subjects
        const res = await axios.get("http://localhost:8050/api/subjects/my-subjects", {
            headers: {
                Authorization: `Bearer ${token}`, // Attach the Bearer token
                'Content-Type': 'application/json',
            },
        });

        if (res && res.status === 200) {
            console.log('Fetched subjects successfully:', res.data);
            return res.data; // Return the list of subjects
        } else {
            console.error('Failed to fetch subjects:', res.statusText);
            return null;
        }
    } catch (error) {
        console.error('Error fetching subjects:', error.response ? error.response.data : error.message);
        return null; // Return null in case of error
    }
};

// Function to fetch a specific subject by ID
export const getSubjectById = async (subjectId) => {
    try {
        const token = localStorage.getItem('jwtToken');
        const res = await axios.get(`http://localhost:8050/api/subjects/${subjectId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (res && res.status === 200) {
            console.log('Fetched subject successfully:', res.data);
            return res.data;
        } else {
            console.error('Failed to fetch subject:', res.statusText);
            return null;
        }
    } catch (error) {
        console.error('Error fetching subject:', error.response ? error.response.data : error.message);
        return null;
    }
};

export const getAllSubjects = async () => {
    try {
        const token = localStorage.getItem('jwtToken'); // Retrieve the JWT token
        const res = await axios.get("http://localhost:8050/api/subjects/all", {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (res.status === 200) {
            console.log("Subjects data:", res.data); // Log the response data
            return res.data; // Return the data
        } else {
            console.error("Failed to fetch subjects.");
            return null;
        }
    } catch (error) {
        console.error("Error fetching subjects:", error.response ? error.response.data : error.message);
        return null; // Handle errors gracefully
    }
};



// Function to get enrolled students for a specific subject
export const getEnrolledStudents = async (subjectId) => {
    try {
        const token = localStorage.getItem('jwtToken');
        const response = await axios.get(`http://localhost:8050/api/subjects/${subjectId}/students`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            }
        });

        if (response && response.status === 200) {
            console.log("Enrolled students:", response.data);  // Log the enrolled students
            return response.data;  // Return the list of enrolled students
        } else {
            console.error("Error fetching enrolled students.");
            return [];
        }
    } catch (error) {
        console.error("Error fetching enrolled students:", error.response ? error.response.data : error.message);
        return [];
    }
};

// Function to get all enrolled subjects for the authenticated student
export const getEnrolledSubjects = async () => {
    try {
        // Retrieve the JWT token from local storage
        const token = localStorage.getItem('jwtToken');

        // Make the GET request to fetch enrolled subjects
        const res = await axios.get("http://localhost:8050/api/subjects/enrolled", {
            headers: {
                'Authorization': `Bearer ${token}`, // Include the Bearer token
                'Content-Type': 'application/json'
            }
        });

        if (res && res.status === 200) {
            console.log("Enrolled subjects:", res.data); // Log the enrolled subjects data
            return res.data; // Return the enrolled subjects
        } else {
            console.error("Failed to fetch enrolled subjects.");
            return null; // Return null if there's an issue
        }
    } catch (error) {
        console.error("Error fetching enrolled subjects:", error.response ? error.response.data : error.message);
        return null; // Handle errors gracefully
    }
};

export const getMaterials = async (subjectId) => {
  try {
    const response = await axios.get(`http://localhost:8050/api/subjects/${subjectId}/materials`);
    return response.data;
  } catch (error) {
    console.error("Error fetching materials:", error);
    throw error;
  }
};




// Function to remove a material from a subject
export const removeMaterial = async (subjectId, materialId) => {
    const token = localStorage.getItem('jwtToken');

    if (!token) {
        console.error("No token found. Please log in.");
        return null;
    }

    try {
        const response = await axios.delete(
            `http://localhost:8050/api/subjects/${subjectId}/materials/${materialId}`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            }
        );

        if (response.status === 200) {
            console.log("Material deleted successfully");
            return true; // Indicate success
        } else {
            console.error("Failed to delete material");
            return false;
        }
    } catch (error) {
        console.error("Error deleting material:", error.response ? error.response.data : error.message);
        return false; // Indicate failure
    }
};



// Function to get announcements for a specific subject
export const getAnnouncements = async (subjectId) => {
    try {
        const token = localStorage.getItem('jwtToken');
        const response = await axios.get(`http://localhost:8050/api/announcements/subject/${subjectId}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            }
        });

        if (response && response.status === 200) {
            return response.data; // Return the list of announcements
        } else {
            console.error("Error fetching announcements.");
            return [];
        }
    } catch (error) {
        console.error("Error fetching announcements:", error.response ? error.response.data : error.message);
        return [];
    }
};


// Function to create a new announcement
export const createAnnouncement = async (announcementData) => {
    try {
        const token = localStorage.getItem('jwtToken');
        const response = await axios.post('http://localhost:8050/api/announcements/create', announcementData, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            }
        });

        if (response && response.status === 201) {
            return response.data; // Return the created announcement
        } else {
            console.error("Error creating announcement:", response.status, response.data);
            return null;
        }
    } catch (error) {
        console.error("Error creating announcement:", error.response ? error.response.data : error.message);
        return null;
    }
};


// Function to delete an announcement
export const deleteAnnouncement = async (announcementId) => {
    try {
        const token = localStorage.getItem('jwtToken');
        const response = await axios.delete(`http://localhost:8050/api/announcements/delete/${announcementId}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        });

        if (response && response.status === 200) {
            console.log("Announcement deleted successfully");
            return response.data;
        } else {
            console.error("Error deleting announcement:", response.status, response.data);
            return null;
        }
    } catch (error) {
        console.error("Error deleting announcement:", error.response ? error.response.data : error.message);
        return null;
    }
};





export const getMessages = async (userId) => {
    try {
      const token = localStorage.getItem('jwtToken'); // Assuming the token is saved in localStorage
      const response = await axios.get(`http://localhost:8050/api/messages/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw new Error('Error fetching messages');
    }
  };
  

  export const sendMessage = async (messageData) => {
    try {
      const token = localStorage.getItem('jwtToken'); // Get the JWT token from localStorage
      const response = await axios.post(
        'http://localhost:8050/api/messages/send', 
        messageData,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Pass the token in the Authorization header
          }
        }
      );
      return response.data;
    } catch (error) {
      throw new Error('Error sending message');
    }
  };
  


