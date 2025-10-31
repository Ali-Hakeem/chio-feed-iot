import { setServoState } from "./status.js";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  setServoState(true);
  console.log("🔄 Servo dipicu!");

  // reset state setelah 3 detik, serverless mungkin tidak berjalan lama, gunakan cache/db jika perlu persist
  setTimeout(() => {
    setServoState(false);
    console.log("🛑 Servo berhenti!");
  }, 3000);

  res.json({ success: true, rotate: true });
}
