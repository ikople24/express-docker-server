const mongoose = require("mongoose");
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  });

// ข้างบนสุด
const express = require("express");
const app = express();
app.use(express.json()); // รองรับ JSON body

app.use((req, res, next) => {
  const allowedOrigins = [
    "http://localhost:3004",
    "https://www.smart-namphrae.app"
  ];
  const origin = req.headers.origin || "";

  if (origin && !allowedOrigins.includes(origin)) {
    return res.status(403).json({ error: "Access denied: Origin not allowed" });
  }

  next();
});

// 🔹 Route เริ่มต้น
app.get("/", (req, res) => {
  res.send("✅ Server is running (Docker)");
});

// 🔹 GET /api/hello → ทดสอบรับข้อความ
app.get("/api/hello", (req, res) => {
  res.json({ message: "👋 Hello from server!" });
});

// 🔹 POST /api/echo → ทดสอบรับ body แล้วส่งกลับ
app.post("/api/echo", (req, res) => {
  const data = req.body;
  res.json({ received: data });
});

// เริ่มฟังที่ port
const PORT = process.env.PORT || 3004;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});