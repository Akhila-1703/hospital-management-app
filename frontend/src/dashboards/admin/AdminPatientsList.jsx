import React from "react";
import { Ban, Check } from "lucide-react";
import {
  headingFont,
  adminRedBtn,
  adminGreenBtn,
} from "../../styles/Common.js";

// component to list patients in the admin dashboard
function AdminPatientsList({
  patients,
  searchQuery,
  loading,
  toggleUserStatus,
  searchBarComponent,
}) {
  // filter the list of patients based on the search query
  const filteredPatients = patients.filter(
    (p) =>
      p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-[#e8e8ed] overflow-hidden">
      <div className="px-6 py-5 border-b border-[#e8e8ed] flex items-center justify-between">
        <h2 className={`text-[18px] font-bold ${headingFont}`}>
          Manage patients
        </h2>
        <span className="bg-[#fafafa] border border-[#e8e8ed] text-gray-600 px-3 py-1 rounded-full text-[11px] font-bold">
          {patients.length} Total
        </span>
      </div>
      <div className="p-6 pb-0">{searchBarComponent}</div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-[#fafafa] border-b border-[#e8e8ed]">
            <tr>
              <th className="px-6 py-3.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                Patient
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
            {filteredPatients.map((p) => (
              <tr key={p._id} className="hover:bg-[#fafafa]/60 transition">
                <td className="px-6 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-100 text-[#1d1d1f] flex items-center justify-center font-bold text-[12px] uppercase">
                      {p.name?.charAt(0)}
                    </div>
                    <div>
                      <div className="font-semibold text-[#1d1d1f] text-[13px]">
                        {p.name}
                      </div>
                      <div className="text-[11px] text-[#86868b] font-normal">
                        {p.email}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-3.5">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                      p.isActive
                        ? "bg-green-50 text-green-700 border border-green-100"
                        : "bg-red-50 text-red-700 border border-red-100"
                    }`}
                  >
                    {p.isActive ? "Active" : "Blocked"}
                  </span>
                </td>
                <td className="px-6 py-3.5 text-center">
                  <button
                    disabled={loading}
                    onClick={() => toggleUserStatus(p._id, "PATIENT")}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition text-[12px] font-semibold ${
                      p.isActive ? adminRedBtn : adminGreenBtn
                    }`}
                  >
                    {p.isActive ? <Ban size={13} /> : <Check size={13} />}
                    {p.isActive ? "Suspend Patient" : "Unsuspend"}
                  </button>
                </td>
              </tr>
            ))}
            {filteredPatients.length === 0 && (
              <tr>
                <td colSpan="3" className="px-6 py-8 text-center text-gray-400">
                  No patients found matching query.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminPatientsList;
