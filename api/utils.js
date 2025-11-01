import { createClient } from "@supabase/supabase-js";

// === Supabase client setup ===
export const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

// === Fungsi reverse geocode (opsional untuk data lokasi ESP32) ===
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

    if (!res.ok || !data.display_name) {
      console.warn("Reverse geocode response missing display_name:", data);
      return "Unknown location";
    }

    return data.display_name;
  } catch (e) {
    console.error("Reverse geocode failed:", e);
    return "Unknown location";
  }
}

// === Fungsi helper untuk update dan baca status servo ===
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
  const { error } = await supabase
    .from("servo_status")
    .update({ rotate: value })
    .eq("id", 1);
  if (error) throw error;
}
