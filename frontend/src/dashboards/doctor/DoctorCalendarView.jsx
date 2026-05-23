import React from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";

// component to show calendar view for doctor appointments
function DoctorCalendarView({ appointments, navigate }) {
  // map appointments to calendar events
  const events = appointments.map((appt) => {
    let bgColor = "#cbd5e1"; // gray-300
    if (appt.status === "CONFIRMED") bgColor = "#22c55e"; // green-500
    if (appt.status === "BOOKED") bgColor = "#eab308"; // yellow-500
    if (appt.status === "CANCELLED") bgColor = "#ef4444"; // red-500
    if (appt.status === "COMPLETED") bgColor = "#3b82f6"; // blue-500

    let dateObj = new Date(appt.appointmentDate || appt.date);
    if (appt.appointmentTime || appt.time) {
      const [hours, mins] = (appt.appointmentTime || appt.time).split(":");
      dateObj.setHours(hours, mins, 0);
    }

    return {
      id: appt._id,
      title: `${appt.patientId?.userId?.name || appt.patientName} - ${
        appt.status
      }`,
      start: dateObj,
      backgroundColor: bgColor,
      borderColor: bgColor,
      extendedProps: { appt },
    };
  });

  return (
    <div className="calendar-container mt-4 z-0 relative">
      {/* rendering the fullcalendar instance */}
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={events}
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,dayGridWeek",
        }}
        height="auto"
        eventClick={(info) => {
          const appt = info.event.extendedProps.appt;
          navigate(`/doctor/appointment-detail/${appt._id}`);
        }}
      />
      <style>{`
        .fc .fc-toolbar-title { font-size: 1.125rem; font-weight: 700; color: #1f2937; }
        .fc-button-primary { background-color: #f3f4f6 !important; border-color: #e5e7eb !important; color: #4b5563 !important; text-transform: capitalize; font-weight: 600 !important; font-size: 0.875rem !important; border-radius: 0.5rem !important; padding: 0.25rem 0.75rem !important; }
        .fc-button-primary:hover { background-color: #e5e7eb !important; color: #1f2937 !important; }
        .fc-button-active { background-color: #d1d5db !important; color: #111827 !important; box-shadow: none !important; }
        .fc-event { border-radius: 4px; padding: 2px 4px; cursor: pointer; font-size: 0.75rem; border: none; font-weight: 600; }
        .fc-daygrid-day-number { color: #4b5563; font-weight: 500; font-size: 0.875rem; padding: 0.5rem; text-decoration: none; }
        .fc-col-header-cell { padding: 0.75rem 0; background-color: #f9fafb; font-weight: 600; color: #6b7280; font-size: 0.875rem; text-transform: uppercase; }
        .fc-theme-standard td, .fc-theme-standard th { border-color: #f3f4f6; }
      `}</style>
    </div>
  );
}

export default DoctorCalendarView;
