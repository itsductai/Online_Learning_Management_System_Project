import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import AdminSidebar from "../components/AdminSidebar";
import AdminNavbar from "../components/AdminNavbar";
import AdminOverview from "../components/AdminOverview";
import CourseTable from "../components/CourseTable";
import Footer from "../components/Footer";

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar isSidebarOpen={isSidebarOpen} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminNavbar user={user} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} logout={logout} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
          <AdminOverview />
          <CourseTable />
        </main>
        <Footer />
      </div>
    </div>
  );
}
