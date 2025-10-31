import { supabase, reverseGeocode } from "./utils.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { username, password, deviceName, latitude, longitude, ts } = req.body;

    if (!username || !password)
      return res.status(401).json({ error: "Unauthorized: username & password required" });

    // validasi login dari tabel `login`
    const { data: user, error: userErr } = await supabase
      .from("login")
      .select("*")
      .eq("username", username)
      .eq("password", password)
      .maybeSingle();

    if (userErr || !user)
      return res.status(401).json({ error: "Unauthorized: invalid credentials" });

    if (!deviceName || !latitude || !longitude)
      return res.status(400).json({ error: "Missing deviceName, latitude, or longitude" });

    // konversi lat lon jadi alamat
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

    return res.status(201).json({
      ok: true,
      user: username,
      inserted: data[0],
    });
  } catch (err) {
    console.error("API save error:", err);
    return res.status(500).json({ error: "Internal server error", details: err.message });
  }
}
