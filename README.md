# 📚 Online Learning Management System (OLMS)

Hi there 👋, thank you for visiting the official repository of my **Online Learning Management System (OLMS)** – a capstone project I built over **3+ months** as a final-year student at **Can Tho University**.

👉 This repository currently contains **2 branches**:

* **`master`** → Base version (Niên luận đã hoàn thành).
* **`LuanVan`** → Extended version (Luận văn tốt nghiệp – currently in development).

Demo (master branch): [YouTube](https://www.youtube.com/watch?v=UG29qXINSHI&t=33s)

---

## 🚀 About the Project

**OLMS** is a full-stack platform that enables:

* 👨‍🎓 Students to register, enroll, learn through video/text lessons, take quizzes, and pay securely.
* 👨‍🏫 Instructors to manage courses, track students, and monitor learning progress.
* 👩‍💼 Admins to handle all data, revenue, users, coupons, and overall statistics.

---

## 🎯 Thesis Development (Branch `LuanVan`)

The graduation thesis branch (`LuanVan`) extends the base OLMS with new features focusing on **demo-ready, visible functionalities**:

* 🔍 **Advanced Search with ElasticSearch**:
  Search lessons by keywords inside video subtitles, with jump-to-time functionality.

* 💬 **Realtime Chat (SignalR)**:
  One-to-one and group messaging with online status and friend invitations.

* 🔥 **Learning Streaks**:
  Track continuous learning days, maintain streaks with friends.

* 📅 **Progress Calendar**:
  Display daily learning activities in a calendar view.

* 🤖 **AI Chatbot Assistant** (experimental):
  Provide learning support and act as a teaching assistant using OpenAI.

---

## 🎨 Interface Showcase

### 👨‍🎓 Student Role – Learning Experience
| Home Page (Courses) | Course Detail |
|---------------------|----------------------------|
| ![student-home](https://github.com/user-attachments/assets/97a48631-b659-4ba2-8b49-53c3f4006c24) | ![student-course-detail](https://github.com/user-attachments/assets/8e00219b-20e9-4088-b5fc-e899922f8efa)|

| Learning Progress | Quizzes |
|--------------------|------------------------|
| ![progress](https://github.com/user-attachments/assets/6d874e20-7858-4068-8853-4bbf5fc09e1a)|![image](https://github.com/user-attachments/assets/0e9ed3fb-1de6-4ef2-97ee-9f3e55fc8718)|

| Payment & coupon | Momo API |
|--------------------|------------------------|
|![image](https://github.com/user-attachments/assets/5d31c450-e5c2-4fa1-b3e2-d3ad56daef63)|![image](https://github.com/user-attachments/assets/d003ec8b-484b-49a2-b71c-33b01fc6288a)|

---

| Manage Payments | Manage Coupons|
|---------------------------|---------------------------|
| ![image](https://github.com/user-attachments/assets/45bb205d-1661-447e-acfd-50eea48e0d33)|![image](https://github.com/user-attachments/assets/aa826c52-aef7-4fb3-9def-3a60db7bbb19)|


### 👩‍💼 Admin Role - Full Control Dashboard
| Dashboard Overview |
|--------------------|
| ![image](https://github.com/user-attachments/assets/b6b15a46-20f3-4daa-86d9-f2ced3f433f4) |

| Manage Users |Manage Courses |
|------------------------|------------------------|
|![image](https://github.com/user-attachments/assets/4a8e0747-fca4-4158-aca4-7a6bfd6779fd)|![image](https://github.com/user-attachments/assets/5097edc6-79b4-49ca-9abd-a97d006b5619)|

---

## 🛠 Technology Stack

### ⚛️ Frontend: `ReactJS + Tailwind CSS`
- ReactJS (Hooks + Axios)
- React Router DOM
- Tailwind CSS

### 🔧 Backend: `ASP.NET Core Web API`
- ASP.NET Core 8
- 3 Layer Architecture: Controller – Service – Repository
- Entity Framework Core
- JWT Authentication
- MoMo Sandbox Payment


### 🗄️ Database:
- SQL Server (Code First with EF Core)

### 🧰 Tools:
- Visual Studio 2022
- Postman
- Git + GitHub

---

## 💡 Key Features

- 🔐 **JWT Authentication & Refresh Token**
- 🎯 **Role-based Authorization** (Student / Instructor / Admin)
- 📚 **Course & Lesson CRUD**
- 📝 **Quiz System with Score Tracking**
- 📈 **Learning Progress Monitoring**
- 💸 **MoMo Payment Integration + Coupon Code**
- 📊 **Admin Statistics Dashboard**

---

## 📦 Architecture Overview
![image](https://github.com/user-attachments/assets/98540e56-858a-4b4e-bd90-10345d8c36e1)
## 🧭 System Architecture Overview

The following diagram illustrates the entire request-response flow of the **Online Learning Management System (OLMS)** — from the **Frontend (ReactJS)** to the **Backend (ASP.NET Core Web API)**, connected to **SQL Server** and integrated with the **MoMo Payment Gateway**.

---

### 🟦 Frontend (ReactJS)

- Contains user-facing pages such as **Login**, **Register**, **Course Detail**, and **Checkout**.
- Uses **Axios** to send API requests to the backend.
- Stores **JWT** and **Refresh Token** in **LocalStorage** to maintain user authentication state across sessions.

---

### 🟩 Backend (ASP.NET Core Web API – 3-Layer Architecture)

- **Controller Layer**: Receives HTTP requests from frontend and passes data via DTOs to the service layer.
- **Service Layer**: Handles business logic, authentication, and payment flows.
- **Repository Layer**: Abstracts database access using **Entity Framework Core** via the `ApplicationDbContext`.
- **Authentication Middleware**: Intercepts and validates JWT tokens before allowing access to protected resources.

---

### 🟥 Database (SQL Server)

- Stores all core data including:
  - `Users`, `Courses`, `Lessons`, `Enrollments`, `Payments`, `Quizzes`, `Coupons`, `LessonProgress`, etc.
- Accessed through **Entity Framework Core ORM**, via the repository pattern.

---

### 🟧 External API (MoMo Payment Gateway)

Payment processing flow:

1. Backend creates an order request.
2. Sends the payment data to **MoMo API**.
3. MoMo processes the transaction, redirects user to payment page, then sends a **callback** to the system.
4. Backend receives callback and updates **payment status** in the database.

---

### 🔄 Main Data Flow

1. Frontend (ReactJS)
2. Axios sends API Request
3. Controller (ASP.NET Core Web API)
4. Service Layer (Business Logic)
5. Repository Layer (Data Access)
6. ApplicationDbContext (EF Core)
7. SQL Server (Database)

🛡️ JWT Token is validated by Authentication Middleware before reaching Controller.

⬅️ Response (JSON) goes back from Controller → Axios → React UI

---

### ✅ Benefits of This Architecture

- ✅ **Clear separation of concerns** between layers (Controller, Service, Repository).
- ✅ Easy to maintain, extend, and test each component individually.
- ✅ Flexible to add more features like:
  - Virtual AI Instructor,
  - Realtime Chat using SignalR,
  - More payment gateways (e.g., VNPay, ZaloPay),
  - AI-powered recommendation.
- ✅ Real-world payment integration (MoMo) mimics commercial products and enhances user experience.

---
## 🧩 ASP.NET Core Dependency Injection Flow

This diagram shows how **Dependency Injection (DI)** works in the ASP.NET Core Web API project:

![image](https://github.com/user-attachments/assets/5c3eff22-a142-436a-8264-8187381df8d4)

### 🔄 Flow Overview

1. **ASP.NET Core DI Container** handles injection of all components.
2. **Controller** depends on a **Service Interface**, injected automatically.
3. **Service Implementation** processes logic and depends on a **Repository Interface**.
4. **Repository Implementation** handles data access via **ApplicationDbContext**.
5. **Database** is queried through EF Core by the repository.

### ✅ Why use this pattern?

- Keeps code clean and organized.
- Makes components easier to test and maintain.
- Separates concerns clearly between layers.

-----
## 👨‍💻 About Me

- 🎓 Final-year IT student @ Can Tho University (CTU)
- 🧠 Passionate about system design, backend logic, and fullstack project building
- 💼 Aspiring **Fullstack .NET Developer**
- 📧 Email: ductaaii.2002@gmail.com
- 🔗 LinkedIn: [linkedin.com/in/ductai-nguyen1612](https://www.linkedin.com/in/ductai-nguyen1612/)

---

## 🌟 Want to support?

> ⭐ Star this repository if it helps you or inspires your own project journey!
