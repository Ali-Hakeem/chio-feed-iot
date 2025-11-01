import { supabase, reverseGeocode } from "./utils.js";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const { username, password, deviceName, latitude, longitude, ts } = req.body;

    if (!username || !password)
      return res.status(401).json({ error: "Username & password required" });

    const { data: user, error: userErr } = await supabase
      .from("login")
      .select("*")
      .eq("username", username)
      .eq("password", password)
      .maybeSingle();

    if (userErr || !user)
      return res.status(401).json({ error: "Invalid credentials" });

    if (!deviceName || !latitude || !longitude)
      return res.status(400).json({ error: "Missing deviceName, latitude, or longitude" });

    // ================================
    // Cek jumlah login hari ini (maks 3x)
    // ================================
    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
    const { count: loginCount, error: countErr } = await supabase
      .from("locations")
      .select("*", { count: "exact" })
      .eq("username", username)
      .gte("ts", `${today}T00:00:00Z`)
      .lte("ts", `${today}T23:59:59Z`);

    if (countErr) throw countErr;

    if (loginCount >= 3) {
      return res.status(403).json({ ok: false, error: "Maksimal login 3x per hari" });
    }

    // ================================
    // Simpan lokasi
    // ================================
    const address = await reverseGeocode(latitude, longitude);

    const record = {
      device_name: deviceName,
      latitude,
      longitude,
      address,
      username,
      ts: ts || new Date().toISOString(),
    };

    const { data, error } = await supabase.from("locations").insert(record).select();
    if (error) throw error;

    return res.status(201).json({ ok: true, user: username, inserted: data[0] });
  } catch (err) {
    console.error("Save error:", err);
    return res.status(500).json({ error: "Internal server error", details: err.message });
  }
}
