import React from "react";
import { Calendar, Clipboard, Folder } from "lucide-react";

// stats component for patient dashboard
function PatientStatsCards({ appointments, patientProfile }) {
  // calculate the number of upcoming appointments
  const upcomingCount = appointments.filter((a) => {
    if (!a.date) return false;
    const apptDate = new Date(a.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return (
      apptDate >= today && (a.status === "BOOKED" || a.status === "CONFIRMED")
    );
  }).length;

  // calculate how many have a prescription
  const prescriptionCount = appointments.filter((a) => a.hasPrescription).length;
  
  // check how many test reports exist
  const recordsCount = patientProfile?.testReports?.length || 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
      {/* upcoming visits card */}
      <div className="bg-white rounded-2xl shadow-sm border p-5 flex justify-between items-start">
        <div>
          <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">
            Upcoming Visits
          </p>
          <h2 className="text-4xl font-extrabold text-gray-800 mt-3">
            {upcomingCount}
          </h2>
        </div>
        <div className="p-2.5 bg-gray-50 rounded-xl text-gray-600 border border-gray-100">
          <Calendar size={18} />
        </div>
      </div>

      {/* prescriptions card */}
      <div className="bg-white rounded-2xl shadow-sm border p-5 flex justify-between items-start">
        <div>
          <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">
            Prescriptions
          </p>
          <h2 className="text-4xl font-extrabold text-gray-800 mt-3">
            {prescriptionCount}
          </h2>
        </div>
        <div className="p-2.5 bg-gray-50 rounded-xl text-gray-600 border border-gray-100">
          <Clipboard size={18} />
        </div>
      </div>

      {/* records card */}
      <div className="bg-white rounded-2xl shadow-sm border p-5 flex justify-between items-start">
        <div>
          <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">
            Records
          </p>
          <h2 className="text-4xl font-extrabold text-gray-800 mt-3">
            {recordsCount}
          </h2>
        </div>
        <div className="p-2.5 bg-gray-50 rounded-xl text-gray-600 border border-gray-100">
          <Folder size={18} />
        </div>
      </div>
    </div>
  );
}

export default PatientStatsCards;
