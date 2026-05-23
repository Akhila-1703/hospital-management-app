import React from "react";

// doctor stats cards component showing summary metrics
function DoctorStatsCards({ appointments }) {
  // get today's date string for comparison
  const todayStr = new Date().toDateString();
  
  // count how many visits are scheduled for today
  const todaysVisitsCount = appointments.filter((a) => {
    if (!a.appointmentDate) return false;
    return (
      new Date(a.appointmentDate).toDateString() === todayStr &&
      a.status !== "CANCELLED"
    );
  }).length;

  // calculate the number of upcoming appointments
  const upcomingCount = appointments.filter((a) => {
    if (!a.appointmentDate) return false;
    const apptDate = new Date(a.appointmentDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return (
      apptDate >= today &&
      (a.status === "BOOKED" || a.status === "CONFIRMED")
    );
  }).length;

  // calculate how many past appointments we have
  const pastCount = appointments.filter((a) => {
    if (!a.appointmentDate) return false;
    const apptDate = new Date(a.appointmentDate);
    const today = new Date();
    return (
      a.status === "COMPLETED" ||
      (apptDate < today &&
        a.status !== "CANCELLED" &&
        a.status !== "BOOKED" &&
        a.status !== "CONFIRMED")
    );
  }).length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
      {/* Today's Visits */}
      <div className="bg-white rounded-2xl shadow-sm border p-5">
        <p className="text-gray-500 text-sm font-semibold">Today's Visits</p>
        <h2 className="text-4xl font-bold text-blue-600 mt-2">
          {todaysVisitsCount}
        </h2>
        <p className="text-xs text-gray-400 mt-2">Scheduled for today</p>
      </div>

      {/* Upcoming Appointments */}
      <div className="bg-white rounded-2xl shadow-sm border p-5">
        <p className="text-gray-500 text-sm font-semibold">
          Upcoming Appointments
        </p>
        <h2 className="text-4xl font-bold text-green-600 mt-2">
          {upcomingCount}
        </h2>
        <p className="text-xs text-gray-400 mt-2">Future scheduled sessions</p>
      </div>

      {/* Past Appointments */}
      <div className="bg-white rounded-2xl shadow-sm border p-5">
        <p className="text-gray-500 text-sm font-semibold">
          Past Appointments
        </p>
        <h2 className="text-4xl font-bold text-gray-700 mt-2">
          {pastCount}
        </h2>
        <p className="text-xs text-gray-400 mt-2">
          Completed & historical visits
        </p>
      </div>
    </div>
  );
}

export default DoctorStatsCards;
