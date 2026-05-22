import exp from "express"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { UserTypeModel } from "../models/UserModel.js"
import { DoctorModel } from "../models/DoctorModel.js"
import { verifyToken } from "../middleware/verifyToken.js"

export const commonRouter = exp.Router()

// LOGIN
commonRouter.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body
    const user = await UserTypeModel.findOne({ email })
    if (!user) return res.status(401).json({ message: "Invalid credentials" })

    const match = await bcrypt.compare(password, user.password)
    if (!match) return res.status(401).json({ message: "Invalid credentials" })

    const token = jwt.sign(
      { id: user._id, role: user.role, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    )

    // set cookie
    res.cookie("token", token, { httpOnly: true, sameSite: "lax" })

    res.status(200).json({
      success: true,
      message: "Login successful",
      payload: { name: user.name, email: user.email, role: user.role, token }
    })
  } catch (err) {
    next(err)
  }
})

// CHANGE PASSWORD
commonRouter.put("/change-password", verifyToken("ADMIN","DOCTOR","PATIENT"), async (req, res, next) => {
  try {
    const { email, currentPassword, newPassword } = req.body
    const user = await UserTypeModel.findOne({ email })
    if (!user) return res.status(404).json({ message: "User not found" })

    const match = await bcrypt.compare(currentPassword, user.password)
    if (!match) return res.status(401).json({ message: "Current password incorrect" })

    user.password = await bcrypt.hash(newPassword, 10)
    await user.save()

    res.status(200).json({ message: "Password updated successfully" })
  } catch (err) {
    next(err)
  }
})

commonRouter.get("/doctors", async (req, res, next) => {
  try {
    // fetch all doctors + populate user info
    const doctors = await DoctorModel.find().populate("userId")

    // only include active users
    const activeDoctors = doctors.filter(doc => doc.userId?.isActive)

    res.status(200).json({
      message: "Doctors fetched successfully",
      payload: activeDoctors
    })
  } catch (err) {
    next(err)
  }
})

// LOGOUT
commonRouter.get("/logout", (req, res) => {

  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "lax",
    secure: false
  });

  res.status(200).json({
    message: "Logged out successfully"
  });
});

