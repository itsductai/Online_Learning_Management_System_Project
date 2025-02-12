import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import FeaturedCourses from "../components/FeaturedCourses";
import ProgressTracking from "../components/ProgressTracking";
import Announcements from "../components/Announcements";
import Footer from "../components/Footer";
import useCourses from "../hooks/useCourses";



export default function HomePage() {
  const { user } = useAuth();
  const {courses, error} = useCourses();

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <HeroSection user={user} />
      <FeaturedCourses courses={courses} limit={3} />
      <ProgressTracking />
      <Announcements />
      <Footer />
    </div>
  );
}
