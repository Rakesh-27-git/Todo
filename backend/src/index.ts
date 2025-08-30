import express from "express";
import cors from "cors";
import { connectDB } from "./db/index";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Simple route
app.get("/", (req, res) => {
  res.send("Hello World with MongoDB connection setup!");
});

// Connect DB & start server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
});
