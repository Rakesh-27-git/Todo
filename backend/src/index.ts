import express from "express";
import cors from "cors";
import { connectDB } from "./db/index";
import authRoutes from "./routes/authRoutes";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);

// Connect DB & start server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
});
