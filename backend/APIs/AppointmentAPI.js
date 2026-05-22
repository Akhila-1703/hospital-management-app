import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";

import { AppointmentModel } from "../models/AppointmentModel.js";
import { PatientModel } from "../models/patientModel.js";
import { DoctorModel } from "../models/DoctorModel.js";

const router = express.Router();

// POST: Book appointment
router.post("/appointment", verifyToken("PATIENT"), async (req, res) => {
  try {
    const { doctorId, appointmentDate, appointmentTime, reason } = req.body;

    // Validate input
    if (!doctorId || !appointmentDate || !appointmentTime || !reason)
      return res.status(400).json({ message: "All fields are required" });

    // Fetch patient
    const patient = await PatientModel.findOne({ userId: req.user.id });
    if (!patient) return res.status(404).json({ message: "Patient not found" });

    // Fetch doctor
    const doctor = await DoctorModel.findById(doctorId);
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });

    // Create appointment directly (no slot checks)
    let appointment = await AppointmentModel.create({
      patientId: patient._id,
      doctorId,
      appointmentDate,
      appointmentTime,
      reason,
      status: "BOOKED",
    });

    // Populate doctor -> userId for frontend
    appointment = await AppointmentModel.findById(appointment._id)
      .populate({
        path: "doctorId",
        populate: { path: "userId", select: "name firstName lastName" },
      })
      .populate({ path: "patientId", select: "userId" }); // optional: include patient info if needed

    res.status(201).json({ message: "Appointment booked", payload: appointment });
  } catch (err) {
    console.error("Booking error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get(
  "/appointments",
  verifyToken("PATIENT"),
  async (req, res) => {
    try {
      // Find patient
      const patient = await PatientModel.findOne({
        userId: req.user.id,
      });

      if (!patient) {
        return res.status(404).json({
          message: "Patient profile not found",
        });
      }

      // Fetch appointments
      const appointments = await AppointmentModel.find({
        patientId: patient._id,
      })
        .populate({
          path: "doctorId",
          populate: {
            path: "userId",
            select: "name firstName lastName",
          },
        })
        .sort({ createdAt: -1 });

      console.log(
        JSON.stringify(appointments, null, 2)
      );

      res.status(200).json({
        message: "Appointments fetched",
        payload: appointments,
      });
    } catch (err) {
      console.error(err);

      res.status(500).json({
        message: "Server error",
      });
    }
  }
);
