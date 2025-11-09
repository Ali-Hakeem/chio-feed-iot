import fetch from "node-fetch";
import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

export async function reverseGeocode(lat, lon) {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`,
      {
        headers: {
          "User-Agent": "chio-feed-iot/1.0 (contact: youremail@example.com)",
        },
      }
    );
    const data = await res.json();
    if (!res.ok || !data.display_name) return "Unknown location";
    return data.display_name;
  } catch {
    return "Unknown location";
  }
}

export async function getServoStatus() {
  const { data, error } = await supabase
    .from("servo_status")
    .select("rotate")
    .eq("id", 1)
    .single();
  if (error) throw error;
  return data?.rotate || false;
}

export async function setServoStatus(value) {
  const { data, error } = await supabase
    .from("servo_status")
    .update({ rotate: value })
    .eq("id", 1)
    .select("rotate");
  if (error) throw error;
  return data?.[0]?.rotate;
}
