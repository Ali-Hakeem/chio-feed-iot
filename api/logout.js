export default function handler(req, res) {
    res.setHeader("Set-Cookie", "session=; Path=/; Max-Age=0");
    res.json({ success: true });
  }
  