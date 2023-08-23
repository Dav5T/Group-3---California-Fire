

function getColor(d) {
  return d > 30  ? '#a72036' :
         d > 25  ? '#ce5e2b' :
         d > 20  ? '#e19c22' :
                   '#dedc3f';
}

// data/us-county-boundaries.geojson can be replaced with: http://127.0.0.1:5000/api/v1.0/county
// data/CaliforniaWeather.json can be replaced with: http://127.0.0.1:5000/api/v1.0/weather
//data/FireIncident.json can be replaced with: http://127.0.0.1:5000/api/v1.0/weather

// Perform a GET request to the query URL/
d3.json("data/CaliforniaWeather.json").then(function (weatherData) {
// Once we get a response, send the data.features object to the createFeatures function.
  d3.json("data/us-county-boundaries.geojson").then(countyData =>{

    d3.json("data/FireIncident.json").then(fireData =>{
      
  
      createFeature(countyData.features, weatherData, fireData.features);
    });

  });
});

// Function passes data object and creates features for the map
function createFeature(county, weather, fire)
{


  // Sort geoJSON datat county alphabetically 
  county.sort(function (a, b) {
    if (a.properties.namelsad < b.properties.namelsad)
        return -1;
    else if (a.properties.namelsad > b.properties.namelsad)
        return 1;
  });

//create a list of temperature 

d3.selectAll("#selDataset").on("change", getData)

function getData()
{
  let dropdownMenu = d3.select("#selDataset");
  let datatset = dropdownMenu.property("value")

  if (datatset == 2018)
    {Tempchart(0)}
  else if(datatset == 2019)
    {Tempchart(1)}
  else if(datatset == 2020)
    {Tempchart(2)}
  else if(datatset == 2021)
    {Tempchart(3)}
  else if(datatset == 2022)
    {Tempchart(4)}
  else
    {Tempchart(5)}
}


function Tempchart(choice)
{
   let temperature=[]

    for (var y in weather[choice].data){
    temperature.push((weather[choice].data[y].value-32)*(5/9))
    }

    console.log(temperature)
  // add temperature list to geoJSON data
    county.forEach((i) =>{ 
      let index = county.indexOf(i);
     i['temperature'] = temperature[index]
   });

    var temp30 = 0
    var temp25 = 0
    var temp20 = 0
    var temp15 = 0
    

    for (var i in temperature){
      if (temperature[i] > 30)
      {temp30 += 1}
      else if (temperature[i] >25)
      {temp25 += 1}
      else if (temperature[i] >20)
      {temp20 += 1}
      else 
      {temp15 += 1}
    }

  let yValue = [temp30, temp25, temp20, temp15]

  let trace ={
    x: [30, 25, 20, 15], 
    y: yValue,
    type: "bar",
    text: yValue.map(String),
    textposition: 'auto',
    hoverinfo: 'none',
    marker: {
      color: 'rgb(158,202,225)',
      line: {
        color: 'rgb(8,48,107)',
        width: 1.5
      }
    }

  }

  let layout ={
    xaxis:{title:"Temperature (°C)"},
    title:{
      text: "Temperature", 
      font:{
        size: 15
      }
    }
  }

  let data = [trace]
  Plotly.newPlot("plotlyDiv", data, layout)
  console.log(county)

  //AVERAGE TEMPERATURE 
  function Average(array){
    var total = 0
    var count = 0

    array.forEach(function(item, index){
      total += item;
      count++
    });
    return total/count;
    }
    console.log(Average(temperature))
  


  function CustomonEachFeature(feature, layer) {
    layer.bindPopup(`<h4>${feature.properties.namelsad}</h4><hr><p><b>Temperature:</b> ${Math.round(feature.temperature)}°C</p>`)
  }




// variable plots county boarder and popup information  
var county1 = L.geoJSON(county,{
  onEachFeature: CustomonEachFeature,
  style:function colors(county){
    return{
      color:"black",
      fillColor: getColor(county.temperature),
      fillOpacity:0.5,
      weight: 0.5
    }
  } 
});


console.log(fire)

function circle (feature, latlng){ 
  var magnitude = {
    radius: 5,//feature.AcresBurned
    fillColor: "black",
    color: "black",
    fillOpacity: "0.8",
    weight: 1
  };
  return L.circleMarker(latlng, magnitude);
}

var fireLocation = L.geoJSON(fire,{
  pointToLayer: circle
})
console.log(fireLocation)

createMap(county1, fireLocation ) //fireLocation

}
}

// Function Creates map
function createMap(boarder, fireLocation ) //fireLocation
{
  let greyScale = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
	  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>', 
    subdomains: 'abcd',
  });

  var satellite = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
	  attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
  });

  var outDoor = L.tileLayer('https://tile.openstreetmap.de/{z}/{x}/{y}.png', {
	  maxZoom: 18,
	  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  });


  let baseMaps = {
    "Greyscale": greyScale,
    "Satellite": satellite,
    "Outdoor": outDoor
  };


  let overlayMap = {
    "county": boarder,
    "fire": fireLocation
  }
  
  

  let myMap = L.map("map", {
    center: [
      38.0692, -117.2306
    ],
    zoom: 7,
    layers: [greyScale, boarder]
  });
  
  myMap = myMap.remove()
 
  myMap = L.map("map", {
    center: [
      38.0692, -117.2306
    ],
    zoom: 7,
    layers: [greyScale, boarder]
  });
  

  L.control.layers(baseMaps, overlayMap, {
    collapsed: false
  }).addTo(myMap);


  

  var legend = L.control({position: 'bottomleft'});

  legend.onAdd = function (myMap) {

    var div = L.DomUtil.create('div', 'info legend'),
    depth = [10, 20, 25, 30],
    labels = [];
  
    for (var i = 0; i < depth.length; i++) 
    {
      div.innerHTML +=
      labels.push('<i style="background:' + getColor(depth[i] + 1) + '"></i> ' +
      depth[i] + (depth[i + 1] ? '&ndash;' + depth[i + 1] + '<br>' : '+'));
    }

    div.innerHTML = "<strong>Temperature</strong><br>" + labels.join("");
    return div;
  };

  legend.addTo(myMap);
  
}
function init(){

  d3.json("data/CaliforniaWeather.json").then(function (weatherData) {
    // Once we get a response, send the data.features object to the createFeatures function.
      d3.json("data/us-county-boundaries.geojson").then(countyData =>{
    
        d3.json("data/FireIncident.json").then(fireData =>{
          
        let county = countyData.features
        let weather = weatherData
        let fire = fireData.features

          county.sort(function (a, b) {
            if (a.properties.namelsad < b.properties.namelsad)
                return -1;
            else if (a.properties.namelsad > b.properties.namelsad)
                return 1;
          });

         

          let temperature=[]

            for (var y in weather[0].data){
            temperature.push((weather[0].data[y].value-32)*(5/9))
            }

            console.log(temperature)
          // add temperature list to geoJSON data
            county.forEach((i) =>{ 
              let index = county.indexOf(i);
            i['temperature'] = temperature[index]
            });

            var temp30 = 0
            var temp25 = 0
            var temp20 = 0
            var temp15 = 0
            

            for (var i in temperature){
              if (temperature[i] > 30)
              {temp30 += 1}
              else if (temperature[i] >25)
              {temp25 += 1}
              else if (temperature[i] >20)
              {temp20 += 1}
              else 
              {temp15 += 1}
            }

            let yValue = [temp30, temp25, temp20, temp15]

            let trace ={
              x: [30, 25, 20, 15], 
              y: yValue,
              type: "bar",
              text: yValue.map(String),
              textposition: 'auto',
              hoverinfo: 'none',
              marker: {
                color: 'rgb(158,202,225)',
                line: {
                  color: 'rgb(8,48,107)',
                  width: 1.5
                }
              }

            }

            let layout ={
              xaxis:{title:"Temperature (°C)"},
              title:{
                text: "Temperature", 
                font:{
                  size: 15
                }
              }
            }

            let data = [trace]
            Plotly.newPlot("plotlyDiv", data, layout)
            console.log(county)

            function CustomonEachFeature(feature, layer) {
              layer.bindPopup(`<h4>${feature.properties.namelsad}</h4><hr><p><b>Temperature:</b> ${Math.round(feature.temperature)}°C</p>`)
            }

            var county1 = L.geoJSON(county,{
              onEachFeature: CustomonEachFeature,
              style:function colors(county){
                return{
                  color:"black",
                  fillColor: getColor(county.temperature),
                  fillOpacity:0.5,
                  weight: 0.5
                }
              } 
            });
            
            
            
            function circle (feature, latlng){ 
              var magnitude = {
                radius: 5,//feature.AcresBurned
                fillColor: "black",
                color: "black",
                fillOpacity: "0.8",
                weight: 1
              };
              return L.circleMarker(latlng, magnitude);
            }
            
            var fireLocation = L.geoJSON(fire,{
              pointToLayer: circle
            })
        
            
          createMap(county1, fireLocation )
            
            
                
      
          createFeature(countyData.features, weatherData, fireData.features);
        });
    
      });
    });

    

}

init()
