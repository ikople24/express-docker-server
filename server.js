require("dotenv").config(); // เพิ่มบรรทัดนี้ไว้บนสุด
const mongoose = require("mongoose");
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("❌ Missing MONGO_URI env");
  process.exit(1);
}

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

app.use("/api/menu", require("./routes/menuRoutes"));
app.use("/api/problems", require("./routes/problemOptions"));

app.use((req, res, next) => {
  const allowedOrigins = [
    "http://localhost:3004",
    "https://www.smart-namphrae.app",
    "https://express-docker-server-production.up.railway.app",
  ];
  const origin = req.headers.origin || "";

  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  } else if (origin) {
    return res.status(403).json({ error: "Access denied: Origin not allowed" });
  }

  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
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