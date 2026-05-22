import { Schema, model } from "mongoose"

const reportSchema = new Schema({

    patientId:{
        type:Schema.Types.ObjectId,
        ref:"patient",
        required:[true,"Patient is required"]
    },

    doctorId:{
        type:Schema.Types.ObjectId,
        ref:"doctor",
        required:[true,"Doctor is required"]
    },

    fileUrl:{
        type:String,
        required:[true,"File URL is required"]
    },

    fileType:{
        type:String,
        required:[true,"File type is required"]
    },

    uploadedAt:{
        type:Date,
        default:Date.now
    }

},{
    timestamps: true,
    strict: "throw",
    versionKey:false
})

export const ReportModel = model("report", reportSchema)