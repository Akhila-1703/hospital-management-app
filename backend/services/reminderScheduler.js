import cron from "node-cron";
import { AppointmentModel } from "../models/AppointmentModel.js";
import { sendAppointmentReminder } from "./emailService.js";

/**
 * Starts the background cron job scheduler for email reminders.
 * Runs every minute to find appointments scheduled to start within the next hour.
 */
export const startReminderScheduler = () => {
  console.log(
    "⏰ [ReminderScheduler] Background cron job initialized (running every minute)..."
  );

  cron.schedule("* * * * *", async () => {
    try {
      const now = new Date();

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Fetch only active appointments that haven't been reminded
      const appointments = await AppointmentModel.find({
        status: { $in: ["BOOKED", "CONFIRMED"] },
        reminderSent: false,
        appointmentDate: { $gte: today }
      })
        .populate({
          path: "patientId",
          populate: {
            path: "userId",
            select: "name email"
          }
        })
        .populate({
          path: "doctorId",
          populate: {
            path: "userId",
            select: "name"
          }
        });

      if (!appointments.length) {
        return;
      }

      for (const appointment of appointments) {
        try {
          // Helper function to mark reminder as sent
          const markReminderSent = async () => {
            await AppointmentModel.updateOne(
              { _id: appointment._id },
              {
                $set: {
                  reminderSent: true
                }
              }
            );
          };

          if (
            !appointment.appointmentDate ||
            !appointment.appointmentTime
          ) {
            await markReminderSent();
            continue;
          }

          const dateStr =
            appointment.appointmentDate.toISOString().split("T")[0];

          const [hours, minutes] = appointment.appointmentTime
            .split(":")
            .map(Number);

          const [year, month, day] = dateStr
            .split("-")
            .map(Number);

          const appointmentDateTime = new Date();
          appointmentDateTime.setFullYear(
            year,
            month - 1,
            day
          );
          appointmentDateTime.setHours(
            hours,
            minutes,
            0,
            0
          );

          const diffMs =
            appointmentDateTime.getTime() - now.getTime();

          const diffMins = diffMs / (1000 * 60);

          // Appointment already started or passed
          if (diffMins <= 0) {
            await markReminderSent();

            console.log(
              `⏰ [ReminderScheduler] Appointment ${appointment._id} is in the past. Marked reminder as processed.`
            );

            continue;
          }

          // Send reminder if appointment starts within next hour
          if (diffMins <= 60) {
            const patientUser = appointment.patientId?.userId;
            const patientEmail = patientUser?.email;
            const patientName =
              patientUser?.name || "Valued Patient";

            const doctorUser = appointment.doctorId?.userId;
            const doctorName =
              doctorUser?.name || "Specialist";

            if (!patientEmail) {
              console.log(
                `⏰ [ReminderScheduler] Skipping appointment ${appointment._id} - Patient email is missing.`
              );

              await markReminderSent();
              continue;
            }

            console.log(
              `⏰ [ReminderScheduler] Sending reminder for appointment ${appointment._id} starting in ${Math.round(
                diffMins
              )} mins...`
            );

            const success = await sendAppointmentReminder({
              patientEmail,
              patientName,
              doctorName,
              appointmentDate: dateStr,
              appointmentTime: appointment.appointmentTime,
              reason:
                appointment.reason ||
                "General Consultation"
            });

            if (success) {
              await markReminderSent();

              console.log(
                `⏰ [ReminderScheduler] Successfully reminded and updated appointment ${appointment._id}`
              );
            }
          }
        } catch (innerErr) {
          console.error(
            `⏰ [ReminderScheduler] Error processing appointment ${appointment._id}:`,
            innerErr
          );
        }
      }
    } catch (err) {
      console.error(
        "⏰ [ReminderScheduler] Error executing background reminder scheduler job:",
        err
      );
    }
  });
};