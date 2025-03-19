import { useState, useEffect, useCallback } from "react"
import { useAuth } from "../context/AuthContext"
import { getProgressByCourseId, updateProgress, createProgress} from "../services/progressAPI"

function useProgress(courseId) {
    const { user } = useAuth() // Lấy thông tin từ user thông qua conext
    const [progress, setProgress] = useState(0) // Quản lý trạng thái % tiến độ khóa học 
    const [completedLessons, setCompletedLessons] = useState([]) // Danh sách bài học đã hoàn thành
    const [lessonUnlocked, setLessonUnlocked] = useState({}) // Danh sách bài học đã mở khóa
    const [watchTime, setWatchTime] = useState(0) // Quản lý thời gian học tập trong bài học hiện tịa
    const [loading, setLoading] = useState(false) // Quản lý trạng thái load dữ liệu
    const [error, setError] = useState(null) // Quản lý các lỗi

    // Lấy tiến độ học tập khi component mount hoặc courseId thay đổi
  useEffect(() => {
    if (courseId) {
      fetchProgress();
    }
  }, [courseId]);

  // Đăng ký khóa học
  const createNewProgress = async (courseId) => {
    try {
      await createProgress(courseId);
    } catch (error) {
      console.error("Lỗi khi tạo tiến trình mới.", error);
      setError("Không tham gia khóa học. Vui lòng thử lại sau.");
    }
  }

  // Lấy tiến độ học tập từ API hoặc localStorage
  const fetchProgress = async () => {
    try {
      setLoading(true);
      setError(null);

        // Nếu đã đăng nhập, lấy tiến độ từ API
        if (user?.userId) {
            const data = await getProgressByCourseId(courseId);
            if (data) {
            setProgress(data.progressPercent || 0)
            setCompletedLessons(data.completedLessons || [])
            }
        } else {
            // Nếu chưa đăng nhập, lấy từ localStorage
            const savedProgress = localStorage.getItem(`course_${courseId}_progress`);
            if (savedProgress) {
              const parsedProgress = JSON.parse(savedProgress);
              setProgress(parsedProgress.progressPercent || 0);
              setCompletedLessons(parsedProgress.completedLessons || []);
            }
        }
    } catch (err) {
      console.error("Lỗi khi lấy tiến độ học tập:", err);
      setError("Không thể lấy tiến độ học tập. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  // Memoize hàm initLessonUnlocked để tránh tạo hàm mới mỗi khi render
  const initLessonUnlocked = useCallback((completedLessonIds, allLessons = []) => {
    console.log("Gọi initLessonUnlocked với:", completedLessonIds, allLessons);
    
    // Tạo một object mới
    const unlockState = {};
    
    // Bài học đầu tiên luôn mở khóa
    if (allLessons.length > 0) {
      unlockState[allLessons[0].lessonId] = true;
      console.log("Unlock bài học đầu tiên:", allLessons[0].lessonId);
    }
    
    // Mở khóa các bài học đã hoàn thành
    completedLessonIds.forEach((lessonId) => {
      unlockState[lessonId] = true;
      console.log("Unlock bài học đã hoàn thành:", lessonId);
    });
    
    // Mở khóa bài học tiếp theo sau bài học đã hoàn thành
    if (allLessons.length > 0) {
      for (let i = 0; i < allLessons.length - 1; i++) {
        if (completedLessonIds.includes(allLessons[i].lessonId)) {
          unlockState[allLessons[i + 1].lessonId] = true;
          console.log("Unlock bài học tiếp theo:", allLessons[i + 1].lessonId);
        }
      }
    }
    
    console.log("UnlockState cuối cùng:", unlockState);
    
    // Cập nhật state với một object mới
    setLessonUnlocked({...unlockState});
  }, []);

  // Cập nhật tiến độ khi hoàn thành bài học
  const saveProgress = async (completedLessonId, allLessons = []) => {
    try {
      setLoading(true);
      setError(null);

      console.log("Goi saveProgress với:", completedLessonId, allLessons);

      // Cập nhật danh sách bài học đã hoàn thành
      const updatedCompletedLessons = [...completedLessons];
      if (completedLessonId && !updatedCompletedLessons.includes(completedLessonId)) {
        updatedCompletedLessons.push(completedLessonId);
      }

      // Tính toán phần trăm tiến độ
      const progressPercent = allLessons.length > 0 ? (updatedCompletedLessons.length / allLessons.length) * 100 : 0;

      // Cập nhật state
      setProgress(progressPercent);
      setCompletedLessons(updatedCompletedLessons);

      // Cập nhật trạng thái mở khóa bài học
      const updatedUnlockState = { ...lessonUnlocked };
      if (completedLessonId) {
        // Tìm bài học tiếp theo để mở khóa
        const currentIndex = allLessons.findIndex((lesson) => lesson.lessonId === completedLessonId);
        if (currentIndex >= 0 && currentIndex < allLessons.length - 1) {
          const nextLessonId = allLessons[currentIndex + 1].lessonId;
          updatedUnlockState[nextLessonId] = true;
          console.log("Mở khóa bài học tiếp theo:", nextLessonId);
        }
      }
      setLessonUnlocked(updatedUnlockState);

      // Dữ liệu tiến độ
      const progressData = {
        courseId: Number(courseId),
        completedLessons: updatedCompletedLessons,
        progressPercent,
        lastUpdated: new Date().toISOString(),
      };

      
      

      // Lưu vào localStorage
      localStorage.setItem(`course_${courseId}_progress`, JSON.stringify(progressData));

      console.log("Goi saveProgress luu vao localstorage du lieu tien do: ", JSON.stringify(progressData));

      // Nếu đã đăng nhập, gửi lên server
      if (user?.userId) {
        // Cập nhật lên qua DB thông qua API
        console.log("cap nhat len database", progressData)
        await updateProgress(progressData);
      }
      
      return true;
    } catch (err) {
      console.error("Lỗi khi lưu tiến độ:", err);
      setError("Không thể lưu tiến độ học tập. Vui lòng thử lại sau.");
      return false;
    } finally {
      setLoading(false);
    }
  };

   // Kiểm tra xem bài học có bị khóa không
    const isLessonLocked = (lessonId) => {
        return !lessonUnlocked[lessonId]
    }

    // Theo dõi thời gian xem/đọc bài học
    const trackWatchTime = (increment = 1) => {
        setWatchTime((prev) => prev + increment)
        return watchTime + increment
    }

    // Reset thời gian xem khi chuyển bài học
    const resetWatchTime = () => {
        setWatchTime(0)
    }

  return {
    // Các giá trị và hàm hiện có
    progress,
    completedLessons,
    lessonUnlocked,
    watchTime,
    loading,
    error,
    isLessonLocked,
    trackWatchTime,
    resetWatchTime,
    saveProgress,
    initLessonUnlocked, // Xuất ra để có thể dùng bên ngoài
    createNewProgress, // Hàm tạo tiến trình khi nhấn tham gia khóa học
  };
}

export default useProgress;
