<div align="center">

# 🎨 Frontend Architecture & UI Documentation

### Peoplecare International Hospital

This document serves as the frontend technical manual for the Hospital Management Platform.

It documents the UI architecture, component organization, routing flow, environment setup, package ecosystem, deployment configuration, and frontend engineering decisions.

</div>

---

# 🏗️ 1. Frontend Architecture & Application Flow

The frontend is implemented as a modern **React Single Page Application (SPA)** built with **Vite**.

The architecture focuses on:

- Component-based development
- Centralized routing
- Secure authentication flows
- Global state management
- Responsive design
- Environment-aware API communication

---

## UI Rendering Flow

```text
Browser
 ↓
React Application
 ↓
React Router
 ↓
Layouts
 ↓
Pages
 ↓
Components
 ↓
API Layer
 ↓
Backend
```

---

## Routing & UI Topology

```text
main.jsx
 ↓
App.jsx
 ↓
RootLayout
 ↓
Router Outlet
 ↓
Public Pages
 ↓
Protected Dashboards
```

---

## Application Layers

```text
Pages
 ↓
Components
 ↓
Hooks
 ↓
Store
 ↓
API Services
 ↓
Backend APIs
```

---

# 🚀 2. Local Installation & Setup

## Install Dependencies

```bash
cd frontend
npm install
```

---

## Configure Environment Variables

Create:

```text
frontend/.env
```

Add:

```env
VITE_API_BASE_URL=http://localhost:4000
```

Production:

```env
VITE_API_BASE_URL=https://hospital-management-app-g81n.onrender.com
```

---

## Start Development Server

```bash
npm run dev
```

Frontend:

```text
http://localhost:5173
```

---

# 🌐 3. Production Deployment

Frontend Deployment:

```text
https://hospital-management-app-xi.vercel.app
```

Hosted Using:

- Vercel

Backend Connected:

```text
https://hospital-management-app-g81n.onrender.com
```

---

# 📂 4. Frontend Project Structure

```text
frontend/

├── public/
│
├── src/
│
│── assets/
│     ├── images/
│     └── icons/
│
│── components/
│     ├── Header.jsx
│     ├── Footer.jsx
│     ├── ProtectedRoute.jsx
│     ├── Calendar.jsx
│     └── Shared UI Components
│
│── pages/
│     ├── Home.jsx
│     ├── Login.jsx
│     ├── Register.jsx
│     ├── About.jsx
│     └── Public Screens
│
│── dashboards/
│     ├── AdminDashboard.jsx
│     ├── DoctorDashboard.jsx
│     ├── PatientDashboard.jsx
│
│── layouts/
│     └── RootLayout.jsx
│
│── hooks/
│
│── store/
│     └── authStore.js
│
│── services/
│     └── api.js
│
│── styles/
│     └── Common.js
│
│── App.jsx
│
│── main.jsx
│
├── package.json
│
├── vite.config.js
│
└── .env
```

---

# 📦 5. Package Documentation

Install all packages:

```bash
npm install
```

---

## Core Framework

| Package | Purpose |
|----------|----------|
| react | Component rendering |
| react-dom | Browser rendering |
| vite | Development + production build |

Install:

```bash
npm install react react-dom
```

---

## Routing

| Package | Purpose |
|----------|----------|
| react-router | Core routing |
| react-router-dom | Browser routing |

Install:

```bash
npm install react-router react-router-dom
```

---

## Styling

| Package | Purpose |
|----------|----------|
| tailwindcss | Utility-first styling |
| @tailwindcss/vite | Tailwind + Vite integration |

Install:

```bash
npm install tailwindcss @tailwindcss/vite
```

---

## State Management

| Package | Purpose |
|----------|----------|
| zustand | Global application state |

Install:

```bash
npm install zustand
```

---

## HTTP Communication

| Package | Purpose |
|----------|----------|
| axios | Backend communication |

Install:

```bash
npm install axios
```

---

## Forms

| Package | Purpose |
|----------|----------|
| react-hook-form | Form validation |

Install:

```bash
npm install react-hook-form
```

---

## Notifications

| Package | Purpose |
|----------|----------|
| react-hot-toast | UI notifications |

Install:

```bash
npm install react-hot-toast
```

---

## Scheduling

| Package | Purpose |
|----------|----------|
| react-calendar | Calendar UI |
| react-datepicker | Date selection |
| @fullcalendar/react | Calendar rendering |
| @fullcalendar/daygrid | Day view |
| @fullcalendar/timegrid | Time slots |
| @fullcalendar/interaction | User interaction |

Install:

```bash
npm install react-calendar react-datepicker
```

```bash
npm install @fullcalendar/react
```

```bash
npm install @fullcalendar/daygrid
```

```bash
npm install @fullcalendar/timegrid
```

```bash
npm install @fullcalendar/interaction
```

---

## Maps

| Package | Purpose |
|----------|----------|
| leaflet | Map engine |
| react-leaflet | React integration |

Install:

```bash
npm install leaflet react-leaflet
```

---

## Icons

| Package | Purpose |
|----------|----------|
| lucide-react | Modern icon system |

Install:

```bash
npm install lucide-react
```

---

# 🛡️ 6. State Management & Security

## Authentication Flow

```text
Login
 ↓
API Request
 ↓
JWT Validation
 ↓
Store User State
 ↓
Protected Navigation
```

---

## Protected Routes

Protected screens are controlled through:

```text
ProtectedRoute
 ↓
Role Validation
 ↓
Dashboard Access
```

Role-based routing controls:

- Patient Access
- Doctor Access
- Admin Access

---

## API Communication

All frontend API requests are centralized.

```text
services/api.js
```

Responsibilities:

- Base URL Management
- Credentials Handling
- API Reusability
- Environment Switching

---

# ⚡ 7. Build & Deployment

Build:

```bash
npm run build
```

Preview:

```bash
npm run preview
```

Production Output:

```text
dist/
```

---

<div align="center">

Built for performance, maintainability, responsive design, and modern healthcare experiences.

</div>
