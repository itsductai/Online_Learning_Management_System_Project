-- Xóa database nếu tồn tại và tạo mới
USE master;
IF EXISTS (SELECT * FROM sys.databases WHERE name = 'learning_system_DB')
BEGIN
    ALTER DATABASE learning_system_DB SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
    DROP DATABASE learning_system_DB;
END
CREATE DATABASE learning_system_DB;
GO
USE learning_system_DB;
GO

-- Xóa bảng theo thứ tự khóa ngoại
IF OBJECT_ID('dbo.CommunityMessages', 'U') IS NOT NULL DROP TABLE CommunityMessages;
IF OBJECT_ID('dbo.CommunityPosts', 'U') IS NOT NULL DROP TABLE CommunityPosts;
IF OBJECT_ID('dbo.Comments', 'U') IS NOT NULL DROP TABLE Comments;
IF OBJECT_ID('dbo.LessonProgress', 'U') IS NOT NULL DROP TABLE LessonProgress;
IF OBJECT_ID('dbo.Enrollments', 'U') IS NOT NULL DROP TABLE Enrollments;
IF OBJECT_ID('dbo.QuizResults', 'U') IS NOT NULL DROP TABLE QuizResults;
IF OBJECT_ID('dbo.Quizzes', 'U') IS NOT NULL DROP TABLE Quizzes;
IF OBJECT_ID('dbo.VideoLessons', 'U') IS NOT NULL DROP TABLE VideoLessons;
IF OBJECT_ID('dbo.TextLessons', 'U') IS NOT NULL DROP TABLE TextLessons;
IF OBJECT_ID('dbo.Lessons', 'U') IS NOT NULL DROP TABLE Lessons;
IF OBJECT_ID('dbo.Courses', 'U') IS NOT NULL DROP TABLE Courses;
IF OBJECT_ID('dbo.Users', 'U') IS NOT NULL DROP TABLE Users;

-- Tạo bảng Users (Người dùng)
CREATE TABLE Users (
    UserId INT IDENTITY(1,1) PRIMARY KEY,
    Name NVARCHAR(100) NOT NULL,
    Email NVARCHAR(100) NOT NULL UNIQUE,
    Password NVARCHAR(255) NOT NULL,
    Role NVARCHAR(50) CHECK (Role IN ('Admin', 'Student')) NOT NULL,
    IsActive BOOL DEFAULT 1,
    CreatedAt DATETIME DEFAULT GETDATE()
);

-- Tạo bảng Courses (Khóa học)
CREATE TABLE Courses (
    CourseId INT IDENTITY(1,1) PRIMARY KEY,
    Title NVARCHAR(200) NOT NULL,
    Description NVARCHAR(MAX),
    IsPaid TINYINT DEFAULT 0,
    Price DECIMAL(10,2) DEFAULT 0.00,
    CreatedAt DATETIME DEFAULT GETDATE()
);

-- Tạo bảng Lessons (Bài học chung)
CREATE TABLE Lessons (
    LessonId INT IDENTITY(1,1) PRIMARY KEY,
    CourseId INT NOT NULL,
    LessonType NVARCHAR(50) CHECK (LessonType IN ('Video', 'Text', 'Quiz')) NOT NULL,
    Title NVARCHAR(200) NOT NULL,
    CreatedAt DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (CourseId) REFERENCES Courses(CourseId) ON DELETE CASCADE
);

-- Tạo bảng VideoLessons (Bài học dạng video)
CREATE TABLE VideoLessons (
    VideoId INT IDENTITY(1,1) PRIMARY KEY,
    LessonId INT NOT NULL,
    StorageType NVARCHAR(20) CHECK (StorageType IN ('YouTube', 'Upload')) NOT NULL,
    YouTubeUrl NVARCHAR(255) NULL, 
    FilePath NVARCHAR(255) NULL,    
    ThumbnailUrl NVARCHAR(255) NULL,  
    Duration NVARCHAR(50) NULL,  
    CreatedAt DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (LessonId) REFERENCES Lessons(LessonId) ON DELETE CASCADE
);

-- Tạo bảng TextLessons (Bài học dạng văn bản có file đính kèm)
CREATE TABLE TextLessons (
    TextId INT IDENTITY(1,1) PRIMARY KEY,
    LessonId INT NOT NULL,
    Content NVARCHAR(MAX) NOT NULL,
    Attachment NVARCHAR(255) NULL,
    CreatedAt DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (LessonId) REFERENCES Lessons(LessonId) ON DELETE CASCADE
);

-- Tạo bảng Quizzes (Câu hỏi trắc nghiệm)
CREATE TABLE Quizzes (
    QuizId INT IDENTITY(1,1) PRIMARY KEY,
    LessonId INT NOT NULL,
    Question NVARCHAR(MAX) NOT NULL,
    OptionA NVARCHAR(MAX),
    OptionB NVARCHAR(MAX),
    OptionC NVARCHAR(MAX),
    OptionD NVARCHAR(MAX),
    CorrectAnswer CHAR(1) CHECK (CorrectAnswer IN ('A', 'B', 'C', 'D')) NOT NULL,
    CreatedAt DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (LessonId) REFERENCES Lessons(LessonId) ON DELETE CASCADE
);

-- Tạo bảng QuizResults (Kết quả làm bài của học viên)
CREATE TABLE QuizResults (
    ResultId INT IDENTITY(1,1) PRIMARY KEY,
    UserId INT NOT NULL,
    QuizId INT NOT NULL,
    Score INT NOT NULL,
    SubmittedAt DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (UserId) REFERENCES Users(UserId) ON DELETE CASCADE,
    FOREIGN KEY (QuizId) REFERENCES Quizzes(QuizId) ON DELETE CASCADE
);

-- Tạo bảng Enrollments (Học viên đăng ký khóa học)
CREATE TABLE Enrollments (
    EnrollmentId INT IDENTITY(1,1) PRIMARY KEY,
    UserId INT NOT NULL,
    CourseId INT NOT NULL,
    IsCompleted TINYINT DEFAULT 0,
    CompletionDate DATE NULL,
    CreatedAt DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (UserId) REFERENCES Users(UserId) ON DELETE CASCADE,
    FOREIGN KEY (CourseId) REFERENCES Courses(CourseId) ON DELETE CASCADE
);

-- Tạo bảng LessonProgress (Tiến trình học)
CREATE TABLE LessonProgress (
    ProgressId INT IDENTITY(1,1) PRIMARY KEY,
    UserId INT NOT NULL,
    LessonId INT NOT NULL,
    IsCompleted TINYINT DEFAULT 0,
    CompletedAt DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (UserId) REFERENCES Users(UserId) ON DELETE CASCADE,
    FOREIGN KEY (LessonId) REFERENCES Lessons(LessonId) ON DELETE CASCADE
);

-- Tạo bảng Comments (Bình luận trên khóa học)
CREATE TABLE Comments (
    CommentId INT IDENTITY(1,1) PRIMARY KEY,
    CourseId INT NOT NULL,
    UserId INT NOT NULL,
    Content NVARCHAR(MAX) NOT NULL,
    CreatedAt DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (CourseId) REFERENCES Courses(CourseId) ON DELETE CASCADE,
    FOREIGN KEY (UserId) REFERENCES Users(UserId) ON DELETE CASCADE
);

-- Tạo bảng CommunityPosts (Bài đăng trong cộng đồng)
CREATE TABLE CommunityPosts (
    PostId INT IDENTITY(1,1) PRIMARY KEY,
    UserId INT NOT NULL,
    Content NVARCHAR(MAX),
    Attachment NVARCHAR(255) NULL,
    CreatedAt DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (UserId) REFERENCES Users(UserId) ON DELETE CASCADE
);

-- Tạo bảng CommunityMessages (Tin nhắn trong hệ thống chat)
CREATE TABLE CommunityMessages (
    MessageId INT IDENTITY(1,1) PRIMARY KEY,
    SenderId INT NOT NULL,
    Content NVARCHAR(MAX) NOT NULL,
    Attachment NVARCHAR(255) NULL,
    CreatedAt DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (SenderId) REFERENCES Users(UserId) ON DELETE CASCADE
);
