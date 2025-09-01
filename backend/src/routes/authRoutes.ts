import express from "express";
import {
  signUp,
  signIn,
  verifyOTP,
  resendOtp,
  getCurrentUser,
} from "../controllers/authController";
import { verifyJWT } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/signup", signUp);
router.post("/signin", signIn);
router.post("/verify-otp", verifyOTP);
router.post("/resend-otp", resendOtp);
router.get("/me", verifyJWT, getCurrentUser);

export default router;
