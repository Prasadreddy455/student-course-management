# Student Course Management System

A full-stack MERN application for managing students, courses, and enrollments.

## Tech Stack
- **Frontend:** React (Vite), Axios, React Router
- **Backend:** Node.js, Express
- **Database:** MongoDB (Mongoose)
- **Auth:** JWT + bcrypt

## Features
- Signup / Login (JWT-based auth)
- Role-based access (Student / Admin)
- Add / Edit / Delete Courses (Admin)
- View & Search Courses
- Enroll / Unenroll in Courses (Student)
- Admin Panel — manage courses, view all students & enrollments

## Project Structure
```
student-course-management/
├── backend/          # Express REST API
└── frontend/          # React app
```

## Getting Started

### 1. Backend
```bash
cd backend
npm install
cp .env.example .env    # fill in your MongoDB URI & JWT secret
npm run dev
```
Runs on `http://localhost:5000`

### 2. Frontend
```bash
cd frontend
npm install
npm run dev
```
Runs on `http://localhost:5173`

### 3. Default Admin
Sign up normally, then in MongoDB set that user's `role` field to `"admin"` manually
(or use the `/api/auth/make-admin` seed route described in `backend/routes/auth.js` comments).

## API Overview
| Method | Endpoint | Access |
|---|---|---|
| POST | /api/auth/signup | Public |
| POST | /api/auth/login | Public |
| GET  | /api/auth/me | Private |
| GET  | /api/courses?search=term | Private |
| POST | /api/courses | Admin |
| PUT  | /api/courses/:id | Admin |
| DELETE | /api/courses/:id | Admin |
| POST | /api/enrollments/:courseId | Student |
| DELETE | /api/enrollments/:courseId | Student |
| GET | /api/enrollments/me | Student |
| GET | /api/enrollments | Admin |

## License
MIT

## ADMIN LOGIN CREDENTIALS:
 Email: esfsffcae@gmail.com
 Password: mypassword123
