import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

// layani file di folder public
app.use(express.static(path.join(__dirname, "public")));

let ledState = false;

app.get("/api/status", (req, res) => {
  res.json({ led: ledState });
});

app.post("/api/toggle", (req, res) => {
  const { state } = req.body;
  ledState = !!state;
  res.json({ success: true, led: ledState });
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));
