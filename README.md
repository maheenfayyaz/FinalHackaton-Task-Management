# Full Stack Task Management System

This is a **full-stack Task Management Application** built with **React** for the frontend and **Node.js, Express, and MongoDB** for the backend. The system allows users to sign up, log in, manage tasks based on roles (admin/user), reset passwords, and update profiles with image support.

---

## 🌟 Features

### Authentication
- Signup, Login, Logout
- JWT-based authentication
- Secure password hashing with bcrypt

### Role-based Access Control
- Admins:
  - Create, update, and delete any task
- Users:
  - View assigned tasks
  - Update task status (To Do → In Progress → Completed)

### Task Management (Drag & Drop)
- Tasks are grouped in columns: `To Do`, `In Progress`, `Completed`
- Intuitive drag-and-drop UI using `@hello-pangea/dnd`

### User Profile
- View and update user profile
- Upload profile picture

### Password Reset
- Email-based password reset workflow

### Responsive Design
- Works smoothly across desktop and mobile devices


##  Technologies Used

### Frontend
- **React** (with Hooks)
- **Redux Toolkit** – State management
- **Formik + Yup** – Forms & validation
- **Axios** – API communication
- **SweetAlert2** – Alerts
- **React Router DOM** – Routing
- **@hello-pangea/dnd** – Drag and drop

### Backend
- **Node.js + Express.js**
- **MongoDB + Mongoose**
- **Joi** – Input validation
- **jsonwebtoken** – JWT-based auth
- **bcrypt** – Password hashing
- **Multer** – File uploads (profile image)
- **Nodemailer** – Email support for password reset
