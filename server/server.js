import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;
const DATA_FILE = path.join(__dirname, "data.json");

app.use(cors());
app.use(express.json({ limit: "10mb" }));

// Helper to ensure data file exists
function readData() {
  if (!fs.existsSync(DATA_FILE)) {
    // Return empty default or load from template
    return null;
  }
  try {
    const raw = fs.readFileSync(DATA_FILE, "utf-8");
    return JSON.parse(raw);
  } catch (err) {
    console.error("Error reading data.json:", err);
    return null;
  }
}

function writeData(data) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), "utf-8");
    return true;
  } catch (err) {
    console.error("Error writing data.json:", err);
    return false;
  }
}

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// Full data endpoint
app.get("/api/data", (req, res) => {
  const data = readData();
  if (data) {
    return res.json(data);
  }
  return res.status(404).json({ message: "No data stored yet" });
});

app.post("/api/data", (req, res) => {
  const success = writeData(req.body);
  if (success) {
    return res.json({ message: "Data saved successfully" });
  }
  return res.status(500).json({ error: "Failed to persist data" });
});

app.listen(PORT, () => {
  console.log(`Business Portal Express API running on http://localhost:${PORT}`);
});
