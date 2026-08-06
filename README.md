# 🚀 ForgeFlow

<p align="center">
  <img src="https://img.shields.io/badge/React-18-blue?logo=react" />
  <img src="https://img.shields.io/badge/Node.js-Express-green?logo=node.js" />
  <img src="https://img.shields.io/badge/MongoDB-Atlas-success?logo=mongodb" />
  <img src="https://img.shields.io/badge/JWT-Authentication-orange" />
  <img src="https://img.shields.io/badge/Socket.IO-Realtime-black?logo=socket.io" />
  <img src="https://img.shields.io/badge/License-MIT-blue" />
</p>

<p align="center">
A modern GitHub-inspired developer collaboration platform built using the MERN Stack.
</p>

---

## 🌐 Live Demo

🔗 **https://forgeflow-i5t3.onrender.com**

---

# 📖 About

ForgeFlow is a full-stack GitHub-inspired developer collaboration platform that enables developers to create repositories, manage code files, track issues, and collaborate through an intuitive interface.

The project was built using the MERN stack with secure JWT authentication, MongoDB Atlas, Express.js REST APIs, Socket.IO integration, and a responsive React frontend.

---

# ✨ Features

### 👤 Authentication

- Secure User Signup
- User Login
- JWT Authentication
- Password Hashing using bcrypt
- Persistent Sessions

---

### 📁 Repository Management

- Create Repository
- Update Repository
- Delete Repository
- Public & Private Repositories
- Search Repositories

---

### 📄 File Management

- Add Files
- Edit Files
- Delete Files
- Repository Content Management

---

### 🐞 Issue Tracking

- Create Issues
- Update Issues
- Delete Issues
- Track Repository Issues

---

### 👥 User Features

- User Profiles
- Repository Dashboard
- Search Functionality

---

### ⚡ Backend

- REST APIs
- MongoDB Atlas
- JWT Authentication
- Express.js
- Socket.IO Support
- MVC Architecture

---

# 🛠 Tech Stack

## Frontend

- React.js
- Vite
- React Router
- Axios
- Primer React
- CSS3

---

## Backend

- Node.js
- Express.js
- MongoDB
- JWT
- bcrypt.js
- Socket.IO
- Mongoose

---

## Deployment

- Render
- MongoDB Atlas

---

# 📂 Project Structure

```
ForgeFlow
│
├── backend
│   ├── controllers
│   ├── middleware
│   ├── models
│   ├── routes
│   ├── index.js
│   └── package.json
│
├── frontend
│   ├── src
│   │   ├── components
│   │   ├── assets
│   │   ├── config
│   │   └── App.jsx
│   │
│   └── package.json
│
└── README.md
```

---

# ⚙️ Installation

## Clone Repository

```bash
git clone https://github.com/Jayant202003/ForgeFlow.git

cd ForgeFlow
```

---

## Install Backend

```bash
cd backend

npm install
```

---

## Install Frontend

```bash
cd ../frontend

npm install
```

---

## Environment Variables

Create a `.env` file inside the backend folder.

```env
PORT=3002

MONGODB_URI=your_mongodb_connection_string

JWT_SECRET=your_secret_key

AWS_ACCESS_KEY_ID=your_key

AWS_SECRET_ACCESS_KEY=your_secret

AWS_REGION=your_region

AWS_BUCKET_NAME=your_bucket
```

---

## Run Backend

```bash
cd backend

npm start
```

---

## Run Frontend

```bash
cd frontend

npm run dev
```

---

# 🗄 Database

The application uses **MongoDB Atlas** for storing:

- Users
- Repositories
- Issues
- Repository Files

---

# 🔐 Authentication Flow

```
User Login
      │
      ▼
JWT Token Generated
      │
      ▼
Stored in Local Storage
      │
      ▼
Authenticated API Requests
```

---

# 🏗 Application Architecture

```
                React + Vite
                      │
                  Axios API
                      │
               Express Server
                      │
               REST Controllers
                      │
                 MongoDB Atlas
```

---

# 🚀 REST API

## Authentication

```
POST /signup

POST /login
```

---

## Repository

```
GET /repo/all

GET /repo/:id

POST /repo/create

PUT /repo/update/:id

DELETE /repo/delete/:id
```

---

## Issues

```
GET /issue/all/:repoId

POST /issue/create/:repoId

PUT /issue/update/:id

DELETE /issue/delete/:id
```

---

## User

```
GET /userProfile/:id

PUT /userProfile/:id

DELETE /userProfile/:id
```

---


# 🔮 Future Improvements

- Pull Requests
- Commit History
- Notifications
- Repository Forking
- Repository Stars
- Code Editor
- Markdown Preview
- Dark/Light Theme
- Email Verification
- Two Factor Authentication

---

# 💻 Author

**Jayant Shivankar**

GitHub

https://github.com/Jayant202003

LinkedIn

https://linkedin.com/in/jayant-shivankar

---

# ⭐ Support

If you like this project, consider giving it a ⭐ on GitHub.

---

# 📄 License

This project is licensed under the MIT License.

---

<p align="center">
Made with ❤️ by Jayant Shivankar
</p>
