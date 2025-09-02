import express from "express";
import {
  signUp,
  signIn,
  verifyOTP,
  resendOtp,
  getCurrentUser,
  signOut,
} from "../controllers/authController.js";
import { verifyJWT } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/signup", signUp);
router.post("/signin", signIn);
router.post("/verify-otp", verifyOTP);
router.post("/resend-otp", resendOtp);
router.post("/signout", signOut);
router.get("/me", verifyJWT, getCurrentUser);

export default router;
