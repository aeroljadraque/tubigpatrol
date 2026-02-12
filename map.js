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

// Create initial marker with default appearance
function createFloodMarker(lat, lng, level = 'normal') {
    if (floodMarker) {
        map.removeLayer(floodMarker);
    }

    const markerColor = getMarkerColor(level);
    
    // Create custom icon
    const customIcon = L.divIcon({
        html: `<div class="flood-marker" style="background-color: ${markerColor}; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);"></div>`,
        iconSize: [30, 30],
        className: 'flood-marker-icon'
    });

    floodMarker = L.marker([lat, lng], { icon: customIcon }).addTo(map);

    // Add popup with level information
    const popupContent = `
        <div class="marker-popup">
            <strong>Holy Trinity Academy, Manila</strong>Calabash Road, Barangay 539, Sampaloc, Manila<br>
            Coordinates: ${lat.toFixed(4)}°N, ${lng.toFixed(4)}°E<br>
            Water Level: <span style="color: ${markerColor}; font-weight: bold;">${level.toUpperCase()}</span>
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

// Create initial marker
createFloodMarker(TARGET_LAT, TARGET_LNG, 'nodata');

// Add CSS for marker
const style = document.createElement('style');
style.textContent = `
    .flood-marker-icon {
        filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2));
    }
    .flood-marker {
        border-radius: 50%;
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
window.updateFloodMarker = function(level) {
    if (floodMarker) {
        // Update marker color
        const markerColor = getMarkerColor(level);
        floodMarker.setIcon(L.divIcon({
            html: `<div class="flood-marker" style="background-color: ${markerColor}; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);"></div>`,
            iconSize: [30, 30],
            className: 'flood-marker-icon'
        }));

        // Update popup
        const popupContent = `
            <div class="marker-popup">
                <strong>Holy Trinity Academy, Manila</strong>Calabash Road, Barangay 539, Sampaloc, Manila 1008<br>
                Coordinates: ${TARGET_LAT.toFixed(4)}°N, ${TARGET_LNG.toFixed(4)}°E<br>
                Water Level: <span style="color: ${markerColor}; font-weight: bold;">${level.toUpperCase()}</span>
            </div>
        `;
        floodMarker.setPopupContent(popupContent);
    }
};

console.log('Map initialized. Use window.updateFloodMarker(level) to update marker color.');
