import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectDB } from "./db/index";
import authRoutes from "./routes/authRoutes";
import noteRoutes from "./routes/noteRoutes";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: "http://localhost:5173", // your frontend URL
    credentials: true, // allow cookies
  })
);
app.use(cookieParser());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/notes", noteRoutes);

// Connect DB & start server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
});
