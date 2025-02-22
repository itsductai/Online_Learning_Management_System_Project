// Hook này giúp gọi API để lấy danh sách khóa học từ backend.

import React, { useEffect, useState } from 'react'
import {coursesAPI, addCourseAPI, updateCourseAPI, deleteCourseAPI } from "../services/api";

function useCourses() {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(()=>{
        setLoading(true);
        fetchCourse();
    }, []);

    const fetchCourse = async() => {
      try {
          const data = await coursesAPI();
          if (Array.isArray(data)) { 
              setCourses(data); // Chỉ đặt state nếu data là một mảng
            } else {
              console.error("API trả về dữ liệu không hợp lệ:", data);
              setCourses([]); // Đặt lại thành mảng rỗng nếu dữ liệu không hợp lệ
            }
         setLoading(false);
      } catch (err){
          setError("Lỗi khi tải khóa học");
      }
  };

  const addCourse = async(courseData) => {
    try{
      await addCourseAPI(courseData);
      fetchCourse();
    } catch (err){
      setError("Lỗi khi thêm khóa học.");
    }
  }

  const updateCourse = async(courseId, courseData) => {
    try {
      await updateCourseAPI(courseId, courseData);
      fetchCourse();
    } catch (err){
      setError("Lỗi khi cập nhật khóa học.");
    }
  }

  const deleteCourse = async(courseId) => {
    try {
      await deleteCourseAPI(courseId);
      fetchCourse();
    } catch (err){
      setError("Lỗi khi xóa khóa học.");
    }
  }

  return {courses, fetchCourse, addCourse, updateCourse, deleteCourse, loading, error};
};

export default useCourses;