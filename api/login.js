import { supabase } from "./utils.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  try {
    const { username, password } = req.body;

    const { data, error } = await supabase
      .from("login")
      .select("*")
      .eq("username", username)
      .eq("password", password)
      .maybeSingle();

    if (error || !data) {
      return res.status(401).json({ success: false, message: "Login gagal" });
    }

    // Buat cookie sederhana
    const token = Buffer.from(`${username}:${Date.now()}`).toString("base64");
    res.setHeader(
      "Set-Cookie",
      `session=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=3600`
    );

    res.setHeader("Content-Type", "application/json");
    res.status(200).json({ success: true });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: err.message });
  }
}
