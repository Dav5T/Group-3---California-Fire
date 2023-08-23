const droughtUrl = "file:///Users/arunbalaram/Desktop/BOOTCAMP%20/Offline%20Notes/PROJECTS%20/PROJECT_3/JSON%20FILES%20USED%20FOR%20PROJECT/FireIncident.json"


d3.json(droughtUrl).then(function(data){
    console.log(data);
});


// Define a function that we want to run once for each feature in the features array (D3 and D4 arrays).
// Give each feature a popup that describes the counties  and duration of the drought in weeks.




let D3_county = [
        {
          name: "Siskiyou County",
          coordinates: [42.0086, -122.32030],
          weeks: 141
        },
        {
          name: "Shasta County",
          coordinate: [41.1849, -122.2945],
          weeks: 140
        },

        {
          name: "Trinity County",
          coordinates: [41.3670, -122.5681],
          weeks: 140
        },
        {
          name: "Modoc County",
          coordinates: [41.9937, -120.8799],
          weeks: 128
        },
        {
            name: "Butte County",
            coordinates: [40.1466, -121.4046],
            weeks: 66
          },
          {
            name: "Colusa County",
            coordinates: [39.4144, -122.1065],
            weeks: 66
          },
  
          {
            name: "Glenn County",
            coordinates: [39.7976, -122.0464],
            weeks: 66
          },
          {
            name: "Lake County",
            coordinates: [39.3832, -122.7390],
            weeks: 66
          },
          {
            name: "Sacramento County",
            coordinates:[38.0360, -121.7795],
            weeks: 66
          },
          {
            name: "Solano County",
            coordinates:[38.0776, -121.9759],
            weeks: 66
          },
          {
            name: "Sutter County",
            coordinates:[39.2956, -121.6237],
            weeks: 66
          },
          {
            name: "Tehama County",
            coordinates:[40.4530, -121.6855],
            weeks: 66
          },
          {
            name: "Yolo County",
            coordinates:[38.9259, -122.0172],
            weeks: 66
          },
          {
            name: "Yuba County",
            coordinates:[39.5881, -121.0191],
            weeks: 66
          },
          {
            name: "Lassen County",
            coordinates:[41.1844, -121.2110],
            weeks: 64
          },
      ];
      
let D4_county = [
        {
            name: "Inyo County",
            coordinates: [42.0086, -122.3203],
            weeks: 53
        },
        {
            name: "San Bernardino County",
            coordinates: [35.8092,  -115.6556],
            weeks: 53
        },
        {
            name: "Mono County",
            coordinates: [38.6875, -119.5485],
            weeks: 47
        },
        {
            name: "Fresno County",
            coordinates: [37.5709, -119.0014],
            weeks: 32
        },
        {
            name: "Kern County",
            coordinates: [35.7983, -117.8911],
            weeks: 32
        },
        {
            name: "Tulare County",
            coordinates: [36.7447, -118.3890],
            weeks: 32
        }, 
        {
            name: "Alameda County",
            coordinates: [37.6929, -122.1911],
            weeks: 31
        },
        {
            name: "Contra Costa County",
            coordinates: [37.9014, -122.3720],
            weeks: 31
        },
        {
            name: "Kings County",
            coordinates: [36.4889, -119.5461],
            weeks: 31
        },
        {
            name: "Madera County",
            coordinates: [37.7395, -119.2724],
            weeks: 31
        }, 
        {
            name: "Solano County",
            coordinates: [38.0776, -121.9759],
            weeks: 31
        },
        {
            name: "Amador County",
            coordinates: [38.7088,  -120.0776],
            weeks: 30
        },
        {
            name: "Calaveras County",
            coordinates: [38.5091, -120.0724],
            weeks: 30
        },
        {
            name: "Sacramento County",
            coordinates: [38.0360, -121.7795],
            weeks: 30
        },
        {
            name: "San Joaquin County",
            coordinates: [38.2254, -120.9955],
            weeks: 30
        }
      ];

    

// An array that will store the created countyMarkers
let D3_countyMarkers = [];
let D4_countyMarkers = [];       

      for (let i = 0; i < D3_county.length; i++) {
        // Setting the marker radius for the state by passing population into the markerSize function
        D3_countyMarkers.push(
          L.circle(D3_county[i].coordinates, {
            stroke: false,
            fillOpacity: 0.75,
            color: "black",
            fillColor: "yellow",
            radius: (D3_county[i].weeks) * 500
          }).bindPopup(`<h1>${D3_county[i].name}</h1> <hr> <h3> Drought in Consecutive Weeks: ${D3_county[i].weeks}</h3>`)
        );
      
// Set the marker radius for the city by passing the population to the markerSize() function.

        D4_countyMarkers.push(
          L.circle(D4_county[i].coordinates, {
            stroke: false,
            fillOpacity: 0.75,
            color: "black",
            fillColor: "red",
            radius: (D4_county[i].weeks) * 750
          }).bindPopup(`<h1>${D4_county[i].name}</h1> <hr> <h3> Drought in Consecutive Weeks: ${D4_county[i].weeks}</h3>`)
        );
      };
    



      
// Add all the countyMarkers to a new layer group.
// Now, we can handle them as one group instead of referencing each one individually.


let counties_D3 = L.layerGroup(D3_countyMarkers);
let counties_D4 = L.layerGroup(D4_countyMarkers);



    // Create the base layers.
let D3_map = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    })
    // Create overlay (D4 map)

let D4_map = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      })
  
    // Create a baseMaps object.
let baseMaps = {
      "D3 Map": D3_map,
      "D4 Map": D4_map
    };
  
    // Create an overlay object to hold our overlay.
let overlayMaps = {
      "Overlay D3 Map": counties_D3,
      "Overlay D4 Map": counties_D4
    };
  

    // Create a Map and create a layer control.
    // Add the layer control to the map.
  
    let myMap = L.map("map", {
        center: [36.77, -119.41],
        zoom: 6,
        layers: [D3_map, D4_map, counties_D4]
    });
    

L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
}).addTo(myMap);