import { supabase } from "./utils.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { deviceName, latitude, longitude, username } = req.body;

  if (!deviceName || !latitude || !longitude) {
    return res.status(400).json({ error: "Missing fields" });
  }

  const address = `Lat ${latitude}, Lon ${longitude}`; // ganti nanti dengan reverse geocode

  const { data, error } = await supabase
    .from("locations")
    .insert({
      device_name: deviceName,
      latitude,
      longitude,
      address,
      user_name: username,
      ts: new Date().toISOString(),
    })
    .select();

  if (error) return res.status(500).json({ error: "Database error", details: error });

  res.status(201).json({ success: true, data });
}
