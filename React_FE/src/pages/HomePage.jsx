import React from "react";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import FeaturedCourses from "../components/FeaturedCourses";
import ProgressTracking from "../components/ProgressTracking";
import Announcements from "../components/Announcements";
import Footer from "../components/Footer";

export default function HomePage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <HeroSection user={user} />
      <FeaturedCourses />
      <ProgressTracking />
      <Announcements />
      <Footer />
    </div>
  );
}
