import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router";
import axios from "axios";
import {
  ArrowLeft,
  User,
  Calendar,
  Clock,
  FileText,
  Heart,
  Phone,
  Mail,
  MapPin,
  Activity,
  Download,
  AlertCircle
} from "lucide-react";

function DoctorPatientDetail() {
  const { appointmentId } = useParams();
  const navigate = useNavigate();
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  // Fetch appointment details
  const fetchAppointmentDetails = useCallback(async () => {
    try {
      const res = await axios.get(
        `/doctor-api/appointment/${appointmentId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setAppointment(res.data.payload);
    } catch (err) {
      console.error("Error fetching appointment details:", err);
      alert("Failed to load appointment details.");
      navigate("/doctor-dashboard");
    } finally {
      setLoading(false);
    }
  }, [appointmentId, token, navigate]);

  useEffect(() => {
    fetchAppointmentDetails();
  }, [fetchAppointmentDetails]);

  // Actions
  const handleApprove = async () => {
    try {
      await axios.put(
        `/doctor-api/appointment/${appointmentId}/approve`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setAppointment((prev) => ({ ...prev, status: "CONFIRMED" }));
      alert("Appointment approved successfully!");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to approve appointment");
    }
  };

  const handleCancel = async () => {
    if (!window.confirm("Are you sure you want to cancel this appointment?")) {
      return;
    }
    try {
      await axios.put(
        `/doctor-api/appointment/${appointmentId}/cancel`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setAppointment((prev) => ({ ...prev, status: "CANCELLED" }));
      alert("Appointment cancelled successfully!");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to cancel appointment");
    }
  };

  const handleMarkCompleted = async () => {
    try {
      await axios.put(
        `/doctor-api/appointment/${appointmentId}/complete`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setAppointment((prev) => ({ ...prev, status: "COMPLETED" }));
      alert("Appointment marked as completed successfully!");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to complete appointment");
    }
  };

  const downloadPrescription = async () => {
    try {
      const prescriptionRes = await axios.get(
        `/prescription-api/appointment/${appointmentId}`
      );
      const prescriptionId = prescriptionRes.data.payload._id;
      const response = await axios.get(
        `/prescription-api/${prescriptionId}/pdf`,
        { responseType: "blob" }
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
      alert("Prescription PDF not available");
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50 text-gray-500 text-lg">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="font-semibold text-gray-600">Loading Medical Case File...</p>
        </div>
      </div>
    );
  }

  if (!appointment) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center bg-white p-8 rounded-3xl shadow-lg border max-w-md">
          <AlertCircle className="mx-auto text-red-500 mb-4" size={48} />
          <h2 className="text-2xl font-bold text-gray-800">Case File Not Found</h2>
          <p className="text-gray-500 mt-2">The requested appointment case file could not be retrieved.</p>
          <button
            onClick={() => navigate("/doctor-dashboard")}
            className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-semibold transition"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const patient = appointment.patientId;
  const patientUser = patient?.userId;

  return (
    <div className="min-h-screen bg-gray-50/50 pb-12">
      {/* HEADER BANNER */}
      <div className="bg-white border-b shadow-sm sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/doctor-dashboard")}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 p-2.5 rounded-xl transition flex items-center justify-center shadow-sm"
              title="Back to Dashboard"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <User className="text-blue-600" size={24} />
                Medical File: {patientUser?.name || appointment.patientName || "N/A"}
              </h1>
              <p className="text-sm text-gray-500 mt-0.5">
                Case reference: <span className="font-semibold text-gray-700">{appointment._id}</span>
              </p>
            </div>
          </div>

          {/* QUICK STATUS BADGE */}
          <div>
            <span
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider ${
                appointment.status === "BOOKED"
                  ? "bg-yellow-100 text-yellow-800 border border-yellow-200"
                  : appointment.status === "CONFIRMED"
                  ? "bg-green-100 text-green-800 border border-green-200"
                  : appointment.status === "COMPLETED"
                  ? "bg-blue-100 text-blue-800 border border-blue-200"
                  : "bg-red-100 text-red-800 border border-red-200"
              }`}
            >
              {appointment.status === "BOOKED"
                ? "Pending Approval"
                : appointment.status === "CONFIRMED"
                ? "Approved"
                : appointment.status === "COMPLETED"
                ? "Completed"
                : appointment.status === "CANCELLED"
                ? "Cancelled"
                : appointment.status}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT COLUMNS - PATIENT DATA (2 cols wide on large screens) */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* DEMOGRAPHICS BENTO CARD */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 sm:p-8 hover:shadow-md transition">
              <h3 className="text-lg font-bold text-gray-800 border-b pb-3 flex items-center gap-2 mb-6">
                <Activity className="text-blue-600 animate-pulse" size={20} />
                Patient Demographics & Profile
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Full Name</p>
                    <p className="text-lg font-semibold text-gray-800 mt-1">
                      {patientUser?.name || appointment.patientName || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Age / Gender</p>
                    <p className="text-lg font-semibold text-gray-800 mt-1 capitalize">
                      {patient?.age || appointment.patientAge || "N/A"} Years • {(patient?.gender || appointment.patientGender || "N/A").toLowerCase()}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Blood Group</p>
                    <p className="text-lg font-semibold text-gray-800 mt-1">
                      <span className="bg-red-50 text-red-600 px-3 py-1 rounded-lg text-sm font-bold border border-red-100">
                        {patient?.bloodGroup || "Not Specified"}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-2.5">
                    <Phone className="text-gray-400 mt-1 shrink-0" size={16} />
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Phone Number</p>
                      <p className="text-base font-semibold text-gray-800 mt-0.5">
                        {patientUser?.phoneNumber || "N/A"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <Mail className="text-gray-400 mt-1 shrink-0" size={16} />
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Email Address</p>
                      <p className="text-base font-semibold text-gray-800 mt-0.5 break-all">
                        {patientUser?.email || "N/A"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <MapPin className="text-gray-400 mt-1 shrink-0" size={16} />
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Residential Address</p>
                      <p className="text-base font-semibold text-gray-700 mt-0.5">
                        {patient?.address || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* MEDICAL HISTORY CARD */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 sm:p-8 hover:shadow-md transition">
              <h3 className="text-lg font-bold text-gray-800 border-b pb-3 flex items-center gap-2 mb-4">
                <Heart className="text-red-500" size={20} />
                Chronic Illnesses & Medical History
              </h3>
              
              <div className="bg-gray-50/50 border rounded-2xl p-5 mt-2">
                {patient?.medicalHistory ? (
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line text-base">
                    {patient.medicalHistory}
                  </p>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-gray-400 italic text-sm">No medical history declared by the patient.</p>
                  </div>
                )}
              </div>
            </div>

            {/* TEST REPORTS CARD */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 sm:p-8 hover:shadow-md transition">
              <h3 className="text-lg font-bold text-gray-800 border-b pb-3 flex items-center gap-2 mb-6">
                <FileText className="text-blue-600" size={20} />
                Patient Uploaded Test Reports
              </h3>

              {patient?.testReports && patient.testReports.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {patient.testReports.map((report, idx) => (
                    <div
                      key={idx}
                      className="border rounded-2xl p-4 flex items-center justify-between bg-gray-50 hover:bg-gray-100/75 transition group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="bg-blue-50 text-blue-600 p-2.5 rounded-xl group-hover:bg-blue-100 transition shrink-0">
                          <FileText size={20} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-gray-800 truncate" title={report.name}>
                            {report.name}
                          </p>
                          <p className="text-xs text-gray-400 mt-0.5">
                            Uploaded: {report.uploadedAt ? new Date(report.uploadedAt).toLocaleDateString() : "N/A"}
                          </p>
                        </div>
                      </div>
                      <a
                        href={report.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-white hover:bg-blue-600 text-blue-600 hover:text-white p-2 rounded-xl border hover:border-blue-600 shadow-sm transition flex items-center justify-center shrink-0"
                        title="Download / Open File"
                      >
                        <Download size={16} />
                      </a>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 bg-gray-50/50 rounded-2xl border border-dashed">
                  <FileText className="mx-auto text-gray-300 mb-3" size={40} />
                  <p className="text-gray-400 text-sm font-medium">No previous test reports uploaded for this patient.</p>
                </div>
              )}
            </div>

          </div>

          {/* RIGHT COLUMN - APPOINTMENT CASE DETAILS & ACTIONS */}
          <div className="space-y-8">
            
            {/* CONSULTATION BRIEF */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition">
              <h3 className="text-lg font-bold text-gray-800 border-b pb-3 flex items-center gap-2 mb-5">
                <Calendar className="text-blue-600" size={20} />
                Appointment Details
              </h3>

              <div className="space-y-4">
                <div className="bg-blue-50/50 rounded-2xl p-4 border border-blue-100/50 flex items-center gap-3">
                  <Calendar className="text-blue-600" size={18} />
                  <div>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Scheduled Date</p>
                    <p className="text-base font-semibold text-gray-800 mt-0.5">
                      {appointment.appointmentDate
                        ? new Date(appointment.appointmentDate).toLocaleDateString("en-GB", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric"
                          })
                        : appointment.date
                        ? new Date(appointment.date).toLocaleDateString("en-GB", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric"
                          })
                        : "N/A"}
                    </p>
                  </div>
                </div>

                <div className="bg-blue-50/50 rounded-2xl p-4 border border-blue-100/50 flex items-center gap-3">
                  <Clock className="text-blue-600" size={18} />
                  <div>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Time Slot</p>
                    <p className="text-base font-semibold text-gray-800 mt-0.5">
                      {appointment.appointmentTime || appointment.time || "N/A"}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Reason for consultation</p>
                  <div className="bg-gray-50 border rounded-2xl p-4">
                    <p className="text-gray-700 text-sm leading-relaxed font-medium">
                      "{appointment.reason || "No reason declared"}"
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* ACTION CENTER */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition">
              <h3 className="text-lg font-bold text-gray-800 border-b pb-3 flex items-center gap-2 mb-5">
                <Activity className="text-blue-600" size={20} />
                Action Center
              </h3>

              <div className="space-y-3">
                {/* If status is BOOKED (Pending Approval) */}
                {appointment.status === "BOOKED" && (
                  <div className="flex flex-col gap-2.5">
                    <button
                      onClick={handleApprove}
                      className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-bold transition shadow-sm"
                    >
                      Approve Appointment
                    </button>
                    <button
                      onClick={handleCancel}
                      className="w-full bg-red-50 hover:bg-red-100 text-red-600 py-3 rounded-xl font-bold border border-red-200 transition"
                    >
                      Reject / Cancel Appointment
                    </button>
                  </div>
                )}

                {/* If status is CONFIRMED (Approved) */}
                {appointment.status === "CONFIRMED" && (
                  <div className="flex flex-col gap-2.5">
                    <button
                      onClick={handleMarkCompleted}
                      className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-bold transition shadow-sm"
                    >
                      Mark Completed
                    </button>
                    
                    {appointment.hasPrescription ? (
                      <button
                        onClick={downloadPrescription}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold transition shadow-sm"
                      >
                        Download / View Prescription
                      </button>
                    ) : (
                      <button
                        onClick={() => navigate(`/prescription-form/${appointmentId}`)}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold transition shadow-sm"
                      >
                        Write Prescription
                      </button>
                    )}

                    <button
                      onClick={handleCancel}
                      className="w-full bg-red-50 hover:bg-red-100 text-red-600 py-3 rounded-xl font-bold border border-red-200 transition mt-2"
                    >
                      Cancel Appointment
                    </button>
                  </div>
                )}

                {/* If status is COMPLETED */}
                {appointment.status === "COMPLETED" && (
                  <div className="space-y-3">
                    <div className="bg-green-50 border border-green-200 rounded-2xl p-4 text-center">
                      <p className="text-sm text-green-800 font-semibold">This consultation is fully completed.</p>
                    </div>
                    {appointment.hasPrescription && (
                      <button
                        onClick={downloadPrescription}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold transition shadow-sm"
                      >
                        Download Prescription PDF
                      </button>
                    )}
                  </div>
                )}

                {/* If status is CANCELLED */}
                {appointment.status === "CANCELLED" && (
                  <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-center">
                    <p className="text-sm text-red-800 font-semibold">This appointment has been cancelled.</p>
                  </div>
                )}
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}

export default DoctorPatientDetail;
