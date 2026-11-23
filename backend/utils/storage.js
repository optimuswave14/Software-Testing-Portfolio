const fs = require("fs");
const path = require("path");

const DATA_DIR = path.join(__dirname, "..", "data");
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

function readData(file, fallback = []) {
  const filePath = path.join(DATA_DIR, file);
  if (!fs.existsSync(filePath)) return fallback;
  try { return JSON.parse(fs.readFileSync(filePath, "utf8")); }
  catch { return fallback; }
}

function writeData(file, value) {
  fs.writeFileSync(path.join(DATA_DIR, file), JSON.stringify(value, null, 2));
}

module.exports = { readData, writeData };
