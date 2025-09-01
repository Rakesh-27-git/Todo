import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api", // your backend URL
  withCredentials: true, // so cookies (JWT tokens) are included
});

export const signUp = async (data: {
  name: string;
  dob: Date;
  email: string;
}) => {
  const response = await API.post("/auth/signup", data);
  return response.data;
};

export const signIn = async (data: { email: string }) => {
  const response = await API.post("/auth/signin", data);
  return response.data;
};

export const verifyOtp = async (data: { email: string; otp: string }) => {
  const response = await API.post("/auth/verify-otp", data);
  return response.data;
};

export default API;
