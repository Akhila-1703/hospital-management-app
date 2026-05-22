import { Schema, model } from "mongoose"

const patientSchema = new Schema({

    userId: {
        type: Schema.Types.ObjectId,
        ref: "user",
        
    },

    age: {
        type: Number,
        
    },

    gender: {
        type: String,
        enum: ["MALE","FEMALE","OTHER"],
       
    },

    address: {
        type: String,
       
    },

    bloodGroup: {
        type: String,
        
    },

    medicalHistory: {
        type: String
    },
    testReports: [{
        name: { type: String, required: true },
        url: { type: String, required: true },
        uploadedAt: { type: Date, default: Date.now }
    }],
    isProfileCompleted: {
        type: Boolean,
        default: false,
      }
},{
    timestamps: true,
    strict: "throw",
    versionKey:false
})

export const PatientModel = model("patient", patientSchema)