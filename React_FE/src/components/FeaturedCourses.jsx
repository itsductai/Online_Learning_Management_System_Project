import React from "react";

export default function FeaturedCourses() {
  const courses = [1, 2, 3];

  return (
    <section className="max-w-7xl mx-auto py-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Khóa học nổi bật</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {courses.map((course) => (
          <div key={course} className="bg-white rounded-lg shadow-md overflow-hidden">
            <img src={`https://source.unsplash.com/random/400x200?sig=${course}`} alt="Course" className="w-full h-48 object-cover" />
            <div className="p-4">
              <h3 className="font-bold text-lg mb-2">Tên khóa học {course}</h3>
              <p className="text-gray-600 text-sm mb-4">Mô tả ngắn về khóa học...</p>
              <button className="bg-primary text-white py-2 px-4 rounded-full text-sm hover:bg-opacity-90 transition">
                Xem chi tiết
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
