import { createClient } from "@supabase/supabase-js";
import fetch from "node-fetch"; // tambahan

export const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

export async function reverseGeocode(lat, lon) {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
    );
    const data = await res.json();
    return data.display_name || "Unknown location";
  } catch (e) {
    console.error("Reverse geocode failed:", e);
    return "Unknown location";
  }
}
