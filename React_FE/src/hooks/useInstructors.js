import { useState, useEffect } from "react";
import { getAllInstructorsAPI } from "../services/instructorAPI";

const useInstructors = () => {
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInstructors = async () => {
      try {
        const data = await getAllInstructorsAPI();
        console.log("Danh sach giang vien tra ve: ", data)
        setInstructors(data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchInstructors();
  }, []);

  return { instructors, loading, error };
};

export default useInstructors;
