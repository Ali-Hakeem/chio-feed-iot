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
  if (!req.session.user) {
    if (req.originalUrl.startsWith("/api")) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    return res.redirect("/login");
  }
  next();
}

// === Servo state ===
let servoAction = false;

// === ROUTES ===
app.get(["/", "/login"], (req, res) => {
  // jika sudah login, langsung ke dashboard
  if (req.session.user) {
    return res.redirect("/dashboard.html");
  }
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// === API LOGIN ===
app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;

  const { data, error } = await supabase
    .from("login")
    .select("*")
    .eq("username", username)
    .eq("password", password)
    .single();

  if (error || !data) {
    console.log("Login gagal untuk", username);
    return res.status(401).json({ success: false, message: "Login gagal" });
  }

  req.session.user = { username: data.username, role: data.role };
  res.json({ success: true });
});

// === LOGOUT ===
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

// === Export (agar bisa dipakai di Vercel) ===
export default app;

// === Hanya aktif saat dijalankan lokal ===
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () =>
    console.log(`✅ Server running locally on http://localhost:${PORT}`)
  );
}
