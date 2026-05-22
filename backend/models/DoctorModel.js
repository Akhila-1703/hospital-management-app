import { Schema, model } from "mongoose"

const doctorSchema = new Schema({

    userId:{
        type: Schema.Types.ObjectId,
        ref:"user",
        required:[true,"User reference is required"]
    },

    dob:{
        type: Date,
        required:[true,"Date of birth is required"]
    },

    specialization:{
        type:String,
        required:[true,"Specialization is required"]
    },

    experience:{
        type:Number,
        required:[true,"Experience is required"]
    },

    qualification:{
        type:String,
        required:[true,"Qualification is required"]
    },

    // New fields for verification
    verificationId: {
        type: String,
        unique: true,
        default: () => new Date().getTime().toString()
    },
    isVerified: {
        type: Boolean,
        default: false
    },

    availableDays:{
        type:[String],
        required:[true,"Available days are required"]
    },

    availableTime:{
        type:String,
        required:[true,"Available time is required"]
    },

    profileImage:{
        type:String
    }

},{
    timestamps: true,
    strict: "throw",
    versionKey:false
})

export const DoctorModel = model("doctor", doctorSchema)