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

// status servo (false = diam, true = berputar)
let servoAction = false;

// untuk ESP32 mengecek status
app.get("/api/status", (req, res) => {
  res.json({ rotate: servoAction });
});

// tombol di web memicu servo
app.post("/api/rotate", (req, res) => {
  servoAction = true;
  // reset otomatis ke false setelah 3 detik
  setTimeout(() => (servoAction = false), 3000);
  res.json({ success: true, rotate: true });
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));
