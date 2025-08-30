import express from "express";

const app = express();
const PORT = process.env.PORT || 5000;

// Simple route
app.get("/", (req, res) => {
  res.send("Hello World from Express + TypeScript!");
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
