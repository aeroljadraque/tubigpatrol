const PROXY_URL = "https://flood-proxy--aeroljadraque.replit.app/flood-level"; // <-- paste your Replit URL here

function convertFloodLevel(levelNumber) {
  switch (levelNumber) {
    case 0: return "low";       // green
    case 1: return "moderate";  // yellow
    case 2: return "high";      // orange
    case 3: return "critical";  // red
    default: return "nodata";
  }
}

function extractTimestamp(data) {
  const timeKeys = ['timestamp','time','ts','updated','updatedAt','lastSeen','last_update','measured_at','created_at'];
  for (const k of timeKeys) {
    if (data && typeof data === 'object' && k in data && data[k]) {
      return data[k];
    }
  }
  return null;
}

async function fetchFloodLevel() {
  try {
    const response = await fetch(PROXY_URL);
    const data = await response.json();
    const levelString = convertFloodLevel(Number(data.level));
    const ts = extractTimestamp(data);
    console.log("Flood Level:", data.level, "→", levelString, 'Timestamp:', ts);
    window.updateFloodMarker(levelString, ts);
  } catch (err) {
    console.error("Failed to fetch flood level:", err);
    window.updateFloodMarker("nodata", null);
  }
}

fetchFloodLevel();
setInterval(fetchFloodLevel, 15000);