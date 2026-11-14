const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "change-moi";
const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, "data");
const GAMES_FILE = path.join(DATA_DIR, "games.json");
const UPLOAD_DIR = path.join(DATA_DIR, "games");

fs.mkdirSync(UPLOAD_DIR, { recursive: true });
if (!fs.existsSync(GAMES_FILE)) fs.writeFileSync(GAMES_FILE, "[]");

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

function readGames() {
  try { return JSON.parse(fs.readFileSync(GAMES_FILE, "utf8")); }
  catch { return []; }
}
function writeGames(games) {
  fs.writeFileSync(GAMES_FILE, JSON.stringify(games, null, 2));
}
function requireAdmin(req, res, next) {
  const token = req.headers.authorization || "";
  if (token !== `Bearer ${ADMIN_PASSWORD}`) {
    return res.status(401).json({ error: "Mot de passe administrateur incorrect." });
  }
  next();
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
  filename: (_req, file, cb) => {
    const safe = file.originalname.replace(/[^a-zA-Z0-9._-]/g, "_");
    cb(null, `${Date.now()}-${safe}`);
  }
});
const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (![".iso", ".cso"].includes(ext)) return cb(new Error("Seuls les fichiers .iso et .cso sont acceptés."));
    cb(null, true);
  }
});

app.get("/api/games", (_req, res) => {
  res.json(readGames().map(({ id, title, description, filename, size, createdAt }) =>
    ({ id, title, description, filename, size, createdAt,
       downloadUrl: `/download/${encodeURIComponent(filename)}` })));
});

app.post("/api/games", requireAdmin, upload.single("gameFile"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "Choisis un fichier ISO ou CSO." });
  const title = String(req.body.title || "").trim();
  if (!title) {
    fs.unlinkSync(req.file.path);
    return res.status(400).json({ error: "Le titre du jeu est obligatoire." });
  }
  const games = readGames();
  const game = {
    id: Date.now().toString(),
    title,
    description: String(req.body.description || "").trim(),
    filename: req.file.filename,
    size: req.file.size,
    createdAt: new Date().toISOString()
  };
  games.unshift(game);
  writeGames(games);
  res.status(201).json({ message: "Jeu publié.", game });
});

app.delete("/api/games/:id", requireAdmin, (req, res) => {
  const games = readGames();
  const game = games.find(g => g.id === req.params.id);
  if (!game) return res.status(404).json({ error: "Jeu introuvable." });
  const filePath = path.join(UPLOAD_DIR, path.basename(game.filename));
  if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  writeGames(games.filter(g => g.id !== req.params.id));
  res.json({ message: "Jeu supprimé." });
});

app.get("/download/:filename", (req, res) => {
  const filename = path.basename(req.params.filename);
  const filePath = path.join(UPLOAD_DIR, filename);
  if (!fs.existsSync(filePath)) return res.status(404).send("Fichier introuvable.");
  res.download(filePath);
});

app.get("*", (_req, res) => res.sendFile(path.join(__dirname, "public", "index.html")));

app.use((err, _req, res, _next) => {
  res.status(400).json({ error: err.message || "Une erreur est survenue." });
});

app.listen(PORT, () => console.log(`GAME PSP DOWNLOAD lancé sur le port ${PORT}`));
