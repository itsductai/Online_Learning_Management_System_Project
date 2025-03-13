// Hàm gọi API đến OpenAI (hiện tại là mock data)
export const sendMessageToAI = async (message, courseId, lessonId) => {
  try {
    // Giả lập API call với timeout
    return new Promise((resolve) => {
      setTimeout(() => {
        // Trong tương lai, đây sẽ là nơi gọi API thực tế đến OpenAI
        resolve({
          id: Date.now(),
          content:
            "Chức năng trò chuyện với AI đang được phát triển. Vui lòng chờ trong thời gian sắp tới. Cảm ơn bạn đã quan tâm!",
          timestamp: new Date().toISOString(),
        })
      }, 1000)
    })

    // Khi tích hợp OpenAI API thực tế, code sẽ như sau:
    /*
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        courseId,
        lessonId,
      }),
    });

    if (!response.ok) {
      throw new Error('Lỗi khi gọi API chat');
    }

    return await response.json();
    */
  } catch (error) {
    console.error("Lỗi khi gửi tin nhắn đến AI:", error)
    throw error
  }
}

// Hàm lấy lịch sử chat (hiện tại là mock data)
export const getChatHistory = async (courseId, lessonId) => {
  try {
    // Giả lập API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            id: 1,
            sender: "ai",
            content: "Xin chào! Tôi là trợ lý AI. Tôi có thể giúp gì cho bạn về bài học này?",
            timestamp: new Date().toISOString(),
          },
        ])
      }, 500)
    })

    // Khi tích hợp API thực tế:
    /*
    const response = await fetch(`/api/chat/history?courseId=${courseId}&lessonId=${lessonId}`);
    
    if (!response.ok) {
      throw new Error('Lỗi khi lấy lịch sử chat');
    }
    
    return await response.json();
    */
  } catch (error) {
    console.error("Lỗi khi lấy lịch sử chat:", error)
    throw error
  }
}

