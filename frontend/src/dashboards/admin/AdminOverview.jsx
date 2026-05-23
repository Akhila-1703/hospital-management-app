import React from "react";
import {
  Users,
  Stethoscope,
  ShieldCheck,
  Calendar,
  ClipboardList,
  Ban,
  Check,
} from "lucide-react";

import {
  headingFont,
  metricCard,
  metricCardPending,
  adminRedBtn,
  adminGreenBtn,
} from "../../styles/Common.js";

// component to render the admin overview statistics and cards
function AdminOverview({
  stats,
  recentUsers,
  setActiveTab,
  toggleUserStatus,
  loading,
}) {
  return (
    <>
      <h2
        className={`text-[24px] font-bold tracking-tight mb-6 ${headingFont}`}
      >
        Dashboard Summary
      </h2>

      {/* top stats grid showing summary numbers */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        {/* TOTAL PATIENTS */}
        <div
          className={`${metricCard} cursor-pointer hover:shadow-md transition-shadow`}
          onClick={() => setActiveTab("patients")}
        >
          <div className="flex justify-between items-start mb-4">
            <p className="text-[11px] font-bold tracking-wider text-gray-400 uppercase">
              Total Patients
            </p>
            <div className="bg-[#fafafa] p-1.5 rounded-lg border border-[#e8e8ed]">
              <Users className="text-[#0071e3]" size={14} />
            </div>
          </div>
          <h2 className={`text-[26px] font-bold leading-none ${headingFont}`}>
            {stats.totalPatients}
          </h2>
        </div>

        {/* TOTAL DOCTORS */}
        <div
          className={`${metricCard} cursor-pointer hover:shadow-md transition-shadow`}
          onClick={() => setActiveTab("doctors")}
        >
          <div className="flex justify-between items-start mb-4">
            <p className="text-[11px] font-bold tracking-wider text-gray-400 uppercase">
              Total Doctors
            </p>
            <div className="bg-[#fafafa] p-1.5 rounded-lg border border-[#e8e8ed]">
              <Stethoscope className="text-[#0071e3]" size={14} />
            </div>
          </div>
          <h2 className={`text-[26px] font-bold leading-none ${headingFont}`}>
            {stats.totalDoctors}
          </h2>
        </div>

        {/* PENDING VERIFICATIONS */}
        <div className={metricCardPending}>
          <div className="flex justify-between items-start mb-4">
            <p className="text-[11px] font-bold tracking-wider text-gray-400 uppercase">
              Pending Verifications
            </p>
            <div className="bg-[#fff9f0] p-1.5 rounded-lg border border-[#ff9500]/10">
              <ShieldCheck className="text-[#ff9500]" size={14} />
            </div>
          </div>
          <h2 className={`text-[26px] font-bold leading-none ${headingFont}`}>
            {stats.pendingVerifications}
          </h2>
        </div>

        {/* APPOINTMENTS */}
        <div
          className={`${metricCard} cursor-pointer hover:shadow-md transition-shadow`}
          onClick={() => setActiveTab("appointments")}
        >
          <div className="flex justify-between items-start mb-4">
            <p className="text-[11px] font-bold tracking-wider text-gray-400 uppercase">
              Appointments
            </p>
            <div className="bg-[#fafafa] p-1.5 rounded-lg border border-[#e8e8ed]">
              <Calendar className="text-[#0071e3]" size={14} />
            </div>
          </div>
          <h2 className={`text-[26px] font-bold leading-none ${headingFont}`}>
            {stats.totalAppointments}
          </h2>
        </div>

        {/* PRESCRIPTIONS */}
        <div
          className={`${metricCard} cursor-pointer hover:shadow-md transition-shadow`}
          onClick={() => setActiveTab("prescriptions")}
        >
          <div className="flex justify-between items-start mb-4">
            <p className="text-[11px] font-bold tracking-wider text-gray-400 uppercase">
              Prescriptions
            </p>
            <div className="bg-[#fafafa] p-1.5 rounded-lg border border-[#e8e8ed]">
              <ClipboardList className="text-[#0071e3]" size={14} />
            </div>
          </div>
          <h2 className={`text-[26px] font-bold leading-none ${headingFont}`}>
            {stats.totalPrescriptions}
          </h2>
        </div>
      </div>

      {/* RECENTLY JOINED USERS */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#e8e8ed] overflow-hidden">
        <div className="px-6 py-4 border-b border-[#e8e8ed]">
          <h3 className={`text-[16px] font-bold ${headingFont}`}>
            Recently Joined Users
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-[#fafafa] border-b border-[#e8e8ed]">
              <tr>
                <th className="px-6 py-3.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                  Role
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
              {recentUsers.map((u) => (
                <tr key={u._id} className="hover:bg-[#fafafa]/60 transition">
                  <td className="px-6 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-100 text-[#1d1d1f] flex items-center justify-center font-bold text-[12px] uppercase">
                        {u.name?.charAt(0)}
                      </div>
                      <div>
                        <div className="font-semibold text-[#1d1d1f] text-[13px]">
                          {u.name}
                        </div>
                        <div className="text-[11px] text-[#86868b] font-normal">
                          {u.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-3.5">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                        u.role === "DOCTOR"
                          ? "bg-blue-50 text-blue-600 border border-blue-100"
                          : "bg-green-50 text-green-600 border border-green-100"
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="px-6 py-3.5">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                        u.isActive
                          ? "bg-green-50 text-green-700 border border-green-100"
                          : "bg-red-50 text-red-700 border border-red-100"
                      }`}
                    >
                      {u.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-6 py-3.5 text-center">
                    <button
                      disabled={loading}
                      onClick={() => toggleUserStatus(u._id, u.role)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition text-[12px] font-semibold ${
                        u.isActive ? adminRedBtn : adminGreenBtn
                      }`}
                    >
                      {u.isActive ? <Ban size={13} /> : <Check size={13} />}
                      {u.isActive ? "Set Inactive" : "Set Active"}
                    </button>
                  </td>
                </tr>
              ))}
              {recentUsers.length === 0 && (
                <tr>
                  <td
                    colSpan="4"
                    className="px-6 py-8 text-center text-gray-400"
                  >
                    No recent users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default AdminOverview;
