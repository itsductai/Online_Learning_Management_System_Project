import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import HomePage from "./pages/HomePage";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider, useAuth } from "./context/AuthContext";

const DefaultRoute = () => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;

  return user.role === "Admin" ? <Dashboard /> : <HomePage />;
};


function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<DefaultRoute />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<ProtectedRoute role="Admin"><Dashboard /></ProtectedRoute>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
