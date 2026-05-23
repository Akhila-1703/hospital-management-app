import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import MinimalBookAppointment from "../components/BookAppointment";
import PatientStatsCards from "./patient/PatientStatsCards";
import PatientCalendarView from "./patient/PatientCalendarView";
import PatientAppointmentsList from "./patient/PatientAppointmentsList";

import {
  pageBackground,
  pageWrapper,
  headingClass,
} from "../styles/Common.js";

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
        "/patient-api/profile",
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
        "/patient-api/appointments",
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
          `/prescription-api/appointment/${appointmentId}`
        );
  
      const prescriptionId =
        prescriptionRes.data.payload._id;
  
      // Download PDF using prescription id
      const response = await axios.get(
        `/prescription-api/${prescriptionId}/pdf`,
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

        {/* stats cards component */}
        <PatientStatsCards 
          appointments={appointments} 
          patientProfile={patientProfile} 
        />

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

          {/* content area */}
          {viewMode === "calendar" ? (
            <PatientCalendarView 
              appointments={appointments}
              downloadPrescription={downloadPrescription}
            />
          ) : (
            <PatientAppointmentsList 
              appointments={appointments}
              apptFilter={apptFilter}
              downloadPrescription={downloadPrescription}
            />
          )}

        </div>
      </div>
    </div>
  );
}

export default PatientDashboard;