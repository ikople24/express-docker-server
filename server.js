require("dotenv").config(); // เพิ่มบรรทัดนี้ไว้บนสุด

const { Clerk } = require('@clerk/clerk-sdk-node');
Clerk({ apiKey: process.env.CLERK_SECRET_KEY });

// ข้างบนสุด
const express = require("express");
const morgan = require("morgan");
const app = express();
app.use(express.json()); // รองรับ JSON body
app.use(morgan("dev")); // morgan สำหรับ log HTTP requests

app.use((req, res, next) => {
  const appId = req.headers['x-app-id'];
  if (!appId) return res.status(400).json({ error: "Missing x-app-id in request headers" });

  const upperAppId = appId.toUpperCase();
  const uri = process.env[`MONGO_URI_${upperAppId}`];
  if (!uri) {
    return res.status(500).json({ error: `MONGO_URI_${upperAppId} not found in environment variables` });
  }

  // Optionally, attach app-specific info to the request
  req.appId = appId;
  req.mongoUri = uri;

  next();
});

app.use((req, res, next) => {
  const origin = req.headers.origin || "";
  res.setHeader("Access-Control-Allow-Origin", origin);
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, x-app-id");

  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  next();
});

app.use("/api/menu", require("./routes/menuRoutes"));
app.use("/api/problem-options", require("./routes/problemOptions"));
app.use("/api/users", require("./routes/users"));
app.use("/api/complaints", require("./routes/submittedreports"));
app.use("/api/assignments", require("./routes/assignments"));
app.use('/api/admin-options', require("./routes/adminOptions"));


// 🔹 Route เริ่มต้น
app.get("/", (req, res) => {
  res.send("✅ Server is running (Docker)");
});

// 🔹 GET /api/hello → ทดสอบรับข้อความ
app.get("/api/hello", (req, res) => {
  const appId = req.headers["x-app-id"];

  if (appId === "app_a") {
    return res.json({ message: "👋 Hello from เส้น A" });
  } else if (appId === "app_b") {
    return res.json({ message: "👋 Hello from เส้น B" });
  } else {
    return res.status(400).json({ error: "Unknown app-id" });
  }
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