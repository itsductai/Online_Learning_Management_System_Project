import { useState } from "react"
import { useAuth } from "../context/AuthContext"
import InstructorSidebar from "../components/instructor/Sidebar"
import StatsOverview from "../components/instructor/StatsOverview"
import Charts from "../components/instructor/Charts"
import CourseManagement from "../components/instructor/CourseManagement"
import StudentManagement from "../components/instructor/StudentManagement"
import CommunityChat from "../components/instructor/CommunityChat"

export default function InstructorDashboard() {
  const { user } = useAuth()
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  return (
    <div className="flex min-h-screen bg-gray-100">
      <InstructorSidebar isSidebarOpen={isSidebarOpen} />

      <div className={`flex-1 transition-all duration-300 ${isSidebarOpen ? "ml-64" : "ml-20"}`}>
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-gray-800">Xin chào, {user?.name}</h1>
            <p className="text-gray-600">Đây là tổng quan về hệ thống của bạn</p>
          </div>

          <StatsOverview />
          <Charts />
        </div>
      </div>
    </div>
  )
}

