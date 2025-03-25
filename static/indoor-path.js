// 📍 Step 1: Define Locations and Coordinates
const locations = {
    "COEP Main Building": [18.529432, 73.856570],
    "Academic Complex": [18.531304, 73.855832],
    "ENTC Extension": [18.531217, 73.855347],
    "ISL Lab": [18.531301, 73.855239],
    "Foss Lab": [18.531388, 73.855304],
    "Computer Department": [18.530642, 73.855435],
    "Mechanical Department": [18.530363, 73.856277],
    "Accounts Section": [18.529493, 73.856122],
    "Subway": [18.52994, 73.856723],
    "Electrical Department": [18.529651, 73.855644],
    "Applied Mechanics": [18.530714, 73.85631],
    "ENTC Old Building":[18.531059, 73.855006],
    "Instrumentation Department": [18.530871, 73.855628],
    "Mini Auditorium":[18.531143, 73.855658]
};

let map;
let currentPath = null;
let geoJsonPaths = null; // Placeholder to store GeoJSON data

// 🗺️ Step 2: Load GeoJSON from External File
async function loadGeoJson() {
    try {
        const response = await fetch('/static/paths.geojson');
        if (!response.ok) {
            throw new Error("Failed to load GeoJSON file.");
        }
        geoJsonPaths = await response.json();
        console.log("✅ GeoJSON data loaded successfully.");
    } catch (error) {
        console.error("❌ Error loading GeoJSON:", error);
    }
}

// 🗺️ Step 3: Initialize Map
function displayMap() {
    // Initialize Map
    map = L.map("map").setView(locations["COEP Main Building"], 17);

    // Add OpenStreetMap tile layer
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: "© OpenStreetMap contributors"
    }).addTo(map);

    // Plot all locations on the map
    for (const loc in locations) {
        const [lat, lon] = locations[loc];
        L.marker([lat, lon]).addTo(map).bindPopup(loc);
    }

    // Auto-fit map to display all markers
    const bounds = L.latLngBounds(Object.values(locations));
    map.fitBounds(bounds);
}

// 🎯 Step 4: Draw Selected Path
function drawSelectedPath(source, destination) {
    // Remove the previous path if it exists
    if (currentPath) {
        map.removeLayer(currentPath);
    }

    // Find the selected path in GeoJSON
    const selectedFeature = geoJsonPaths.features.find((feature) => {
        const coordinates = feature.geometry.coordinates;
        const sourceCoords = coordinates[0];
        const destCoords = coordinates[coordinates.length - 1];

        const sourceName = getLocationName(sourceCoords[1], sourceCoords[0]);
        const destName = getLocationName(destCoords[1], destCoords[0]);

        return (
            (sourceName === source && destName === destination) ||
            (sourceName === destination && destName === source)
        );
    });

    if (selectedFeature) {
        // Convert coordinates to LatLng
        const geoJsonCoords = selectedFeature.geometry.coordinates.map(
            (coord) => [coord[1], coord[0]]
        );

        // Draw selected path
        currentPath = L.polyline(geoJsonCoords, { color: "green", weight: 4 })
            .addTo(map)
            .bindPopup(`${source} to ${destination}`)
            .openPopup();

        console.log(`✅ Path drawn: ${source} to ${destination}`);
    } else {
        alert("❌ No valid path found between selected source and destination.");
    }
}

function getLocationName(lat, lon) {
    for (const loc in locations) {
        const [locLat, locLon] = locations[loc];
        if (locLat === lat && locLon === lon) {
            return loc;
        }
    }
    return null;
}



// 🎯 Step 6: Find Path Based on Selection
function findPath() {
    const source = document.getElementById("sourceSelect").value;
    const destination = document.getElementById("destinationSelect").value;

    if (source && destination && source !== destination) {
        drawSelectedPath(source, destination);
    } else {
        alert("⚠️ Please select different source and destination.");
    }
}

// Load map and GeoJSON when DOM is ready
document.addEventListener("DOMContentLoaded", async () => {
    await loadGeoJson();
    displayMap();
});

