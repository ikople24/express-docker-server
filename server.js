const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("✅ Server is running (Docker)");
});

const PORT = process.env.PORT || 3004;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});