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

async function fetchFloodLevel() {
  try {
    const response = await fetch(PROXY_URL);
    const data = await response.json();

    const levelString = convertFloodLevel(Number(data.level));
    console.log("Flood Level:", data.level, "→", levelString);

    // Uses your existing map.js function
    window.updateFloodMarker(levelString);
  } catch (err) {
    console.error("Failed to fetch flood level:", err);
    window.updateFloodMarker("nodata");
  }
}

fetchFloodLevel();
setInterval(fetchFloodLevel, 15000);