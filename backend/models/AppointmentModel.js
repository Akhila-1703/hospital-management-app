import { Schema, model } from "mongoose";

const appointmentSchema = new Schema(
  {
    patientId: {
      type: Schema.Types.ObjectId,
      ref: "patient",
      required: [true, "Patient is required"],
      index: true
    },

    doctorId: {
      type: Schema.Types.ObjectId,
      ref: "doctor",
      required: [true, "Doctor is required"],
      index: true
    },

    appointmentDate: {
      type: Date,
      required: [true, "Appointment date is required"],
      validate: {
        validator: function (value) {
          // Validate only when creating a new appointment
          if (!this.isNew) return true;

          const today = new Date();
          today.setHours(0, 0, 0, 0);

          return value >= today;
        },
        message: "Appointment date cannot be in the past"
      }
    },

    appointmentTime: {
      type: String,
      required: [true, "Appointment time is required"],
      trim: true
    },

    status: {
      type: String,
      enum: ["BOOKED", "CONFIRMED", "COMPLETED", "CANCELLED"],
      default: "BOOKED"
    },

    reason: {
      type: String,
      required: [true, "Reason is required"],
      trim: true
    },

    reminderSent: {
      type: Boolean,
      default: false,
      index: true
    }
  },
  {
    timestamps: true,
    strict: "throw",
    versionKey: false
  }
);

// Prevent double booking for same doctor, date and time
appointmentSchema.index(
  {
    doctorId: 1,
    appointmentDate: 1,
    appointmentTime: 1
  },
  {
    unique: true
  }
);

export const AppointmentModel = model(
  "appointment",
  appointmentSchema
);