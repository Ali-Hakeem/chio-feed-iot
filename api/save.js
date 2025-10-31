// api/save.js
import { supabase, reverseGeocode } from "./utils.js";

export async function saveLocation(req, res) {
  if (!req.session.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { deviceName, latitude, longitude, hostname } = req.body;
  if (!deviceName || !latitude || !longitude)
    return res.status(400).json({ error: "Missing fields" });

  const address = await reverseGeocode(latitude, longitude);
  const record = {
    device_name: deviceName,
    latitude,
    longitude,
    address,
    hostname,
    ts: new Date().toISOString(),
    user_name: req.session.user.username,
  };

  const { data, error } = await supabase.from("locations").insert(record).select();
  if (error) return res.status(500).json({ error: error.message });

  return res.status(201).json({ ok: true, data });
}
