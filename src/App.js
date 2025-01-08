import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import FormDialog from './components/form/Form'; 
import PrincipalDashboard from './components/RoleDash/PrincipalDashboard';
import TeacherDashboard from './components/RoleDash/TeacherDashboard';
import StudentDashboard from './components/RoleDash/StudentDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import SubjectPage from './components/RoleDash/SubjectPage';
import MessagesPage from './components/RoleDash/MessagesPage';
import ChatPage from './components/RoleDash/ChatPage';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<FormDialog open={true} />} />
      <Route 
          path="/protected/principal" 
          element={
              <ProtectedRoute roles={['ROLE_PRINCIPAL']}>
                  <PrincipalDashboard />
              </ProtectedRoute>
          } 
      />
      <Route 
          path="/protected/teacher" 
          element={
              <ProtectedRoute roles={['ROLE_TEACHER']}>
                  <TeacherDashboard />
              </ProtectedRoute>
          } 
      />
      <Route 
          path="/protected/student" 
          element={
              <ProtectedRoute roles={['ROLE_STUDENT']}>
                  <StudentDashboard />
              </ProtectedRoute>
          } 
      />
      <Route path="/subject/:subjectId" element={<SubjectPage />} />
      <Route path="/messages" element={<MessagesPage />} />
      <Route path="/chat/:receiverId" element={<ChatPage />} />
    </Routes>
  );
};

export default App;