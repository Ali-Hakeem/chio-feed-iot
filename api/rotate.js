let servoAction = false;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  servoAction = true;
  console.log("🔄 Servo dipicu!");
  setTimeout(() => {
    servoAction = false;
    console.log("🛑 Servo berhenti!");
  }, 3000);

  res.status(200).json({ success: true, rotate: true });
}
