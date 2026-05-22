import React, { useState, useEffect } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useLocation, useNavigate } from "react-router";
import {
  CalendarDays,
  Clock3,
  FileText,
  UserRound,
  Stethoscope,
} from "lucide-react";

function MinimalBookAppointment({ fetchAppointments }) {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const [profileComplete, setProfileComplete] = useState(true);
  const [checkingProfile, setCheckingProfile] = useState(true);

  const [formData, setFormData] = useState({
    doctorId: "",
    appointmentDate: null,
    appointmentTime: "",
    reason: "",
  });

  useEffect(() => {
    if (location.state?.doctorId) {
      setFormData((prev) => ({
        ...prev,
        doctorId: location.state.doctorId,
      }));
    }
  }, [location.state]);

  const token = localStorage.getItem("token");

  // Fetch doctors & profile completeness
  useEffect(() => {
    setCheckingProfile(true);

    axios
      .get("/doctor-api/doctors", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setDoctors(res.data.payload))
      .catch((err) => console.error(err));

    axios
      .get("/patient-api/profile", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        if (res.data.payload) {
          setProfileComplete(res.data.payload.isProfileCompleted);
        } else {
          setProfileComplete(false);
        }
      })
      .catch((err) => {
        console.error(err);
        setProfileComplete(false);
      })
      .finally(() => {
        setCheckingProfile(false);
      });
  }, [token]);

  // Handle input changes
  const handleChange = (e) =>
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

  const handleDateChange = (date) =>
    setFormData({
      ...formData,
      appointmentDate: date,
    });

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.appointmentDate) {
      return alert("Please select appointment date");
    }

    setLoading(true);

    try {
      const year = formData.appointmentDate.getFullYear();
      const month = String(formData.appointmentDate.getMonth() + 1).padStart(2, '0');
      const day = String(formData.appointmentDate.getDate()).padStart(2, '0');

      const formattedData = {
        ...formData,
        appointmentDate: `${year}-${month}-${day}`,
      };

      const res = await axios.post(
        "/patient-api/appointment",
        formattedData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const appointment = res.data.payload;
      const doctor = appointment.doctorId;

      const doctorName =
        doctor?.userId?.name ||
        `${doctor?.userId?.firstName || ""} ${
          doctor?.userId?.lastName || ""
        }`.trim() ||
        "N/A";

      alert(
        `Appointment Booked Successfully 

Doctor: ${doctorName}
Specialization: ${doctor?.specialization || "N/A"}
Date: ${appointment.appointmentDate}
Time: ${appointment.appointmentTime}`
      );

      fetchAppointments();

      setFormData({
        doctorId: "",
        appointmentDate: null,
        appointmentTime: "",
        reason: "",
      });
    } catch (err) {
      alert(err.response?.data?.message || "Booking failed");
    } finally {
      setLoading(false);
    }
  };

  if (checkingProfile) {
    return (
      <div className="max-w-2xl mx-auto p-6 text-center">
        <div className="h-10 w-10 rounded-full border-4 border-blue-500 border-t-transparent animate-spin mx-auto mb-4"></div>
        <p className="text-gray-500">Checking profile status...</p>
      </div>
    );
  }

  if (!profileComplete) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-white shadow-2xl rounded-3xl p-8 border border-red-100 text-center">
          <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-5 border border-red-100">
            <UserRound size={30} />
          </div>

          <h2 className="text-2xl font-bold text-gray-800 mb-3">
            Profile Completion Required
          </h2>

          <p className="text-gray-600 mb-8 max-w-md mx-auto leading-relaxed">
            Please complete your profile details (age, address, gender, blood group) first before you can book appointments.
          </p>

          <button
            onClick={() => navigate("/patient-profile")}
            className="bg-red-500 hover:bg-red-600 hover:shadow-lg text-white font-semibold px-8 py-3 rounded-xl transition duration-300"
          >
            Complete Profile Now
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-2xl rounded-3xl p-8 border border-gray-100"
      >
        {/* Heading */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Stethoscope size={30} />
          </div>

          <h2 className="text-3xl font-bold text-gray-800">
            Book Appointment
          </h2>

          <p className="text-gray-500 mt-2">
            Schedule your consultation with a doctor
          </p>
        </div>

        {/* Doctor */}
        <div className="mb-5">
          <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <UserRound size={16} />
            Select Doctor
          </label>

          <select
            name="doctorId"
            value={formData.doctorId}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 transition"
          >
            <option value="">Choose Doctor</option>

            {doctors.map((doc) => {
              const doctorName =
                doc.userId?.name ||
                `${doc.userId?.firstName || ""} ${
                  doc.userId?.lastName || ""
                }`.trim() ||
                "N/A";

              return (
                <option key={doc._id} value={doc._id}>
                  {doctorName} — {doc.specialization || "General"}
                </option>
              );
            })}
          </select>
        </div>

        {/* Date */}
        <div className="mb-5">
          <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <CalendarDays size={16} />
            Appointment Date
          </label>

          <DatePicker
            selected={formData.appointmentDate}
            onChange={handleDateChange}
            dateFormat="yyyy-MM-dd"
            minDate={new Date()}
            placeholderText="Select date"
            required
            className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
        </div>

        {/* Time */}
        <div className="mb-5">
          <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <Clock3 size={16} />
            Appointment Time
          </label>

          <input
            type="time"
            name="appointmentTime"
            value={formData.appointmentTime}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
        </div>

        {/* Reason */}
        <div className="mb-6">
          <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <FileText size={16} />
            Reason for Visit
          </label>

          <textarea
            name="reason"
            value={formData.reason}
            onChange={handleChange}
            rows="4"
            placeholder="Describe your symptoms or reason..."
            required
            className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 transition resize-none"
          />
        </div>

        {/* Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 rounded-xl text-white font-semibold transition duration-300
          ${
            loading
              ? "bg-blue-300 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 hover:shadow-lg"
          }`}
        >
          {loading ? "Booking..." : "Book Appointment"}
        </button>
      </form>
    </div>
  );
}

export default MinimalBookAppointment;