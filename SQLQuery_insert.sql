-- Xóa dữ liệu các bảng theo thứ tự quan hệ khóa ngoại
DELETE FROM CommunityMessages;
DELETE FROM CommunityPosts;
DELETE FROM Comments;
DELETE FROM LessonProgress;
DELETE FROM Enrollments;
DELETE FROM QuizResults;
DELETE FROM Quizzes;
DELETE FROM VideoLessons;
DELETE FROM TextLessons;
DELETE FROM Lessons;
DELETE FROM Courses;
DELETE FROM Users;

select * from Lessons;
select * from Users;
SELECT * FROM Courses;
select * from Quizzes;
select * from Comments;

-- Chèn dữ liệu vào bảng Users
INSERT INTO Users (Name, Email, PasswordHash, Role, IsActive, CreatedAt) VALUES
(N'Admin', 'admin@gmail.com', '123', 'Admin', 1, GETDATE()),
(N'Nguyễn Đức Tài', 'ductai@gmail.com', '123', 'Student', 1, GETDATE()),
(N'Đỗ Phúc', 'phucdo@gmail.com', '123', 'Student', 1, GETDATE()),
(N'Trần Thị B', 'tranthib@example.com', '123', 'Student', 1, GETDATE()),
(N'Lê Văn C', 'levanc@example.com', '123', 'Student', 1, GETDATE()),
(N'Phạm Minh D', 'phamminhd@example.com', '123', 'Student', 1, GETDATE()),
(N'Nguyễn Văn E', 'nguyenvane@example.com', '123', 'Student', 1, GETDATE());

-- Chèn dữ liệu vào bảng Courses
INSERT INTO Courses (Title, Description, IsPaid, Price, CreatedAt) VALUES
(N'ASP.NET Core Web API', N'Khóa học lập trình API với ASP.NET Core', 1, 500000, GETDATE()),
(N'ReactJS Fundamentals', N'Khóa học nhập môn ReactJS', 1, 400000, GETDATE()),
(N'OOP in C#', N'Học lập trình hướng đối tượng trong C#', 0, 0, GETDATE());

-- Chèn dữ liệu vào bảng Lessons
INSERT INTO Lessons (CourseId, LessonType, Title, CreatedAt) VALUES
(15, 'Video', N'Giới thiệu về ASP.NET Core Web API', GETDATE()),  -- LessonId = 1
(15, 'Text', N'Cách cài đặt môi trường ASP.NET Core', GETDATE()),  -- LessonId = 2
(15, 'Quiz', N'Kiểm tra kiến thức về ASP.NET Core Web API', GETDATE()),  -- LessonId = 3
(16, 'Video', N'ReactJS là gì?', GETDATE()),  -- LessonId = 4
(16, 'Text', N'JSX và cách sử dụng trong React', GETDATE()),  -- LessonId = 5
(16, 'Quiz', N'Kiểm tra ReactJS cơ bản', GETDATE()),  -- LessonId = 6
(17, 'Video', N'Các nguyên tắc OOP trong C#', GETDATE()),  -- LessonId = 7
(17, 'Text', N'Các mẫu thiết kế trong C#', GETDATE()),  -- LessonId = 8
(17, 'Quiz', N'Kiểm tra kiến thức về OOP trong C#', GETDATE());  -- LessonId = 9

-- Chèn dữ liệu vào bảng VideoLessons (các LessonId đã có)
INSERT INTO VideoLessons (LessonId, StorageType, YouTubeUrl, FilePath, ThumbnailUrl, Duration, CreatedAt) VALUES
(30, 'YouTube', 'https://www.youtube.com/watch?v=fmvcAzHpsk8', NULL, 'https://img.youtube.com/vi/fmvcAzHpsk8/0.jpg', '15:30', GETDATE()),
(33, 'YouTube', 'https://www.youtube.com/watch?v=Ke90Tje7VS0', NULL, 'https://img.youtube.com/vi/Ke90Tje7VS0/0.jpg', '20:45', GETDATE()),
(36, 'YouTube', 'https://www.youtube.com/watch?v=GhQdlIFylQ8', NULL, 'https://img.youtube.com/vi/GhQdlIFylQ8/0.jpg', '18:00', GETDATE());

-- Chèn dữ liệu vào bảng TextLessons (các LessonId đã có)
INSERT INTO TextLessons (LessonId, Content, Attachment, CreatedAt) VALUES
(31, N'Để cài đặt ASP.NET Core, bạn cần cài đặt .NET SDK...', 'https://docs.microsoft.com/en-us/aspnet/core/', GETDATE()),
(34, N'JSX là cú pháp mở rộng của JavaScript...', 'https://reactjs.org/docs/introducing-jsx.html', GETDATE()),
(37, N'Các nguyên tắc SOLID là những nguyên tắc quan trọng...', 'https://docs.microsoft.com/en-us/dotnet/standard/modern-web-apps-azure-architecture/', GETDATE());

-- Chèn dữ liệu vào bảng Quizzes (các LessonId đã có)
INSERT INTO Quizzes (LessonId, Question, OptionA, OptionB, OptionC, OptionD, CorrectAnswer) VALUES
(32, N'ASP.NET Core là framework dành cho?', N'Mobile App', N'Web App', N'Game', N'Tất cả', 'B'),  -- QuizId = 1
(35, N'JSX là gì?', N'Một ngôn ngữ mới', N'Một cách viết JavaScript', N'Công cụ của NodeJS', N'Một thư viện React', 'B'),  -- QuizId = 2
(38, N'Nguyên tắc O trong SOLID là gì?', N'Open/Closed Principle', N'Object-oriented Principle', N'Order Principle', N'Operation Principle', 'A');  -- QuizId = 3


-- Chèn dữ liệu vào bảng QuizResults (các QuizId đã có)
INSERT INTO QuizResults (UserId, QuizId, Score, SubmittedAt) VALUES
(33, 13, 80, GETDATE()),
(34, 14, 90, GETDATE()),
(33, 15, 70, GETDATE());

select * from Courses;
-- Chèn dữ liệu vào bảng Enrollments
INSERT INTO Enrollments (UserId, CourseId, IsCompleted, CompletionDate, CreatedAt) VALUES
(33, 15, 0, NULL, GETDATE()),
(33, 16, 1, GETDATE(), GETDATE()),
(34, 20, 0, NULL, GETDATE());

-- Chèn dữ liệu vào bảng LessonProgress (các LessonId đã có)
INSERT INTO LessonProgress (UserId, LessonId, IsCompleted, CompletedAt) VALUES
(33, 30, 1, GETDATE()),
(33, 31, 1, GETDATE()),
(34, 33, 0, NULL);

-- Chèn dữ liệu vào bảng Comments
INSERT INTO Comments (CourseId, UserId, Content, CreatedAt) VALUES
(15, 33, N'Khóa học rất hay! Giúp mình hiểu rõ về Web API.', GETDATE()),
(16, 33, N'ReactJS khá thú vị, cảm ơn giảng viên!', GETDATE()),
(17, 34, N'OOP trong C# giúp mình hiểu sâu hơn về lập trình.', GETDATE());

