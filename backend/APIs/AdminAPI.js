import exp from "express"
import bcrypt from "bcryptjs";
import { UserTypeModel } from "../models/UserModel.js"
import { DoctorModel } from "../models/DoctorModel.js";
import { AppointmentModel } from "../models/AppointmentModel.js";
import { PrescriptionModel } from "../models/PrescriptionModel.js";
import { sendDoctorCredentials } from "../services/emailService.js";
import { verifyToken } from "../middleware/verifyToken.js";

export const adminRoute = exp.Router()

// Protect all admin routes - require ADMIN role
adminRoute.use(verifyToken("ADMIN"));


// get active doctors
adminRoute.get("/doctors", async(req,res,next)=>{
    try{
        const users = await UserTypeModel.find({ role: "DOCTOR" }).lean();
        const doctorDetails = await DoctorModel.find().lean();
        
        // Map details from DoctorModel to User objects
        const doctorsWithDetails = users.map(user => {
            const detail = doctorDetails.find(d => d.userId.toString() === user._id.toString());
            return {
                ...user,
                specialization: detail ? detail.specialization : "General Physician",
                isVerified: detail ? detail.isVerified : false
            };
        });

        res.json({
            message:"Doctors fetched",
            payload:doctorsWithDetails
        })
    }
    catch(err){
        next(err)
    }
})

// get recent users (doctors & patients)
adminRoute.get("/recent-users", async(req,res,next)=>{
    try{
        const users = await UserTypeModel.find({
            role: { $in: ["DOCTOR", "PATIENT"] }
        }).sort({ createdAt: -1 }).limit(5);

        res.json({
            message:"Recent users fetched",
            payload:users
        })
    }
    catch(err){
        next(err)
    }
})


// get active patients
adminRoute.get("/patients", async(req,res,next)=>{
    try{

        const patients = await UserTypeModel.find({
            role:"PATIENT"
        })

        res.json({
            message:"Patients fetched",
            payload:patients
        })
    }
    catch(err){
        next(err)
    }
})


// toggle doctor status
// ======================================================
// VERIFY DOCTOR BY ADMIN
// ======================================================
adminRoute.put("/doctor/:id/verify", async (req, res, next) => {
    try {
        const doctor = await DoctorModel.findById(req.params.id);
        if (!doctor) return res.status(404).json({ message: "Doctor not found" });
        doctor.isVerified = true;
        await doctor.save();
        res.json({ message: "Doctor verification completed", payload: doctor });
    } catch (err) {
        next(err);
    }
});
// toggle doctor status
adminRoute.put("/doctor/:id", async (req, res, next) => {
    try{
        const user = await UserTypeModel.findById(req.params.id);
        if(!user) return res.status(404).json({ message: "Doctor not found" });
        
        user.isActive = !user.isActive;
        await user.save();

        res.json({
            message: user.isActive ? "Doctor account activated" : "Doctor account deactivated"
        })
    }
    catch(err){
        next(err)
    }
})


// toggle patient status
adminRoute.put("/patient/:id", async(req,res,next)=>{
    try{
        const user = await UserTypeModel.findById(req.params.id);
        if(!user) return res.status(404).json({ message: "Patient not found" });
        
        user.isActive = !user.isActive;
        await user.save();

        res.json({
            message: user.isActive ? "Patient account activated" : "Patient account deactivated"
        })
    }
    catch(err){
        next(err)
    }
})

// get dashboard stats
adminRoute.get("/stats", async(req,res,next)=>{
    try{
        const totalDoctors = await UserTypeModel.countDocuments({ role: "DOCTOR" });
        const totalPatients = await UserTypeModel.countDocuments({ role: "PATIENT" });
        const totalAppointments = await AppointmentModel.countDocuments();
        const totalPrescriptions = await PrescriptionModel.countDocuments();

        res.json({
            message:"Stats fetched",
            payload: {
                totalDoctors,
                totalPatients,
                pendingVerifications: 1,
                totalAppointments,
                totalPrescriptions
            }
        })
    }
    catch(err){
        next(err)
    }
})

// get all appointments
adminRoute.get("/all-appointments", async(req,res,next)=>{
    try{
        const appointments = await AppointmentModel.find()
            .populate({
                path: "patientId",
                populate: { path: "userId", select: "name email phoneNumber" }
            })
            .populate({
                path: "doctorId",
                populate: { path: "userId", select: "name email" }
            })
            .sort({ createdAt: -1 });

        res.json({
            message:"Appointments fetched",
            payload:appointments
        })
    }
    catch(err){
        next(err)
    }
})

// get all prescriptions
adminRoute.get("/all-prescriptions", async(req,res,next)=>{
    try{
        const prescriptions = await PrescriptionModel.find()
            .populate({
                path: "patientId",
                populate: { path: "userId", select: "name email phoneNumber" }
            })
            .populate({
                path: "doctorId",
                populate: { path: "userId", select: "name email" }
            })
            .populate("appointmentId")
            .sort({ createdAt: -1 });

        res.json({
            message:"Prescriptions fetched",
            payload:prescriptions
        })
    }
    catch(err){
        next(err)
    }
})

// ======================================================
// CREATE DOCTOR BY ADMIN (DIRECT CREATION WITH CREDENTIALS)
// ======================================================
adminRoute.post("/create-doctor", async (req, res, next) => {
    try {
        const {
            name,
            email,
            password,
            phoneNumber,
            dob,
            specialization,
            experience,
            qualification,
            availableDays,
            availableTime
        } = req.body;

        // Basic validation
        if (!name || !email || !password || !phoneNumber || !dob || !specialization || !experience || !qualification || !availableDays || !availableTime) {
            return res.status(400).json({
                success: false,
                message: "All fields are required to create a verified doctor profile."
            });
        }

        // Duplicate check
        const existingUser = await UserTypeModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "A user with this email already exists."
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create User Type Model
        const userDoc = new UserTypeModel({
            name,
            email,
            password: hashedPassword,
            phoneNumber,
            role: "DOCTOR",
            isActive: true
        });
        const savedUser = await userDoc.save();

        // Create Doctor Model
        const doctorDoc = new DoctorModel({
            userId: savedUser._id,
            dob,
            specialization,
            experience: Number(experience),
            qualification,
            availableDays: Array.isArray(availableDays) ? availableDays : [availableDays],
            availableTime,
            isVerified: true // Auto-verified on direct admin creation
        });
        await doctorDoc.save();

        // Send credentials email (SMTP or development console log)
        await sendDoctorCredentials({
            email,
            name,
            password
        });

        res.status(201).json({
            success: true,
            message: "Doctor created successfully, and credentials have been sent to their email.",
            payload: {
                user: {
                    _id: savedUser._id,
                    name: savedUser.name,
                    email: savedUser.email,
                    role: savedUser.role
                },
                doctor: doctorDoc
            }
        });
    } catch (err) {
        next(err);
    }
});