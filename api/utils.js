// api/utils.js
import { createClient } from "@supabase/supabase-js";
import fetch from "node-fetch";

export const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

// Fungsi konversi lat/lon → alamat (pakai OpenStreetMap)
export async function reverseGeocode(lat, lon) {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1`,
      { headers: { "User-Agent": "chio-feed-iot/1.0" } }
    );
    const data = await res.json();
    return data.display_name || "Unknown address";
  } catch (err) {
    console.error("Reverse geocode error:", err);
    return "Error fetching address";
  }
}
