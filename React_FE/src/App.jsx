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

const DefaultRoute = () => {
  const { user } = useAuth();
  return user ? <HomePage /> : <Navigate to="/login" />;
};


function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<DefaultRoute />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/courses" element={<CoursesPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/dashboard" element={<ProtectedRoute role="Admin"><Dashboard /></ProtectedRoute>} />
          <Route path="/admin/courses" element={<ProtectedRoute role="Admin"><CoursesManagement /></ProtectedRoute>}/>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
