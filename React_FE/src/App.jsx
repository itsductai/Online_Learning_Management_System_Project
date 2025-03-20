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
import InstructorDashboard from "./pages/InstructorDashboard.jsx";

const DefaultRoute = () => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" />;

  // Điều hướng theo role của người dùng
  switch (user.role) {
    case "Admin":
      return <Navigate to="/dashboard" />;
    case "Instructor":
      return <Navigate to="/instructor/dashboard" />;
    case "Student":
      return <HomePage />; // Student sẽ hiển thị trang chủ
    default:
      return <Navigate to="/login" />;
  }
};



function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<ProtectedRoute roles={["Student"]}><DefaultRoute /></ProtectedRoute>} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/courses" element={<ProtectedRoute roles={["Student"]}><CoursesPage /></ProtectedRoute>} />
          <Route path="/courses/:courseId/lessons" element={ <ProtectedRoute roles={["Student"]}> <CourseLesson /> </ProtectedRoute>}/>

          <Route path="/profile" element={<ProtectedRoute roles={["Student", "Instructor"]}><ProfilePage /></ProtectedRoute>} />
          <Route path="/progress" element={<ProtectedRoute roles={["Student"]}> <ProgressPage /> </ProtectedRoute>} />

          {/* Admin Dashboard */}
          <Route path="/dashboard" element={<ProtectedRoute roles={["Admin"]}><Dashboard /></ProtectedRoute>} />
          <Route path="/admin/courses" element={<ProtectedRoute roles={["Admin"]}><CoursesManagement /></ProtectedRoute>}/>
          <Route path="/admin/courses/:courseId/lessons" element={<ProtectedRoute roles={["Admin"]}> <LessonManagement /> </ProtectedRoute>}/>

          {/* Instructor Dashboard */}
          <Route path="/instructor/dashboard" element={<ProtectedRoute roles={["Instructor"]}><InstructorDashboard /></ProtectedRoute>} />
          <Route path="/instructor/courses" element={<ProtectedRoute roles={["Instructor"]}><CoursesManagement /></ProtectedRoute>}/>
          <Route path="/instructor/courses/:courseId/lessons" element={<ProtectedRoute roles={["Instructor"]}> <LessonManagement /> </ProtectedRoute>}/>

        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
