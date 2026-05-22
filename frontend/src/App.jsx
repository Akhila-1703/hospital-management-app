import React from "react";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router";

import RootLayout from "./layouts/RootLayout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Doctors from "./pages/Doctors";
import PrescriptionForm from "./pages/PrescriptionForm";

import BookAppointment from "./components/BookAppointment";
import HospitalLocations from "./components/HospitalLocations";
import Appointments from "./pages/Appointments";
import About from "./pages/About";

import PatientDashboard from "./dashboards/PatientDashboard";
import DoctorDashboard from "./dashboards/DoctorDashboard";
import AdminDashboard from "./dashboards/AdminDashboard";

import DoctorForm from "./components/DoctorForm";
import PatientProfile from "./pages/PatientProfile";
import DoctorPatientDetail from "./pages/DoctorPatientDetail";

import { Toaster } from "react-hot-toast";
import { useAuth } from "./store/authStore";

function App() {
  const checkAuth = useAuth((state) => state.checkAuth);

  React.useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const routerObj = createBrowserRouter([
    {
      path: "/",
      element: <RootLayout />,
      children: [
        // Home
        {
          index: true,
          element: <Home />,
        },
        {
          path: "about",
          element: <About />,
        },

        // Auth
        {
          path: "register",
          element: <Register />,
        },
        {
          path: "login",
          element: <Login />,
        },

        // Doctors
        {
          path: "doctors",
          element: <Doctors />,
        },

        // Doctor Flow
        {
          path: "doctor-form",
          element: <DoctorForm />,
        },
        {
          path: "doctor-dashboard",
          element: <DoctorDashboard />,
        },
        {
          path: "doctor/appointment-detail/:appointmentId",
          element: <DoctorPatientDetail />,
        },

        // Prescription Form
        {
          path: "prescription-form/:id",
          element: <PrescriptionForm />,
        },

        // Patient Flow
        {
          path: "patient-profile",
          element: <PatientProfile />,
        },
        {
          path: "patient-dashboard",
          element: <PatientDashboard />,
        },

        // Appointment Flow
        {
          path: "book-appointment",
          element: <BookAppointment />,
        },
        {
          path: "appointments",
          element: <Appointments />,
        },
        
        {
          path: "locations",
          element: <HospitalLocations />,
        },

        // Admin
        {
          path: "admin-dashboard",
          element: <AdminDashboard />,
        },
      ],
    },

    // 404
    {
      path: "*",
      element: (
        <div className="h-screen flex items-center justify-center text-2xl font-bold">
          404 Not Found
        </div>
      ),
    },
  ]);

  return (
    <>
      <Toaster position="top-center" />
      <RouterProvider router={routerObj} />
    </>
  );
}

export default App;