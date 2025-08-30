import nodemailer from "nodemailer";

// generate 6-digit OTP
export const generateOTP = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

// send OTP email
export const sendOtpEmail = async (email: string, otp: string) => {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: email,
    subject: "Your OTP Code",
    text: `Your OTP is ${otp}. It is valid for 5 minutes.`,
  };

  await transporter.sendMail(mailOptions);
};
