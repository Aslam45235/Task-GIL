// Initialize the Leaflet map
var map = L.map('map').setView([51.505, -0.09], 13);

// Fetch the JSON data from the API
fetch('https://api.npoint.io/f26432e9e880999eeb1b')
  .then(response => response.json())
  .then(data => {
    // Ensure that 'data' is an object with a 'buildings' property that is an array
    if (data && Array.isArray(data.buildings)) {
      var buildings = data.buildings;

      // Create an array to store markers
      var markers = [];

      // Loop through the buildings and create markers
      buildings.forEach(building => {
        if (building && building.lat && building.lng) {
          var marker = L.marker([building.lat, building.lng]).addTo(map);
          markers.push(marker);
        }
      });

      // Function to check if two markers are nearby
      function areMarkersNearby(marker1, marker2) {
        var latlng1 = marker1.getLatLng();
        var latlng2 = marker2.getLatLng();

        // Calculate the distance (you can use other methods for more accurate distance calculation)
        var distance = latlng1.distanceTo(latlng2);

        // Set a threshold distance (in meters) for changing marker color
        var threshold = 100; // You can adjust this value

        return distance < threshold;
      }

      // Loop through the markers and change their color if they are nearby
      for (var i = 0; i < markers.length; i++) {
        for (var j = i + 1; j < markers.length; j++) {
          if (areMarkersNearby(markers[i], markers[j])) {
            markers[i].setIcon(L.icon({ iconUrl: 'red-marker.png', iconSize: [32, 32] }));
            markers[j].setIcon(L.icon({ iconUrl: 'red-marker.png', iconSize: [32, 32] }));
          }
        }
      }
    } else {
      console.error('Invalid data format. Data should be an object with a "buildings" property that is an array.');
    }
  })
  .catch(error => console.error('Error fetching data:', error));
