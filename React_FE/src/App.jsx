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
import InstructorCourseManagement from "./components/instructor/CourseManagement.jsx";
import LessonManagement from "./pages/LessonManagement.jsx";
import InstructorLessonManagement from "./pages/instructor/LessonManagement.jsx";
import CourseLesson from "./pages/CourseLesson.jsx";
import ProgressPage from "./pages/ProgressPage.jsx";
import InstructorDashboard from "./pages/InstructorDashboard.jsx";
import InstructorManagement from "./pages/admin/InstructorManagement";
import StudentManagement from "./pages/admin/StudentManagement";
import CheckoutSuccess from "./pages/checkout/CheckoutSuccess.jsx";
import CheckoutMomoSuccess from "./pages/checkout/CheckoutMomoSuccess.jsx";
import PaymentManager from "./pages/admin/PaymentManager"
import CouponManager from "./pages/admin/CouponManager"
import InstructorStudentManagement from "./pages/instructor/StudentManagement.jsx";
import ChatPage from "./pages/chat/ChatPage.jsx";
import UserProfilePage from "./pages/UserProfilePage.jsx"
import { UnreadProvider, useUnread } from "./context/UnreadContext.jsx";
import AIManager from "./pages/admin/AIManager";


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
    <UnreadProvider>
      <Router>
        <Routes>
          <Route path="/" element={<ProtectedRoute roles={["Student"]}><DefaultRoute /></ProtectedRoute>} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/courses" element={<ProtectedRoute roles={["Student"]}><CoursesPage /></ProtectedRoute>} />
          <Route path="/courses/:courseId/lessons" element={ <ProtectedRoute roles={["Student"]}> <CourseLesson /> </ProtectedRoute>}/>

          <Route path="/profile" element={<ProtectedRoute roles={["Student", "Instructor"]}><ProfilePage /></ProtectedRoute>} />
          <Route path="/progress" element={<ProtectedRoute roles={["Student"]}> <ProgressPage /> </ProtectedRoute>} />
          {/* User Profile Route */}
          <Route path="/u/:userId" element={ <ProtectedRoute roles={["Admin", "Instructor", "Student"]}> <UserProfilePage />  </ProtectedRoute> }/>
          {/* Admin Dashboard */}
          <Route path="/dashboard" element={<ProtectedRoute roles={["Admin"]}><Dashboard /></ProtectedRoute>} />
          <Route path="/admin/courses" element={<ProtectedRoute roles={["Admin"]}><CoursesManagement /></ProtectedRoute>}/>
          <Route path="/admin/courses/:courseId/lessons" element={<ProtectedRoute roles={["Admin"]}> <LessonManagement /> </ProtectedRoute>}/>
          <Route path="/admin/ai-manager" element={<ProtectedRoute roles={["Admin"]}> <AIManager /> </ProtectedRoute>} />

          {/* Thêm route mới cho quản lý giảng viên và học viên */}
          <Route path="/admin/instructors" element={<ProtectedRoute roles={["Admin"]}><InstructorManagement /></ProtectedRoute>}/>
          <Route path="/admin/students" element={<ProtectedRoute roles={["Admin"]}><StudentManagement /></ProtectedRoute>}/>
          <Route path="/admin/payments" element={<ProtectedRoute roles={["Admin"]}><PaymentManager /></ProtectedRoute>} />
          <Route path="/admin/coupons" element={<ProtectedRoute roles={["Admin"]}><CouponManager /></ProtectedRoute>} />

          {/* Instructor Dashboard */}
          <Route path="/instructor/dashboard" element={<ProtectedRoute roles={["Instructor"]}><InstructorDashboard /></ProtectedRoute>} />
          <Route path="/instructor/courses" element={<ProtectedRoute roles={["Instructor"]}><InstructorCourseManagement /></ProtectedRoute>}/>
          <Route path="/instructor/courses/:courseId/lessons" element={<ProtectedRoute roles={["Instructor"]}> <InstructorLessonManagement /> </ProtectedRoute>}/>
          <Route path="/instructor/students" element={<ProtectedRoute roles={["Instructor"]}><InstructorStudentManagement /></ProtectedRoute>}/>

          
          {/* Checkout routes */}
          <Route path="/checkout/momo-success" element={<CheckoutMomoSuccess />} />
          <Route path="/checkout/success" element={<CheckoutSuccess />} />

          {/* Chat route */}
          <Route  path="/chat"  element={  <ProtectedRoute roles={["Admin", "Instructor", "Student"]}>  <ChatPage />   </ProtectedRoute> } />
        </Routes>
      </Router>
      </UnreadProvider>
    </AuthProvider>
  );
}

export default App;
