import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Dashboard from "./pages/Dashboard";
import HomePage from "./pages/HomePage";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider, useAuth } from "./context/AuthContext.jsx";
import CoursesPage from "./pages/CoursesPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import CoursesManagement from "./pages/CoursesManagement.jsx";
import LessonManagement from "./pages/LessonManagement.jsx";
import CourseLesson from "./pages/CourseLesson.jsx";
import ProgressPage from "./pages/ProgressPage.jsx";

const DefaultRoute = () => {
  const { user } = useAuth();
  return user ? <HomePage /> : <Navigate to="/login" />;
};


function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<ProtectedRoute role="Student"><DefaultRoute /></ProtectedRoute>} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/courses" element={<ProtectedRoute role="Student"><CoursesPage /></ProtectedRoute>} />
          <Route path="/courses/:courseId/lessons" element={ <ProtectedRoute role="Student"> <CourseLesson /> </ProtectedRoute>}/>
          <Route path="/profile" element={<ProtectedRoute role="Student"><ProfilePage /></ProtectedRoute>} />
          <Route path="/progress" element={ <ProtectedRoute role="Student"> <ProgressPage /> </ProtectedRoute> } />
          <Route path="/dashboard" element={<ProtectedRoute role="Admin"><Dashboard /></ProtectedRoute>} />
          <Route path="/admin/courses" element={<ProtectedRoute role="Admin"><CoursesManagement /></ProtectedRoute>}/>
          <Route path="/admin/courses/:courseId/lessons" element={ <ProtectedRoute role="Admin"> <LessonManagement /> </ProtectedRoute> }/>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
