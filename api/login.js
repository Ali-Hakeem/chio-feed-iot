import { supabase } from "./utils.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
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
    return res.status(401).json({ success: false, message: "Invalid credentials" });
  }

  // Simulasi session: kirim username ke client
  return res.status(200).json({ success: true, user: data.username });
}
