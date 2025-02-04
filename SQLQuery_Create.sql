USE master;  -- Chuyển về database master để tránh sử dụng database cần xóa
ALTER DATABASE learning_system_DB SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
DROP DATABASE IF EXISTS learning_system_DB;
CREATE DATABASE learning_system_DB;
USE learning_system_DB;

-- Xóa bảng theo đúng thứ tự khóa ngoại
DROP TABLE IF EXISTS CommunityMessages;
DROP TABLE IF EXISTS CommunityPosts;
DROP TABLE IF EXISTS Comments;
DROP TABLE IF EXISTS LessonProgress;
DROP TABLE IF EXISTS Enrollments;
DROP TABLE IF EXISTS QuizResults;
DROP TABLE IF EXISTS Quizzes;
DROP TABLE IF EXISTS Lessons;
DROP TABLE IF EXISTS Courses;
DROP TABLE IF EXISTS Users;

-- Tạo bảng Users
CREATE TABLE Users (
    UserId INT IDENTITY(1,1) PRIMARY KEY,
    Name VARCHAR(100) NOT NULL,
    Email VARCHAR(100) NOT NULL UNIQUE,
    Password VARCHAR(255) NOT NULL,
    Role VARCHAR(50) NOT NULL, -- 'Admin' hoặc 'Student'
    IsActive TINYINT DEFAULT 1, -- 1: Kích hoạt, 0: Vô hiệu hóa
    CreatedAt DATETIME DEFAULT GETDATE()
);

-- Tạo bảng Courses
CREATE TABLE Courses (
    CourseId INT IDENTITY(1,1) PRIMARY KEY,
    Title VARCHAR(200) NOT NULL,
    Description TEXT,
    IsPaid TINYINT DEFAULT 0, -- 0: Miễn phí, 1: Tính phí
    Price DECIMAL(10, 2) DEFAULT 0.00,
    CreatedAt DATETIME DEFAULT GETDATE()
);

-- Tạo bảng Lessons
CREATE TABLE Lessons (
    LessonId INT IDENTITY(1,1) PRIMARY KEY,
    CourseId INT NOT NULL,
    LessonType VARCHAR(50) NOT NULL, -- 'Video', 'Text', hoặc 'Quiz'
    Title VARCHAR(200) NOT NULL,
    Content TEXT, -- Nội dung bài học (dành cho dạng bài viết)
    Attachment VARCHAR(255), -- Đường dẫn file đính kèm (NULL nếu không có)
    CreatedAt DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (CourseId) REFERENCES Courses(CourseId) ON DELETE CASCADE
);

-- Tạo bảng Quizzes
CREATE TABLE Quizzes (
    QuizId INT IDENTITY(1,1) PRIMARY KEY,
    LessonId INT NOT NULL,
    Question TEXT NOT NULL,
    OptionA TEXT,
    OptionB TEXT,
    OptionC TEXT,
    OptionD TEXT,
    CorrectAnswer CHAR(1) NOT NULL, -- 'A', 'B', 'C', hoặc 'D'
    FOREIGN KEY (LessonId) REFERENCES Lessons(LessonId) ON DELETE CASCADE
);

-- Tạo bảng QuizResults
CREATE TABLE QuizResults (
    ResultId INT IDENTITY(1,1) PRIMARY KEY,
    UserId INT NOT NULL,
    QuizId INT NOT NULL,
    Score INT NOT NULL,
    SubmittedAt DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (UserId) REFERENCES Users(UserId) ON DELETE CASCADE,
    FOREIGN KEY (QuizId) REFERENCES Quizzes(QuizId) ON DELETE CASCADE
);

-- Tạo bảng Enrollments
CREATE TABLE Enrollments (
    EnrollmentId INT IDENTITY(1,1) PRIMARY KEY,
    UserId INT NOT NULL,
    CourseId INT NOT NULL,
    IsCompleted TINYINT DEFAULT 0, -- 0: Chưa hoàn thành, 1: Đã hoàn thành
    CompletionDate DATE,
    CreatedAt DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (UserId) REFERENCES Users(UserId) ON DELETE CASCADE,
    FOREIGN KEY (CourseId) REFERENCES Courses(CourseId) ON DELETE CASCADE
);

-- Tạo bảng LessonProgress
CREATE TABLE LessonProgress (
    ProgressId INT IDENTITY(1,1) PRIMARY KEY,
    UserId INT NOT NULL,
    LessonId INT NOT NULL,
    IsCompleted TINYINT DEFAULT 0, -- 0: Chưa hoàn thành, 1: Đã hoàn thành
    CompletedAt DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (UserId) REFERENCES Users(UserId) ON DELETE CASCADE,
    FOREIGN KEY (LessonId) REFERENCES Lessons(LessonId) ON DELETE CASCADE
);

-- Tạo bảng Comments
CREATE TABLE Comments (
    CommentId INT IDENTITY(1,1) PRIMARY KEY,
    CourseId INT NOT NULL,
    UserId INT NOT NULL,
    Content TEXT NOT NULL,
    CreatedAt DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (CourseId) REFERENCES Courses(CourseId) ON DELETE CASCADE,
    FOREIGN KEY (UserId) REFERENCES Users(UserId) ON DELETE CASCADE
);

-- Tạo bảng CommunityPosts
CREATE TABLE CommunityPosts (
    PostId INT IDENTITY(1,1) PRIMARY KEY,
    UserId INT NOT NULL,
    Content TEXT,
    Attachment VARCHAR(255), -- File hoặc ảnh đính kèm (NULL nếu không có)
    CreatedAt DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (UserId) REFERENCES Users(UserId) ON DELETE CASCADE
);

-- Tạo bảng CommunityMessages
CREATE TABLE CommunityMessages (
    MessageId INT IDENTITY(1,1) PRIMARY KEY,
    SenderId INT NOT NULL,
    Content TEXT NOT NULL,
    Attachment VARCHAR(255), -- File hoặc ảnh đính kèm (NULL nếu không có)
    CreatedAt DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (SenderId) REFERENCES Users(UserId) ON DELETE CASCADE
);
