import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { Request, Response } from "express";
import { generateOTP, sendOtpEmail } from "../utils/otpHelper.js";

const generateAccessAndRefreshToken = async (userId: string) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({
      validateBeforeSave: false,
    });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new Error("Token generation failed");
  }
};

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

    return res
      .status(200)
      .json({ message: "Signup successful, OTP sent", user });
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

    return res.status(200).json({ message: "OTP sent for signin", user });
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

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
      user._id as string
    );

    const isProduction = process.env.NODE_ENV === "production";
    const cookieOptions = {
      httpOnly: true,
      secure: true,
      sameSite: "none" as const, // allow cross-site cookies 
    };

    return res
      .status(200)
      .cookie("refreshToken", refreshToken, {
        ...cookieOptions,
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      })
      .cookie("accessToken", accessToken, {
        ...cookieOptions,
        maxAge: 15 * 60 * 1000, // 15 minutes
      })
      .json({
        message: "OTP verified successfully",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          dob: user.dob,
        },
        tokens: {
          accessToken,
          refreshToken,
        },
      });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "OTP verification failed", error });
  }
};



export const signOut = async (req: Request, res: Response) => {
  try {
    res.clearCookie("refreshToken");
    res.clearCookie("accessToken");
    return res.status(200).json({ message: "Signed out successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Sign out failed", error });
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

export const refreshAccessToken = async (req: Request, res: Response) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    return res.status(401).json({ message: "Unauthorized request" });
  }

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET!
    ) as jwt.JwtPayload;

    if (!decodedToken?._id) {
      return res.status(401).json({ message: "Invalid refresh token payload" });
    }

    const user = await User.findById(decodedToken._id);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    if (incomingRefreshToken !== user.refreshToken) {
      return res
        .status(401)
        .json({ message: "Refresh token expired or reused" });
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
      user._id as string
    );

    const isProduction = process.env.NODE_ENV === "production";
    const cookieOptions = {
      httpOnly: true,
      secure: isProduction,
      sameSite: "none" as const,
    };

    return res
      .status(200)
      .cookie("refreshToken", refreshToken, {
        ...cookieOptions,
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      })
      .cookie("accessToken", accessToken, {
        ...cookieOptions,
        maxAge: 15 * 60 * 1000, // 15 minutes
      })
      .json({
        message: "Access token refreshed successfully",
        accessToken,
      });
  } catch (error) {
    console.error(error);
    return res
      .status(401)
      .json({ message: "Invalid or expired refresh token" });
  }
};

export const getCurrentUser = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    res.status(200).json({
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        dob: req.user.dob,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch current user" });
  }
};
