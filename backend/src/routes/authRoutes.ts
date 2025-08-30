import express from "express";
import { signUp, signIn, verifyOTP, resendOtp } from "../controllers/authController";

const router = express.Router();

router.post("/signup", signUp);
router.post("/signin", signIn);
router.post("/verify-otp", verifyOTP);
router.post("/resend-otp", resendOtp);

export default router;
