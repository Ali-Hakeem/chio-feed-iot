import { setServoStatus } from "./utils.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    console.log("⏳ Auto reset request received...");
    await setServoStatus(false);
    console.log("🛑 Servo status reset to false.");
    res.status(200).json({ success: true });
  } catch (err) {
    console.error("❌ Error resetting servo:", err.message);
    res.status(500).json({ error: err.message });
  }
}
