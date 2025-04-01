import { useState, useEffect } from "react"
import { FaBookmark, FaRegBookmark } from "react-icons/fa"
import { useAuth } from "../context/AuthContext"

const BookmarkButton = ({ courseId, size = "md", className = "" }) => {
  const { user } = useAuth()
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Kiểm tra xem khóa học đã được đánh dấu chưa
    const checkBookmarkStatus = () => {
      if (!user) return

      const bookmarks = JSON.parse(localStorage.getItem("bookmarks") || "[]")
      setIsBookmarked(bookmarks.includes(Number(courseId)))

      // Trong thực tế, bạn sẽ gọi API để kiểm tra
      // api.get(`/bookmarks/check/${courseId}`)
      //   .then(response => {
      //     setIsBookmarked(response.data.isBookmarked);
      //   })
      //   .catch(error => {
      //     console.error('Error checking bookmark status:', error);
      //   });
    }

    checkBookmarkStatus()
  }, [courseId, user])

  const toggleBookmark = (e) => {
    e.stopPropagation() // Ngăn sự kiện click lan tỏa

    if (!user) {
      // Nếu chưa đăng nhập, chuyển hướng đến trang đăng nhập
      alert("Vui lòng đăng nhập để đánh dấu khóa học!")
      return
    }

    setIsLoading(true)

    // Cập nhật trạng thái local
    const newStatus = !isBookmarked
    setIsBookmarked(newStatus)

    // Cập nhật localStorage
    const bookmarks = JSON.parse(localStorage.getItem("bookmarks") || "[]")
    if (newStatus) {
      if (!bookmarks.includes(Number(courseId))) {
        bookmarks.push(Number(courseId))
      }
    } else {
      const index = bookmarks.indexOf(Number(courseId))
      if (index !== -1) {
        bookmarks.splice(index, 1)
      }
    }
    localStorage.setItem("bookmarks", JSON.stringify(bookmarks))

    // Giả lập API call
    setTimeout(() => {
      setIsLoading(false)
    }, 500)

    // Trong thực tế, bạn sẽ gọi API để cập nhật
    // api.post('/bookmarks/toggle', { courseId })
    //   .then(response => {
    //     setIsBookmarked(response.data.isBookmarked);
    //     setIsLoading(false);
    //   })
    //   .catch(error => {
    //     console.error('Error toggling bookmark:', error);
    //     setIsLoading(false);
    //     // Khôi phục trạng thái cũ nếu có lỗi
    //     setIsBookmarked(!newStatus);
    //   });
  }

  // Xác định kích thước dựa vào prop size
  const sizeClasses = {
    sm: "p-1.5 text-sm",
    md: "p-2 text-base",
    lg: "p-3 text-lg",
  }

  const buttonSize = sizeClasses[size] || sizeClasses.md

  return (
    <button
      onClick={toggleBookmark}
      disabled={isLoading}
      className={`${buttonSize} ${className} rounded-full bg-white shadow-md hover:bg-gray-100 transition relative`}
    >
      {isLoading ? (
        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-primary"></div>
      ) : isBookmarked ? (
        <FaBookmark className="text-primary" />
      ) : (
        <FaRegBookmark className="text-gray-400" />
      )}
    </button>
  )
}

export default BookmarkButton