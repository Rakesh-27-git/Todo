import jwt, { SignOptions } from "jsonwebtoken";
import type { StringValue } from "ms";
import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  dob: Date;
  email: string;
  otp?: string;
  otpExpires?: Date;
  googleId?: string;
  refreshToken?: string;
  createdAt: Date;
  updatedAt: Date;
  generateAccessToken: () => string;
  generateRefreshToken: () => string;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    dob: { type: Date, required: true },
    email: { type: String, required: true, unique: true },
    otp: { type: String },
    otpExpires: { type: Date },
    googleId: { type: String },
    refreshToken: { type: String },
  },
  { timestamps: true }
);


UserSchema.methods.generateAccessToken = function (): string {
  const options: SignOptions = {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRY as StringValue || "15m",
  };

  return jwt.sign(
    { _id: this._id, email: this.email },
    process.env.ACCESS_TOKEN_SECRET as string,
    options
  );
};

UserSchema.methods.generateRefreshToken = function (): string {
  const options: SignOptions = {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRY as StringValue || "7d",
  };

  return jwt.sign(
    { _id: this._id },
    process.env.REFRESH_TOKEN_SECRET as string,
    options
  );
};

export default mongoose.model<IUser>("User", UserSchema);
