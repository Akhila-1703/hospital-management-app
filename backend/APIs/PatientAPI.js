import express from "express";
import bcrypt from "bcryptjs";
import { verifyToken } from "../middleware/verifyToken.js";

import { UserTypeModel } from "../models/UserModel.js";
import { PatientModel } from "../models/PatientModel.js";
import { DoctorModel } from "../models/DoctorModel.js";
import { AppointmentModel } from "../models/AppointmentModel.js";

// IMPORT MULTER UPLOADER & CLOUDINARY HELPER
import { upload } from "../config/multer.js";
import { uploadToCloudinary } from "../config/cloudinaryUpload.js";

export const patientRoute = express.Router();

/* ---------------- REGISTER ---------------- */
patientRoute.post("/register", async (req, res, next) => {
  try {
    const { name, email, password, phoneNumber } = req.body;

    const existing = await UserTypeModel.findOne({ email });
    if (existing)
      return res.status(409).json({ message: "Email already exists" });

    const hashed = await bcrypt.hash(password, 10);

    const user = await UserTypeModel.create({
      name,
      email,
      password: hashed,
      role: "PATIENT",
      phoneNumber,
    });

    // create empty profile (IMPORTANT)
    await PatientModel.create({ userId: user._id });

    res.status(201).json({ message: "Registered", payload: user });
  } catch (err) {
    next(err);
  }
});

/* ---------------- GET PROFILE ---------------- */
patientRoute.get("/profile", verifyToken("PATIENT"), async (req, res) => {
  try {
    const patient = await PatientModel.findOne({
      userId: req.user.id,   // IMPORTANT: must match middleware
    });

    if (!patient) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.json({ message: "Profile found", payload: patient });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

/* ---------------- UPLOAD REPORT ---------------- */
patientRoute.post(
  "/upload-report",
  verifyToken("PATIENT"),
  upload.single("report"),
  async (req, res, next) => {
    try {
      console.log("FILE:", req.file);

      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "No report file provided",
        });
      }

      const result = await uploadToCloudinary(
        req.file.buffer,
        req.file.mimetype
      );

      return res.status(200).json({
        success: true,
        message: "Report uploaded successfully",
        secure_url: result.secure_url,
      });
    } catch (err) {
      console.error("Upload Error:", err);
      next(err);
    }
  }
);

/* ---------------- CREATE PROFILE ---------------- */
patientRoute.post("/profile", verifyToken("PATIENT"), async (req, res) => {
  try {
    const { age, gender, address, bloodGroup, medicalHistory, testReports } = req.body;

    let patient = await PatientModel.findOne({ userId: req.user.id });

    if (!patient) {
      patient = new PatientModel({ userId: req.user.id });
    }

    patient.age = age;
    patient.gender = gender;
    patient.address = address;
    patient.bloodGroup = bloodGroup;
    patient.medicalHistory = medicalHistory;
    patient.testReports = testReports || [];
    patient.isProfileCompleted = true;

    await patient.save();

    res.json({
      message: "Profile saved",
      payload: patient,
    });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

/* ---------------- APPOINTMENTS ---------------- */
patientRoute.get("/appointments", verifyToken("PATIENT"), async (req, res) => {
  try {
    const patient = await PatientModel.findOne({ userId: req.user.id });

    if (!patient)
      return res.status(404).json({ message: "Profile not found" });

    const appointments = await AppointmentModel.find({
      patientId: patient._id,
    }).populate({
      path: "doctorId",
      populate: { path: "userId", select: "name" },
    });

    res.json({
      message: "Appointments",
      payload: appointments.map((a) => ({
        _id: a._id,
        doctorName: a.doctorId?.userId?.name,
        date: a.appointmentDate,
        time: a.appointmentTime,
        reason: a.reason,
        status: a.status,
      })),
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

/* ---------------- BOOK APPOINTMENT ---------------- */
patientRoute.post("/appointment", verifyToken("PATIENT"), async (req, res, next) => {
  try {
    const { doctorId, appointmentDate, appointmentTime, reason } = req.body;

    // Validate input
    if (!doctorId || !appointmentDate || !appointmentTime || !reason)
      return res.status(400).json({ message: "All fields are required" });

    // Fetch patient
    const patient = await PatientModel.findOne({ userId: req.user.id });
    if (!patient) return res.status(404).json({ message: "Patient not found" });

    // Check if patient profile is completed
    if (!patient.isProfileCompleted) {
      return res.status(400).json({
        message: "Please complete your profile before booking an appointment.",
      });
    }

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
      .populate({ path: "patientId", select: "userId" });

    res.status(201).json({ message: "Appointment booked", payload: appointment });
  } catch (err) {
    next(err);
  }
});