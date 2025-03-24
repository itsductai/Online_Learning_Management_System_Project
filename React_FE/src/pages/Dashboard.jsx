"use client"

import { useState } from "react"
import { useAuth } from "../context/AuthContext"
import Sidebar from "../components/admin/Sidebar"
import StatsOverview from "../components/admin/StatsOverview"
import Charts from "../components/admin/Charts"
import CourseManagement from "../components/admin/CourseManagement"
import StudentManagement from "./admin/StudentManagement"
import CommunityChat from "../components/admin/CommunityChat"

export default function Dashboard() {
  const { user } = useAuth()
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar isSidebarOpen={isSidebarOpen} />

      <div className={`flex-1 transition-all duration-300 ${isSidebarOpen ? "ml-64" : "ml-20"}`}>
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-gray-800">Xin chào, {user?.name}</h1>
            <p className="text-gray-600">Đây là tổng quan về hệ thống của bạn</p>
          </div>

          <StatsOverview />
          <Charts />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="lg:col-span-2">
              <CourseManagement />
            </div>
            <div className="lg:col-span-2">
              <StudentManagement />
            </div>
            <div className="lg:col-span-2">
              <CommunityChat />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

