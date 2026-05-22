import { Schema, model } from "mongoose"

const reportSchema = new Schema({

    patientId: {
        type: Schema.Types.ObjectId,
        ref: "patient",
        required: [true, "Patient id is required"]
    },

    doctorId: {
        type: Schema.Types.ObjectId,
        ref: "doctor",
        required: [true, "Doctor id is required"]
    },

    fileUrl: {
        type: String,
        required: [true, "Report file url is required"]
    },

    fileType: {
        type: String,
        required: [true, "Report type is required"]
    }

}, {
    timestamps: true,
    strict: "throw",
    versionKey: false
})

// create model
export const ReportModel = model("report", reportSchema)