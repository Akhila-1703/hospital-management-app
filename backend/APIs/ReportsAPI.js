import exp from "express"
import { ReportModel } from "../models/MedicalReportsModel.js"

export const reportRoute = exp.Router()


// upload report
reportRoute.post("/", async (req,res)=>{

    const reportObj = req.body

    const report = await ReportModel.create(reportObj)

    res.status(201).json({
        message:"Report uploaded",
        payload:report
    })
})


// get reports of patient
reportRoute.get("/patient/:patientId", async (req,res)=>{

    const patientId = req.params.patientId

    const reports = await ReportModel.find({patientId})

    res.status(200).json({
        message:"Reports fetched",
        payload:reports
    })
})