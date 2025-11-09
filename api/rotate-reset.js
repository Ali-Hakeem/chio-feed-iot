import { setServoStatus, getServoStatus } from "./utils.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const current = await getServoStatus();
    if (current === false) {
      console.log("⚙️ Servo sudah OFF, reset diabaikan");
      return res.status(200).json({ success: true, message: "Already OFF" });
    }

    await setServoStatus(false);
    console.log("🛑 Servo OFF (reset otomatis dari web/ESP32)");
    res.status(200).json({ success: true });
  } catch (err) {
    console.error("❌ Error reset servo:", err.message);
    res.status(500).json({ error: err.message });
  }
}
