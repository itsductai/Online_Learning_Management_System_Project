INSERT INTO Users (Name, Email, PasswordHash, Role, CreatedAt, IsActive)
VALUES 
('Admin', 'admin@example.com', 'admin123', 'Admin', GETDATE(),1),
('NguyenTai', 'nguyentai@example.com', 'student123', 'Student', GETDATE(),1);
