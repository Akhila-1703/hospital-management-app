import React from "react";
import { FileText } from "lucide-react";

// component to render the list of doctor's appointments
function DoctorAppointmentsList({
  appointments,
  apptFilter,
  navigate,
  downloadPrescription,
  handleMarkCompleted,
  handleApprove,
  handleCancel,
}) {
  // string representing today's date
  const todayStr = new Date().toDateString();
  
  // filter out appointments based on the active tab
  const filtered = appointments.filter((appt) => {
    if (!appt.appointmentDate) return false;
    const apptDate = new Date(appt.appointmentDate);
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

  // return an empty state if no appointments match the current filter
  if (filtered.length === 0) {
    return (
      <div className="text-center py-16 text-gray-400 font-medium">
        No {apptFilter} appointments found
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {filtered.map((appt) => (
        <div
          key={appt._id}
          onClick={() => navigate(`/doctor/appointment-detail/${appt._id}`)}
          className="border rounded-xl p-5 flex flex-col md:flex-row justify-between items-center bg-gray-50 hover:bg-gray-100 transition cursor-pointer hover:border-blue-200 hover:shadow-sm"
        >
          {/* LEFT SIDE */}
          <div>
            <h4 className="text-lg font-semibold text-gray-800">
              {appt.patientId?.userId?.name || appt.patientName || "N/A"}
            </h4>
            <p className="text-sm text-gray-600 mt-1">
              {appt.patientId?.age || appt.patientAge || "N/A"} yrs •{" "}
              <span className="capitalize">
                {(
                  appt.patientId?.gender ||
                  appt.patientGender ||
                  "N/A"
                ).toLowerCase()}
              </span>
            </p>
            <p className="text-sm text-gray-500 mt-2">
              <span className="font-semibold text-gray-700">Reason:</span>{" "}
              {appt.reason}
            </p>

            {/* PATIENT TEST REPORTS */}
            {appt.patientId?.testReports &&
              appt.patientId.testReports.length > 0 && (
                <div className="mt-4 border-t border-gray-100 pt-3">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Patient Test Reports
                  </p>

                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="flex flex-wrap gap-2 mt-2"
                  >
                    {appt.patientId.testReports.map((report, idx) => (
                      <a
                        key={report._id || report.url || idx}
                        href={report.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 bg-white border px-3 py-2 rounded-lg hover:bg-gray-50 transition"
                      >
                        <FileText size={18} />
                        <span>{report.name}</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}
          </div>

          {/* RIGHT SIDE */}
          <div className="text-right mt-4 md:mt-0">
            <p className="text-sm text-gray-700 font-semibold">
              {appt.appointmentDate
                ? new Date(appt.appointmentDate).toLocaleDateString()
                : appt.date
                ? new Date(appt.date).toLocaleDateString()
                : "N/A"}
            </p>
            <p className="text-sm text-gray-500 mt-1 font-medium">
              {appt.appointmentTime || appt.time || "N/A"}
            </p>

            {/* STATUS */}
            <span
              className={`inline-block mt-3 px-3 py-1 rounded-full text-xs font-semibold ${
                appt.status === "BOOKED"
                  ? "bg-yellow-100 text-yellow-700"
                  : appt.status === "CONFIRMED"
                  ? "bg-green-100 text-green-700"
                  : appt.status === "COMPLETED"
                  ? "bg-blue-100 text-blue-700"
                  : appt.status === "CANCELLED"
                  ? "bg-red-100 text-red-600"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              {appt.status === "BOOKED"
                ? "Pending Approval"
                : appt.status === "CONFIRMED"
                ? "Approved"
                : appt.status === "COMPLETED"
                ? "Completed"
                : appt.status === "CANCELLED"
                ? "Cancelled"
                : appt.status}
            </span>

            {/* ACTIONS */}
            <div
              onClick={(e) => e.stopPropagation()}
              className="mt-4 flex flex-wrap gap-2 justify-end"
            >
              {/* PAST APPOINTMENTS ACTION FALLBACK */}
              {apptFilter === "past" ? (
                <>
                  {appt.hasPrescription ? (
                    <button
                      onClick={() => downloadPrescription(appt._id)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition flex items-center gap-1.5"
                    >
                      <FileText size={14} />
                      Download Prescription
                    </button>
                  ) : (
                    <button
                      onClick={() =>
                        navigate(`/prescription-form/${appt._id}`)
                      }
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition"
                    >
                      Write Prescription
                    </button>
                  )}
                </>
              ) : (
                <>
                  {/* If status is BOOKED (Pending Approval) */}
                  {appt.status === "BOOKED" && (
                    <>
                      <button
                        onClick={() => handleApprove(appt._id)}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleCancel(appt._id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition"
                      >
                        Cancel
                      </button>
                    </>
                  )}

                  {/* If status is CONFIRMED (Approved) */}
                  {appt.status === "CONFIRMED" && (
                    <>
                      <button
                        onClick={() => handleMarkCompleted(appt._id)}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition"
                      >
                        Mark Completed
                      </button>
                      {appt.hasPrescription ? (
                        <button
                          onClick={() => downloadPrescription(appt._id)}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition"
                        >
                          View Prescription
                        </button>
                      ) : (
                        <button
                          onClick={() =>
                            navigate(`/prescription-form/${appt._id}`)
                          }
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition font-semibold"
                        >
                          Write Prescription
                        </button>
                      )}
                      <button
                        onClick={() => handleCancel(appt._id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition"
                      >
                        Cancel Appointment
                      </button>
                    </>
                  )}

                  {/* If status is COMPLETED */}
                  {appt.status === "COMPLETED" && (
                    <>
                      {appt.hasPrescription ? (
                        <button
                          onClick={() => downloadPrescription(appt._id)}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition flex items-center gap-1.5"
                        >
                          <FileText size={14} />
                          Download Prescription
                        </button>
                      ) : (
                        <button
                          onClick={() =>
                            navigate(`/prescription-form/${appt._id}`)
                          }
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition"
                        >
                          Write Prescription
                        </button>
                      )}
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default DoctorAppointmentsList;
