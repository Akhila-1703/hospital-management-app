import { Schema, model } from "mongoose";

const medicineSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Medicine name is required"],
      trim: true,
    },

    dosage: {
      type: String,
      required: [true, "Dosage is required"],
      trim: true,
    },

    timings: {
      type: String,
      required: [true, "Medicine timings are required"],
      trim: true,
    },

    duration: {
      type: String,
      required: [true, "Duration is required"],
      trim: true,
    },

    instructions: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    _id: false,
  }
);

const prescriptionSchema = new Schema(
  {
    appointmentId: {
      type: Schema.Types.ObjectId,
      ref: "appointment",
      required: [true, "Appointment is required"],
    },

    doctorId: {
      type: Schema.Types.ObjectId,
      ref: "doctor",
      required: [true, "Doctor is required"],
    },

    patientId: {
      type: Schema.Types.ObjectId,
      ref: "patient",
      required: [true, "Patient is required"],
    },

    chiefComplaints: {
      type: String,
      required: [true, "Chief complaints are required"],
      trim: true,
    },

    diagnosis: {
      type: String,
      required: [true, "Diagnosis is required"],
      trim: true,
    },

    medicines: {
      type: [medicineSchema],
      required: [true, "Medicines are required"],
      validate: {
        validator: function (value) {
          return value.length > 0;
        },
        message:
          "At least one medicine is required",
      },
    },

    continueMedication: {
      type: String,
      trim: true,
      default: "",
    },

    notes: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    timestamps: true,
    strict: "throw",
    versionKey: false,
  }
);

export const PrescriptionModel = model(
  "prescription",
  prescriptionSchema
);