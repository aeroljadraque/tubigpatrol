// ============================================
// DYNAMIC MARKER - SENSOR DATA HANDLER
// ============================================
// This file handles the dynamic marker updates based on sensor data
// The marker color and state will change based on flood levels received from sensors

// Example sensor data structure and simulation
// In production, this would receive data from your actual sensor API

const sensorDataHandler = {
    // Simulated sensor data levels
    levels: ['nodata', 'low', 'moderate', 'high', 'critical'],
    currentLevel: 'nodata',
    updateInterval: null,

    // Initialize sensor data handling
    init: function() {
        // Wait for map to be fully loaded
        if (typeof map !== 'undefined' && typeof updateFloodMarker !== 'undefined') {
            console.log('Sensor data handler initialized');
            
            // Optional: Simulate sensor data changes (for demonstration)
            // Uncomment the line below to enable automatic simulation
            // this.startSimulation();
        } else {
            // Retry if map isn't loaded yet
            setTimeout(() => this.init(), 100);
        }
    },

    // Update marker based on sensor data
    updateMarker: function(waterLevel) {
        if (waterLevel && typeof updateFloodMarker === 'function') {
            this.currentLevel = waterLevel;
            updateFloodMarker(waterLevel);
            console.log(`Marker updated: Water level is now ${waterLevel}`);
        }
    },

    // Simulate sensor data changes (for testing)
    startSimulation: function() {
        let levelIndex = 0;
        this.updateInterval = setInterval(() => {
            levelIndex = (levelIndex + 1) % this.levels.length;
            this.updateMarker(this.levels[levelIndex]);
        }, 5000); // Change level every 5 seconds
    },

    // Stop simulation
    stopSimulation: function() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
            this.updateInterval = null;
        }
    },

    // Method to receive real sensor data from your backend/API
    receiveRealSensorData: function(sensorDataFromAPI) {
        // Parse your sensor data and extract water level
        // Example: const waterLevel = sensorDataFromAPI.waterLevel;
        // Then call: this.updateMarker(waterLevel);
        
        // Implementation depends on your actual sensor data format
        if (sensorDataFromAPI && sensorDataFromAPI.waterLevel) {
            this.updateMarker(sensorDataFromAPI.waterLevel);
        }
    }
};

// Initialize when document is ready
document.addEventListener('DOMContentLoaded', () => {
    sensorDataHandler.init();
});

// Make sensor handler globally accessible
window.sensorDataHandler = sensorDataHandler;

// Example usage (uncomment to use):
// window.sensorDataHandler.updateMarker('high');
// window.sensorDataHandler.receiveRealSensorData({ waterLevel: 'moderate' });
