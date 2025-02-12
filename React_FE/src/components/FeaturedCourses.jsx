import React from "react";
import { FaStar} from 'react-icons/fa'; 

export default function FeaturedCourses({courses, limit}) {
  
  return (
    <section className="max-w-7xl mx-auto py-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Khóa học nổi bật</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {courses.map((course) => (
          <div key={course.courseId} className="bg-white rounded-lg shadow-md overflow-hidden">
            <img src={course.imageUrl || "/placeholder.svg"} alt={course.title} className="w-full h-48 object-cover" />
            <div className="p-4">
              <h3 className="font-bold text-lg mb-2 truncate">{course.title}</h3>
              <p className="text-gray-600 text-sm mb-4">{course.description}</p>
              <div className="flex items-center mb-2">
                <FaStar className="text-yellow-400 mr-1" />
                <span>{course.rating} ({course.reviewCount} đánh giá)</span>
              </div>
              <button className="bg-primary text-white py-2 px-4 rounded-full text-sm hover:bg-opacity-90 transition">
                Xem khóa học
              </button>
            </div>
          </div>
      ))}
      </div>
    </section>
  );
}
