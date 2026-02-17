// ============================================
// MAP INITIALIZATION AND FUNCTIONALITY
// ============================================

// Initialize the map centered on Philippines
const map = L.map('map').setView([12.8797, 121.7740], 6);

// Add OpenStreetMap tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors',
    maxZoom: 19
}).addTo(map);

// Target coordinates: 14°36'39.0"N 121°00'10.0"E
// Convert to decimal: 14.6108° N, 121.0028° E
const TARGET_LAT = 14.6108;
const TARGET_LNG = 121.0028;

// Marker object to be updated by sensor data
let floodMarker = null;

function formatTimestampForDisplay(ts) {
    if (!ts) return null;
    const maybe = (ts instanceof Date) ? ts : (typeof ts === 'number' ? new Date(ts) : new Date(ts));
    if (Number.isNaN(maybe.getTime())) return null;
    return maybe.toLocaleString();
}

// Create initial marker with default appearance
function createFloodMarker(lat, lng, level = 'normal', timestamp = null) {
    if (floodMarker) {
        map.removeLayer(floodMarker);
    }

    const markerImage = getMarkerImage(level);
    
    // Create custom icon with PNG image
    const customIcon = L.divIcon({
        html: `<div class="flood-marker"><img src="${markerImage}" alt="${level}" style="width: 40px; height: 40px; object-fit: contain;"></div>`,
        iconSize: [50, 50],
        className: 'flood-marker-icon'
    });

    floodMarker = L.marker([lat, lng], { icon: customIcon }).addTo(map);

    // Add popup with level information
    const tsDisplay = formatTimestampForDisplay(timestamp);
    const displayLevel = (level && String(level).toLowerCase() === 'nodata') ? 'NO DATA' : String(level).toUpperCase();
    let levelColor;
    if (level && String(level).toLowerCase() === 'nodata') {
        levelColor = '#808080'; // gray for NO DATA
    } else {
        levelColor = getMarkerColor(level || 'nodata');
    }
    const popupContent = `
        <div class="marker-popup">
            <strong>Holy Trinity Academy, Manila</strong>Calabash Road, Barangay 539, Sampaloc, Manila<br>
            Coordinates: ${lat.toFixed(4)}°N, ${lng.toFixed(4)}°E<br>
            Water Level: <span style="font-weight: bold; color: ${levelColor};">${displayLevel}</span>
            ${tsDisplay ? `<div class="marker-timestamp">Last update: ${tsDisplay}</div>` : `<div class="marker-timestamp">Last update: No data</div>`}
        </div>
    `;

    floodMarker.bindPopup(popupContent);

    return floodMarker;
}

// Get color based on water level
function getMarkerColor(level) {
    const colors = {
        'nodata': '#808080',
        'low': '#4CAF50',
        'moderate': '#FFC107',
        'high': '#FF9800',
        'critical': '#F44336'
    };
    return colors[level.toLowerCase()] || colors['nodata'];
}

// Get PNG image path based on water level
function getMarkerImage(level) {
    const images = {
        'nodata': 'NO DATA.png',
        'low': 'LOW.png',
        'moderate': 'MODERATE.png',
        'high': 'HIGH.png',
        'critical': 'CRITICAL.png',
        'normal': 'NO DATA.png'
    };
    return images[level.toLowerCase()] || images['nodata'];
}

// Create initial marker
createFloodMarker(TARGET_LAT, TARGET_LNG, 'nodata');

// Add CSS for marker
const style = document.createElement('style');
style.textContent = `
    .flood-marker-icon {
        filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2));
    }
    .flood-marker {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        animation: pulse 2s infinite;
    }
    @keyframes pulse {
        0%, 100% {
            transform: scale(1);
            opacity: 1;
        }
        50% {
            transform: scale(1.2);
            opacity: 0.8;
        }
    }
    .marker-popup {
        font-size: 12px;
        color: #333;
    }
    .marker-popup strong {
        display: block;
        margin-bottom: 5px;
        color: #667eea;
    }
    .marker-timestamp {
        margin-top: 6px;
        font-size: 11px;
        color: #666;
    }
`;
document.head.appendChild(style);

// ============================================
// SEARCH FUNCTIONALITY
// ============================================

const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');

// Perform search
async function performSearch(query) {
    if (!query.trim()) {
        alert('Please enter a location');
        return;
    }

    try {
        // Use OpenStreetMap Nominatim API for geocoding
        const response = await fetch(
            `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1`
        );
        
        if (!response.ok) throw new Error('Search failed');
        
        const results = await response.json();
        
        if (results.length === 0) {
            alert('Location not found. Please try a different search.');
            return;
        }

        const result = results[0];
        const lat = parseFloat(result.lat);
        const lng = parseFloat(result.lon);

        // Zoom to the location
        map.setView([lat, lng], 12, {
            animate: true,
            duration: 1
        });

        // Add a marker for the search result (different from flood marker)
        const searchIcon = L.divIcon({
            html: `<div style="background-color: #0066cc; width: 20px; height: 20px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
            iconSize: [20, 20],
            className: 'search-marker-icon'
        });

        L.marker([lat, lng], { icon: searchIcon }).addTo(map)
            .bindPopup(`<strong>${result.name}</strong><br>Latitude: ${lat.toFixed(4)}<br>Longitude: ${lng.toFixed(4)}`)
            .openPopup();

    } catch (error) {
        console.error('Search error:', error);
        alert('An error occurred while searching. Please try again.');
    }
}

// Search button click
searchButton.addEventListener('click', () => {
    performSearch(searchInput.value);
});

// Search on Enter key
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        performSearch(searchInput.value);
    }
});

// ============================================
// GLOBAL FUNCTION FOR DYNAMIC MARKER UPDATES
// ============================================

// This function will be called by the sensor data handler
window.updateFloodMarker = function(level, timestamp = null) {
    if (floodMarker) {
        // Update marker with PNG image
        const markerImage = getMarkerImage(level);
        floodMarker.setIcon(L.divIcon({
            html: `<div class="flood-marker"><img src="${markerImage}" alt="${level}" style="width: 40px; height: 40px; object-fit: contain;"></div>`,
            iconSize: [50, 50],
            className: 'flood-marker-icon'
        }));

        // Color coding for flood level text
        const colorMap = {
            'nodata': '#808080',
            'low': '#4CAF50',
            'moderate': '#FFC107',
            'high': '#FF9800',
            'critical': '#F44336'
        };
        const levelKey = (level || 'nodata').toLowerCase();
        const displayLevel = (levelKey === 'nodata') ? 'NO DATA' : level.toUpperCase();
        const levelColor = colorMap[levelKey] || colorMap['nodata'];

        // Format timestamp for display
        let tsDisplay = null;
        if (timestamp) {
            const maybe = (timestamp instanceof Date) ? timestamp : (typeof timestamp === 'number' ? new Date(timestamp) : new Date(timestamp));
            if (!Number.isNaN(maybe.getTime())) {
                tsDisplay = maybe.toLocaleString();
            }
        }

        // Update popup
        const popupContent = `
            <div class="marker-popup">
                <strong>Holy Trinity Academy, Manila</strong>Calabash Road, Barangay 539, Sampaloc, Manila 1008<br>
                Coordinates: ${TARGET_LAT.toFixed(4)}°N, ${TARGET_LNG.toFixed(4)}°E<br>
                Water Level: <span style="font-weight: bold; color: ${levelColor};">${displayLevel}</span>
                ${tsDisplay ? `<div class="marker-timestamp">Last update: ${tsDisplay}</div>` : `<div class="marker-timestamp">Last update: No data</div>`}
            </div>
        `;
        floodMarker.setPopupContent(popupContent);
    }
};

console.log('Map initialized. Use window.updateFloodMarker(level) to update marker color.');
