import React from "react";
import { Plus, Ban, Check } from "lucide-react";
import {
  headingFont,
  adminRedBtn,
  adminGreenBtn,
} from "../../styles/Common.js";

// component to list doctors and allow admins to toggle their active status
function AdminDoctorsList({
  doctors,
  searchQuery,
  loading,
  toggleUserStatus,
  setShowAddModal,
  searchBarComponent,
}) {
  // filter the list of doctors based on the search query
  const filteredDoctors = doctors.filter(
    (d) =>
      d.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-[#e8e8ed] overflow-hidden">
      <div className="px-6 py-5 border-b border-[#e8e8ed] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className={`text-[18px] font-bold ${headingFont}`}>
            Manage Doctors
          </h2>
          <span className="bg-[#fafafa] border border-[#e8e8ed] text-[#86868b] px-3 py-1 rounded-full text-[11px] font-bold">
            {doctors.length} Total
          </span>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 bg-[#0071e3] hover:bg-[#0077ed] text-white px-4 py-2 rounded-xl text-[12px] font-semibold transition shadow-sm hover:shadow"
        >
          <Plus size={14} />
          Add Doctor
        </button>
      </div>
      <div className="p-6 pb-0">{searchBarComponent}</div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-[#fafafa] border-b border-[#e8e8ed]">
            <tr>
              <th className="px-6 py-3.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                Doctor
              </th>
              <th className="px-6 py-3.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                Specialization
              </th>
              <th className="px-6 py-3.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider text-center">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e8e8ed]">
            {filteredDoctors.map((d) => (
              <tr key={d._id} className="hover:bg-[#fafafa]/60 transition">
                <td className="px-6 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-100 text-[#1d1d1f] flex items-center justify-center font-bold text-[12px] uppercase">
                      {d.name?.charAt(0)}
                    </div>
                    <div>
                      <div className="font-semibold text-[#1d1d1f] text-[13px]">
                        {d.name}
                      </div>
                      <div className="text-[11px] text-[#86868b] font-normal">
                        {d.email}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-3.5 text-gray-650 text-[13px] font-medium">
                  {d.specialization || "General Physician"}
                </td>
                <td className="px-6 py-3.5">
                  <div className="flex flex-col gap-1.5">
                    <span
                      className={`inline-flex items-center w-fit px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${
                        d.isActive
                          ? "bg-green-50 text-green-700 border-green-100"
                          : "bg-red-50 text-red-700 border-red-100"
                      }`}
                    >
                      {d.isActive ? "Active" : "Suspended"}
                    </span>
                    <span
                      className={`inline-flex items-center w-fit px-2 py-0.5 rounded-full text-[9px] font-bold border ${
                        d.isVerified
                          ? "bg-blue-50 text-blue-700 border-blue-100"
                          : "bg-yellow-50 text-yellow-750 border-yellow-100"
                      }`}
                    >
                      {d.isVerified ? "Verified" : "Unverified"}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-3.5 text-center">
                  <button
                    disabled={loading}
                    onClick={() => toggleUserStatus(d._id, "DOCTOR")}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition text-[12px] font-semibold ${
                      d.isActive ? adminRedBtn : adminGreenBtn
                    }`}
                  >
                    {d.isActive ? <Ban size={13} /> : <Check size={13} />}
                    {d.isActive ? "Suspend Doctor" : "Activate Doctor"}
                  </button>
                </td>
              </tr>
            ))}
            {filteredDoctors.length === 0 && (
              <tr>
                <td colSpan="4" className="px-6 py-8 text-center text-gray-400">
                  No doctors found matching query.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminDoctorsList;
