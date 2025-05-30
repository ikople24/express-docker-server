// scripts/updateComplaintId.js
const { MongoClient } = require("mongodb");
require("dotenv").config(); // โหลดจาก .env ถ้ามี

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017";
const DB_NAME = "db_namphrae"; // แก้เป็นชื่อจริง

(async () => {
  const client = new MongoClient(MONGO_URI);

  try {
    await client.connect();
    const db = client.db(DB_NAME);
    const collection = db.collection("submittedreports");

    // หาค่าเลขที่ complaintId ที่มีอยู่สูงสุด
    const existingDocs = await collection
      .find({ complaintId: { $exists: true } })
      .toArray();

    const maxId = existingDocs
      .map(doc => parseInt((doc.complaintId || "").split("-")[1]))
      .filter(n => !isNaN(n))
      .sort((a, b) => b - a)[0] || 0;

    const reports = await collection
      .find({ complaintId: { $exists: false } })
      .toArray();

    console.log(`🔎 Found ${reports.length} reports without complaintId`);

    for (let i = 0; i < reports.length; i++) {
      const doc = reports[i];
      const newNumber = String(maxId + i + 1).padStart(6, "0");
      const newId = `CMP-${newNumber}`;

      await collection.updateOne(
        { _id: doc._id },
        { $set: { complaintId: newId } }
      );

      console.log(`✅ Updated _id: ${doc._id} with complaintId: ${newId}`);
    }

    console.log("🎉 Update completed!");
  } catch (err) {
    console.error("❌ Error updating complaint IDs:", err);
  } finally {
    await client.close();
  }
})();