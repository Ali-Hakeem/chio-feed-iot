import { supabase } from "./utils.js";

export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  const { username, password } = req.body;

  try {
    const { data, error } = await supabase
      .from("login")
      .select("*")
      .eq("username", username)
      .eq("password", password)
      .maybeSingle(); // aman jika tidak ada data

    if (error || !data)
      return res.status(401).json({ success: false, message: "Login gagal" });

    const token = Buffer.from(`${username}:${Date.now()}`).toString("base64");
    res.setHeader(
      "Set-Cookie",
      `session=${token}; Path=/; HttpOnly; ${process.env.NODE_ENV === "production" ? "Secure;" : ""} SameSite=Strict`
    );

    return res.json({ success: true, username: data.username });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
