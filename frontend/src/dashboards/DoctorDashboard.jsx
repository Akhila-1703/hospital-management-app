import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import { useAuth } from "../store/authStore";
import { FileText } from "lucide-react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";

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
        {(() => {
          const todayStr = new Date().toDateString();
          const todaysVisitsCount = appointments.filter(a => {
            if (!a.appointmentDate) return false;
            return new Date(a.appointmentDate).toDateString() === todayStr && a.status !== "CANCELLED";
          }).length;

          const upcomingCount = appointments.filter(a => {
            if (!a.appointmentDate) return false;
            const apptDate = new Date(a.appointmentDate);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            return apptDate >= today && (a.status === "BOOKED" || a.status === "CONFIRMED");
          }).length;

          const pastCount = appointments.filter(a => {
            if (!a.appointmentDate) return false;
            const apptDate = new Date(a.appointmentDate);
            const today = new Date();
            return a.status === "COMPLETED" || (apptDate < today && a.status !== "CANCELLED" && a.status !== "BOOKED" && a.status !== "CONFIRMED");
          }).length;

          return (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
              {/* Today's Visits */}
              <div className="bg-white rounded-2xl shadow-sm border p-5">
                <p className="text-gray-500 text-sm font-semibold">
                  Today's Visits
                </p>
                <h2 className="text-4xl font-bold text-blue-600 mt-2">
                  {todaysVisitsCount}
                </h2>
                <p className="text-xs text-gray-400 mt-2">
                  Scheduled for today
                </p>
              </div>

              {/* Upcoming Appointments */}
              <div className="bg-white rounded-2xl shadow-sm border p-5">
                <p className="text-gray-500 text-sm font-semibold">
                  Upcoming Appointments
                </p>
                <h2 className="text-4xl font-bold text-green-600 mt-2">
                  {upcomingCount}
                </h2>
                <p className="text-xs text-gray-400 mt-2">
                  Future scheduled sessions
                </p>
              </div>

              {/* Past Appointments */}
              <div className="bg-white rounded-2xl shadow-sm border p-5">
                <p className="text-gray-500 text-sm font-semibold">
                  Past Appointments
                </p>
                <h2 className="text-4xl font-bold text-gray-700 mt-2">
                  {pastCount}
                </h2>
                <p className="text-xs text-gray-400 mt-2">
                  Completed & historical visits
                </p>
              </div>
            </div>
          );
        })()}

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
          {(() => {
            if (viewMode === "calendar") {
              const events = appointments.map(appt => {
                let bgColor = "#cbd5e1"; // gray-300
                if (appt.status === "CONFIRMED") bgColor = "#22c55e"; // green-500
                if (appt.status === "BOOKED") bgColor = "#eab308"; // yellow-500
                if (appt.status === "CANCELLED") bgColor = "#ef4444"; // red-500
                if (appt.status === "COMPLETED") bgColor = "#3b82f6"; // blue-500

                let dateObj = new Date(appt.appointmentDate || appt.date);
                if (appt.appointmentTime || appt.time) {
                  const [hours, mins] = (appt.appointmentTime || appt.time).split(":");
                  dateObj.setHours(hours, mins, 0);
                }

                return {
                  id: appt._id,
                  title: `${appt.patientId?.userId?.name || appt.patientName} - ${appt.status}`,
                  start: dateObj,
                  backgroundColor: bgColor,
                  borderColor: bgColor,
                  extendedProps: { appt }
                };
              });

              return (
                <div className="calendar-container mt-4 z-0 relative">
                  <FullCalendar
                    plugins={[dayGridPlugin, interactionPlugin]}
                    initialView="dayGridMonth"
                    events={events}
                    headerToolbar={{
                      left: "prev,next today",
                      center: "title",
                      right: "dayGridMonth,dayGridWeek"
                    }}
                    height="auto"
                    eventClick={(info) => {
                      const appt = info.event.extendedProps.appt;
                      navigate(`/doctor/appointment-detail/${appt._id}`);
                    }}
                  />
                  <style>{`
                    .fc .fc-toolbar-title { font-size: 1.125rem; font-weight: 700; color: #1f2937; }
                    .fc-button-primary { background-color: #f3f4f6 !important; border-color: #e5e7eb !important; color: #4b5563 !important; text-transform: capitalize; font-weight: 600 !important; font-size: 0.875rem !important; border-radius: 0.5rem !important; padding: 0.25rem 0.75rem !important; }
                    .fc-button-primary:hover { background-color: #e5e7eb !important; color: #1f2937 !important; }
                    .fc-button-active { background-color: #d1d5db !important; color: #111827 !important; box-shadow: none !important; }
                    .fc-event { border-radius: 4px; padding: 2px 4px; cursor: pointer; font-size: 0.75rem; border: none; font-weight: 600; }
                    .fc-daygrid-day-number { color: #4b5563; font-weight: 500; font-size: 0.875rem; padding: 0.5rem; text-decoration: none; }
                    .fc-col-header-cell { padding: 0.75rem 0; background-color: #f9fafb; font-weight: 600; color: #6b7280; font-size: 0.875rem; text-transform: uppercase; }
                    .fc-theme-standard td, .fc-theme-standard th { border-color: #f3f4f6; }
                  `}</style>
                </div>
              );
            }

            const todayStr = new Date().toDateString();
            const filtered = appointments.filter(appt => {
              if (!appt.appointmentDate) return false;
              const apptDate = new Date(appt.appointmentDate);
              const today = new Date();
              today.setHours(0, 0, 0, 0);

              if (apptFilter === "today") {
                return apptDate.toDateString() === todayStr && appt.status !== "CANCELLED";
              } else if (apptFilter === "upcoming") {
                return apptDate >= today && (appt.status === "BOOKED" || appt.status === "CONFIRMED");
              } else if (apptFilter === "past") {
                return appt.status === "COMPLETED" || (apptDate < today && appt.status !== "CANCELLED" && appt.status !== "BOOKED" && appt.status !== "CONFIRMED");
              }
              return true;
            });

            if (filtered.length === 0) {
              return (
                <div className="text-center py-16 text-gray-400 font-medium">
                  No {apptFilter} appointments found
                </div>
              );
            }

            return (
              <div className="space-y-4">
                {filtered.map((appt) => (
                  <div
                    key={appt._id}
                    onClick={() => navigate(`/doctor/appointment-detail/${appt._id}`)}
                    className="border rounded-xl p-5 flex flex-col md:flex-row justify-between items-center bg-gray-50 hover:bg-gray-100 transition cursor-pointer hover:border-blue-200 hover:shadow-sm"
                  >
                    {/* LEFT SIDE */}
                    <div>
                      <h4 className="text-lg font-semibold text-gray-800">
                        {appt.patientId?.userId?.name || appt.patientName || "N/A"}
                      </h4>
                      <p className="text-sm text-gray-600 mt-1">
                        {appt.patientId?.age || appt.patientAge || "N/A"} yrs •{" "}
                        <span className="capitalize">
                          {(appt.patientId?.gender || appt.patientGender || "N/A").toLowerCase()}
                        </span>
                      </p>
                      <p className="text-sm text-gray-500 mt-2">
                        <span className="font-semibold text-gray-700">Reason:</span> {appt.reason}
                      </p>

                      {/* PATIENT TEST REPORTS */}
                      {appt.patientId?.testReports && appt.patientId.testReports.length > 0 && (
  <div className="mt-4 border-t border-gray-100 pt-3">
    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
      Patient Test Reports
    </p>

    <div
      onClick={(e) => e.stopPropagation()}
      className="flex flex-wrap gap-2 mt-2"
    >
      {appt.patientId.testReports.map((report, idx) => (
        <a
          key={report._id || report.url || idx}
          href={report.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 bg-white border px-3 py-2 rounded-lg hover:bg-gray-50 transition"
        >
          <FileText size={18} />
          <span>{report.name}</span>
        </a>
      ))}
    </div>
  </div>
)}
                    </div>

                    {/* RIGHT SIDE */}
                    <div className="text-right mt-4 md:mt-0">
                      <p className="text-sm text-gray-700 font-semibold">
                        {appt.appointmentDate
                          ? new Date(appt.appointmentDate).toLocaleDateString()
                          : appt.date
                          ? new Date(appt.date).toLocaleDateString()
                          : "N/A"}
                      </p>
                      <p className="text-sm text-gray-500 mt-1 font-medium">
                        {appt.appointmentTime || appt.time || "N/A"}
                      </p>

                      {/* STATUS */}
                      <span
                        className={`inline-block mt-3 px-3 py-1 rounded-full text-xs font-semibold ${
                          appt.status === "BOOKED"
                            ? "bg-yellow-100 text-yellow-700"
                            : appt.status === "CONFIRMED"
                            ? "bg-green-100 text-green-700"
                            : appt.status === "COMPLETED"
                            ? "bg-blue-100 text-blue-700"
                            : appt.status === "CANCELLED"
                            ? "bg-red-100 text-red-600"
                            : "bg-gray-200 text-gray-600"
                        }`}
                      >
                        {appt.status === "BOOKED"
                          ? "Pending Approval"
                          : appt.status === "CONFIRMED"
                          ? "Approved"
                          : appt.status === "COMPLETED"
                          ? "Completed"
                          : appt.status === "CANCELLED"
                          ? "Cancelled"
                          : appt.status}
                      </span>

                      {/* ACTIONS */}
                      <div onClick={(e) => e.stopPropagation()} className="mt-4 flex flex-wrap gap-2 justify-end">
                        
                        {/* PAST APPOINTMENTS ACTION FALLBACK */}
                        {apptFilter === "past" ? (
                          <>
                            {appt.hasPrescription ? (
                              <button
                                onClick={() => downloadPrescription(appt._id)}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition flex items-center gap-1.5"
                              >
                                <FileText size={14} />
                                Download Prescription
                              </button>
                            ) : (
                              <button
                                onClick={() => navigate(`/prescription-form/${appt._id}`)}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition"
                              >
                                Write Prescription
                              </button>
                            )}
                          </>
                        ) : (
                          <>
                            {/* If status is BOOKED (Pending Approval) */}
                            {appt.status === "BOOKED" && (
                              <>
                                <button
                                  onClick={() => handleApprove(appt._id)}
                                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition"
                                >
                                  Approve
                                </button>
                                <button
                                  onClick={() => handleCancel(appt._id)}
                                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition"
                                >
                                  Cancel
                                </button>
                              </>
                            )}

                            {/* If status is CONFIRMED (Approved) */}
                            {appt.status === "CONFIRMED" && (
                              <>
                                <button
                                  onClick={() => handleMarkCompleted(appt._id)}
                                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition"
                                >
                                  Mark Completed
                                </button>
                                {appt.hasPrescription ? (
                                  <button
                                    onClick={() => downloadPrescription(appt._id)}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition"
                                  >
                                    View Prescription
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => navigate(`/prescription-form/${appt._id}`)}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition font-semibold"
                                  >
                                    Write Prescription
                                  </button>
                                )}
                                <button
                                  onClick={() => handleCancel(appt._id)}
                                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition"
                                >
                                  Cancel Appointment
                                </button>
                              </>
                            )}

                            {/* If status is COMPLETED */}
                            {appt.status === "COMPLETED" && (
                              <>
                                {appt.hasPrescription ? (
                                  <button
                                    onClick={() => downloadPrescription(appt._id)}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition flex items-center gap-1.5"
                                  >
                                    <FileText size={14} />
                                    Download Prescription
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => navigate(`/prescription-form/${appt._id}`)}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition"
                                  >
                                    Write Prescription
                                  </button>
                                )}
                              </>
                            )}
                          </>
                        )}

                    </div>
                  </div>
                </div>
              ))}
              </div>
            );
          })()}

        </div>

      </div>
    </div>
  );
}

export default DoctorDashboard;