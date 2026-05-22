import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import { useAuth } from "../store/authStore";
import { 
  User, 
  Mail, 
  Phone, 
  Heart, 
  MapPin, 
  FileText, 
  Calendar, 
  Edit3, 
  ChevronLeft,
  Lock
} from "lucide-react";

function PatientProfile() {
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
        "/common-api/change-password",
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
    age: "",
    gender: "MALE",
    address: "",
    bloodGroup: "",
    medicalHistory: "",
    testReports: []
  });

  const [uploadingReport, setUploadingReport] = useState(false);

  // Fetch patient profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          "/patient-api/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );

        if (res.data.payload && res.data.payload.isProfileCompleted) {
          const profile = res.data.payload;
          setFormData({
            age: profile.age || "",
            gender: profile.gender || "MALE",
            address: profile.address || "",
            bloodGroup: profile.bloodGroup || "",
            medicalHistory: profile.medicalHistory || "",
            testReports: profile.testReports || [],
          });
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

  const handleReportUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "image/jpeg",
      "image/png"
    ];
    if (!allowedTypes.includes(file.type)) {
      alert("Only PDF, Word (.doc/.docx), and JPG/PNG image files are allowed.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("File size should be less than 5MB");
      return;
    }

    const data = new FormData();
    data.append("report", file);

    setUploadingReport(true);
    try {
      const res = await axios.post(
        "/patient-api/upload-report",
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
        testReports: [
          ...prev.testReports,
          { name: file.name, url }
        ]
      }));
      alert("Report uploaded successfully!");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to upload report");
    } finally {
      setUploadingReport(false);
    }
  };

  const handleRemoveReport = (indexToRemove) => {
    setFormData((prev) => ({
      ...prev,
      testReports: prev.testReports.filter((_, idx) => idx !== indexToRemove)
    }));
  };

  const handleQuickReportUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "image/jpeg",
      "image/png"
    ];
    if (!allowedTypes.includes(file.type)) {
      alert("Only PDF, Word (.doc/.docx), and JPG/PNG image files are allowed.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("File size should be less than 5MB");
      return;
    }

    const data = new FormData();
    data.append("report", file);

    setUploadingReport(true);
    try {
      const res = await axios.post(
        "/patient-api/upload-report",
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const url = res.data.secure_url;
      const updatedReports = [...formData.testReports, { name: file.name, url }];

      const profileData = {
        ...formData,
        testReports: updatedReports
      };

      await axios.post(
        "/patient-api/profile",
        profileData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      setFormData((prev) => ({
        ...prev,
        testReports: updatedReports
      }));

      alert("Report uploaded and saved successfully!");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to upload and save report");
    } finally {
      setUploadingReport(false);
    }
  };

  const handleQuickRemoveReport = async (indexToRemove) => {
    if (!window.confirm("Are you sure you want to delete this report?")) return;

    const updatedReports = formData.testReports.filter((_, idx) => idx !== indexToRemove);

    try {
      const profileData = {
        ...formData,
        testReports: updatedReports
      };

      await axios.post(
        "/patient-api/profile",
        profileData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      setFormData((prev) => ({
        ...prev,
        testReports: updatedReports
      }));

      alert("Report removed successfully!");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to remove report");
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      await axios.post(
        "/patient-api/profile",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      alert("Profile saved successfully!");
      setProfileExists(true);
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Error saving profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="h-14 w-14 rounded-full border-4 border-green-500 border-t-transparent animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Back navigation */}
        <div className="mb-6 flex justify-between items-center">
          <button
            onClick={() => navigate("/patient-dashboard")}
            className="flex items-center gap-2 text-gray-600 hover:text-green-600 font-medium transition"
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
                className="flex items-center gap-2 bg-white text-green-600 border border-green-200 px-4 py-2 rounded-xl font-semibold shadow-sm hover:bg-green-50 hover:shadow transition"
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
                <div className="h-20 w-20 rounded-full bg-green-50 text-green-600 border border-green-100 flex items-center justify-center shadow-inner">
                  <User size={40} />
                </div>
                <div>
                  <h1 className="text-3xl font-extrabold text-gray-900">
                    {currentUser?.name || "Patient Profile"}
                  </h1>
                  <span className="inline-block mt-2 bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                    Patient Role
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
              
              {/* Stats Card */}
              <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-5">
                <h3 className="text-lg font-bold text-gray-800 border-b border-gray-50 pb-3 flex items-center gap-2">
                  <Calendar size={18} className="text-green-500" />
                  Vital Metrics
                </h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-2xl p-4 text-center">
                    <p className="text-xs text-gray-500 font-bold uppercase">Age</p>
                    <p className="text-2xl font-black text-gray-800 mt-1">{formData.age} yrs</p>
                  </div>

                  <div className="bg-gray-50 rounded-2xl p-4 text-center">
                    <p className="text-xs text-gray-500 font-bold uppercase">Gender</p>
                    <p className="text-lg font-extrabold text-gray-800 mt-1 capitalize">{formData.gender.toLowerCase()}</p>
                  </div>
                </div>

                <div className="bg-red-50 rounded-2xl p-4 text-center border border-red-100">
                  <p className="text-xs text-red-500 font-bold uppercase flex justify-center items-center gap-1">
                    <Heart size={14} className="fill-red-500 text-red-500" />
                    Blood Group
                  </p>
                  <p className={`font-black text-red-700 mt-1 ${
                    formData.bloodGroup && formData.bloodGroup.length > 3 ? 'text-lg' : 'text-3xl'
                  }`}>{formData.bloodGroup}</p>
                </div>
              </div>

              {/* Address Card */}
              <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm md:col-span-2 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold text-gray-800 border-b border-gray-50 pb-3 flex items-center gap-2">
                    <MapPin size={18} className="text-green-500" />
                    Contact Address
                  </h3>
                  
                  <p className="text-gray-600 mt-4 leading-relaxed text-base">
                    {formData.address || "No contact address listed."}
                  </p>
                </div>

                <div className="mt-6 bg-gray-50 rounded-2xl p-4 border border-gray-100 flex items-center gap-3">
                  <div className="h-10 w-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-green-600 border">
                    <MapPin size={18} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-bold">Residential verification</p>
                    <p className="text-xs text-gray-600 font-semibold mt-0.5">Permanent residential details</p>
                  </div>
                </div>
              </div>
              {/* Medical History */}
              <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm md:col-span-3">
                <h3 className="text-lg font-bold text-gray-800 border-b border-gray-50 pb-3 flex items-center gap-2">
                  <FileText size={18} className="text-green-500" />
                  Medical History & Notes
                </h3>
                
                <div className="mt-4 bg-gray-50 rounded-2xl p-5 border border-gray-100">
                  {formData.medicalHistory ? (
                    <p className="text-gray-700 leading-relaxed whitespace-pre-line text-sm md:text-base">
                      {formData.medicalHistory}
                    </p>
                  ) : (
                    <p className="text-gray-400 italic">No medical history or pre-existing conditions recorded.</p>
                  )}
                </div>
              </div>

              {/* Test Reports Card (Optional) */}
              <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm md:col-span-3 animate-fadeIn">
                <div className="flex justify-between items-center border-b border-gray-50 pb-3 mb-4">
                  <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                    <FileText size={18} className="text-green-500" />
                    Previous Test Reports (Optional)
                  </h3>
                  
                  {/* Quick upload trigger */}
                  <div>
                    <input
                      type="file"
                      id="view-mode-quick-upload"
                      accept=".pdf,.doc,.docx,image/jpeg,image/png"
                      onChange={handleQuickReportUpload}
                      disabled={uploadingReport}
                      className="hidden"
                    />                    <label
                      htmlFor="view-mode-quick-upload"
                      className={`inline-flex items-center gap-1.5 bg-green-50 hover:bg-green-100 text-green-700 font-bold px-3 py-1.5 rounded-xl text-xs cursor-pointer transition shadow-sm border border-green-100 ${uploadingReport ? 'opacity-50 pointer-events-none' : ''}`}
                    >
                      {uploadingReport ? "Uploading..." : "+ Add Report"}
                    </label>
                  </div>
                </div>
                
                <div>
                  {formData.testReports && formData.testReports.length > 0 ? (
                    <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {formData.testReports.map((report, idx) => (
                        <div key={idx} className="relative group">
                          <a
                            href={report.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 bg-gray-50 hover:bg-green-50 hover:border-green-200 border rounded-2xl p-4 transition shadow-sm group pr-10"
                          >
                            <div className="h-10 w-10 bg-white rounded-xl shadow-sm border flex items-center justify-center text-green-600 group-hover:text-green-700">
                              <FileText size={20} />
                            </div>
                            <div className="overflow-hidden flex-1">
                              <p className="text-sm font-bold text-gray-700 truncate group-hover:text-green-700">
                                {report.name}
                              </p>
                              <p className="text-xs text-gray-400 font-semibold mt-0.5">Click to view</p>
                            </div>
                          </a>
                          
                          <button
                            type="button"
                            onClick={() => handleQuickRemoveReport(idx)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 px-2 py-1 rounded-lg hover:bg-red-50 text-xl font-bold transition leading-none"
                            title="Remove report"
                          >
                            &times;
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-gray-50 rounded-2xl p-6 border border-dashed border-gray-200 text-center">
                      <p className="text-gray-400 italic text-sm">No test reports uploaded yet. Upload one quickly above!</p>
                    </div>
                  )}
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
                Provide your essential details to ensure your medical profiles and bookings are accurate.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              
              <div className="grid sm:grid-cols-2 gap-6">
                {/* Age */}
                <div>
                  <label className="block mb-2 font-semibold text-gray-700 text-sm">
                    Age
                  </label>
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    placeholder="e.g. 24"
                    required
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-400 transition"
                  />
                </div>

                {/* Gender */}
                <div>
                  <label className="block mb-2 font-semibold text-gray-700 text-sm">
                    Gender
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-400 bg-white transition"
                  >
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                {/* Blood Group */}
                <div>
                  <label className="block mb-2 font-semibold text-gray-700 text-sm">
                    Blood Group
                  </label>
                  <select
                    name="bloodGroup"
                    value={formData.bloodGroup}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-400 bg-white transition"
                  >
                    <option value="">Select Blood Group</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                    <option value="Not Known">Not Known</option>
                  </select>
                </div>

                {/* Address */}
                <div>
                  <label className="block mb-2 font-semibold text-gray-700 text-sm">
                    Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Enter permanent address"
                    required
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-400 transition"
                  />
                </div>
              </div>

              {/* Medical History */}
              <div>
                <label className="block mb-2 font-semibold text-gray-700 text-sm">
                  Medical History / Pre-existing Conditions
                </label>
                <textarea
                  name="medicalHistory"
                  value={formData.medicalHistory}
                  onChange={handleChange}
                  rows="4"
                  placeholder="e.g. Allergies, previous surgeries, chronic diseases, current long-term medications..."
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-400 resize-none transition"
                />
              </div>

              {/* Optional Test Reports Uploader */}
              <div className="border-t border-gray-100 pt-6">
                <label className="block mb-2 font-semibold text-gray-700 text-sm">
                  Upload Previous Test Reports (Optional)
                </label>
                
                {/* List of currently added test reports with delete button */}
                {formData.testReports && formData.testReports.length > 0 && (
                  <div className="grid sm:grid-cols-2 gap-3 mb-4">
                    {formData.testReports.map((report, idx) => (
                      <div key={idx} className="flex items-center justify-between bg-gray-50 border rounded-2xl p-4 shadow-sm animate-fadeIn">
                        <div className="flex items-center gap-3 overflow-hidden flex-1 mr-2">
                          <div className="h-9 w-9 bg-white rounded-xl shadow-sm border flex items-center justify-center text-green-600 flex-shrink-0">
                            <FileText size={18} />
                          </div>
                          <span className="text-sm font-bold text-gray-700 truncate">{report.name}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveReport(idx)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 px-2.5 py-1.5 rounded-lg text-lg font-bold transition leading-none"
                          title="Remove report"
                        >
                          &times;
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Upload Trigger Area */}
                <div className="flex items-center gap-4 border border-dashed border-gray-300 rounded-2xl p-4 bg-gray-50 hover:bg-gray-100 transition relative">
                  <div className="h-12 w-12 rounded-xl bg-green-50 text-green-600 border border-green-100 flex items-center justify-center shadow-inner flex-shrink-0">
                    <FileText size={24} />
                  </div>
                  <div className="flex-1">
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx,image/jpeg,image/png"
                      onChange={handleReportUpload}
                      disabled={uploadingReport}
                      className="hidden"
                      id="report-file-upload"
                    />
                    <label
                      htmlFor="report-file-upload"
                      className={`inline-block px-4 py-2 bg-green-50 hover:bg-green-100 text-green-600 font-semibold rounded-xl text-sm cursor-pointer transition ${uploadingReport ? 'opacity-50 pointer-events-none' : ''}`}
                    >
                      {uploadingReport ? "Uploading..." : "Upload New Report"}
                    </label>
                    <p className="text-xs text-gray-400 mt-1">PDF, Word, JPG or PNG (max 5MB) - Optional</p>
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
                  className="flex-1 bg-green-500 hover:bg-green-600 hover:shadow-lg text-white font-semibold py-3 rounded-xl transition duration-300"
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

export default PatientProfile;