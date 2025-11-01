import { setServoStatus } from "./utils.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Aktifkan servo
    await setServoStatus(true);
    console.log("✅ Servo ON");

    // Kirim respon ke client dulu
    res.status(200).json({ success: true, rotate: true });

    // Nonaktifkan servo setelah 3 detik
    setTimeout(async () => {
      try {
        await setServoStatus(false);
        console.log("🛑 Servo OFF");
      } catch (err) {
        console.error("Gagal mematikan servo:", err.message);
      }
    }, 3000);
  } catch (error) {
    console.error("Error updating servo:", error.message);
    res.status(500).json({ error: error.message });
  }
}
