import { supabase } from "./utils.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Nyalakan servo (true)
    await supabase.from("servo_status").update({ rotate: true }).eq("id", 1);
    console.log("🔄 Servo dinyalakan!");

    // Kirim respon langsung ke client
    res.status(200).json({ success: true, rotate: true });

    // Setelah 3 detik, matikan servo (false)
    setTimeout(async () => {
      await supabase.from("servo_status").update({ rotate: false }).eq("id", 1);
      console.log("🛑 Servo dimatikan!");
    }, 3000);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
