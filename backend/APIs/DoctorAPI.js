import express from "express";
import { register } from "../services/authService.js";

import { DoctorModel } from "../models/DoctorModel.js";
import { AppointmentModel } from "../models/AppointmentModel.js";
import { PrescriptionModel } from "../models/PrescriptionModel.js";
import { ReportModel } from "../models/ReportModel.js";

import { verifyToken } from "../middleware/verifyToken.js";

// IMPORT MULTER UPLOADER & CLOUDINARY HELPER
import { upload } from "../config/multer.js";
import { uploadToCloudinary } from "../config/cloudinaryUpload.js";

export const doctorRoute = express.Router();


// ======================================================
// UPLOAD PROFILE IMAGE
// ======================================================
doctorRoute.post(
  "/upload-image",
  verifyToken("DOCTOR"),
  upload.single("image"),
  async (req, res, next) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "No image file provided",
        });
      }

      const result = await uploadToCloudinary(req.file.buffer);

      res.status(200).json({
        success: true,
        message: "Image uploaded successfully",
        secure_url: result.secure_url,
      });
    } catch (err) {
      next(err);
    }
  }
);


// ======================================================
// REGISTER DOCTOR
// ======================================================
doctorRoute.post(
  "/register",
  async (req, res, next) => {
    try {
      res.status(403).json({
        success: false,
        message: "Doctor registration must be performed by the Administrator.",
      });
    } catch (err) {
      next(err);
    }
  }
);


// ======================================================
// CREATE / UPDATE PROFILE
// ======================================================
doctorRoute.post(
  "/profile",
  verifyToken("DOCTOR"),
  async (req, res, next) => {
    try {
      const userId = req.user.id;

      const doctor =
        await DoctorModel.findOneAndUpdate(
          { userId },
          {
            userId,
            ...req.body,
          },
          {
            new: true,
            upsert: true,
            runValidators: true,
          }
        );

      res.status(200).json({
        success: true,
        message: "Doctor profile saved",
        payload: doctor,
      });
    } catch (err) {
      next(err);
    }
  }
);


// ======================================================
// GET DOCTOR PROFILE
// ======================================================
doctorRoute.get(
  "/profile",
  verifyToken("DOCTOR"),
  async (req, res, next) => {
    try {
      const doctor =
        await DoctorModel.findOne({
          userId: req.user.id,
        }).populate(
          "userId",
          "name email phoneNumber"
        );

      if (!doctor) {
        return res.status(200).json({
          success: true,
          message: "Doctor profile not found",
          payload: null
        });
      }

      res.status(200).json({
        success: true,
        message: "Doctor profile fetched",
        payload: doctor,
      });
    } catch (err) {
      next(err);
    }
  }
);


// ======================================================
// GET ALL DOCTORS
// ======================================================
doctorRoute.get(
  "/doctors",
  async (req, res, next) => {
    try {
      const doctors =
        await DoctorModel.find().populate(
          "userId",
          "name email phoneNumber"
        );

      res.status(200).json({
        success: true,
        message: "Doctors fetched",
        payload: doctors,
      });
    } catch (err) {
      next(err);
    }
  }
);


// ======================================================
// GET ALL APPOINTMENTS OF DOCTOR
// ======================================================
doctorRoute.get(
  "/appointments",
  verifyToken("DOCTOR"),
  async (req, res, next) => {
    try {
      const doctor =
        await DoctorModel.findOne({
          userId: req.user.id,
        });

      if (!doctor) {
        return res.status(404).json({
          success: false,
          message:
            "Doctor profile not found",
        });
      }

      const appointments =
        await AppointmentModel.find({
          doctorId: doctor._id,
        })
          .populate({
            path: "patientId",
            populate: {
              path: "userId",
              select: "name email phoneNumber",
            },
          })
          .populate({
            path: "doctorId",
            populate: {
              path: "userId",
              select: "name email phoneNumber",
            },
          });

      // Find all prescriptions for these appointments
      const appointmentIds = appointments.map((appt) => appt._id);
      const prescriptions = await PrescriptionModel.find({
        appointmentId: { $in: appointmentIds },
      });

      const prescribedAppointmentIds = new Set(
        prescriptions.map((p) => p.appointmentId.toString())
      );

      const appointmentsWithPrescriptionStatus = appointments.map((appt) => {
        const apptObj = appt.toObject();
        apptObj.hasPrescription = prescribedAppointmentIds.has(appt._id.toString());
        return apptObj;
      });

      res.status(200).json({
        success: true,
        message: "Appointments fetched",
        payload: appointmentsWithPrescriptionStatus,
      });
    } catch (err) {
      next(err);
    }
  }
);


// ======================================================
// MARK APPOINTMENT AS COMPLETED
// ======================================================
doctorRoute.put(
  "/appointment/:id/complete",
  verifyToken("DOCTOR"),
  async (req, res, next) => {
    try {
      const appointment = await AppointmentModel.findByIdAndUpdate(
        req.params.id,
        { status: "COMPLETED" },
        { new: true }
      );

      if (!appointment) {
        return res.status(404).json({
          success: false,
          message: "Appointment not found",
        });
      }

      res.status(200).json({
        success: true,
        message: "Appointment marked as completed",
        payload: appointment,
      });
    } catch (err) {
      next(err);
    }
  }
);


// ======================================================
// APPROVE APPOINTMENT
// ======================================================
doctorRoute.put(
  "/appointment/:id/approve",
  verifyToken("DOCTOR"),
  async (req, res, next) => {
    try {
      const appointment = await AppointmentModel.findByIdAndUpdate(
        req.params.id,
        { status: "CONFIRMED" },
        { new: true }
      );

      if (!appointment) {
        return res.status(404).json({
          success: false,
          message: "Appointment not found",
        });
      }

      res.status(200).json({
        success: true,
        message: "Appointment approved successfully",
        payload: appointment,
      });
    } catch (err) {
      next(err);
    }
  }
);


// ======================================================
// CANCEL APPOINTMENT BY DOCTOR
// ======================================================
doctorRoute.put(
  "/appointment/:id/cancel",
  verifyToken("DOCTOR"),
  async (req, res, next) => {
    try {
      const appointment = await AppointmentModel.findByIdAndUpdate(
        req.params.id,
        { status: "CANCELLED" },
        { new: true }
      );

      if (!appointment) {
        return res.status(404).json({
          success: false,
          message: "Appointment not found",
        });
      }

      res.status(200).json({
        success: true,
        message: "Appointment cancelled successfully",
        payload: appointment,
      });
    } catch (err) {
      next(err);
    }
  }
);


// ======================================================
// GET SINGLE APPOINTMENT
// ======================================================
doctorRoute.get(
  "/appointment/:id",
  verifyToken("DOCTOR"),
  async (req, res, next) => {
    try {
      const appointment =
        await AppointmentModel.findById(
          req.params.id
        )
          .populate({
            path: "patientId",
            populate: {
              path: "userId",
              select: "name email phoneNumber",
            },
          })
          .populate({
            path: "doctorId",
            populate: {
              path: "userId",
              select: "name email phoneNumber",
            },
          });

      if (!appointment) {
        return res.status(404).json({
          success: false,
          message: "Appointment not found",
        });
      }

      const prescription = await PrescriptionModel.findOne({
        appointmentId: appointment._id,
      });

      const apptObj = appointment.toObject();
      apptObj.hasPrescription = !!prescription;

      res.status(200).json({
        success: true,
        message: "Appointment fetched",
        payload: apptObj,
      });
    } catch (err) {
      next(err);
    }
  }
);


// ======================================================
// UPDATE APPOINTMENT STATUS
// ======================================================
doctorRoute.put(
  "/appointment/:id",
  verifyToken("DOCTOR"),
  async (req, res, next) => {
    try {
      const updated =
        await AppointmentModel.findByIdAndUpdate(
          req.params.id,
          {
            status: req.body.status,
          },
          {
            new: true,
          }
        );

      res.status(200).json({
        success: true,
        message: "Appointment updated",
        payload: updated,
      });
    } catch (err) {
      next(err);
    }
  }
);


// ======================================================
// CREATE PRESCRIPTION
// ======================================================
doctorRoute.post(
  "/prescription",
  verifyToken("DOCTOR"),
  async (req, res, next) => {
    try {
      const doctor =
        await DoctorModel.findOne({
          userId: req.user.id,
        });

      if (!doctor) {
        return res.status(400).json({
          success: false,
          message:
            "Please create doctor profile first",
        });
      }

      const prescription =
        await PrescriptionModel.create({
          ...req.body,
          doctorId: doctor._id,
        });

      res.status(201).json({
        success: true,
        message: "Prescription created",
        payload: prescription,
      });
    } catch (err) {
      next(err);
    }
  }
);


// ======================================================
// GET PATIENT REPORTS
// ======================================================
doctorRoute.get(
  "/reports/:patientId",
  verifyToken("DOCTOR"),
  async (req, res, next) => {
    try {
      const reports =
        await ReportModel.find({
          patientId: req.params.patientId,
        });

      res.status(200).json({
        success: true,
        message: "Reports fetched",
        payload: reports,
      });
    } catch (err) {
      next(err);
    }
  }
);