import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import { useAuth } from "../store/authStore";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Edit3, 
  ChevronLeft,
  Briefcase,
  GraduationCap,
  Clock,
  CalendarCheck,
  Lock
} from "lucide-react";

import {
  pageBackground,
  pageWrapper,
  headingClass,
  formGroup,
  labelClass,
  inputClass,
  submitBtn
} from "../styles/common";

function AddDoctor() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const currentUser = useAuth((state) => state.currentUser);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [profileExists, setProfileExists] = useState(false);

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: ""
  });
  const [passwordLoading, setPasswordLoading] = useState(false);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmNewPassword) {
      alert("New passwords do not match!");
      return;
    }
    try {
      setPasswordLoading(true);
      await axios.put(
        "http://localhost:4000/common-api/change-password",
        {
          email: currentUser?.email,
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      alert("Password updated successfully!");
      setShowPasswordModal(false);
      setPasswordForm({ currentPassword: "", newPassword: "", confirmNewPassword: "" });
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to update password.");
    } finally {
      setPasswordLoading(false);
    }
  };

  const [formData, setFormData] = useState({
    dob: "",
    specialization: "",
    experience: "",
    qualification: "",
    availableDays: [],
    availableTime: "",
    profileImage: ""
  });

  const [uploading, setUploading] = useState(false);
  const [profileImagePreview, setProfileImagePreview] = useState("");

  const daysList = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  // Fetch doctor profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          "http://localhost:4000/doctor-api/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (res.data.payload && res.data.payload.specialization) {
          const profile = res.data.payload;
          setFormData({
            dob: profile.dob ? new Date(profile.dob).toISOString().split('T')[0] : "",
            specialization: profile.specialization || "",
            experience: profile.experience || "",
            qualification: profile.qualification || "",
            availableDays: profile.availableDays || [],
            availableTime: profile.availableTime || "",
            profileImage: profile.profileImage || ""
          });
          setProfileImagePreview(profile.profileImage || "");
          setProfileExists(true);
          setIsEditing(false);
        } else {
          setProfileExists(false);
          setIsEditing(true);
        }
      } catch (err) {
        console.error(err);
        setProfileExists(false);
        setIsEditing(true);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchProfile();
    }
  }, [token]);

  // Handle image upload
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!["image/jpeg", "image/png"].includes(file.type)) {
      alert("Only JPG and PNG files are allowed");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      alert("Image size should be less than 2MB");
      return;
    }

    if (!token) {
      alert("Login required");
      navigate("/login");
      return;
    }

    const data = new FormData();
    data.append("image", file);

    setUploading(true);
    try {
      const res = await axios.post(
        "http://localhost:4000/doctor-api/upload-image",
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const url = res.data.secure_url;
      setFormData((prev) => ({
        ...prev,
        profileImage: url,
      }));
      setProfileImagePreview(url);
      alert("Image uploaded successfully");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  // input change
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  // checkbox toggle
  const handleDayChange = (day) => {
    setFormData((prev) => ({
      ...prev,
      availableDays: prev.availableDays.includes(day)
        ? prev.availableDays.filter((d) => d !== day)
        : [...prev.availableDays, day]
    }));
  };

  // submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      alert("Login required");
      navigate("/login");
      return;
    }

    try {
      setSaving(true);
      await axios.post(
        "http://localhost:4000/doctor-api/profile",
        {
          ...formData,
          experience: Number(formData.experience)
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      alert("Profile saved successfully");
      setProfileExists(true);
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      const status = err.response?.status;
      if (status === 401) {
        alert("Session expired. Login again");
        navigate("/login");
      } else if (status === 403) {
        alert("Only doctors allowed");
      } else {
        alert("Something went wrong");
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="h-14 w-14 rounded-full border-4 border-blue-500 border-t-transparent animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">

        {/* Back navigation */}
        <div className="mb-6 flex justify-between items-center">
          <button
            onClick={() => navigate("/doctor-dashboard")}
            className="flex items-center gap-2 text-gray-600 hover:text-blue-600 font-medium transition"
          >
            <ChevronLeft size={20} />
            Back to Dashboard
          </button>

          {profileExists && !isEditing && (
            <div className="flex gap-3">
              <button
                onClick={() => setShowPasswordModal(true)}
                className="flex items-center gap-2 bg-white text-blue-600 border border-blue-200 px-4 py-2 rounded-xl font-semibold shadow-sm hover:bg-blue-50 hover:shadow transition"
              >
                <Lock size={18} />
                Change Password
              </button>

              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 bg-white text-blue-600 border border-blue-200 px-4 py-2 rounded-xl font-semibold shadow-sm hover:bg-blue-50 hover:shadow transition"
              >
                <Edit3 size={18} />
                Edit Profile
              </button>
            </div>
          )}
        </div>

        {/* PROFILE VIEW MODE */}
        {!isEditing ? (
          <div className="space-y-8 animate-fadeIn">
            
            {/* Header Banner card */}
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center gap-6">
                {formData.profileImage ? (
                  <div className="h-24 w-24 rounded-full overflow-hidden border-2 border-blue-500 shadow-md flex-shrink-0">
                    <img src={formData.profileImage} alt="Profile" className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="h-24 w-24 rounded-full bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center shadow-inner flex-shrink-0">
                    <User size={44} />
                  </div>
                )}
                <div>
                  <h1 className="text-3xl font-extrabold text-gray-900">
                    Dr. {currentUser?.name || "Doctor Profile"}
                  </h1>
                  <span className="inline-block mt-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                    {formData.specialization || "General Physician"}
                  </span>
                </div>
              </div>

              <div className="space-y-2 border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-8 text-gray-600">
                <div className="flex items-center gap-2">
                  <Mail size={16} className="text-gray-400" />
                  <span className="text-sm font-medium">{currentUser?.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone size={16} className="text-gray-400" />
                  <span className="text-sm font-medium">{currentUser?.phoneNumber || "N/A"}</span>
                </div>
              </div>
            </div>

            {/* Bento-style profile grids */}
            <div className="grid md:grid-cols-3 gap-6">
              
              {/* Qualification & Experience Card */}
              <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-6">
                <h3 className="text-lg font-bold text-gray-800 border-b border-gray-50 pb-3 flex items-center gap-2">
                  <GraduationCap size={18} className="text-blue-500" />
                  Professional details
                </h3>
                
                <div className="bg-gray-50 rounded-2xl p-4 flex items-center gap-3">
                  <div className="h-10 w-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-blue-600 border">
                    <GraduationCap size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-bold uppercase">Qualification</p>
                    <p className="text-base font-extrabold text-gray-800 mt-0.5">{formData.qualification || "N/A"}</p>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-2xl p-4 flex items-center gap-3">
                  <div className="h-10 w-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-blue-600 border">
                    <Briefcase size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-bold uppercase">Experience</p>
                    <p className="text-base font-extrabold text-gray-800 mt-0.5">{formData.experience} Years</p>
                  </div>
                </div>
              </div>

              {/* Schedule Card */}
              <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm md:col-span-2 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold text-gray-800 border-b border-gray-50 pb-3 flex items-center gap-2">
                    <CalendarCheck size={18} className="text-blue-500" />
                    Availability Schedule
                  </h3>
                  
                  <div className="mt-4 space-y-4">
                    <div>
                      <p className="text-xs text-gray-400 font-bold uppercase">Consultation Days</p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {formData.availableDays && formData.availableDays.length > 0 ? (
                          formData.availableDays.map((day) => (
                            <span key={day} className="bg-blue-50 text-blue-700 px-3 py-1 rounded-xl text-xs font-semibold border border-blue-100">
                              {day}
                            </span>
                          ))
                        ) : (
                          <span className="text-gray-400 italic text-sm">No days configured.</span>
                        )}
                      </div>
                    </div>

                    <div>
                      <p className="text-xs text-gray-400 font-bold uppercase">Consultation Timings</p>
                      <p className="text-base font-extrabold text-gray-800 mt-1 flex items-center gap-2">
                        <Clock size={16} className="text-blue-500" />
                        {formData.availableTime || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 bg-gray-50 rounded-2xl p-4 border border-gray-100 flex items-center gap-3">
                  <div className="h-10 w-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-blue-600 border">
                    <Calendar size={18} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-bold">Personal info</p>
                    <p className="text-xs text-gray-600 font-semibold mt-0.5">Date of Birth: {formData.dob ? new Date(formData.dob).toLocaleDateString() : "N/A"}</p>
                  </div>
                </div>
              </div>

            </div>

          </div>
        ) : (
          
          /* PROFILE EDIT/CREATE MODE */
          <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8 sm:p-10 animate-fadeIn">
            <div className="mb-8">
              <h1 className="text-3xl font-extrabold text-gray-800">
                {profileExists ? "Update Your Profile" : "Complete Your Profile"}
              </h1>
              <p className="text-gray-500 mt-2">
                Configure your specialization, availability schedule, and clinic options.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">

              <div className="grid sm:grid-cols-2 gap-6">
                {/* DOB */}
                <div className={formGroup}>
                  <label className={labelClass}>Date of Birth</label>
                  <input type="date" name="dob" value={formData.dob} onChange={handleChange} className={inputClass} required />
                </div>

                {/* Specialization */}
                <div className={formGroup}>
                  <label className={labelClass}>Specialization</label>
                  <input type="text" name="specialization" value={formData.specialization} onChange={handleChange} className={inputClass} required placeholder="e.g. Cardiologist, Dermatologist" />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                {/* Experience */}
                <div className={formGroup}>
                  <label className={labelClass}>Experience (Years)</label>
                  <input type="number" name="experience" value={formData.experience} onChange={handleChange} className={inputClass} required placeholder="e.g. 8" />
                </div>

                {/* Qualification */}
                <div className={formGroup}>
                  <label className={labelClass}>Qualification</label>
                  <input type="text" name="qualification" value={formData.qualification} onChange={handleChange} className={inputClass} required placeholder="e.g. MBBS, MD, FRCS" />
                </div>
              </div>

              {/* Available Days */}
              <div className={formGroup}>
                <label className={labelClass}>Available Days</label>
                <div className="flex flex-wrap gap-4 mt-2 bg-gray-50 rounded-2xl p-4 border border-gray-100">
                  {daysList.map((day) => (
                    <label key={day} className="flex items-center gap-2 text-sm font-semibold text-gray-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.availableDays.includes(day)}
                        onChange={() => handleDayChange(day)}
                        className="rounded text-blue-500 focus:ring-blue-400 h-4 w-4"
                      />
                      {day}
                    </label>
                  ))}
                </div>
              </div>

              {/* Available Time */}
              <div className={formGroup}>
                <label className={labelClass}>Available Time</label>
                <input type="text" name="availableTime" value={formData.availableTime} onChange={handleChange} className={inputClass} required placeholder="e.g. 09:00 AM - 05:00 PM" />
              </div>

              {/* Profile Image */}
              <div className={formGroup}>
                <label className={labelClass}>Profile Image</label>
                <div className="flex items-center gap-4 border border-dashed border-gray-300 rounded-xl p-4 bg-gray-50 hover:bg-gray-100 transition relative">
                  {profileImagePreview ? (
                    <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-blue-500 shadow flex-shrink-0">
                      <img src={profileImagePreview} alt="Profile Preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => {
                          setFormData((prev) => ({ ...prev, profileImage: "" }));
                          setProfileImagePreview("");
                        }}
                        className="absolute inset-0 bg-black bg-opacity-60 text-white flex items-center justify-center text-[10px] font-bold hover:opacity-100 opacity-0 transition-opacity"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-gray-200 border-2 border-gray-300 flex items-center justify-center text-gray-400 flex-shrink-0 font-bold">
                      IMG
                    </div>
                  )}
                  <div className="flex-1">
                    <input
                      type="file"
                      accept="image/jpeg,image/png"
                      onChange={handleImageUpload}
                      disabled={uploading}
                      className="hidden"
                      id="profile-image-upload"
                    />
                    <label
                      htmlFor="profile-image-upload"
                      className={`inline-block px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 font-semibold rounded-lg text-sm cursor-pointer transition ${uploading ? 'opacity-50 pointer-events-none' : ''}`}
                    >
                      {uploading ? "Uploading..." : "Choose Image"}
                    </label>
                    <p className="text-xs text-gray-500 mt-1">JPG or PNG (max 2MB)</p>
                  </div>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-4 pt-4">
                {profileExists && (
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 rounded-xl transition duration-300"
                  >
                    Cancel
                  </button>
                )}
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 hover:shadow-lg text-white font-semibold py-3 rounded-xl transition duration-300"
                >
                  {saving ? "Saving Profile..." : "Save Profile Details"}
                </button>
              </div>

            </form>
          </div>
        )}

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-gray-100 relative">
            <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-2">
              <Lock className="text-blue-600 animate-pulse" size={24} />
              Change Password
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              Protect your account by setting a strong, secure password.
            </p>

            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Current Password
                </label>
                <input
                  type="password"
                  required
                  placeholder="Enter current password"
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  New Password
                </label>
                <input
                  type="password"
                  required
                  placeholder="Enter new password"
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  required
                  placeholder="Confirm new password"
                  value={passwordForm.confirmNewPassword}
                  onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmNewPassword: e.target.value }))}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowPasswordModal(false);
                    setPasswordForm({ currentPassword: "", newPassword: "", confirmNewPassword: "" });
                  }}
                  className="w-1/2 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-xl font-bold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={passwordLoading}
                  className="w-1/2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-3 rounded-xl font-bold transition shadow-md shadow-blue-200 flex items-center justify-center gap-2"
                >
                  {passwordLoading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : "Update"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      </div>
    </div>
  );
}

export default AddDoctor;