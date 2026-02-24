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
  const timeKeys = [
  'lastUpdate', 'last_updated', 'lastupdated', 'lastUpdated',
  'timestamp','time','ts',
  'updated','updatedAt','updated_at',
  'lastSeen','last_update','measured_at','created_at'
];
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

    // ✅ NEW: treat offline OR null/undefined level as NO DATA
    const isOffline = data && (data.offline === true);
    const levelValue = (data && data.level !== null && data.level !== undefined)
      ? Number(data.level)
      : null;

    const levelString = (isOffline || levelValue === null || Number.isNaN(levelValue))
      ? "nodata"
      : convertFloodLevel(levelValue);

    const ts = extractTimestamp(data);

    console.log("Flood Level:", data.level, "offline:", data.offline, "→", levelString, "Timestamp:", ts);
    window.updateFloodMarker(levelString, ts);
  } catch (err) {
    console.error("Failed to fetch flood level:", err);
    window.updateFloodMarker("nodata", null);
  }
}

fetchFloodLevel();
setInterval(fetchFloodLevel, 15000);