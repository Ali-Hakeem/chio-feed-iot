import { supabase } from "./utils.js";

export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  const { username, password } = req.body;

  const { data, error } = await supabase
    .from("login")
    .select("*")
    .eq("username", username)
    .eq("password", password)
    .maybeSingle();

  if (error || !data)
    return res.status(401).json({ success: false, message: "Login gagal" });

  // Generate token sederhana
  const token = Buffer.from(`${username}:${Date.now()}`).toString("base64");

  // Simpan cookie session
  res.setHeader(
    "Set-Cookie",
    `session=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=3600`
  );

  return res.json({ success: true, username: data.username });
}
