import React from "react";
import { Download } from "lucide-react";
import { headingFont, adminPrimaryBtn } from "../../styles/Common.js";

// component to list prescriptions in the admin dashboard
function AdminPrescriptionsList({
  prescriptions,
  searchQuery,
  searchBarComponent,
  downloadPrescription,
}) {
  // filter the list of prescriptions based on the search query
  const filteredPresc = prescriptions.filter(
    (presc) =>
      presc.patientId?.userId?.name
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      presc.doctorId?.userId?.name
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      presc.diagnosis?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-[#e8e8ed] overflow-hidden">
      <div className="px-6 py-5 border-b border-[#e8e8ed]">
        <h2 className={`text-[18px] font-bold ${headingFont}`}>
          All Prescriptions
        </h2>
      </div>
      <div className="p-6 pb-0">{searchBarComponent}</div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-[#fafafa] border-b border-[#e8e8ed]">
            <tr>
              <th className="px-6 py-3.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                Patient
              </th>
              <th className="px-6 py-3.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                Doctor
              </th>
              <th className="px-6 py-3.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                Diagnosis
              </th>
              <th className="px-6 py-3.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider text-center">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e8e8ed]">
            {filteredPresc.map((presc) => (
              <tr key={presc._id} className="hover:bg-[#fafafa]/60 transition">
                <td className="px-6 py-3.5 text-[#86868b] text-[13px]">
                  {new Date(presc.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-3.5 font-semibold text-[#1d1d1f] text-[13px]">
                  {presc.patientId?.userId?.name || "Unknown"}
                </td>
                <td className="px-6 py-3.5 font-semibold text-[#1d1d1f] text-[13px]">
                  Dr. {presc.doctorId?.userId?.name || "Unknown"}
                </td>
                <td className="px-6 py-3.5 text-[#86868b] text-[13px]">
                  {presc.diagnosis}
                </td>
                <td className="px-6 py-3.5 text-center">
                  <button
                    onClick={() => downloadPrescription(presc._id)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition text-[12px] font-semibold ${adminPrimaryBtn}`}
                  >
                    <Download size={13} />
                    Download PDF
                  </button>
                </td>
              </tr>
            ))}
            {filteredPresc.length === 0 && (
              <tr>
                <td colSpan="5" className="px-6 py-8 text-center text-gray-400">
                  No prescriptions found matching query.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminPrescriptionsList;
