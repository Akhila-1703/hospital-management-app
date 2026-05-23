import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import { useAuth } from "../store/authStore";
import { FileText } from "lucide-react";
import DoctorStatsCards from "./doctor/DoctorStatsCards";
import DoctorCalendarView from "./doctor/DoctorCalendarView";
import DoctorAppointmentsList from "./doctor/DoctorAppointmentsList";

function DoctorDashboard() {
  const [doctor, setDoctor] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apptFilter, setApptFilter] = useState("today"); // "today" | "upcoming" | "past"
  const [viewMode, setViewMode] = useState("list"); // "list" | "calendar"

  const navigate = useNavigate();

  const logout = useAuth((state) => state.logout);

  const token = localStorage.getItem("token");

  // Fetch doctor profile
  const fetchDoctor = useCallback(async () => {
    try {
      const res = await axios.get(
        "/doctor-api/profile",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.data.payload) {
        navigate("/doctor-form");
        return false;
      }

      setDoctor(res.data.payload);
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  }, [token, navigate]);

  // Fetch appointments
  const fetchAppointments = useCallback(async () => {
    try {
      const res = await axios.get(
        "/doctor-api/appointments",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setAppointments(res.data.payload || []);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    const loadData = async () => {
      const doctorFound = await fetchDoctor();
      if (doctorFound) {
        await fetchAppointments();
      } else {
        setLoading(false);
      }
    };

    loadData();
  }, [fetchDoctor, fetchAppointments]);

  // Download prescription PDF
  const downloadPrescription = async (appointmentId) => {
    try {
      // Get prescription by appointment id
      const prescriptionRes = await axios.get(
        `/prescription-api/appointment/${appointmentId}`
      );

      const prescriptionId = prescriptionRes.data.payload._id;

      // Download PDF using prescription id
      const response = await axios.get(
        `/prescription-api/${prescriptionId}/pdf`,
        {
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `prescription_${appointmentId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.log(error);
      alert("Prescription not available");
    }
  };

  // Mark appointment as completed
  const handleMarkCompleted = async (appointmentId) => {
    try {
      await axios.put(
        `/doctor-api/appointment/${appointmentId}/complete`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      // Update local state instantly
      setAppointments((prev) =>
        prev.map((appt) =>
          appt._id === appointmentId ? { ...appt, status: "COMPLETED" } : appt
        )
      );
      alert("Appointment marked as completed successfully!");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to complete appointment");
    }
  };

  // Approve appointment
  const handleApprove = async (appointmentId) => {
    try {
      await axios.put(
        `/doctor-api/appointment/${appointmentId}/approve`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      // Update local state instantly to CONFIRMED
      setAppointments((prev) =>
        prev.map((appt) =>
          appt._id === appointmentId ? { ...appt, status: "CONFIRMED" } : appt
        )
      );
      alert("Appointment approved successfully!");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to approve appointment");
    }
  };

  // Cancel appointment
  const handleCancel = async (appointmentId) => {
    if (!window.confirm("Are you sure you want to cancel this appointment?")) {
      return;
    }
    try {
      await axios.put(
        `/doctor-api/appointment/${appointmentId}/cancel`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      // Update local state instantly to CANCELLED
      setAppointments((prev) =>
        prev.map((appt) =>
          appt._id === appointmentId ? { ...appt, status: "CANCELLED" } : appt
        )
      );
      alert("Appointment cancelled successfully!");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to cancel appointment");
    }
  };

  // Logout
  const handleLogout = () => {
    logout();

    localStorage.removeItem("token");

    navigate("/login", {
      replace: true,
    });
  };

  // Loading Screen
  if (loading || !doctor) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-100 text-gray-500 text-lg">
        Loading Dashboard...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">

      {/* HEADER */}
      <div className="bg-white border-b shadow-sm">

        <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">

          <div>

            <h1 className="text-3xl font-bold text-gray-800">
              Doctor Dashboard
            </h1>

            <p className="text-gray-500 text-sm mt-1">
              Welcome back Dr. {doctor.userId?.name}
            </p>

          </div>

          

        </div>

      </div>

      {/* MAIN CONTENT */}
      <div className="max-w-7xl mx-auto p-6">

        {/* OVERVIEW CARDS */}
        <DoctorStatsCards appointments={appointments} />

        {/* APPOINTMENTS */}
        <div className="bg-white rounded-2xl shadow-sm border p-6">

          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 pb-4 border-b border-gray-100">
            <div>
              <h3 className="text-xl font-bold text-gray-800">
                Recent Appointments
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Manage all patient appointments
              </p>
            </div>

            {/* Filter & View Mode Bar */}
            <div className="flex flex-col sm:flex-row gap-3 mt-4 md:mt-0">
              {viewMode === "list" && (
                <div className="flex gap-1.5 bg-gray-100/80 p-1 rounded-xl border overflow-x-auto">
                  <button
                    onClick={() => setApptFilter("today")}
                    className={`px-4 py-1.5 text-xs font-bold rounded-lg transition whitespace-nowrap ${
                      apptFilter === "today"
                        ? "bg-white text-blue-600 shadow-sm border border-gray-200/50"
                        : "text-gray-500 hover:text-gray-800"
                    }`}
                  >
                    Today's Appointments
                  </button>
                  <button
                    onClick={() => setApptFilter("upcoming")}
                    className={`px-4 py-1.5 text-xs font-bold rounded-lg transition whitespace-nowrap ${
                      apptFilter === "upcoming"
                        ? "bg-white text-blue-600 shadow-sm border border-gray-200/50"
                        : "text-gray-500 hover:text-gray-800"
                    }`}
                  >
                    Upcoming Appointments
                  </button>
                  <button
                    onClick={() => setApptFilter("past")}
                    className={`px-4 py-1.5 text-xs font-bold rounded-lg transition whitespace-nowrap ${
                      apptFilter === "past"
                        ? "bg-white text-blue-600 shadow-sm border border-gray-200/50"
                        : "text-gray-500 hover:text-gray-800"
                    }`}
                  >
                    Past Appointments
                  </button>
                </div>
              )}
              
              <div className="flex gap-1.5 bg-gray-100/80 p-1 rounded-xl border">
                <button
                  onClick={() => setViewMode("list")}
                  className={`px-4 py-1.5 text-xs font-bold rounded-lg transition whitespace-nowrap ${
                    viewMode === "list"
                      ? "bg-white text-blue-600 shadow-sm border border-gray-200/50"
                      : "text-gray-500 hover:text-gray-800"
                  }`}
                >
                  List View
                </button>
                <button
                  onClick={() => setViewMode("calendar")}
                  className={`px-4 py-1.5 text-xs font-bold rounded-lg transition whitespace-nowrap ${
                    viewMode === "calendar"
                      ? "bg-white text-blue-600 shadow-sm border border-gray-200/50"
                      : "text-gray-500 hover:text-gray-800"
                  }`}
                >
                  Calendar View
                </button>
              </div>
            </div>
          </div>

          {/* Filtered Appointments Content */}
          {viewMode === "calendar" ? (
            <DoctorCalendarView
              appointments={appointments}
              navigate={navigate}
            />
          ) : (
            <DoctorAppointmentsList
              appointments={appointments}
              apptFilter={apptFilter}
              navigate={navigate}
              downloadPrescription={downloadPrescription}
              handleMarkCompleted={handleMarkCompleted}
              handleApprove={handleApprove}
              handleCancel={handleCancel}
            />
          )}

        </div>

      </div>
    </div>
  );
}

export default DoctorDashboard;