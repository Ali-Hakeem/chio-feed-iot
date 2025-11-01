import { supabase } from "./utils.js";

export default async function handler(req, res) {
  try {
    const { data, error } = await supabase
      .from("servo_status")
      .select("rotate")
      .eq("id", 1)
      .single();

    if (error) throw error;

    res.status(200).json({ rotate: data?.rotate || false });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
