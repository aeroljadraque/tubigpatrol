# Tubig Patrol - Water Flood Detection & Monitoring Website

A modern, responsive website for the Tubig Patrol flood-detection and monitoring device prototype.

## Project Structure

```
tubig-patrol/
├── index.html           # Landing page
├── map.html             # Interactive map page
├── css/
│   └── styles.css       # All styling for both pages
├── js/
│   ├── main.js          # Landing page scripts
│   ├── map.js           # Map initialization and search functionality
│   └── dynamic-marker.js # Dynamic marker updates based on sensor data
└── README.md            # This file
```

## Features

### Landing Page (index.html)
- **Hero Section**: Eye-catching introduction with prominent "View Interactive Map" button
- **About Section**: Information about Tubig Patrol with 4 key insights
- **How It Works**: 5-step process explanation
- **Water Level Indicators**: 5 flood level symbols with descriptions:
  - Normal/Safe (Green - #4CAF50)
  - Low Risk (Yellow - #FFC107)
  - Moderate Risk (Orange - #FF9800)
  - High Risk (Red - #F44336)
  - Critical (Purple - #9C27B0)
- **Responsive Design**: Fully mobile-friendly

### Interactive Map Page (map.html)
- **OpenStreetMap Integration**: Using Leaflet library
- **Search Functionality**: Search bar to find locations (powered by OpenStreetMap Nominatim API)
- **Flood Marker**: Dynamic marker at coordinates 14°36'39.0"N 121°00'10.0"E
- **Full-Screen Map**: Map covers entire viewport (minus header)
- **Legend**: Quick reference for flood level symbols
- **Responsive Header**: Navigation and search in sticky header
- **Dynamic Updates**: Marker color changes based on sensor data

## Setup Instructions

### Local Development

1. **Clone or Download** the project files to your desired directory
2. **Start a Local Server** (required for proper functionality):
   
   **Using Python 3:**
   ```bash
   cd tubig-patrol
   python -m http.server 8000
   ```
   
   **Using Python 2:**
   ```bash
   cd tubig-patrol
   python -m SimpleHTTPServer 8000
   ```
   
   **Using Node.js (with http-server):**
   ```bash
   cd tubig-patrol
   npx http-server
   ```
   
   **Using PHP:**
   ```bash
   cd tubig-patrol
   php -S localhost:8000
   ```

3. **Open in Browser**: Navigate to `http://localhost:8000`

## Usage

### For End Users
1. Visit the landing page (index.html) to learn about Tubig Patrol
2. Click the "View Interactive Map" button to access the interactive map
3. Use the search bar to find specific locations
4. View the flood level legend to understand the marker colors
5. Click on markers to see detailed information

### For Developers - Updating Sensor Data

The marker color updates dynamically based on flood levels. To integrate your sensor data:

#### Method 1: Direct Function Call
```javascript
// From anywhere on the map page
window.updateFloodMarker('high');
```

#### Method 2: Using Sensor Handler
```javascript
// Call this when you receive sensor data
window.sensorDataHandler.updateMarker('moderate');
```

#### Method 3: API Integration
Modify `js/dynamic-marker.js` to connect to your sensor API:

```javascript
// Example: Fetch data from your sensor backend
fetch('https://your-api.com/sensor/data')
    .then(response => response.json())
    .then(data => {
        window.sensorDataHandler.updateMarker(data.waterLevel);
    });
```

### Available Water Levels
- `'normal'` - Normal/Safe
- `'low'` - Low Risk
- `'moderate'` - Moderate Risk
- `'high'` - High Risk
- `'critical'` - Critical

## External Libraries Used

- **Leaflet.js** v1.9.4 - Interactive map library
- **OpenStreetMap** - Map tiles
- **Nominatim API** - Location search
- **Leaflet Control Geocoder** - Geocoding support

## Browser Compatibility

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Customization

### Change the Target Coordinates
Edit `js/map.js`:
```javascript
const TARGET_LAT = 14.6108;  // Change to your latitude
const TARGET_LNG = 121.0028; // Change to your longitude
```

### Change Colors
Edit `css/styles.css` to modify:
- Header gradient colors
- Button colors
- Card colors
- Symbol colors

### Modify Content
Edit the respective HTML files:
- `index.html` - For landing page content
- `map.html` - For map page structure

## Testing the Dynamic Marker

To test the marker with simulated sensor data changes:

1. Open the map page in browser
2. Open Developer Console (F12 or Right-click > Inspect)
3. Run:
```javascript
window.sensorDataHandler.startSimulation();
```

This will cycle through all water levels every 5 seconds. To stop:
```javascript
window.sensorDataHandler.stopSimulation();
```

## Deployment

For production deployment:

1. Upload all files to your web hosting server
2. Ensure HTTPS is enabled
3. Configure CORS if your sensor API is on a different domain
4. Update sensor data endpoints to point to your production API
5. Test all functionality on mobile devices

## Future Enhancements

- Multiple monitoring stations with different markers
- Historical data visualization
- Real-time alerts and notifications
- Weather integration
- Community reports feature
- Mobile app version

## Support

For questions or issues with the website, please refer to the documentation above or contact the development team.

## License

© 2026 Tubig Patrol. All rights reserved.
