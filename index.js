import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// status LED global
let ledState = false;

// Endpoint untuk melihat status LED
app.get("/api/status", (req, res) => {
  res.json({ led: ledState });
});

// Endpoint untuk mengubah status LED (nyala/mati)
app.post("/api/toggle", (req, res) => {
  const { state } = req.body; // true / false
  ledState = !!state;
  res.json({ success: true, led: ledState });
});

// Jalankan server (Vercel otomatis handle port)
app.listen(3000, () => console.log("Server running on port 3000"));

export default app;
