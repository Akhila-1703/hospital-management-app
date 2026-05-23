<div align="center">

# ⚙️ Backend Architecture & API Documentation

### Peoplecare International Hospital

This document serves as the technical reference for the Hospital Management backend.

It documents the backend architecture, environment configuration, package ecosystem, schemas, deployment details, API contracts, and development setup.

</div>

---

# 🏗️ 1. Backend Architecture Overview

The backend is built using a modular **Node.js + Express + MongoDB** architecture.

The server is responsible for:

- User Authentication & Authorization
- Role-Based Access Control (RBAC)
- Appointment Management
- Patient Management
- Doctor Workflows
- Protected API Communication
- Database Persistence
- Environment-Based Deployment

---

## Backend Processing Flow

```text
Client Request
     ↓
Express Server
     ↓
Middleware Layer
     ↓
Authentication Check
     ↓
API Controllers
     ↓
Database Models
     ↓
MongoDB Atlas
     ↓
JSON Response
```

---

# 🚀 2. Local Installation & Setup

## Install Dependencies

```bash
cd backend
npm install
```

---

## Configure Environment Variables

Create:

```text
backend/.env
```

Add:

```env
PORT=4000

DB_URL=your_mongodb_connection_string

JWT_SECRET_KEY=your_secret_key

NODE_ENV=development

CLIENT_URL=http://localhost:5173
```

---

## Start Backend Server

```bash
npm start
```

Server runs on:

```text
http://localhost:4000
```

---

# 🌐 3. Production Deployment

## Backend Deployment

```text
https://hospital-management-app-g81n.onrender.com
```

Hosted using:

- Render
- MongoDB Atlas

---

# 📂 4. Backend Project Structure

```text
backend/

├── APIs/
│   ├── AdminAPI.js
│   ├── AppointmentAPI.js
│   ├── AuthAPI.js
│   ├── DoctorAPI.js
│   ├── PatientAPI.js
│   └── UserAPI.js

├── models/
│   ├── AdminModel.js
│   ├── AppointmentModel.js
│   ├── DoctorModel.js
│   ├── PatientModel.js
│   └── UserModel.js

├── middleware/
│   ├── verifyToken.js
│   ├── roleMiddleware.js
│   └── errorHandler.js

├── config/
│   └── database.js

├── services/
│   └── authService.js

├── .env

├── server.js

└── package.json
```

---

# 📦 5. Package Documentation

Install all packages:

```bash
npm install
```

---

| Package | Purpose |
|----------|----------|
| express | REST API framework |
| mongoose | MongoDB object modeling |
| jsonwebtoken | JWT authentication |
| bcryptjs | Password hashing |
| cookie-parser | Cookie extraction |
| cors | Secure frontend communication |
| dotenv | Environment loading |
| nodemon | Development server reload |
| validator | Data validation |
| multer | File upload handling |
| cloudinary | Cloud asset storage |

---

## Manual Package Installation

```bash
npm install express
```

```bash
npm install mongoose
```

```bash
npm install jsonwebtoken
```

```bash
npm install bcryptjs
```

```bash
npm install cookie-parser
```

```bash
npm install cors
```

```bash
npm install dotenv
```

```bash
npm install validator
```

```bash
npm install multer
```

```bash
npm install cloudinary
```

Install development dependency:

```bash
npm install -D nodemon
```

---

# 🗄️ 6. Database Schemas

## User Schema

```text
User
```

| Field | Type |
|--------|------|
| _id | ObjectId |
| name | String |
| email | String |
| password | String |
| role | String |
| createdAt | Date |

---

## Patient Schema

```text
Patient
```

| Field | Type |
|--------|------|
| _id | ObjectId |
| patientName | String |
| age | Number |
| gender | String |
| appointmentId | ObjectId |

---

## Doctor Schema

```text
Doctor
```

| Field | Type |
|--------|------|
| _id | ObjectId |
| doctorName | String |
| specialization | String |
| schedule | Array |

---

## Appointment Schema

```text
Appointment
```

| Field | Type |
|--------|------|
| _id | ObjectId |
| patientId | ObjectId |
| doctorId | ObjectId |
| appointmentDate | Date |
| status | String |

---

# 🌐 7. API Documentation

Base URL:

```text
https://hospital-management-app-g81n.onrender.com
```

---

## Authentication APIs

| Method | Endpoint | Purpose |
|---------|----------|----------|
| POST | /auth/login | User Login |
| POST | /auth/register | User Registration |
| GET | /auth/logout | Logout |
| GET | /auth/check-auth | Session Validation |
| PUT | /auth/change-password | Password Update |

---

## Patient APIs

| Method | Endpoint | Purpose |
|---------|----------|----------|
| GET | /patient | Get Patients |
| POST | /patient | Create Patient |
| PUT | /patient/:id | Update Patient |
| DELETE | /patient/:id | Remove Patient |

---

## Doctor APIs

| Method | Endpoint | Purpose |
|---------|----------|----------|
| GET | /doctor | Get Doctors |
| POST | /doctor | Add Doctor |
| PUT | /doctor/:id | Update Doctor |

---

## Appointment APIs

| Method | Endpoint | Purpose |
|---------|----------|----------|
| GET | /appointments | Fetch Appointments |
| POST | /appointments | Book Appointment |
| PUT | /appointments/:id | Update Appointment |
| DELETE | /appointments/:id | Cancel Appointment |

---

## Admin APIs

| Method | Endpoint | Purpose |
|---------|----------|----------|
| GET | /admin/users | Manage Users |
| GET | /admin/dashboard | Dashboard Data |

---

# 🔐 8. Authentication Strategy

Authentication flow:

```text
Login
 ↓
Generate JWT
 ↓
Store Secure Cookie
 ↓
Protected Middleware
 ↓
Access Authorized APIs
```

Security Controls:

- JWT Authentication
- Protected Routes
- Secure Cookies
- Password Hashing
- Environment Isolation

---

<div align="center">

Built with maintainability, security, and production deployment practices.

</div>
