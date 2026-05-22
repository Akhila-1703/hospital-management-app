import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import MinimalBookAppointment from "../components/BookAppointment";
import { Calendar, Clipboard, Folder, FileText } from "lucide-react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";

import {
  pageBackground,
  pageWrapper,
  headingClass,
} from "../styles/common";

function PatientDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [patientProfile, setPatientProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showBookForm, setShowBookForm] = useState(false);
  const [apptFilter, setApptFilter] = useState("today"); // "today" | "upcoming" | "past"
  const [viewMode, setViewMode] = useState("list"); // "list" | "calendar"

  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  // Fetch patient profile to count records/test reports
  const fetchProfile = useCallback(async () => {
    try {
      const res = await axios.get(
        "http://localhost:4000/patient-api/profile",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      if (res.data.payload) {
        setPatientProfile(res.data.payload);
      }
    } catch (err) {
      console.error("Error fetching patient profile", err);
    }
  }, [token]);

  // Fetch appointments
  const fetchAppointments = useCallback(async () => {
    try {
      const res = await axios.get(
        "http://localhost:4000/patient-api/appointments",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setAppointments(
        res.data.payload || []
      );
    } catch (err) {
      console.error(err);

      if (
        err.response?.data?.message ===
        "Patient profile not found"
      ) {
        navigate("/patient-profile");
      }
    } finally {
      setLoading(false);
    }
  }, [token, navigate]);

  useEffect(() => {
    fetchProfile();
    fetchAppointments();
  }, [fetchProfile, fetchAppointments]);

  // Download prescription PDF
  const downloadPrescription = async (
    appointmentId
  ) => {
    try {
  
      // Get prescription by appointment id
      const prescriptionRes =
        await axios.get(
          `http://localhost:4000/prescription-api/appointment/${appointmentId}`
        );
  
      const prescriptionId =
        prescriptionRes.data.payload._id;
  
      // Download PDF using prescription id
      const response = await axios.get(
        `http://localhost:4000/prescription-api/${prescriptionId}/pdf`,
        {
          responseType: "blob",
        }
      );
  
      const url =
        window.URL.createObjectURL(
          new Blob([response.data])
        );
  
      const link =
        document.createElement("a");
  
      link.href = url;
  
      link.setAttribute(
        "download",
        "prescription.pdf"
      );
  
      document.body.appendChild(link);
  
      link.click();
  
      link.remove();
  
    } catch (error) {
  
      console.log(error);
  
      alert("Prescription not available");
  
    }
  };

  // Loading
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-14 w-14 rounded-full border-4 border-blue-500 border-t-transparent animate-spin"></div>
      </div>
    );
  }

  return (
    <div className={pageBackground}>
      <div className={pageWrapper}>

        {/* Title */}
        <h2 className={headingClass}>
          Patient Dashboard
        </h2>

        {/* STATS CARDS */}
        {(() => {
          const upcomingCount = appointments.filter(a => {
            if (!a.date) return false;
            const apptDate = new Date(a.date);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            return apptDate >= today && (a.status === "BOOKED" || a.status === "CONFIRMED");
          }).length;

          const prescriptionCount = appointments.filter(a => a.hasPrescription).length;
          const recordsCount = patientProfile?.testReports?.length || 0;

          return (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
              {/* Upcoming Visits */}
              <div className="bg-white rounded-2xl shadow-sm border p-5 flex justify-between items-start">
                <div>
                  <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">
                    Upcoming Visits
                  </p>
                  <h2 className="text-4xl font-extrabold text-gray-800 mt-3">
                    {upcomingCount}
                  </h2>
                </div>
                <div className="p-2.5 bg-gray-50 rounded-xl text-gray-600 border border-gray-100">
                  <Calendar size={18} />
                </div>
              </div>

              {/* Prescriptions */}
              <div className="bg-white rounded-2xl shadow-sm border p-5 flex justify-between items-start">
                <div>
                  <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">
                    Prescriptions
                  </p>
                  <h2 className="text-4xl font-extrabold text-gray-800 mt-3">
                    {prescriptionCount}
                  </h2>
                </div>
                <div className="p-2.5 bg-gray-50 rounded-xl text-gray-600 border border-gray-100">
                  <Clipboard size={18} />
                </div>
              </div>

              {/* Records */}
              <div className="bg-white rounded-2xl shadow-sm border p-5 flex justify-between items-start">
                <div>
                  <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">
                    Records
                  </p>
                  <h2 className="text-4xl font-extrabold text-gray-800 mt-3">
                    {recordsCount}
                  </h2>
                </div>
                <div className="p-2.5 bg-gray-50 rounded-xl text-gray-600 border border-gray-100">
                  <Folder size={18} />
                </div>
              </div>
            </div>
          );
        })()}

        {/* Book Appointment Toggle */}
        <div className="mb-8 bg-white rounded-2xl shadow-sm border p-5">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h3 className="text-lg font-bold text-gray-800">
                Book a New Appointment
              </h3>
              <p className="text-xs text-gray-400 mt-1">
                Schedule a consultation with our specialized medical team.
              </p>
            </div>
            <button
              onClick={() => setShowBookForm(!showBookForm)}
              className="bg-[#0071e3] hover:bg-blue-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition shadow-sm"
            >
              {showBookForm ? "Hide Booking Form" : "Book Appointment"}
            </button>
          </div>

          {showBookForm && (
            <div className="mt-6 border-t border-gray-100 pt-5 animate-fadeIn">
              <MinimalBookAppointment
                fetchAppointments={fetchAppointments}
              />
            </div>
          )}
        </div>

        {/* Appointments Section */}
        <div className="bg-white rounded-2xl shadow-sm border p-6">

          {/* Header & Filter Pills */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 pb-4 border-b border-gray-100 gap-4">
            <div>
              <h3 className="text-xl font-bold text-gray-800">
                Your Appointments
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                View and manage your appointments
              </p>
            </div>

            {/* Filter & View Mode Bar */}
            <div className="flex flex-col sm:flex-row gap-3">
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

          {/* Content Area (List or Calendar) */}
          {(() => {
            if (viewMode === "calendar") {
              const events = appointments.map(appt => {
                let bgColor = "#cbd5e1"; // gray-300
                if (appt.status === "CONFIRMED") bgColor = "#22c55e"; // green-500
                if (appt.status === "BOOKED") bgColor = "#eab308"; // yellow-500
                if (appt.status === "CANCELLED") bgColor = "#ef4444"; // red-500
                if (appt.status === "COMPLETED") bgColor = "#3b82f6"; // blue-500

                let dateObj = new Date(appt.date);
                if (appt.time) {
                  const [hours, mins] = appt.time.split(":");
                  dateObj.setHours(hours, mins, 0);
                }

                return {
                  id: appt._id,
                  title: `Dr. ${appt.doctorName} - ${appt.status}`,
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
                      if (appt.hasPrescription) {
                        if (window.confirm(`Appointment with Dr. ${appt.doctorName} was ${appt.status}. Do you want to download the prescription?`)) {
                          downloadPrescription(appt._id);
                        }
                      } else {
                        alert(`Appointment with Dr. ${appt.doctorName}\nStatus: ${appt.status}\nReason: ${appt.reason || "N/A"}\nDate: ${new Date(appt.date).toLocaleDateString()}`);
                      }
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
              if (!appt.date) return false;
              const apptDate = new Date(appt.date);
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
                {filtered.map((appt) => {
                  const doctorName = appt.doctorName || "N/A";
                  const specialization = appt.specialization || "General Physician";

                  return (
                    <div
                      key={appt._id}
                      className="border rounded-2xl p-5 flex flex-col md:flex-row justify-between items-center bg-gray-50 hover:bg-gray-100 transition hover:border-blue-200 hover:shadow-sm"
                    >
                      {/* Left Side Info */}
                      <div className="w-full md:w-auto">
                        <h4 className="text-lg font-semibold text-gray-800">
                          Dr. {doctorName}
                        </h4>
                        <p className="text-blue-600 font-medium mt-1 capitalize text-xs">
                          {specialization}
                        </p>
                        <p className="text-sm text-gray-500 mt-2">
                          <span className="font-semibold text-gray-700">Reason:</span> {appt.reason || "N/A"}
                        </p>
                      </div>

                      {/* Right Side Status & Date */}
                      <div className="text-right mt-4 md:mt-0 w-full md:w-auto flex flex-col items-end">
                        <p className="text-sm text-gray-700 font-semibold">
                          {appt.date ? new Date(appt.date).toLocaleDateString("en-GB") : "N/A"}
                        </p>
                        <p className="text-sm text-gray-500 mt-1 font-medium">
                          {appt.time || "N/A"}
                        </p>

                        <span
                          className={`inline-block mt-3 px-3 py-1 rounded-full text-xs font-semibold ${
                            appt.status === "BOOKED"
                              ? "bg-yellow-100 text-yellow-700"
                              : appt.status === "CONFIRMED"
                              ? "bg-green-100 text-green-700"
                              : appt.status === "CANCELLED"
                              ? "bg-red-100 text-red-600"
                              : appt.status === "COMPLETED"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-gray-200 text-gray-600"
                          }`}
                        >
                          {appt.status === "BOOKED"
                            ? "Pending Approval"
                            : appt.status === "CONFIRMED"
                            ? "Approved"
                            : appt.status === "CANCELLED"
                            ? "Cancelled"
                            : appt.status === "COMPLETED"
                            ? "Completed"
                            : appt.status}
                        </span>

                        {/* Prescription Action Button */}
                        {(appt.status === "COMPLETED" || appt.hasPrescription || apptFilter === "past") && (
                          <div className="mt-4 flex justify-end w-full">
                            {appt.hasPrescription ? (
                              <button
                                onClick={() => downloadPrescription(appt._id)}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
                              >
                                <FileText size={14} />
                                Download Prescription
                              </button>
                            ) : (
                              <span className="text-xs text-gray-400 italic font-medium">
                                Prescription Pending
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })()}

        </div>
      </div>
    </div>
  );
}

export default PatientDashboard;