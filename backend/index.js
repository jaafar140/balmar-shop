const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Route test
app.get("/", (req, res) => {
  res.json({ message: "Backend is running successfully 🚀" });
});

// Exemple API route
app.get("/api/test", (req, res) => {
  res.json({ success: true, message: "API works!" });
});

// Port obligatoire pour Render
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
