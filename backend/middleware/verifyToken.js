import jwt from "jsonwebtoken"
import { config } from "dotenv"
config()

export const verifyToken = (...allowedRoles) => {
  return async (req, res, next) => {
    try {
      const token =
        req.cookies?.token ||
        req.headers.authorization?.split(" ")[1]

      if (!token) {
        return res.status(401).json({
          message: "Unauthorized. Please login"
        })
      }

      const decodedToken = jwt.verify(token, process.env.JWT_SECRET)

      if (!allowedRoles.includes(decodedToken.role)) {
        return res.status(403).json({
          message: "Forbidden. No permission"
        })
      }

      req.user = decodedToken
      next()

    } catch (err) {

      if (err.name === "TokenExpiredError") {
        return res.status(401).json({
          message: "Session expired. Login again"
        })
      }

      if (err.name === "JsonWebTokenError") {
        return res.status(401).json({
          message: "Invalid token"
        })
      }

      // 🔥 THIS WAS MISSING (MAIN FIX)
      return res.status(500).json({
        message: "Auth error",
        error: err.message
      })
    }
  }
}