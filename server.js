require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// ✅ MongoDB Connection
console.log("Connecting to MongoDB...");
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => console.error("❌ MongoDB connection error:", err.message));

// ✅ Define Schema
const upiSchema = new mongoose.Schema(
  {
    upi_id: { type: String, required: true, unique: true, index: true },
    first_seen: { type: Date, default: Date.now },
    last_seen: { type: Date, default: Date.now },
    seen_count: { type: Number, default: 1 },
  },
  { collection: "game_upi_id" } // custom collection name
);

// ✅ Create Model
const Upi = mongoose.model("Upi", upiSchema);

// ✅ Root test route
app.get("/", (req, res) => {
  console.log("🌐 GET / called — Server is running fine");
  res.send("🚀 UPI Tracker Server is running...");
});

// ✅ API: Insert / Check / Update
app.post("/upi", async (req, res) => {
  console.log("📥 Incoming request:", req.body);

  try {
    const { upi_id } = req.body;

    if (!upi_id) {
      console.warn("⚠️ Missing upi_id in request body");
      return res.status(400).json({ error: "upi_id is required" });
    }

    console.log(`🔍 Searching for UPI ID: ${upi_id}`);

    let record = await Upi.findOne({ upi_id });

    if (!record) {
      console.log(`🆕 Creating new record for ${upi_id}`);
      record = await Upi.create({
        upi_id,
        first_seen: new Date(),
        last_seen: new Date(),
        seen_count: 1,
      });
    } else {
      console.log(`♻️ Updating record for ${upi_id}`);
      record.last_seen = new Date();
      record.seen_count += 1;
      await record.save();
    }

    console.log("✅ Final record:", record);

    // Respond with record
    res.json({
      upi_id: record.upi_id,
      first_seen: record.first_seen,
      last_seen: record.last_seen,
      seen_count: record.seen_count,
    });
  } catch (error) {
    console.error("❌ Error while processing /upi:", error);
    res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
});

// ✅ Start Server
const PORT = process.env.PORT || 5500;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
