import { setServoStatus } from "./utils.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    await setServoStatus(true);
    console.log("🔄 Servo dinyalakan!");
    res.status(200).json({ success: true, rotate: true });

    // Otomatis reset ke false setelah 3 detik
    setTimeout(async () => {
      await setServoStatus(false);
      console.log("🛑 Servo dimatikan!");
    }, 3000);
  } catch (error) {
    console.error("Rotate error:", error);
    res.status(500).json({ error: error.message });
  }
}
