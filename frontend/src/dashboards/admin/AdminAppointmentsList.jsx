import React from "react";
import { headingFont } from "../../styles/Common.js";

// component to display a table of appointments for the admin
function AdminAppointmentsList({
  appointments,
  searchQuery,
  searchBarComponent,
}) {
  // filter appointments based on patient or doctor name
  const filteredAppts = appointments.filter(
    (appt) =>
      appt.patientId?.userId?.name
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      appt.doctorId?.userId?.name
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-[#e8e8ed] overflow-hidden">
      <div className="px-6 py-5 border-b border-[#e8e8ed]">
        <h2 className={`text-[18px] font-bold ${headingFont}`}>
          All Appointments
        </h2>
      </div>
      <div className="p-6 pb-0">{searchBarComponent}</div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-[#fafafa] border-b border-[#e8e8ed]">
            <tr>
              <th className="px-6 py-3.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                Date & Time
              </th>
              <th className="px-6 py-3.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                Patient
              </th>
              <th className="px-6 py-3.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                Doctor
              </th>
              <th className="px-6 py-3.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e8e8ed]">
            {filteredAppts.map((appt) => (
              <tr key={appt._id} className="hover:bg-[#fafafa]/60 transition">
                <td className="px-6 py-3.5 text-[13px] text-[#1d1d1f] font-medium">
                  {new Date(appt.appointmentDate).toLocaleDateString()} <br />
                  <span className="text-[11px] text-gray-400 font-normal">
                    {appt.appointmentTime}
                  </span>
                </td>
                <td className="px-6 py-3.5">
                  <div className="font-semibold text-[#1d1d1f] text-[13px]">
                    {appt.patientId?.userId?.name || "Unknown"}
                  </div>
                  <div className="text-[11px] text-[#86868b] font-normal">
                    {appt.patientId?.userId?.email}
                  </div>
                </td>
                <td className="px-6 py-3.5 text-gray-800 text-[13px] font-medium">
                  Dr. {appt.doctorId?.userId?.name || "Unknown"}
                </td>
                <td className="px-6 py-3.5">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${
                      appt.status === "COMPLETED"
                        ? "bg-green-50 text-green-700 border-green-100"
                        : appt.status === "CANCELLED"
                        ? "bg-red-50 text-red-700 border-red-100"
                        : appt.status === "CONFIRMED"
                        ? "bg-blue-50 text-blue-700 border-blue-100"
                        : "bg-yellow-50 text-yellow-700 border-yellow-100"
                    }`}
                  >
                    {appt.status}
                  </span>
                </td>
              </tr>
            ))}
            {filteredAppts.length === 0 && (
              <tr>
                <td colSpan="4" className="px-6 py-8 text-center text-gray-400">
                  No appointments found matching query.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminAppointmentsList;
