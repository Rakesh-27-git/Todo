import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/auth", // your backend URL
  withCredentials: true, // so cookies (JWT tokens) are included
});

export const signUp = async (data: {
  name: string;
  dob: Date;
  email: string;
}) => {
  const response = await API.post("/signup", data);
  return response.data;
};

export const signIn = async (data: { email: string }) => {
  const response = await API.post("/signin", data);
  return response.data;
};

export const signOut = async () => {
  const response = await API.post("/signout");
  return response.data;
};

export const verifyOtp = async (data: { email: string; otp: string }) => {
  const response = await API.post("/verify-otp", data);
  return response.data;
};

export const getCurrentUser = async () => {
  const response = await API.get("/me");
  return response.data;
};

export default API;
