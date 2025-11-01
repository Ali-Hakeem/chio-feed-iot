import { getServoStatus } from "./utils.js";

export default async function handler(req, res) {
  try {
    const rotate = await getServoStatus();
    res.status(200).json({ rotate });
  } catch (err) {
    console.error("Error getting servo status:", err.message);
    res.status(500).json({ error: err.message });
  }
}
