import React, { useState } from 'react';
import { registerStudent, createSubject, getAllCreatedSubjects } from '../../api-helpers/api-helpers'; // Import API helpers
import HeaderForUser from './HeaderForUser';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import Footer from '../Footer';

const TeacherDashboard = () => {
  // Student management states
  const [showStudentForm, setShowStudentForm] = useState(false); // Show/Hide student form
  const [studentData, setStudentData] = useState({ fullName: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [students, setStudents] = useState([]); // Store registered students

  // Subject management states
  const [showSubjectForm, setShowSubjectForm] = useState(false); // Show/Hide subject form
  const [subjectData, setSubjectData] = useState({
    name: '',
    year: 2024,
    grade: 'Grade 7',
    subjectClass: 'A',
  }); // Store subject data
  const [subjects, setSubjects] = useState([]); // Store created subjects

  // My Subjects states
  const [mySubjects, setMySubjects] = useState([]); // Store subjects created by the teacher
  const [showMySubjects, setShowMySubjects] = useState(false); // Toggle My Subjects view
  const [hoveredSubject, setHoveredSubject] = useState(null); // Track the subject being hovered over

  const navigate = useNavigate(); // Hook to navigate to subject page

  // Handle form submission for adding a new student
  const handleAddStudent = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const registeredStudent = await registerStudent(studentData);
      if (registeredStudent) {
        setStudents([...students, registeredStudent]);
        setStudentData({ fullName: '', email: '', password: '' });
        setShowStudentForm(false);
      } else {
        setError('Failed to register student.');
      }
    } catch (err) {
      setError('Error registering student.');
    } finally {
      setLoading(false);
    }
  };

  // Handle form submission for creating a subject
  const handleCreateSubject = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const createdSubject = await createSubject(subjectData); // Make API call to create subject
      if (createdSubject) {
        setSubjects([...subjects, createdSubject]);
        setSubjectData({ name: '', year: 2024, grade: 'Grade 7', subjectClass: 'A' });
        setShowSubjectForm(false); // Close the form after successful submission
      } else {
        setError('Failed to create subject.');
      }
    } catch (err) {
      setError('Error creating subject.');
    } finally {
      setLoading(false);
    }
  };

  // Handle fetching all created subjects
  const handleShowMySubjects = async () => {
    setError(null);
    setLoading(true);

    try {
      const fetchedSubjects = await getAllCreatedSubjects(); // Call API to fetch subjects
      if (fetchedSubjects) {
        setMySubjects(fetchedSubjects);
        setShowMySubjects(true); // Show the subjects
      } else {
        setError('Failed to fetch your subjects.');
      }
    } catch (err) {
      setError('Error fetching your subjects.');
    } finally {
      setLoading(false);
    }
  };

  // Navigate to the subject page when clicked
  const handleSubjectClick = (subjectId) => {
    navigate(`/subject/${subjectId}`); // Pass subjectId, not subjectName
  };
  

  return (
    <div>
      <HeaderForUser />
      <h1>Teacher Dashboard</h1>

      {/* Button to show form for adding a new student */}
      <button onClick={() => setShowStudentForm(!showStudentForm)}>
        {showStudentForm ? 'Cancel' : 'Add New Student'}
      </button>

      {/* Form for adding a new student */}
      {showStudentForm && (
        <form onSubmit={handleAddStudent}>
          <div>
            <label>Full Name:</label>
            <input
              type="text"
              value={studentData.fullName}
              onChange={(e) => setStudentData({ ...studentData, fullName: e.target.value })}
              required
            />
          </div>
          <div>
            <label>Email:</label>
            <input
              type="email"
              value={studentData.email}
              onChange={(e) => setStudentData({ ...studentData, email: e.target.value })}
              required
            />
          </div>
          <div>
            <label>Password:</label>
            <input
              type="password"
              value={studentData.password}
              onChange={(e) => setStudentData({ ...studentData, password: e.target.value })}
              required
            />
          </div>
          <button type="submit" disabled={loading}>
            {loading ? 'Adding...' : 'Add Student'}
          </button>
          {/* Display error message */}
          {error && <p style={{ color: 'red' }}>{error}</p>}
        </form>
      )}

      {/* Button to show form for creating a new subject */}
      <button
        onClick={() => setShowSubjectForm(!showSubjectForm)}
        style={{
          padding: '10px 20px',
          backgroundColor: '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
        }}
      >
        {showSubjectForm ? 'Cancel' : 'Create New Subject'}
      </button>

      {/* Popup form for creating a new subject */}
      {showSubjectForm && (
        <div className="popup-form">
          <div className="form-container">
            <h2>Create Subject</h2>
            <form onSubmit={handleCreateSubject}>
              <div>
                <label>Subject Name:</label>
                <input
                  type="text"
                  value={subjectData.name}
                  onChange={(e) => setSubjectData({ ...subjectData, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <label>Year:</label>
                <select
                  value={subjectData.year}
                  onChange={(e) => setSubjectData({ ...subjectData, year: e.target.value })}
                  required
                >
                  <option value={2024}>2024</option>
                  <option value={2025}>2025</option>
                  <option value={2026}>2026</option>
                </select>
              </div>
              <div>
                <label>Grade:</label>
                <select
                  value={subjectData.grade}
                  onChange={(e) => setSubjectData({ ...subjectData, grade: e.target.value })}
                  required
                >
                  <option value="Grade 7">Grade 7</option>
                  <option value="Grade 8">Grade 8</option>
                  <option value="Grade 9">Grade 9</option>
                  <option value="Grade 10">Grade 10</option>
                  <option value="Grade 11">Grade 11</option>
                </select>
              </div>
              <div>
                <label>Subject Class:</label>
                <select
                  value={subjectData.subjectClass}
                  onChange={(e) => setSubjectData({ ...subjectData, subjectClass: e.target.value })}
                  required
                >
                  <option value="A">A</option>
                  <option value="B">B</option>
                  <option value="C">C</option>
                  <option value="D">D</option>
                </select>
              </div>
              <button type="submit" disabled={loading}>
                {loading ? 'Creating...' : 'Create Subject'}
              </button>
            </form>
            {/* Display error message */}
            {error && <p style={{ color: 'red' }}>{error}</p>}
          </div>
        </div>
      )}

      {/* Button to fetch and display "My Subjects" */}
      <button
        onClick={handleShowMySubjects}
        style={{
          padding: '10px 20px',
          backgroundColor: '#2196F3',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          marginTop: '20px',
        }}
      >
        My Subjects
      </button>

      {/* Display fetched subjects */}
      {showMySubjects && (
  <div>
    <h2>My Subjects</h2>
    {mySubjects.length > 0 ? (
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
        <thead>
          <tr style={{ backgroundColor: '#2196F3', color: 'white' }}>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Subject Name</th>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Year</th>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Grade</th>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Class</th>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>ID</th>
          </tr>
        </thead>
        <tbody>
          {mySubjects.map((subject) => (
            <tr
              key={subject.id}
              onClick={() => handleSubjectClick(subject.id)}
              onMouseEnter={() => setHoveredSubject(subject.id)}
              onMouseLeave={() => setHoveredSubject(null)}
              style={{
                backgroundColor: hoveredSubject === subject.id ? '#f0f0f0' : 'transparent',
                cursor: 'pointer',
              }}
            >
              <td style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'center' }}>
                {subject.name}
              </td>
              <td style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'center' }}>
                {subject.year}
              </td>
              <td style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'center' }}>
                {subject.grade}
              </td>
              <td style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'center' }}>
                {subject.subjectClass}
              </td>
              <td style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'center' }}>
                {subject.id}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    ) : (
      <p>No subjects found.</p>
    )}
    <Footer/>
  </div>
)}

    </div>
  );
};

export default TeacherDashboard;
