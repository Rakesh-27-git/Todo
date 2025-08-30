import { Request, Response } from "express";
import User from "../models/User";
import jwt from "jsonwebtoken";
import { generateOTP, sendOtpEmail } from "../utils/otpHelper";

// Signup
export const signUp = async (req: Request, res: Response) => {
  try {
    const { name, dob, email } = req.body;

    if (!name || !dob || !email) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 5 * 60 * 1000);

    const user = new User({ name, dob, email, otp, otpExpires });
    await user.save();

    await sendOtpEmail(email, otp);

    return res.status(200).json({ message: "Signup successful, OTP sent" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Signup failed", error });
  }
};

// Signin
export const signIn = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const otp = generateOTP();
    user.otp = otp;
    user.otpExpires = new Date(Date.now() + 5 * 60 * 1000);
    await user.save();

    await sendOtpEmail(email, otp);

    return res.status(200).json({ message: "OTP sent for signin" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Signin failed", error });
  }
};

//  Verify OTP (for both signup & signin)
export const verifyOTP = async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (!user.otpExpires || user.otpExpires < new Date()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    // Clear OTP
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    // Issue JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, {
      expiresIn: "1d",
    });

    return res.status(200).json({
      message: "OTP verified successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        dob: user.dob,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "OTP verification failed", error });
  }
};

//  Resend OTP
export const resendOtp = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate new OTP
    const otp = generateOTP();
    user.otp = otp;
    user.otpExpires = new Date(Date.now() + 5 * 60 * 1000);
    await user.save();

    await sendOtpEmail(email, otp);

    return res.status(200).json({ message: "New OTP sent successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to resend OTP", error });
  }
};
