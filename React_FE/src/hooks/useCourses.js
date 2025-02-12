import React, { useEffect, useState } from 'react'
import { coursesAPI } from '../services/api';

function useCourses() {
    const [courses, setCourses] = useState([]);
    const [error, setError] = useState("");

    useEffect(()=>{
        const fetchCourse = async() => {
            try {
                const data = await coursesAPI();
                if (Array.isArray(data)) { 
                    setCourses(data); // Chỉ đặt state nếu data là một mảng
                  } else {
                    console.error("API trả về dữ liệu không hợp lệ:", data);
                    setCourses([]); // Đặt lại thành mảng rỗng nếu dữ liệu không hợp lệ
                  }
            } catch (err){
                setError("Lỗi khi tải khóa học");
            }
        };
        fetchCourse();
    }, []);

  return {courses, error};
};

export default useCourses;