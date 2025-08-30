import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  dob: Date;
  email: string;
  otp?: string;
  otpExpires?: Date;
  googleId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    dob: { type: Date, required: true },
    email: { type: String, required: true, unique: true },
    otp: { type: String },
    otpExpires: { type: Date },
    googleId: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model<IUser>("User", UserSchema);
