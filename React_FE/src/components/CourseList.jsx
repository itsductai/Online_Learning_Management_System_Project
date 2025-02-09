import React from "react";

const courses = [
  { id: 1, name: "Lập trình Web với React", instructor: "Nguyễn Văn A" },
  { id: 2, name: "Lập trình Backend với .NET Core", instructor: "Trần Thị B" },
  { id: 3, name: "Phát triển ứng dụng di động", instructor: "Lê Văn C" },
];

export default function CourseList() {
  return (
    <section className="p-6">
      <h2 className="text-2xl font-bold text-primary mb-4">Khóa học của bạn</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div key={course.id} className="bg-white p-4 rounded-lg shadow-lg">
            <h3 className="text-lg font-bold">{course.name}</h3>
            <p className="text-gray-600">Giảng viên: {course.instructor}</p>
            <button className="mt-3 bg-primary text-white py-2 px-4 rounded-lg transition hover:bg-opacity-80">
              Tiếp tục học
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
