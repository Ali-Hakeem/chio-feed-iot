import { supabase } from "./utils.js";

export default async function handler(req, res) {
  console.log("📩 /api/login hit, method:", req.method);

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { username, password } = req.body || {};
  if (!username || !password) {
    return res.status(400).json({ success: false, message: "Missing fields" });
  }

  const { data, error } = await supabase
    .from("login")
    .select("*")
    .eq("username", username)
    .eq("password", password)
    .single();

  if (error || !data) {
    console.error("Login gagal:", error);
    return res.status(401).json({ success: false });
  }

  // kirim respons sukses
  return res.status(200).json({ success: true, username: data.username });
}
