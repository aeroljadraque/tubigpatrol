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
    console.log('Raw flood API response:', data);

    // Determine if the device/server reports being offline or returns no usable level
    let levelString = 'nodata';
    let resolvedTimestamp = null;

    // If the API provides an explicit connectivity/status flag, respect it
    if (data && typeof data === 'object') {
      if (('connected' in data && data.connected === false) ||
          ('online' in data && data.online === false) ||
          ('status' in data && (data.status === 'offline' || data.status === 'no data' || data.status === 'nodata'))) {
        levelString = 'nodata';
      } else {
        // Check for timestamp/age indicators to avoid showing stale readings
        const timeKeys = ['timestamp','time','ts','updated','updatedAt','lastSeen','last_update','measured_at','created_at'];
        let readingTs = null;
        for (const k of timeKeys) {
          if (k in data && data[k]) {
            readingTs = data[k];
            break;
          }
        }

        if (readingTs) {
          let parsed = null;
          // numeric epoch (seconds or ms)
          if (typeof readingTs === 'number') {
            parsed = (readingTs > 1e12) ? new Date(readingTs) : new Date(readingTs * 1000);
          } else if (typeof readingTs === 'string') {
            const asNum = Number(readingTs);
            if (!Number.isNaN(asNum)) {
              parsed = (asNum > 1e12) ? new Date(asNum) : new Date(asNum * 1000);
            } else {
              const maybe = Date.parse(readingTs);
              if (!Number.isNaN(maybe)) parsed = new Date(maybe);
            }
          }

          if (parsed && !Number.isNaN(parsed.getTime())) {
            const ageMs = Date.now() - parsed.getTime();
            const STALE_MS = 2 * 60 * 1000; // 2 minutes
            console.log('Reading timestamp age (ms):', ageMs);
            if (ageMs > STALE_MS) {
              levelString = 'nodata';
            } else {
              // only set resolvedTimestamp when the reading is fresh
              resolvedTimestamp = parsed;
            }
          }
        }

        // If still undecided, validate the numeric level
        if (levelString === 'nodata') {
          // already set to nodata by status/timestamp
        } else if (data.level === null || data.level === undefined || data.level === '' || Number.isNaN(Number(data.level))) {
          levelString = 'nodata';
        } else {
          levelString = convertFloodLevel(Number(data.level));
        }
      }
    }

    console.log("Flood Level:", data.level, "→", levelString, 'resolvedTimestamp:', resolvedTimestamp);

    // Update the marker with the resolved level and timestamp (if any)
    try {
      window.updateFloodMarker(levelString, resolvedTimestamp);
    } catch (e) {
      // Backwards-compat: older code may call without timestamp
      window.updateFloodMarker(levelString);
    }
  } catch (err) {
    console.error("Failed to fetch flood level:", err);
    window.updateFloodMarker("nodata");
  }
}

fetchFloodLevel();
setInterval(fetchFloodLevel, 15000);