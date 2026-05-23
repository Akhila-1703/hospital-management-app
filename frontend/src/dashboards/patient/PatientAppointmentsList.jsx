import React from "react";
import { FileText } from "lucide-react";

// list view component for patient appointments
function PatientAppointmentsList({
  appointments,
  apptFilter,
  downloadPrescription,
}) {
  const todayStr = new Date().toDateString();
  
  // filter appointments based on the selected filter
  const filtered = appointments.filter((appt) => {
    if (!appt.date) return false;
    const apptDate = new Date(appt.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (apptFilter === "today") {
      return (
        apptDate.toDateString() === todayStr && appt.status !== "CANCELLED"
      );
    } else if (apptFilter === "upcoming") {
      return (
        apptDate >= today &&
        (appt.status === "BOOKED" || appt.status === "CONFIRMED")
      );
    } else if (apptFilter === "past") {
      return (
        appt.status === "COMPLETED" ||
        (apptDate < today &&
          appt.status !== "CANCELLED" &&
          appt.status !== "BOOKED" &&
          appt.status !== "CONFIRMED")
      );
    }
    return true;
  });

  // show empty state if nothing matches
  if (filtered.length === 0) {
    return (
      <div className="text-center py-16 text-gray-400 font-medium">
        No {apptFilter} appointments found
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {filtered.map((appt) => {
        const doctorName = appt.doctorName || "N/A";
        const specialization = appt.specialization || "General Physician";

        return (
          <div
            key={appt._id}
            className="border rounded-2xl p-5 flex flex-col md:flex-row justify-between items-center bg-gray-50 hover:bg-gray-100 transition hover:border-blue-200 hover:shadow-sm"
          >
            {/* left side info block */}
            <div className="w-full md:w-auto">
              <h4 className="text-lg font-semibold text-gray-800">
                Dr. {doctorName}
              </h4>
              <p className="text-blue-600 font-medium mt-1 capitalize text-xs">
                {specialization}
              </p>
              <p className="text-sm text-gray-500 mt-2">
                <span className="font-semibold text-gray-700">Reason:</span>{" "}
                {appt.reason || "N/A"}
              </p>
            </div>

            {/* right side status and date block */}
            <div className="text-right mt-4 md:mt-0 w-full md:w-auto flex flex-col items-end">
              <p className="text-sm text-gray-700 font-semibold">
                {appt.date
                  ? new Date(appt.date).toLocaleDateString("en-GB")
                  : "N/A"}
              </p>
              <p className="text-sm text-gray-500 mt-1 font-medium">
                {appt.time || "N/A"}
              </p>

              {/* show status badge */}
              <span
                className={`inline-block mt-3 px-3 py-1 rounded-full text-xs font-semibold ${
                  appt.status === "BOOKED"
                    ? "bg-yellow-100 text-yellow-700"
                    : appt.status === "CONFIRMED"
                    ? "bg-green-100 text-green-700"
                    : appt.status === "CANCELLED"
                    ? "bg-red-100 text-red-600"
                    : appt.status === "COMPLETED"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                {appt.status === "BOOKED"
                  ? "Pending Approval"
                  : appt.status === "CONFIRMED"
                  ? "Approved"
                  : appt.status === "CANCELLED"
                  ? "Cancelled"
                  : appt.status === "COMPLETED"
                  ? "Completed"
                  : appt.status}
              </span>

              {/* prescription action button area */}
              {(appt.status === "COMPLETED" ||
                appt.hasPrescription ||
                apptFilter === "past") && (
                <div className="mt-4 flex justify-end w-full">
                  {appt.hasPrescription ? (
                    <button
                      onClick={() => downloadPrescription(appt._id)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
                    >
                      <FileText size={14} />
                      Download Prescription
                    </button>
                  ) : (
                    <span className="text-xs text-gray-400 italic font-medium">
                      Prescription Pending
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default PatientAppointmentsList;
