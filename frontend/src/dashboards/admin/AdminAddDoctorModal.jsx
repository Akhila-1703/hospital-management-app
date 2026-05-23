import React from "react";
import { Stethoscope, Key, X } from "lucide-react";
import { DAYS_LIST } from "../../utils/constants";

// modal component used by admins to add a new doctor
function AdminAddDoctorModal({
  newDoctor,
  setNewDoctor,
  handleCreateDoctor,
  loading,
  generateRandomPassword,
  setShowAddModal,
}) {
  return (
    // overlay background with blur effect
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto animate-fadeIn">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl border border-gray-100 relative my-8">
        // close button
        <button
          onClick={() => setShowAddModal(false)}
          className="absolute right-5 top-5 p-1 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition"
        >
          <X size={20} />
        </button>

        <h3 className="text-2xl font-extrabold text-gray-900 flex items-center gap-2 mb-2">
          <Stethoscope className="text-[#0071e3]" size={24} />
          Register New Doctor
        </h3>
        <p className="text-sm text-gray-500 mb-6">
          Create a fully verified doctor profile. The login credentials will be
          dispatched immediately to the doctor's email.
        </p>

        <form onSubmit={handleCreateDoctor} className="space-y-6">
          {/* SECTION 1: ACCOUNT CREDENTIALS */}
          <div>
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-2 mb-4">
              Account Credentials & Settings
            </h4>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Akhila Priya"
                  value={newDoctor.name}
                  onChange={(e) =>
                    setNewDoctor((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className="w-full border border-gray-200 bg-gray-50 rounded-xl px-4 py-2.5 text-[13px] outline-none focus:bg-white focus:ring-2 focus:ring-[#0071e3] transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="doctor@peoplecare.com"
                  value={newDoctor.email}
                  onChange={(e) =>
                    setNewDoctor((prev) => ({ ...prev, email: e.target.value }))
                  }
                  className="w-full border border-gray-200 bg-gray-50 rounded-xl px-4 py-2.5 text-[13px] outline-none focus:bg-white focus:ring-2 focus:ring-[#0071e3] transition"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="Choose or generate a password"
                    value={newDoctor.password}
                    onChange={(e) =>
                      setNewDoctor((prev) => ({
                        ...prev,
                        password: e.target.value,
                      }))
                    }
                    className="w-full border border-gray-200 bg-gray-50 rounded-xl pl-4 pr-24 py-2.5 text-[13px] font-mono outline-none focus:bg-white focus:ring-2 focus:ring-[#0071e3] transition"
                  />
                  <button
                    type="button"
                    onClick={generateRandomPassword}
                    className="absolute right-2 top-1.5 bg-gray-200 hover:bg-gray-300 text-gray-700 px-2.5 py-1 rounded-lg text-[10px] font-bold transition flex items-center gap-1"
                  >
                    <Key size={10} />
                    Auto-Gen
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. +91 9876543210"
                  value={newDoctor.phoneNumber}
                  onChange={(e) =>
                    setNewDoctor((prev) => ({
                      ...prev,
                      phoneNumber: e.target.value,
                    }))
                  }
                  className="w-full border border-gray-200 bg-gray-50 rounded-xl px-4 py-2.5 text-[13px] outline-none focus:bg-white focus:ring-2 focus:ring-[#0071e3] transition"
                />
              </div>
            </div>
          </div>

          {/* SECTION 2: PROFESSIONAL INFORMATION */}
          <div>
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-2 mb-4">
              Professional Information
            </h4>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Specialization
                </label>
                <select
                  required
                  value={newDoctor.specialization}
                  onChange={(e) =>
                    setNewDoctor((prev) => ({
                      ...prev,
                      specialization: e.target.value,
                    }))
                  }
                  className="w-full border border-gray-200 bg-gray-50 rounded-xl px-4 py-2.5 text-[13px] outline-none focus:bg-white focus:ring-2 focus:ring-[#0071e3] transition text-gray-700 font-medium"
                >
                  <option value="" disabled>
                    Select Specialization
                  </option>
                  <option value="Cardiology">Cardiology</option>
                  <option value="Orthopedics">Orthopedics</option>
                  <option value="Neurology">Neurology</option>
                  <option value="Pediatrics">Pediatrics</option>
                  <option value="Gynecology & Obstetrics">
                    Gynecology & Obstetrics
                  </option>
                  <option value="Ophthalmology">Ophthalmology</option>
                  <option value="Dentistry">Dentistry</option>
                  <option value="Pulmonology">Pulmonology</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Qualification
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. MBBS, MD (Cardiology)"
                  value={newDoctor.qualification}
                  onChange={(e) =>
                    setNewDoctor((prev) => ({
                      ...prev,
                      qualification: e.target.value,
                    }))
                  }
                  className="w-full border border-gray-200 bg-gray-50 rounded-xl px-4 py-2.5 text-[13px] outline-none focus:bg-white focus:ring-2 focus:ring-[#0071e3] transition"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Experience (Years)
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  placeholder="e.g. 8"
                  value={newDoctor.experience}
                  onChange={(e) =>
                    setNewDoctor((prev) => ({
                      ...prev,
                      experience: e.target.value,
                    }))
                  }
                  className="w-full border border-gray-200 bg-gray-50 rounded-xl px-4 py-2.5 text-[13px] outline-none focus:bg-white focus:ring-2 focus:ring-[#0071e3] transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Date of Birth
                </label>
                <input
                  type="date"
                  required
                  value={newDoctor.dob}
                  onChange={(e) =>
                    setNewDoctor((prev) => ({ ...prev, dob: e.target.value }))
                  }
                  className="w-full border border-gray-200 bg-gray-50 rounded-xl px-4 py-2.5 text-[13px] outline-none focus:bg-white focus:ring-2 focus:ring-[#0071e3] transition"
                />
              </div>
            </div>
          </div>

          {/* SECTION 3: CONSULTATION AVAILABILITY */}
          <div>
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-2 mb-4">
              Consultation Schedule
            </h4>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Available Days
                </label>
                <div className="flex flex-wrap gap-3 mt-1.5 p-3.5 bg-gray-50 rounded-2xl border border-gray-200">
                  {DAYS_LIST.map((day) => (
                    <label
                      key={day}
                      className="flex items-center gap-1.5 text-xs font-semibold text-gray-700 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={newDoctor.availableDays.includes(day)}
                        onChange={() => {
                          setNewDoctor((prev) => ({
                            ...prev,
                            availableDays: prev.availableDays.includes(day)
                              ? prev.availableDays.filter((d) => d !== day)
                              : [...prev.availableDays, day],
                          }));
                        }}
                        className="rounded text-[#0071e3] focus:ring-[#0071e3] h-4 w-4"
                      />
                      {day}
                    </label>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Consultation Hours
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 09:00 AM - 05:00 PM"
                  value={newDoctor.availableTime}
                  onChange={(e) =>
                    setNewDoctor((prev) => ({
                      ...prev,
                      availableTime: e.target.value,
                    }))
                  }
                  className="w-full border border-gray-200 bg-gray-50 rounded-xl px-4 py-2.5 text-[13px] outline-none focus:bg-white focus:ring-2 focus:ring-[#0071e3] transition"
                />
              </div>
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex gap-3 pt-4 border-t border-gray-150">
            <button
              type="button"
              disabled={loading}
              onClick={() => setShowAddModal(false)}
              className="w-1/2 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 text-gray-750 font-bold py-3 rounded-xl transition text-[13px]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="w-1/2 bg-[#0071e3] hover:bg-[#0077ed] disabled:opacity-50 text-white font-bold py-3 rounded-xl transition text-[13px] shadow-md shadow-blue-100 flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                "Create Doctor"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AdminAddDoctorModal;
