let servoAction = false;

export default async function handler(req, res) {
  if (req.method === "GET") {
    return res.status(200).json({ rotate: servoAction });
  }
  res.status(405).json({ error: "Method not allowed" });
}

export { servoAction };
