import { setServoState } from "./status.js";

export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  setServoState(true);
  console.log("🔄 Servo dipicu!");
  setTimeout(() => {
    setServoState(false);
    console.log("🛑 Servo berhenti!");
  }, 3000);

  res.json({ success: true, rotate: true });
}
