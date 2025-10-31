import express from "express";
import session from "express-session";
import path from "path";
import bodyParser from "body-parser";
import { fileURLToPath } from "url";
import { supabase } from "./api/utils.js";
import { saveLocation } from "./api/save.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  session({
    secret: process.env.SESSION_SECRET || "chiosecret",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 },
  })
);

// === Static files ===
app.use(express.static(path.join(__dirname, "public")));

// === Login middleware ===
function requireLogin(req, res, next) {
  if (!req.session.user) return res.redirect("/login");
  next();
}

// === Servo state ===
let servoAction = false;

// === ROUTES ===
app.get(["/", "/login"], (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const { data, error } = await supabase
    .from("login")
    .select("*")
    .eq("username", username)
    .eq("password", password)
    .single();

  if (error || !data) {
    return res.status(401).send("<h3>Login gagal. <a href='/login'>Coba lagi</a></h3>");
  }

  req.session.user = { username: data.username, role: data.role };
  res.redirect("/dashboard.html");
});

app.get("/logout", (req, res) => {
  req.session.destroy(() => res.redirect("/login"));
});

// === API untuk ESP32 ===
app.get("/api/status", (req, res) => {
  res.json({ rotate: servoAction });
});

// === API tombol putar (web) ===
app.post("/api/rotate", requireLogin, (req, res) => {
  servoAction = true;
  console.log("🔄 Servo dipicu!");
  setTimeout(() => {
    servoAction = false;
    console.log("🛑 Servo berhenti!");
  }, 3000);
  res.json({ success: true, rotate: true });
});

// === API simpan lokasi ===
app.post("/api/save", requireLogin, saveLocation);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
